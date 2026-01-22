import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import * as crypto from 'crypto';
import sharp from 'sharp';
import { S3Service } from 'src/modules/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';

// ============================================================================
// IMAGE PROCESSING CONFIGURATION
// ============================================================================

export const IMAGE_SIZES = {
  thumbnail: {
    width: 150,
    height: 150,
    format: 'webp' as const,
    quality: 80,
    fit: 'cover' as const,
  },
  medium: {
    width: 500,
    height: 500,
    format: 'webp' as const,
    quality: 85,
    fit: 'inside' as const,
  },
  large: {
    width: 1200,
    height: 1200,
    format: 'webp' as const,
    quality: 85,
    fit: 'inside' as const,
  },
  original: {
    width: 2000,
    height: 2000,
    format: 'original' as const,
    quality: 90,
    fit: 'inside' as const,
  },
};

export const MEDIA_CONSTRAINTS = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  minFileSize: 100, // 100 bytes
  maxDimensions: { width: 4000, height: 4000 },
  minDimensions: { width: 100, height: 100 },
  supportedFormats: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
};

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ProcessedImage {
  thumbnail: Buffer;
  medium: Buffer;
  large: Buffer;
  original: Buffer;
}

interface ImageMetadata {
  width: number;
  height: number;
  format: string;
}

interface UploadResult {
  mediaId: string;
  filename: string;
  urlOriginal: string;
  urlLarge: string;
  urlMedium: string;
  urlThumbnail: string;
  width: number;
  height: number;
  size: number;
  isDeduped: boolean;
}

// ============================================================================
// MEDIA LIBRARY SERVICE
// ============================================================================

@Injectable()
export class MediaLibraryService {
  private readonly logger = new Logger(MediaLibraryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3Service: S3Service,
  ) {}

  // ──────────────────────────────────────────────────────────────────────
  // 📤 UPLOAD & PROCESSING
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Main upload handler - orchestrates entire upload flow
   *
   * @param buffer - Raw file buffer from HTTP request
   * @param filename - Original filename
   * @param userId - User uploading the image
   * @returns UploadResult with URLs and metadata
   */
  async uploadMedia(
    buffer: Buffer,
    filename: string,
    userId: string,
  ): Promise<UploadResult> {
    try {
      // Step 1: VALIDATE
      this.validateFile(buffer, filename);

      // Step 2: HASH
      const fileHash = this.computeHash(buffer);
      this.logger.debug(`File hash: ${fileHash}`);

      // Step 3: CHECK DEDUPLICATION
      const existingAsset = await this.prisma.mediaAsset.findUnique({
        where: { fileHash },
      });

      if (existingAsset && !existingAsset.isDeleted) {
        // ✅ DEDUPLICATION: File already exists!
        /*  this.logger.log(`Deduped asset found: ${existingAsset.id}`);
        return await this.createDedupedAsset(existingAsset, filename, userId); */
        throw new BadRequestException(
          `This file already exists in your media library as "${existingAsset.filename}". Please upload a different image.`,
        );
      }

      // Step 4: PROCESS IMAGE
      const metadata = await this.getImageMetadata(buffer);
      const processed = await this.processImage(buffer);

      // Step 5: UPLOAD TO S3
      const s3Keys = this.generateS3Keys(fileHash, userId);
      const urls = await this.uploadProcessedImages(processed, s3Keys);

      // Step 6: SAVE TO DATABASE
      const mediaAsset = await this.prisma.mediaAsset.create({
        data: {
          filename,
          fileHash,
          key: s3Keys.original,
          mimeType: `image/${this.detectFormat(buffer)}`,
          size: buffer.length,
          width: metadata.width,
          height: metadata.height,
          urlOriginal: urls.urlOriginal,
          urlLarge: urls.urlLarge,
          urlMedium: urls.urlMedium,
          urlThumbnail: urls.urlThumbnail,
          uploadedById: userId,
          refCount: 1,
        },
      });

      this.logger.log(`Asset created: ${mediaAsset.id}`);

      return {
        mediaId: mediaAsset.id,
        filename: mediaAsset.filename,
        urlOriginal: mediaAsset.urlOriginal,
        urlLarge: mediaAsset.urlLarge,
        urlMedium: mediaAsset.urlMedium,
        urlThumbnail: mediaAsset.urlThumbnail,
        width: mediaAsset.width,
        height: mediaAsset.height,
        size: mediaAsset.size,
        isDeduped: false,
      };
    } catch (error) {
      this.logger.error(`Upload failed: ${error.message}`, error.stack);
      throw error;
    }
  }

