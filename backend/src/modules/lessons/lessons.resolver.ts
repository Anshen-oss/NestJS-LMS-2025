import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { LessonProgress } from '../progress/entities/lesson-progress.entity';
import { ProgressService } from '../progress/progress.service';
import { User } from '../users/entities/user.entity';
import { CreateLessonAttachmentInput } from './dto/create-lesson-attachment.input';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonContentInput } from './dto/update-lesson-content.input';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { UpdateProgressInput } from './dto/update-progress.input';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';
import { LessonAttachment } from './types/lesson-attachment.type';

@Resolver(() => Lesson)
export class LessonsResolver {
  constructor(
    private readonly lessonsService: LessonsService,
    private progressService: ProgressService,
  ) {}

  // ═══════════════════════════════════════════════════════════
  //                         QUERIES
  // ═══════════════════════════════════════════════════════════

  @Query(() => [Lesson], { name: 'lessonsByChapter' })
  async findAllByChapter(
    @Args('chapterId') chapterId: string,
    @CurrentUser() user?: User,
  ) {
    return this.lessonsService.findAllByChapter(chapterId, user?.id);
  }

  @Query(() => Lesson, { name: 'lesson' })
  async findOne(@Args('id') id: string, @CurrentUser() user?: User) {
    // ✅ Pour les queries publiques, utiliser USER comme rôle par défaut si undefined
    const userRole = user?.role ?? UserRole.STUDENT;
    return this.lessonsService.findOne(id, user?.id, userRole);
  }

  /**
   * Récupérer une lesson pour l'édition (ADMIN/INSTRUCTOR seulement)
   * Ne fait PAS les checks d'enrollment
   */
  @Query(() => Lesson, { name: 'lessonForEdit' })
  @UseGuards(ClerkGqlGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async findOneForEdit(@Args('id') id: string, @CurrentUser() user: User) {
    // ✅ Vérification explicite du rôle
    if (!user.role) {
      throw new UnauthorizedException('User role is required');
    }

    return this.lessonsService.findOneForEdit(id, user.id, user.role);
  }

  // ═══════════════════════════════════════════════════════════
  //                        MUTATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Créer une leçon
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Lesson)
  @UseGuards(ClerkGqlGuard)
  async createLesson(
    @Args('chapterId') chapterId: string,
    @Args('input') input: CreateLessonInput,
    @CurrentUser() user: User,
  ) {
    // ✅ Vérification explicite : si l'utilisateur n'a pas de rôle, c'est une erreur
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.lessonsService.create(chapterId, input, user.id, user.role);
  }

  /**
   * Mettre à jour une leçon
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Lesson)
  @UseGuards(ClerkGqlGuard)
  async updateLesson(
    @Args('id') id: string,
    @Args('input') input: UpdateLessonInput,
    @CurrentUser() user: User,
  ) {
    // ✅ Vérification explicite
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.lessonsService.update(id, input, user.id, user.role);
  }

  /**
   * Supprimer une leçon
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Boolean)
  @UseGuards(ClerkGqlGuard)
  async deleteLesson(@Args('id') id: string, @CurrentUser() user: User) {
    // ✅ Vérification explicite
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.lessonsService.delete(id, user.id, user.role);
  }

  // ═══════════════════════════════════════════════════════════
  //               MUTATIONS - PROGRESSION
  // ═══════════════════════════════════════════════════════════

  /**
   * Marquer une leçon comme complétée
   * AUTORISÉ : Utilisateurs connectés
   */
  @Mutation(() => LessonProgress)
  @UseGuards(ClerkGqlGuard)
  async markLessonAsCompleted(
    @Args('lessonId') lessonId: string,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.markAsCompleted(lessonId, user.id);
  }

  /**
   * Mettre à jour la progression de visionnage
   * AUTORISÉ : Utilisateurs connectés
   */
  @Mutation(() => LessonProgress)
  @UseGuards(ClerkGqlGuard)
  async updateLessonProgress(
    @Args('lessonId') lessonId: string,
    @Args('input') input: UpdateProgressInput,
    @CurrentUser() user: User,
  ) {
    return this.lessonsService.updateProgress(
      lessonId,
      user.id,
      input.watchedDuration,
    );
  }

  @Mutation(() => Lesson)
  @UseGuards(ClerkGqlGuard)
  async updateLessonContent(
    @Args('input') input: UpdateLessonContentInput,
  ): Promise<Lesson> {
    return this.lessonsService.updateLessonContent(
      input.lessonId,
      input.content,
      input.isPublished,
    );
  }

  // ═══════════════════════════════════════════════════════════
  //                    RESOLVE FIELDS
  // ═══════════════════════════════════════════════════════════

  /**
   * Résout le champ completed pour l'utilisateur courant
   */
  @ResolveField(() => Boolean)
  async completed(@Parent() lesson: Lesson, @CurrentUser() user?: User) {
    if (!user) return false;

    const progress = await this.progressService.getLessonProgress(
      user.id,
      lesson.id,
    );

    return progress?.completed || false;
  }

  /**
   * Créer un attachement
   */
  @Mutation(() => LessonAttachment)
  @UseGuards(ClerkGqlGuard)
  async createLessonAttachment(
    @Args('input') input: CreateLessonAttachmentInput,
  ): Promise<LessonAttachment> {
    return this.lessonsService.createAttachment(
      input.lessonId,
      input.fileName,
      input.fileUrl,
      input.fileSize,
      input.fileType,
    );
  }

  /**
   * Lister les attachements d'une lesson
   */
  @Query(() => [LessonAttachment])
  async lessonAttachments(
    @Args('lessonId') lessonId: string,
  ): Promise<LessonAttachment[]> {
    return this.lessonsService.getAttachments(lessonId);
  }

  /**
   * Supprimer un attachement
   */
  @Mutation(() => Boolean)
  @UseGuards(ClerkGqlGuard)
  async deleteLessonAttachment(@Args('id') id: string): Promise<boolean> {
    return this.lessonsService.deleteAttachment(id);
  }
}
