import { Module } from '@nestjs/common';
import { S3Service } from '../s3/s3.service';
import { MediaUploadController } from './controllers/media-upload.controller';
import { MediaLibraryResolver } from './graphql/media-library.resolver';
import { MediaLibraryService } from './services/media-library.service';

/**
 * MediaLibrary Module
 *
 * Handles:
 * - Image upload and processing
 * - Media library management
 * - S3 integration
 * - GraphQL API for media operations
 * - REST API for file uploads
 */
@Module({
  imports: [], // Check if there's an S3Module to import instead
  controllers: [MediaUploadController],
  providers: [MediaLibraryService, MediaLibraryResolver, S3Service],
  exports: [MediaLibraryService],
})
export class MediaLibraryModule {}
