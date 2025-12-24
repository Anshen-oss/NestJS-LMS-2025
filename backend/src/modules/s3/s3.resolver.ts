import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard'; // ✅ Import ClerkGqlGuard
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
  @UseGuards(ClerkGqlGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async getUploadUrl(
    @Args('fileName') fileName: string,
    @Args('contentType') contentType: string,
  ): Promise<UploadUrlResponse> {
    //console.log('🖼️ GetUploadUrl called for:', fileName, contentType);

    const result = await this.s3Service.getUploadUrl(fileName, contentType);

    //console.log('✅ Upload URL generated');

    return result;
  }

  /**
   * Génère une URL pré-signée pour upload de vidéo avec validation
   */
  @Mutation(() => UploadUrlResponse)
  @UseGuards(ClerkGqlGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async getUploadUrlForVideo(
    @Args('fileName') fileName: string,
    @Args('fileType') fileType: string,
    @Args('fileSize') fileSize: number,
  ): Promise<UploadUrlResponse> {
    const result = await this.s3Service.getUploadUrlForVideo(
      fileName,
      fileType,
      fileSize,
    );
    return result;
  }

  /**
   * Supprime un fichier de S3
   */
  @Mutation(() => Boolean)
  @UseGuards(ClerkGqlGuard)
  async deleteFile(@Args('url') url: string): Promise<boolean> {
    console.log('🗑️ DeleteFile called for:', url);

    const key = this.s3Service.extractKeyFromUrl(url);
    if (!key) {
      throw new Error('Invalid S3 URL');
    }

    await this.s3Service.deleteFile(key);

    //console.log('✅ File deleted');

    return true;
  }
}
