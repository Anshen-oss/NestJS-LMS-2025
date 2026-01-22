import { clerkClient } from '@clerk/clerk-sdk-node';
import {
  BadRequestException,
  Controller,
  Logger,
  Post,
  Request,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request as ExpressRequest } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaLibraryService } from '../services/media-library.service';

interface AuthenticatedRequest extends ExpressRequest {
  user?: {
    id: string;
    email?: string;
  };
}

@Controller('api/media')
export class MediaUploadController {
  private readonly logger = new Logger(MediaUploadController.name);

  constructor(
    private readonly mediaLibraryService: MediaLibraryService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Upload media file endpoint
   */
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(
    @UploadedFile() file: Express.Multer.File | undefined,
    @Request() req: AuthenticatedRequest,
  ) {
    // Verify file exists
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    try {
      // Step 1: Verify JWT token with Clerk
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new BadRequestException('No authorization header');
      }

      const token = authHeader.replace('Bearer ', '');
      const session = await clerkClient.verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY,
      });

      if (!session || !session.sub) {
        throw new BadRequestException('Invalid token');
      }

      // Step 2: Get user from database using Clerk ID
      const user = await this.prisma.user.findUnique({
        where: { clerkId: session.sub },
      });

      if (!user) {
        throw new BadRequestException('User not found in database');
      }

      const userId = user.id; // ✅ Use the internal UUID

      this.logger.log(
        `Upload started: ${file.originalname} (${file.size} bytes) by user ${userId}`,
      );

      // Step 3: Upload media
      const result = await this.mediaLibraryService.uploadMedia(
        file.buffer,
        file.originalname,
        userId,
      );

      this.logger.log(`Upload successful: ${result.mediaId}`);

      return {
        success: true,
        mediaId: result.mediaId,
        filename: result.filename,
        urlOriginal: result.urlOriginal,
        urlLarge: result.urlLarge,
        urlMedium: result.urlMedium,
        urlThumbnail: result.urlThumbnail,
        width: result.width,
        height: result.height,
        size: result.size,
        isDeduped: result.isDeduped,
        message: result.isDeduped
          ? 'File was already in system, reused!'
          : 'File uploaded successfully',
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Upload failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Health check for upload endpoint
   */
  @Post('health')
  healthCheck() {
    return {
      status: 'ok',
      endpoint: '/api/media/upload',
      method: 'POST',
      contentType: 'multipart/form-data',
    };
  }
}
