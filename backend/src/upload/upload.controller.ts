import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from 'src/modules/s3/s3.service';

/**
 * REST Controller pour l'upload de fichiers
 *
 * Route: POST /api/upload
 * Multipart FormData avec fichier
 */
@Controller('api')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  /**
   * Upload un avatar vers S3
   *
   * @param file - Le fichier uploadé (image)
   * @returns {success, avatarUrl, avatarKey, message}
   */
  @Post('upload')
  @HttpCode(201)
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, cb) => {
        // ✅ Vérifier que c'est une image
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException('Seules les images sont acceptées'),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file: any) {
    console.log('📤 [UPLOAD] POST /api/upload - Endpoint reçu');
    console.log('📤 [UPLOAD] File:', file ? 'OUI' : 'NON');
    console.log('📤 [UPLOAD] Body:', file);

    if (!file) {
      console.error('❌ [UPLOAD] Aucun fichier fourni');
      throw new BadRequestException('Aucun fichier fourni');
    }

    try {
      console.log(
        '📸 [UPLOAD] Fichier reçu:',
        file.originalname,
        `(${file.size} bytes)`,
      );

      // ✅ Upload vers S3 dans le dossier "avatars"
      const { publicUrl, key } = await this.s3Service.uploadUserAvatar(
        file.buffer,
        file.originalname,
        file.mimetype,
      );

      console.log('✅ Upload S3 réussi:', key);

      return {
        success: true,
        message: 'Avatar uploadé avec succès',
        avatarUrl: publicUrl,
        avatarKey: key,
      };
    } catch (error) {
      console.error('❌ Erreur upload:', error);
      throw new BadRequestException(
        error instanceof Error ? error.message : "Erreur lors de l'upload",
      );
    }
  }
}