  /**
   * Handle deduplication case - reuse existing S3 files
   */
  private async createDedupedAsset(
    existingAsset: any,
    filename: string,
    userId: string,
  ): Promise<UploadResult> {
    // Create new MediaAsset but reuse all URLs
    const dedupedAsset = await this.prisma.mediaAsset.create({
      data: {
        filename,
        fileHash: existingAsset.fileHash,
        key: existingAsset.key,
        mimeType: existingAsset.mimeType,
        size: existingAsset.size,
        width: existingAsset.width,
        height: existingAsset.height,
        urlOriginal: existingAsset.urlOriginal,
        urlLarge: existingAsset.urlLarge,
        urlMedium: existingAsset.urlMedium,
        urlThumbnail: existingAsset.urlThumbnail,
        uploadedById: userId,
        refCount: 1,
      },
    });

    // Increment original asset's refCount
    await this.prisma.mediaAsset.update({
      where: { id: existingAsset.id },
      data: { refCount: { increment: 1 } },
    });

    this.logger.log(`Deduped asset created: ${dedupedAsset.id}`);

    return {
      mediaId: dedupedAsset.id,
      filename: dedupedAsset.filename,
      urlOriginal: dedupedAsset.urlOriginal,
      urlLarge: dedupedAsset.urlLarge,
      urlMedium: dedupedAsset.urlMedium,
      urlThumbnail: dedupedAsset.urlThumbnail,
      width: dedupedAsset.width,
      height: dedupedAsset.height,
      size: dedupedAsset.size,
      isDeduped: true,
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // 🖼️ IMAGE PROCESSING
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Generate 4 image resolutions from input buffer
   */
  private async processImage(buffer: Buffer): Promise<ProcessedImage> {
    try {
      const image = sharp(buffer).rotate();

      // Get metadata for smart sizing
      const metadata = await image.metadata();

      // Process 4 resolutions in parallel
      const [thumbnail, medium, large, original] = await Promise.all([
        image
          .clone()
          .resize(150, 150, {
            fit: IMAGE_SIZES.thumbnail.fit,
            position: 'center',
            withoutEnlargement: true,
          })
          .webp({ quality: IMAGE_SIZES.thumbnail.quality })
          .toBuffer(),

        image
          .clone()
          .resize(500, 500, {
            fit: IMAGE_SIZES.medium.fit,
            withoutEnlargement: true,
          })
          .webp({ quality: IMAGE_SIZES.medium.quality })
          .toBuffer(),

        image
          .clone()
          .resize(1200, 1200, {
            fit: IMAGE_SIZES.large.fit,
            withoutEnlargement: true,
          })
          .webp({ quality: IMAGE_SIZES.large.quality })
          .toBuffer(),

        image
          .clone()
          .resize(2000, 2000, {
            fit: IMAGE_SIZES.original.fit,
            withoutEnlargement: true,
          })
          .toBuffer(),
      ]);

      this.logger.debug(
        `Images processed - thumb: ${thumbnail.length}B, med: ${medium.length}B, large: ${large.length}B, orig: ${original.length}B`,
      );

      return { thumbnail, medium, large, original };
    } catch (error) {
      throw new BadRequestException(
        `Image processing failed: ${error.message}`,
      );
    }
  }

  /**
   * Get image metadata (width, height, format)
   */
  private async getImageMetadata(buffer: Buffer): Promise<ImageMetadata> {
    const image = sharp(buffer);
    const metadata = await image.metadata();
    return {
      width: metadata.width || 0,
      height: metadata.height || 0,
      format: metadata.format || 'unknown',
    };
  }

  // ──────────────────────────────────────────────────────────────────────
  // ☁️ S3 UPLOAD & URL GENERATION
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Generate S3 keys (file paths) for all 4 resolutions
   */
  private generateS3Keys(fileHash: string, userId: string) {
    const folder = `media/${userId}/${fileHash}`;
    return {
      original: `${folder}/original.jpg`,
      large: `${folder}/large.webp`,
      medium: `${folder}/medium.webp`,
      thumbnail: `${folder}/thumbnail.webp`,
    };
  }

  /**
   * Upload 4 processed images to S3 and return CDN URLs
   */
  private async uploadProcessedImages(
    processed: ProcessedImage,
    keys: any,
  ): Promise<{
    urlOriginal: string;
    urlLarge: string;
    urlMedium: string;
    urlThumbnail: string;
  }> {
    try {
      const [urlOriginal, urlLarge, urlMedium, urlThumbnail] =
        await Promise.all([
          this.s3Service.uploadFile(
            processed.original,
            keys.original,
            'image/jpeg',
          ),
          this.s3Service.uploadFile(processed.large, keys.large, 'image/webp'),
          this.s3Service.uploadFile(
            processed.medium,
            keys.medium,
            'image/webp',
          ),
          this.s3Service.uploadFile(
            processed.thumbnail,
            keys.thumbnail,
            'image/webp',
          ),
        ]);

      return { urlOriginal, urlLarge, urlMedium, urlThumbnail };
    } catch (error) {
      throw new BadRequestException(`S3 upload failed: ${error.message}`);
    }
  }

  // ──────────────────────────────────────────────────────────────────────
  // 🔍 RETRIEVAL & QUERYING
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Get user's media library (own uploads + public shared images)
   */
  async getMyMediaLibrary(userId: string, skip: number = 0, take: number = 20) {
    return await this.prisma.mediaAsset.findMany({
      where: {
        isDeleted: false,
        OR: [{ uploadedById: userId }, { isPublic: true }],
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        filename: true,
        urlOriginal: true,
        urlLarge: true,
        urlMedium: true,
        urlThumbnail: true,
        width: true,
        height: true,
        size: true,
        description: true,
        tags: true,
        isPublic: true,
        createdAt: true,
        lastUsedAt: true,
        usageCount: true,
        uploadedBy: { select: { id: true, name: true } },
      },
    });
  }

  /**
   * Get single media asset by ID with all URLs
   */
  async getMediaById(id: string) {
    const media = await this.prisma.mediaAsset.findUnique({
      where: { id },
      include: {
        uploadedBy: { select: { id: true, name: true, email: true } },
      },
    });

    if (!media || media.isDeleted) {
      throw new NotFoundException(`Media asset not found`);
    }

    return media;
  }

  // ──────────────────────────────────────────────────────────────────────
  // 🗑️ DELETION & CLEANUP
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Soft delete a media asset
   */
  async deleteMedia(mediaId: string, userId: string): Promise<boolean> {
    // Verify ownership
    const media = await this.getMediaById(mediaId);
    if (media.uploadedById !== userId) {
      throw new BadRequestException('You can only delete your own images');
    }

    // Soft delete
    await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Decrement refCount
    if (media.refCount > 1) {
      await this.prisma.mediaAsset.update({
        where: { fileHash: media.fileHash },
        data: { refCount: { decrement: 1 } },
      });
    }

    this.logger.log(`Asset soft deleted: ${mediaId}`);
    return true;
  }

  /**
   * Increment usage counter
   */
  async trackUsage(mediaId: string): Promise<void> {
    await this.prisma.mediaAsset.update({
      where: { id: mediaId },
      data: {
        usageCount: { increment: 1 },
        lastUsedAt: new Date(),
      },
    });
  }

  /**
   * Cleanup orphaned files from S3 (run monthly via Cron)
   */
  async cleanupOrphanedFiles(): Promise<number> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orphans = await this.prisma.mediaAsset.findMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: thirtyDaysAgo },
        purgedFromS3: false,
        refCount: 0,
      },
    });

    this.logger.log(`Found ${orphans.length} orphaned assets to clean`);

    let deletedCount = 0;

    for (const orphan of orphans) {
      try {
        await this.s3Service.deleteFile(orphan.key);
        deletedCount++;
      } catch (error) {
        this.logger.error(`Failed to delete S3 file: ${orphan.key}`, error);
      }
    }

    // Mark as purged in DB
    await this.prisma.mediaAsset.updateMany({
      where: {
        isDeleted: true,
        deletedAt: { lte: thirtyDaysAgo },
        purgedFromS3: false,
        refCount: 0,
      },
      data: { purgedFromS3: true },
    });

    this.logger.log(`Cleanup completed: ${deletedCount} files deleted from S3`);
    return deletedCount;
  }

  // ──────────────────────────────────────────────────────────────────────
  // ✅ VALIDATION HELPERS
  // ──────────────────────────────────────────────────────────────────────

  /**
   * Validate uploaded file meets requirements
   */
  private validateFile(buffer: Buffer, filename: string): void {
    if (buffer.length > MEDIA_CONSTRAINTS.maxFileSize) {
      throw new BadRequestException(
        `File too large. Max: ${MEDIA_CONSTRAINTS.maxFileSize / 1024 / 1024}MB`,
      );
    }

    if (buffer.length < MEDIA_CONSTRAINTS.minFileSize) {
      throw new BadRequestException('File too small');
    }

    const detectedMime = this.detectMimeType(buffer);
    if (!MEDIA_CONSTRAINTS.supportedFormats.includes(detectedMime)) {
      throw new BadRequestException(
        `Unsupported format. Supported: JPEG, PNG, GIF, WebP`,
      );
    }
  }

  /**
   * Detect MIME type from file magic bytes
   */
  private detectMimeType(buffer: Buffer): string {
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return 'image/jpeg';
    }

    // PNG
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return 'image/png';
    }

    // GIF
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return 'image/gif';
    }

    // WebP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return 'image/webp';
    }

    return 'application/octet-stream';
  }

  /**
   * Detect image format from buffer
   */
  private detectFormat(buffer: Buffer): string {
    const mime = this.detectMimeType(buffer);
    return mime.split('/')[1] || 'jpg';
  }

  /**
   * Compute SHA-256 hash of file buffer
   */
  private computeHash(buffer: Buffer): string {
    return crypto.createHash('sha256').update(buffer).digest('hex');
  }
}
