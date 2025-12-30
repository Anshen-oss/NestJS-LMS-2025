import { UseGuards } from '@nestjs/common';
import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { CourseStatus, UserRole } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { ClerkGqlGuard } from '../auth/guards/clerk-gql.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { User } from '../users/entities/user.entity';
import { CoursePerformanceOutput } from './dto/course-performance.output';
import { InstructorStatsOutput } from './dto/instructor-stats.output';
import { RecentActivityOutput } from './dto/recent-activity.output';
import { InstructorService } from './instructor.service';

@Resolver()
@UseGuards(ClerkGqlGuard, RolesGuard)
export class InstructorResolver {
  constructor(private readonly instructorService: InstructorService) {}

  // ═══════════════════════════════════════════════════════════
  //                     QUERIES
  // ═══════════════════════════════════════════════════════════

  /**
   * Récupère les statistiques globales de l'instructeur connecté
   * Utilisé dans le dashboard instructor
   *
   * Accès: INSTRUCTOR, ADMIN
   */
  @Query(() => InstructorStatsOutput, {
    name: 'instructorStats',
    description: "Statistiques globales de l'instructeur (dashboard)",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getInstructorStats(
    @CurrentUser() user: User,
  ): Promise<InstructorStatsOutput> {
    return this.instructorService.getInstructorStats(user.id);
  }

  /**
   * Récupère la liste des cours de l'instructeur avec leurs performances
   *
   * Accès: INSTRUCTOR, ADMIN
   *
   * @param status - Filtre optionnel par statut (Published, Draft, Archived)
   */
  @Query(() => [CoursePerformanceOutput], {
    name: 'instructorCourses',
    description: "Liste des cours de l'instructeur avec performances",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getInstructorCourses(
    @CurrentUser() user: User,
    @Args('status', { type: () => CourseStatus, nullable: true })
    status?: CourseStatus,
  ): Promise<CoursePerformanceOutput[]> {
    return this.instructorService.getInstructorCourses(user.id, status);
  }

  /**
   * Récupère les performances détaillées d'un cours spécifique
   *
   * Accès: INSTRUCTOR (propriétaire), ADMIN
   *
   * @param courseId - ID du cours
   */
  @Query(() => CoursePerformanceOutput, {
    name: 'coursePerformance',
    description: "Performances détaillées d'un cours",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getCoursePerformance(
    @CurrentUser() user: User,
    @Args('courseId') courseId: string,
  ): Promise<CoursePerformanceOutput> {
    return this.instructorService.getCoursePerformance(user.id, courseId);
  }

  /**
   * Récupère les activités récentes (enrollments, completions, etc.)
   *
   * Accès: INSTRUCTOR, ADMIN
   *
   * @param limit - Nombre maximum d'activités à retourner (défaut: 10, max: 50)
   */
  @Query(() => [RecentActivityOutput], {
    name: 'recentActivity',
    description:
      "Activités récentes de l'instructeur (enrollments, completions)",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getRecentActivity(
    @CurrentUser() user: User,
    @Args('limit', { type: () => Int, defaultValue: 10, nullable: true })
    limit: number = 10,
  ): Promise<RecentActivityOutput[]> {
    // Limiter à 50 activités max
    const safeLimit = Math.min(Math.max(1, limit), 50);
    return this.instructorService.getRecentActivity(user.id, safeLimit);
  }
}
