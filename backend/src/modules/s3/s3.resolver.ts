import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

import { Roles } from '../auth/decorators/roles.decorator';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { S3Service } from './s3.service';

@ObjectType()
class UploadUrlResponse {
  @Field()
  uploadUrl: string;

  @Field()
  key: string;

  @Field()
  publicUrl: string;
}

@Resolver()
export class S3Resolver {
  constructor(private s3Service: S3Service) {}

  /**
   * Génère une URL pré-signée pour upload
   */
  @Mutation(() => UploadUrlResponse)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async getUploadUrl(
    @Args('fileName') fileName: string,
    @Args('contentType') contentType: string,
  ): Promise<UploadUrlResponse> {
    return this.s3Service.getUploadUrl(fileName, contentType);
  }

  /**
   * Supprime un fichier de S3
   */
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async deleteFile(@Args('url') url: string): Promise<boolean> {
    const key = this.s3Service.extractKeyFromUrl(url);
    if (!key) {
      throw new Error('Invalid S3 URL');
    }
    await this.s3Service.deleteFile(key);
    return true;
  }
}
