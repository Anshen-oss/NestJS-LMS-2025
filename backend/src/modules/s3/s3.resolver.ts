import { UseGuards } from '@nestjs/common';
import { Args, Field, Mutation, ObjectType, Resolver } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';

import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard'; // ✅ Import ClerkGqlGuard
import { RolesGuard } from '../auth/guards/roles.guard';
import { S3Service } from './s3.service';

import type { FileUpload } from 'graphql-upload-ts';
import { GraphQLUpload } from 'graphql-upload-ts';

// ========================================
// 🆕 TYPES GRAPHQL POUR AVATARS (Phase 18)
// ========================================

/**
 * Réponse de l'upload d'avatar
 * Retournée par la mutation uploadUserAvatar
 */
@ObjectType('UploadAvatarResponse')
class UploadAvatarResponse {
  /**
   * URL publique de l'avatar stocké sur S3
   * Exemple: https://s3.tigris.dev/lms/avatars/1234-abc.webp
   */
  @Field()
  avatarUrl: string;

  /**
   * Indicateur de succès de l'upload
   * true = upload réussi
   * false = erreur pendant l'upload
   */
  @Field()
  success: boolean;

  /**
   * Message optionnel (succès ou erreur)
   * Exemple: "Avatar uploadé avec succès" ou "Format non supporté"
   */
  @Field({ nullable: true })
  message?: string;
}

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

  // ========================================
  // 🆕 MUTATION POUR AVATAR UPLOAD
  // ========================================

  /**
   * 🆕 Upload et compresse un avatar utilisateur
   *
   * PROCESSUS:
   * 1️⃣  Reçoit le fichier image (GraphQL Upload)
   * 2️⃣  Valide le format (JPEG, PNG, WEBP, GIF)
   * 3️⃣  Valide la taille (max 5MB)
   * 4️⃣  Compresse avec SHARP (200x200, WEBP, quality 80%)
   * 5️⃣  Upload à Tigris S3
   * 6️⃣  Retourne l'URL publique
   *
   * AUTHENTIFICATION:
   * - Requiert @ClerkGqlGuard: user authentifié
   * - Requiert @RolesGuard: user a un rôle valide
   * - Tous les rôles peuvent uploader (ADMIN, INSTRUCTOR, STUDENT)
   *
   * @param file - Le fichier image (type: GraphQLUpload)
   *   - Propriétés disponibles:
   *     • filename: string (nom du fichier)
   *     • mimetype: string (type MIME: image/jpeg, etc)
   *     • encoding: string (7bit, etc)
   *     • createReadStream(): Stream (flux du fichier)
   *
   * @returns UploadAvatarResponse
   *   {
   *     avatarUrl: "https://s3.tigris.dev/avatars/...",
   *     success: true,
   *     message: "Avatar uploadé avec succès"
   *   }
   *
   * @throws BadRequestException si fichier invalide
   *
   * EXEMPLE D'UTILISATION (GraphQL Query):
   * ```graphql
   * mutation UploadAvatar($file: Upload!) {
   *   uploadUserAvatar(file: $file) {
   *     avatarUrl
   *     success
   *     message
   *   }
   * }
   * ```
   *
   * Variables:
   * ```json
   * {
   *   "file": <binary_data>
   * }
   * ```
   */
  @Mutation(() => UploadAvatarResponse, {
    description:
      'Upload un avatar utilisateur. Compresse automatiquement en WEBP 200x200.',
  })
  @UseGuards(ClerkGqlGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR, UserRole.STUDENT)
  async uploadUserAvatar(
    @Args('file', { type: () => GraphQLUpload })
    file: FileUpload,
  ): Promise<UploadAvatarResponse> {
    console.log("📤 Upload d'avatar reçu:", {
      filename: file.filename,
      mimetype: file.mimetype,
      encoding: file.encoding,
    });

    try {
      // ✅ ÉTAPE 1 : Lire le fichier en buffer
      // ─────────────────────────────────────
      // Le fichier arrive sous forme de stream (flux de données)
      // On doit le lire entièrement avant de le traiter

      const chunks: Buffer[] = [];
      const stream = file.createReadStream();

      // Écouter l'événement 'data' pour chaque chunk reçu
      stream.on('data', (chunk: Buffer) => {
        console.log(`📦 Chunk reçu: ${(chunk.length / 1024).toFixed(2)}KB`);
        chunks.push(chunk);
      });

      // Attendre que le stream soit terminé
      await new Promise<void>((resolve, reject) => {
        stream.on('end', () => {
          console.log('✅ Stream terminé');
          resolve();
        });
        stream.on('error', (error) => {
          console.error('❌ Erreur stream:', error);
          reject(error);
        });
      });

      // Fusionner tous les chunks en un seul Buffer
      const fileBuffer = Buffer.concat(chunks);
      console.log(
        `📊 Taille totale: ${(fileBuffer.length / 1024).toFixed(2)}KB`,
      );

      // ✅ ÉTAPE 2 : Appeler le service S3 pour upload
      // ──────────────────────────────────────────────
      // Le S3Service va:
      // 1. Valider le fichier
      // 2. Compresser avec SHARP
      // 3. Upload à S3
      // 4. Retourner l'URL

      console.log('🔄 Appel S3Service.uploadUserAvatar()...');
      const uploadResult = await this.s3Service.uploadUserAvatar(
        fileBuffer,
        file.filename,
        file.mimetype,
      );

      console.log('✅ Avatar uploadé avec succès:', {
        url: uploadResult.publicUrl,
        key: uploadResult.key,
      });

      // ✅ ÉTAPE 3 : Retourner la réponse au frontend
      // ─────────────────────────────────────────────
      return {
        avatarUrl: uploadResult.publicUrl,
        success: true,
        message: 'Avatar uploadé et compressé avec succès',
      };
    } catch (error) {
      console.error("❌ Erreur lors de l'upload d'avatar:", error);

      // Retourner une erreur mais de manière gracieuse
      // (sans crash le serveur)
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur inconnue lors de l'upload";

      return {
        avatarUrl: '',
        success: false,
        message: `❌ ${errorMessage}`,
      };
    }
  }
}
