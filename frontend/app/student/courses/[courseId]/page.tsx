'use client';

//import { GET_COURSE_WITH_CURRICULUM } from '@/graphql/queries/student.queries';
import { useGetCourseForEditQuery } from '@/lib/generated/graphql';

import { useParams, useRouter } from 'next/navigation';

export default function StudentCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  // const { data, loading } = useQuery(GET_COURSE_WITH_CURRICULUM, {
  //   variables: { id: courseId },
  // });

  const { data, loading } = useGetCourseForEditQuery({
  variables: { id: courseId },
});

  if (loading) return <div>Chargement...</div>;

  const course = data?.getCourseForEdit;
  const firstLesson = course?.chapters?.[0]?.lessons?.[0];

  if (!firstLesson) {
    return <div>Aucune leçon disponible</div>;
  }

  // Rediriger automatiquement vers la première leçon
  router.push(`/student/courses/${courseId}/lessons/${firstLesson.id}`);

  return <div>Redirection...</div>;
}
