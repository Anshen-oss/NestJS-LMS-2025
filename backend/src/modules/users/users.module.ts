import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { S3Module } from '../s3/s3.module';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, S3Module],
  providers: [UsersResolver, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
