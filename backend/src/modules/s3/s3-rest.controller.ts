import {
  BadRequestException,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('api')
export class S3RestController {
  constructor(private readonly s3Service: S3Service) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UploadedFile()
    file: any,
  ) {
    try {
      console.log('📁 File received:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
        encoding: file.encoding,
      });

      if (!file) throw new BadRequestException('Aucun fichier fourni');

      // ✅ Formats d'image acceptés (avec SVG)
      const validMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml', // ← AJOUTER SVG
      ];
      if (!validMimeTypes.includes(file.mimetype)) {
        console.error('❌ Invalid mimetype:', file.mimetype);
        throw new BadRequestException(
          `Type d'image non supporté. Formats acceptés: ${validMimeTypes.join(', ')}`,
        );
      }

      const MAX_SIZE = 5 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        throw new BadRequestException('Fichier trop volumineux (max 5MB)');
      }

      const result = await this.s3Service.uploadUserAvatar(
        file.buffer,
        file.originalname,
        file.mimetype,
      );

      return {
        success: true,
        message: 'Avatar uploadé avec succès',
        avatarUrl: result.publicUrl,
        avatarKey: result.key,
      };
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw new HttpException(
        {
          success: false,
          message: error.message || "Erreur lors de l'upload",
        },
        error.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
