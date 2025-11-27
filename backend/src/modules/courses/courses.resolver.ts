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
import { CoursesService } from './courses.service';
import { CreateCourseInput } from './dto/create-course.input';
import { UpdateCourseInput } from './dto/update-course.input';
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
  ) {
    if (!user.role) {
      throw new UnauthorizedException(
        'User role is required to perform this action',
      );
    }
    return this.coursesService.update(user.id, user.role, input);
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
}
