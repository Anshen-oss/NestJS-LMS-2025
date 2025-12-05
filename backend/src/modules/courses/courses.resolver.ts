import { UnauthorizedException, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CourseStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { User } from '../auth/entities/user.entity';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Chapter } from '../chapters/entities/chapter.entity';
import { Lesson } from '../lessons/entities/lesson.entity';
import { CoursesService } from './courses.service';
import { CreateChapterInput } from './dto/create-chapter.input';
import { CreateCourseInput } from './dto/create-course.input';
import { CreateLessonInput } from './dto/create-lesson.input';
import { ReorderChaptersInput } from './dto/reorder-chapters.input';
import { ReorderLessonsInput } from './dto/reorder-lessons.input';
import { UpdateChapterInput } from './dto/update-chapter.input';
import { UpdateCourseInput } from './dto/update-course.input';
import { UpdateLessonInput } from './dto/update-lesson.input';
import { Course } from './entities/course.entity';

@Resolver(() => Course)
export class CoursesResolver {
  constructor(private readonly coursesService: CoursesService) {}

  // ═══════════════════════════════════════════════════════════
  //                         QUERIES
  // ═══════════════════════════════════════════════════════════
  @Query(() => [Course], { name: 'courses' })
  async findAll(
    @CurrentUser() user: User,
    @Args('status', { type: () => CourseStatus, nullable: true })
    status?: CourseStatus,
  ) {
    return this.coursesService.findAll(user?.role || UserRole.USER, status);
  }

  @Query(() => Course, { name: 'course' })
  async findOne(@Args('id') id: string, @CurrentUser() user: User) {
    return this.coursesService.findOne(id, user?.role || UserRole.USER);
  }

  @Query(() => Course, { name: 'getCourseForEdit' })
  @UseGuards(GqlAuthGuard)
  async getCourseForEdit(@Args('id') id: string, @CurrentUser() user: User) {
    if (!user || !user.role) {
      throw new UnauthorizedException('You must be logged in');
    }

    return this.coursesService.findOneForEdit(id, user.id, user.role);
  }

  // ═══════════════════════════════════════════════════════════
  //                        MUTATIONS
  // ═══════════════════════════════════════════════════════════

  /**
   * Créer un cours
   * AUTORISÉ : ADMIN, INSTRUCTOR
   */

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async createCourse(
    @Args('input') input: CreateCourseInput,
    @CurrentUser() user: User,
  ) {
    return this.coursesService.create(user.id, input);
  }

  /**
   * Mettre à jour un cours
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */

  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async updateCourse(
    @Args('input') input: UpdateCourseInput,
    @CurrentUser() user: User,
  ): Promise<Course> {
    // Vérifier que l'utilisateur est admin
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.updateCourse(user.id, user.role, input);
  }

  /**
   * Créer un chapter
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Chapter)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async createChapter(
    @Args('input') input: CreateChapterInput,
    @CurrentUser() user: User,
  ): Promise<any> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.coursesService.createChapter(user.id, user.role, input);
  }

  /**
   * Mettre à jour un chapter
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Chapter)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async updateChapter(
    @Args('input') input: UpdateChapterInput,
    @CurrentUser() user: User,
  ): Promise<Chapter> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.coursesService.updateChapter(user.id, user.role, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async deleteChapter(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.deleteChapter(user.id, user.role, id);
  }

  @Query(() => [Chapter], { name: 'chaptersByCourse' })
  async getChaptersByCourse(@Args('courseId') courseId: string) {
    return this.coursesService.getChaptersByCourse(courseId);
  }

  /**
   * Supprimer un cours
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async deleteCourse(@Args('id') id: string, @CurrentUser() user: User) {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.deleteCourse(id, user.id, user.role);
  }

  /**
   * Réordonner les chapters un cours
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => [Chapter])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async reorderChapters(
    @Args('input') input: ReorderChaptersInput,
    @CurrentUser() user: User,
  ): Promise<any> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.coursesService.reorderChapters(user.id, user.role, input);
  }

  /**
   * Récupérer un cours
   */
  @Query(() => Course)
  async courseBySlug(@Args('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  /**
   * Récupérer mes cours (Instructor/Admin)
   * AUTORISÉ : ADMIN, INSTRUCTOR
   */
  @Query(() => [Course], { name: 'myCourses' })
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async getMyCourses(@CurrentUser() user: User) {
    return this.coursesService.getMyCourses(user.id);
  }

  /**
   * Publier un cours
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async publishCourse(@Args('id') id: string, @CurrentUser() user: User) {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.publish(id, user.id, user.role);
  }

  /**
   * Archiver un cours
   * AUTORISÉ : ADMIN, INSTRUCTOR (ses cours)
   */
  @Mutation(() => Course)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async archiveCourse(@Args('id') id: string, @CurrentUser() user: User) {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.archive(id, user.id, user.role);
  }
  // ═══════════════════════════════════════════════════════════
  //                    RESOLVE FIELDS
  // ═══════════════════════════════════════════════════════════
  @ResolveField(() => [Chapter], { nullable: true })
  async chapters(@Parent() course: Course) {
    // Si déjà chargé par le service, retourner
    if (course.chapters) {
      return course.chapters;
    }

    // Sinon charger depuis la DB
    return this.coursesService['prisma'].chapter.findMany({
      where: { courseId: course.id },
      orderBy: { position: 'asc' },
    });
  }

  /**
   * CRUD Lessons
   */
  @Mutation(() => Lesson)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async createLesson(
    @Args('input') input: CreateLessonInput,
    @CurrentUser() user: User,
  ): Promise<Lesson> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.coursesService.createLesson(user.id, user.role, input);
  }

  @Mutation(() => Lesson)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async updateLesson(
    @Args('id') id: string,
    @Args('input') input: UpdateLessonInput,
    @CurrentUser() user: User,
  ): Promise<Lesson> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.coursesService.updateLesson(user.id, user.role, id, input);
  }

  @Mutation(() => Lesson)
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async deleteLesson(
    @Args('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Lesson> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }

    return this.coursesService.deleteLesson(user.id, user.role, id);
  }

  @Mutation(() => [Lesson])
  @UseGuards(GqlAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async reorderLessons(
    @Args('input') input: ReorderLessonsInput,
    @CurrentUser() user: User,
  ): Promise<any> {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.reorderLessons(user.id, user.role, input);
  }
}
