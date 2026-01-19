import { Module } from '@nestjs/common';
import { S3Module } from 'src/modules/s3/s3.module';
import { UploadController } from './upload.controller';

@Module({
  imports: [S3Module],
  controllers: [UploadController],
})
export class UploadModule {}
