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
import { User } from '../auth/entities/user.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateLessonInput } from './dto/create-lesson.input';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { UpdateProgressInput } from './dto/update-progress.input';
import { LessonProgress } from './entities/lesson-progress.entity';
import { Lesson } from './entities/lesson.entity';
import { LessonsService } from './lessons.service';

@Resolver(() => Lesson)
export class LessonsResolver {
  constructor(private readonly lessonsService: LessonsService) {}

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
    const userRole = user?.role ?? UserRole.USER;
    return this.lessonsService.findOne(id, user?.id, userRole);
  }

  // ═══════════════════════════════════════════════════════════
  //                        MUTATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Créer une leçon
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Lesson)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
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
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
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
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
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
  @UseGuards(GqlAuthGuard)
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
  @UseGuards(GqlAuthGuard)
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

  // ═══════════════════════════════════════════════════════════
  //                    RESOLVE FIELDS
  // ═══════════════════════════════════════════════════════════

  /**
   * Résout le champ isCompleted pour l'utilisateur courant
   */
  @ResolveField(() => Boolean, { nullable: true })
  async isCompleted(@Parent() lesson: Lesson, @CurrentUser() user?: User) {
    if (!user) return null;

    // Déjà calculé dans le service si userId fourni
    if ('isCompleted' in lesson) {
      return lesson.isCompleted;
    }

    // Sinon calculer
    const progress = await this.lessonsService[
      'prisma'
    ].lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId: lesson.id,
        },
      },
    });

    return progress?.isCompleted ?? false;
  }
}
