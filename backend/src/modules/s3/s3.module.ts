import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { S3Resolver } from './s3.resolver'; // ← Important
import { S3Service } from './s3.service';

@Module({
  imports: [ConfigModule, AuthModule],
  providers: [S3Service, S3Resolver], // ← S3Resolver doit être ici
  exports: [S3Service],
})
export class S3Module {}
