import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

  // 🆕 Configuration vidéo
  private readonly VIDEO_MAX_SIZE = 2 * 1024 * 1024 * 1024; // 2GB en bytes
  private readonly ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
  private readonly ALLOWED_VIDEO_EXTENSIONS = ['.mp4', '.webm'];

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get('AWS_REGION') || 'auto',
      endpoint: this.configService.get('AWS_ENDPOINT_URL_S3'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')!,
      },
    });

    this.bucketName = this.configService.get('AWS_S3_BUCKET_NAME')!;
    this.publicUrl = this.configService.get('AWS_S3_PUBLIC_URL')!;
  }

  /**
   * Génère une URL pré-signée pour upload
   */
  async getUploadUrl(
    fileName: string,
    contentType: string,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    // Génère un nom de fichier unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const key = `uploads/${timestamp}-${randomString}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    // URL valide pendant 5 minutes
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    const publicUrl = `${this.publicUrl}/${key}`;

    return {
      uploadUrl,
      key,
      publicUrl,
    };
  }

  /**
   * Supprime un fichier de S3
   */
  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    await this.s3Client.send(command);
  }

  /**
   * Extrait la clé (key) depuis une URL publique
   */
  extractKeyFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      // Retire le premier slash
      return pathname.startsWith('/') ? pathname.substring(1) : pathname;
    } catch {
      return null;
    }
  }

  async getUploadUrlForFile(
    fileName: string,
    contentType: string,
    folder: string = 'lesson-attachments',
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const key = `${folder}/${timestamp}-${randomString}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 300,
    });

    const publicUrl = `${this.publicUrl}/${key}`;

    return {
      uploadUrl,
      key,
      publicUrl,
    };
  }

  // ========================================
  // 🆕 NOUVELLES MÉTHODES POUR LES VIDÉOS
  // ========================================

  /**
   * 🆕 Génère une URL pré-signée pour upload de vidéo avec validation
   * @param fileName - Nom du fichier vidéo
   * @param fileType - Type MIME (video/mp4, video/webm)
   * @param fileSize - Taille du fichier en bytes
   * @returns Object contenant uploadUrl, key et publicUrl
   */
  async getUploadUrlForVideo(
    fileName: string,
    fileType: string,
    fileSize: number,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    // Validation du type MIME
    if (!this.ALLOWED_VIDEO_TYPES.includes(fileType)) {
      throw new BadRequestException(
        `Type de fichier non supporté. Formats acceptés: ${this.ALLOWED_VIDEO_TYPES.join(', ')}`,
      );
    }

    // Validation de l'extension
    const hasValidExtension = this.ALLOWED_VIDEO_EXTENSIONS.some((ext) =>
      fileName.toLowerCase().endsWith(ext),
    );
    if (!hasValidExtension) {
      throw new BadRequestException(
        `Extension de fichier non supportée. Extensions acceptées: ${this.ALLOWED_VIDEO_EXTENSIONS.join(', ')}`,
      );
    }

    // Validation de la taille
    if (fileSize > this.VIDEO_MAX_SIZE) {
      const maxSizeGB = this.VIDEO_MAX_SIZE / (1024 * 1024 * 1024);
      throw new BadRequestException(
        `La taille du fichier dépasse la limite de ${maxSizeGB}GB`,
      );
    }

    // Génère un nom de fichier unique dans le dossier videos/
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `videos/${timestamp}-${randomString}-${sanitizedFileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: fileType,
      ContentLength: fileSize,
    });

    // URL valide pendant 10 minutes (plus long pour les vidéos)
    const uploadUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: 600,
    });

    const publicUrl = `${this.publicUrl}/${key}`;

    return {
      uploadUrl,
      key,
      publicUrl,
    };
  }

  /**
   * 🆕 Supprime une vidéo de S3
   * @param key - La clé S3 de la vidéo (ex: "videos/1234-abc-intro.mp4")
   */
  async deleteVideo(key: string): Promise<void> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`✅ Vidéo supprimée de S3: ${key}`);
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la vidéo:', error);
      throw new BadRequestException('Impossible de supprimer la vidéo de S3');
    }
  }

  /**
   * Compresse et uploade un avatar utilisateur à S3
   */
  async uploadUserAvatar(
    fileBuffer: Buffer,
    fileName: string,
    fileType: string,
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    // Validation
    this.validateImageFile(fileName, fileType);
    this.validateFileSize(fileBuffer.length, 5 * 1024 * 1024); // 5MB max

    // Compression avec SHARP
    console.log("🖼️ Compression de l'avatar...");
    const sharp = (await import('sharp')).default;

    const compressedBuffer = await sharp(fileBuffer)
      .resize(200, 200, {
        fit: 'cover',
        position: 'center',
      })
      .webp({ quality: 80 })
      .toBuffer();

    console.log(
      `📉 Taille originale: ${(fileBuffer.length / 1024).toFixed(2)}KB → Compressée: ${(compressedBuffer.length / 1024).toFixed(2)}KB`,
    );

    // Générer une clé unique
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const key = `avatars/${timestamp}-${randomString}.webp`;

    // Upload à S3
    console.log(`📤 Upload à S3 avec clé: ${key}`);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: compressedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000',
    });

    await this.s3Client.send(command);
    console.log('✅ Avatar uploadé avec succès à S3');

    const publicUrl = `${this.publicUrl}/${key}`;

    return {
      uploadUrl: publicUrl,
      key,
      publicUrl,
    };
  }

  /**
   * Valide le type d'image
   */
  private validateImageFile(fileName: string, contentType: string): void {
    const ALLOWED_IMAGE_TYPES = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

    if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
      throw new BadRequestException(
        `Type d'image non supporté. Formats acceptés: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
      );
    }

    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      fileName.toLowerCase().endsWith(ext),
    );
    if (!hasValidExtension) {
      throw new BadRequestException(
        `Extension non supportée. Extensions acceptées: ${ALLOWED_EXTENSIONS.join(', ')}`,
      );
    }
  }

  /**
   * Valide la taille du fichier
   */
  private validateFileSize(fileSize: number, maxSize: number): void {
    if (fileSize > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      throw new BadRequestException(
        `La taille du fichier dépasse la limite de ${maxSizeMB}MB`,
      );
    }
  }

  /**
   * Supprime un avatar de S3
   */
  async deleteUserAvatar(key: string): Promise<void> {
    if (!key) {
      console.warn("⚠️ Tentative de suppression d'un avatar sans clé");
      return;
    }

    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
      console.log(`✅ Avatar supprimé de S3: ${key}`);
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'avatar:", error);
      throw new BadRequestException("Impossible de supprimer l'ancien avatar");
    }
  }
}
