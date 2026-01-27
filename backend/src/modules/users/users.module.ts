import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { MediaLibraryModule } from '../media-library/media-library.module';
import { S3Module } from '../s3/s3.module';
import { UserController } from './user.controller';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  controllers: [UserController],
  imports: [PrismaModule, S3Module, MediaLibraryModule],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
