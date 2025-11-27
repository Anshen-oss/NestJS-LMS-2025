import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private publicUrl: string;

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
}
