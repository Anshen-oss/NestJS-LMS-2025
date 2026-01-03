import { gql, useQuery } from '@apollo/client';

// ================================================================
// TYPES
// ================================================================

export interface StudentEnrollment {
  id: string;
  enrolledAt: string;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED';
  completionRate: number;
  lessonsCompleted: number;
  totalLessons: number;
  lastActivityAt: string | null;
}

export interface StudentCourseProgress {
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseImage?: string | null;
  price: number;
  enrollment: StudentEnrollment;
}

export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  enrolledAt: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  overallCompletionRate: number;
  lastActivityAt: string | null;
  courses: StudentCourseProgress[];
}

export interface StudentsListResponse {
  students: StudentListItem[];
  total: number;
  page: number;
  pageSize: number;
}

export interface StudentDetailResponse {
  student: StudentListItem & {
    joinedAt: string;
    totalTimeSpent: number; // en minutes
    averageTimePerLesson: number; // en minutes
    achievements: Achievement[];
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon?: string | null;
}

// ================================================================
// GRAPHQL QUERIES
// ================================================================

const GET_INSTRUCTOR_STUDENTS = gql`
  query GetInstructorStudents($page: Int, $pageSize: Int, $search: String, $courseId: String, $sortBy: String) {
    instructorStudents(
      page: $page
      pageSize: $pageSize
      search: $search
      courseId: $courseId
      sortBy: $sortBy
    ) {
      students {
        id
        name
        email
        image
        enrolledAt
        totalCoursesEnrolled
        totalCoursesCompleted
        overallCompletionRate
        lastActivityAt
        courses {
          courseId
          courseTitle
          courseSlug
          courseImage
          price
          enrollment {
            id
            enrolledAt
            status
            completionRate
            lessonsCompleted
            totalLessons
            lastActivityAt
          }
        }
      }
      total
      page
      pageSize
    }
  }
`;

const GET_STUDENT_DETAIL = gql`
  query GetStudentDetail($studentId: String!) {
    studentDetail(studentId: $studentId) {
      student {
        id
        name
        email
        image
        joinedAt
        enrolledAt
        totalCoursesEnrolled
        totalCoursesCompleted
        overallCompletionRate
        lastActivityAt
        totalTimeSpent
        averageTimePerLesson
        courses {
          courseId
          courseTitle
          courseSlug
          courseImage
          price
          enrollment {
            id
            enrolledAt
            status
            completionRate
            lessonsCompleted
            totalLessons
            lastActivityAt
          }
        }
        achievements {
          id
          title
          description
          unlockedAt
          icon
        }
      }
    }
  }
`;

const GET_STUDENT_BY_COURSE = gql`
  query GetStudentsByCourse($courseId: String!, $page: Int, $pageSize: Int, $search: String, $sortBy: String) {
    studentsByCourse(
      courseId: $courseId
      page: $page
      pageSize: $pageSize
      search: $search
      sortBy: $sortBy
    ) {
      students {
        id
        name
        email
        image
        enrolledAt
        totalCoursesEnrolled
        totalCoursesCompleted
        overallCompletionRate
        lastActivityAt
        courses {
          courseId
          courseTitle
          courseSlug
          courseImage
          price
          enrollment {
            id
            enrolledAt
            status
            completionRate
            lessonsCompleted
            totalLessons
            lastActivityAt
          }
        }
      }
      total
      page
      pageSize
    }
  }
`;

// ================================================================
// HOOKS
// ================================================================

/**
 * Hook pour récupérer la liste des étudiants de l'instructeur
 * Supporte recherche, filtrage par cours, et pagination
 */
export function useInstructorStudents(
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  courseId?: string,
  sortBy: string = 'enrolledAt'
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    { instructorStudents: StudentsListResponse },
    {
      page: number;
      pageSize: number;
      search?: string;
      courseId?: string;
      sortBy: string;
    }
  >(GET_INSTRUCTOR_STUDENTS, {
    variables: { page, pageSize, search, courseId, sortBy },
    fetchPolicy: 'cache-and-network',
  });

  const handleNextPage = () => {
    const nextPage = (data?.instructorStudents.page || 1) + 1;
    fetchMore({
      variables: { page: nextPage },
    });
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max((data?.instructorStudents.page || 1) - 1, 1);
    fetchMore({
      variables: { page: prevPage },
    });
  };

  return {
    students: data?.instructorStudents.students || [],
    total: data?.instructorStudents.total || 0,
    page: data?.instructorStudents.page || 1,
    pageSize: data?.instructorStudents.pageSize || 10,
    loading,
    error,
    refetch,
    handleNextPage,
    handlePreviousPage,
  };
}

/**
 * Hook pour récupérer les détails complets d'un étudiant
 */
export function useStudentDetail(studentId: string) {
  const { data, loading, error, refetch } = useQuery<
    { studentDetail: StudentDetailResponse },
    { studentId: string }
  >(GET_STUDENT_DETAIL, {
    variables: { studentId },
    fetchPolicy: 'cache-and-network',
    skip: !studentId,
  });

  return {
    student: data?.studentDetail.student,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook pour récupérer les étudiants d'un cours spécifique
 */
export function useStudentsByCourse(
  courseId: string,
  page: number = 1,
  pageSize: number = 10,
  search?: string,
  sortBy: string = 'enrolledAt'
) {
  const { data, loading, error, refetch, fetchMore } = useQuery<
    { studentsByCourse: StudentsListResponse },
    {
      courseId: string;
      page: number;
      pageSize: number;
      search?: string;
      sortBy: string;
    }
  >(GET_STUDENT_BY_COURSE, {
    variables: { courseId, page, pageSize, search, sortBy },
    fetchPolicy: 'cache-and-network',
    skip: !courseId,
  });

  const handleNextPage = () => {
    const nextPage = (data?.studentsByCourse.page || 1) + 1;
    fetchMore({
      variables: { page: nextPage },
    });
  };

  const handlePreviousPage = () => {
    const prevPage = Math.max((data?.studentsByCourse.page || 1) - 1, 1);
    fetchMore({
      variables: { page: prevPage },
    });
  };

  return {
    students: data?.studentsByCourse.students || [],
    total: data?.studentsByCourse.total || 0,
    page: data?.studentsByCourse.page || 1,
    pageSize: data?.studentsByCourse.pageSize || 10,
    loading,
    error,
    refetch,
    handleNextPage,
    handlePreviousPage,
  };
}
