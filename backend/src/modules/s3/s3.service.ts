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
}
