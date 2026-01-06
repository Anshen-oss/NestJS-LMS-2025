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
import {
  ExportRevenueResponse,
  InstructorRevenueResponse,
  RevenueInstructorPeriod,
} from './dto/revenue.dto';
import {
  StudentDetailOutput,
  StudentListResponseOutput,
} from './dto/student.output';
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

  /**
   * Récupère la liste paginée des étudiants de l'instructeur
   *
   * Accès: INSTRUCTOR, ADMIN
   *
   * @param page - Numéro de page (défaut: 1)
   * @param pageSize - Étudiants par page (défaut: 10)
   * @param search - Recherche par nom ou email (optionnel)
   * @param courseId - Filtrer par cours (optionnel)
   * @param sortBy - Trier par: enrolledAt, name, completionRate, lastActivityAt (défaut: enrolledAt)
   */
  @Query(() => StudentListResponseOutput, {
    name: 'instructorStudents',
    description: "Liste paginée des étudiants de l'instructeur",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getInstructorStudents(
    @CurrentUser() user: User,
    @Args('page', { type: () => Int, defaultValue: 1, nullable: true })
    page: number = 1,
    @Args('pageSize', { type: () => Int, defaultValue: 10, nullable: true })
    pageSize: number = 10,
    @Args('search', { nullable: true })
    search?: string,
    @Args('courseId', { nullable: true })
    courseId?: string,
    @Args('sortBy', { defaultValue: 'enrolledAt', nullable: true })
    sortBy: string = 'enrolledAt',
  ): Promise<StudentListResponseOutput> {
    return this.instructorService.getInstructorStudents(
      user.id,
      page,
      pageSize,
      search,
      courseId,
      sortBy,
    );
  }

  /**
   * Récupère les détails complets d'un étudiant spécifique
   *
   * Accès: INSTRUCTOR (si étudiant inscrit à ses cours), ADMIN
   *
   * @param studentId - ID de l'étudiant
   */
  @Query(() => StudentDetailOutput, {
    name: 'studentDetail',
    description: "Détails complets d'un étudiant",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getStudentDetail(
    @CurrentUser() user: User,
    @Args('studentId') studentId: string,
  ): Promise<StudentDetailOutput> {
    return this.instructorService.getStudentDetail(user.id, studentId);
  }

  /**
   * Récupère les étudiants inscrits à un cours spécifique
   *
   * Accès: INSTRUCTOR (propriétaire), ADMIN
   *
   * @param courseId - ID du cours
   * @param page - Numéro de page (défaut: 1)
   * @param pageSize - Étudiants par page (défaut: 10)
   * @param search - Recherche par nom ou email (optionnel)
   * @param sortBy - Trier par (défaut: enrolledAt)
   */
  @Query(() => StudentListResponseOutput, {
    name: 'studentsByCourse',
    description: 'Étudiants inscrits à un cours spécifique',
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getStudentsByCourse(
    @CurrentUser() user: User,
    @Args('courseId') courseId: string,
    @Args('page', { type: () => Int, defaultValue: 1, nullable: true })
    page: number = 1,
    @Args('pageSize', { type: () => Int, defaultValue: 10, nullable: true })
    pageSize: number = 10,
    @Args('search', { nullable: true })
    search?: string,
    @Args('sortBy', { defaultValue: 'enrolledAt', nullable: true })
    sortBy: string = 'enrolledAt',
  ): Promise<StudentListResponseOutput> {
    return this.instructorService.getStudentsByCourse(
      user.id,
      courseId,
      page,
      pageSize,
      search,
      sortBy,
    );
  }

  /**
   * Récupère les données de revenus de l'instructeur
   *
   * Accès: INSTRUCTOR, ADMIN
   *
   * @param period - Période à analyser (LAST_7_DAYS, LAST_30_DAYS, LAST_90_DAYS, YEAR)
   */
  @Query(() => InstructorRevenueResponse, {
    name: 'getInstructorRevenue',
    description: "Données complètes des revenus de l'instructeur",
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async getInstructorRevenue(
    @CurrentUser() user: User,
    @Args('period', {
      type: () => RevenueInstructorPeriod,
      defaultValue: RevenueInstructorPeriod.LAST_30_DAYS,
    })
    period: RevenueInstructorPeriod = RevenueInstructorPeriod.LAST_30_DAYS,
  ): Promise<InstructorRevenueResponse> {
    return this.instructorService.getInstructorRevenue(user.id, period);
  }

  /**
   * Exporte les données de revenus en CSV
   *
   * Accès: INSTRUCTOR, ADMIN
   *
   * @param period - Période à exporter
   */
  @Query(() => ExportRevenueResponse, {
    name: 'exportRevenue',
    description: 'Exporte les revenus en CSV',
  })
  @Roles(UserRole.INSTRUCTOR, UserRole.ADMIN)
  async exportInstructorRevenue(
    @CurrentUser() user: User,
    @Args('period', { type: () => RevenueInstructorPeriod })
    period: RevenueInstructorPeriod,
  ): Promise<ExportRevenueResponse> {
    return this.instructorService.exportInstructorRevenue(user.id, period);
  }
}
