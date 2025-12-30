import { gql, useQuery } from '@apollo/client';

// ================================================================
// TYPES
// ================================================================

export interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  archivedCourses: number;
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  monthlyRevenue: number;
  totalViews: number;
  weeklyViews: number;
  averageCompletionRate: number;
  averageRating: number | null;
}

export interface CoursePerformance {
  id: string;
  title: string;
  slug: string;
  imageUrl?: string | null;
  status: 'Draft' | 'Published' | 'Archived';
  price: number;
  studentsCount: number;
  activeStudentsCount: number;
  revenue: number;
  completionRate: number;
  chaptersCount: number;
  lessonsCount: number;
  duration?: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  averageRating?: number | null;
  reviewsCount?: number | null;
}

export interface ActivityStudent {
  id: string;
  name: string;
  image?: string | null;
}

export interface ActivityCourse {
  id: string;
  title: string;
  slug: string;
}

export type ActivityType = 'ENROLLMENT' | 'COMPLETION' | 'LESSON_COMPLETED' | 'REVIEW' | 'QUESTION';

export interface RecentActivity {
  id: string;
  type: ActivityType;
  student: ActivityStudent;
  course: ActivityCourse;
  createdAt: string;
  lessonTitle?: string | null;
  reviewText?: string | null;
  rating?: number | null;
}

// ================================================================
// GRAPHQL QUERIES
// ================================================================

const GET_INSTRUCTOR_STATS = gql`
  query GetInstructorStats {
    instructorStats {
      totalCourses
      publishedCourses
      draftCourses
      archivedCourses
      totalStudents
      activeStudents
      totalRevenue
      monthlyRevenue
      totalViews
      weeklyViews
      averageCompletionRate
      averageRating
    }
  }
`;

const GET_INSTRUCTOR_COURSES = gql`
  query GetInstructorCourses($status: CourseStatus) {
    instructorCourses(status: $status) {
      id
      title
      slug
      imageUrl
      status
      price
      studentsCount
      activeStudentsCount
      revenue
      completionRate
      chaptersCount
      lessonsCount
      duration
      createdAt
      updatedAt
      publishedAt
      averageRating
      reviewsCount
    }
  }
`;

const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity($limit: Int) {
    recentActivity(limit: $limit) {
      id
      type
      student {
        id
        name
        image
      }
      course {
        id
        title
        slug
      }
      createdAt
      lessonTitle
      reviewText
      rating
    }
  }
`;

// ================================================================
// HOOKS
// ================================================================

/**
 * Hook pour récupérer les statistiques de l'instructeur
 */
export function useInstructorStats() {
  const { data, loading, error, refetch } = useQuery<{ instructorStats: InstructorStats }>(
    GET_INSTRUCTOR_STATS,
    {
      fetchPolicy: 'cache-and-network',
    }
  );

  return {
    stats: data?.instructorStats,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les cours de l'instructeur
 */
export function useInstructorCourses(status?: 'Draft' | 'Published' | 'Archived') {
  const { data, loading, error, refetch } = useQuery<
    { instructorCourses: CoursePerformance[] },
    { status?: 'Draft' | 'Published' | 'Archived' }
  >(GET_INSTRUCTOR_COURSES, {
    variables: status ? { status } : {},
    fetchPolicy: 'cache-and-network',
  });

  return {
    courses: data?.instructorCourses || [],
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les activités récentes
 */
export function useRecentActivity(limit: number = 10) {
  const { data, loading, error, refetch } = useQuery<
    { recentActivity: RecentActivity[] },
    { limit?: number }
  >(GET_RECENT_ACTIVITY, {
    variables: { limit },
    fetchPolicy: 'cache-and-network',
  });

  return {
    activities: data?.recentActivity || [],
    loading,
    error,
    refetch,
  };
}
