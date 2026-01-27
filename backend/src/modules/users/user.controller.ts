import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ClerkRestGuard } from 'src/auth/guards/clerk-rest.guard';
import { UsersService } from './users.service';

@Controller('api/user')
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * 🖼️ GET - Récupérer l'utilisateur actuel avec avatar
   */
  @Get('me')
  @UseGuards(ClerkRestGuard)
  async getCurrentUser(@Req() req: any) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.usersService.getUserWithAvatar(userId);

      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        avatar: user.avatar
          ? {
              id: user.avatar.id,
              urlMedium: user.avatar.urlMedium,
              urlLarge: user.avatar.urlLarge,
            }
          : null,
      };
    } catch (error) {
      console.error('❌ Error in getCurrentUser:', error);
      throw error;
    }
  }

  /**
   * 🖼️ PUT - Mettre à jour l'avatar (REST API)
   */
  @Put('avatar')
  @UseGuards(ClerkRestGuard)
  async updateUserAvatar(
    @Req() req: any,
    @Body() body: { avatarMediaId: string },
  ) {
    const userId = req.user?.id;
    console.log(
      `🖼️ Updating avatar for user ${userId} with media ${body.avatarMediaId}`,
    );

    return await this.usersService.updateUserAvatar(userId, body.avatarMediaId);
  }

  /**
   * 🖼️ GET - Récupérer les images du user (REST API)
   */
  @Get('media')
  @UseGuards(ClerkRestGuard)
  async getUserMedia(@Req() req: any, @Query('limit') limit: string = '50') {
    const userId = req.user?.id;
    console.log(`📸 GET /api/user/media - userId: ${userId}, limit: ${limit}`);

    if (!userId) {
      throw new HttpException('User ID not found', HttpStatus.UNAUTHORIZED);
    }

    const result = await this.usersService.getUserMedia(
      userId,
      parseInt(limit),
    );
    console.log('📸 Returning:', result);
    return result;
  }

  // src/modules/users/user.controller.ts

  @Post('upload-avatar')
  @UseGuards(ClerkRestGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<any> {
    const userId = req.user?.id;

    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    return await this.usersService.uploadAvatarFile(userId, file);
  }
}
