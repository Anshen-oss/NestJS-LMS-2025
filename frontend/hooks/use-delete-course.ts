import { gql, useMutation } from '@apollo/client';
import { toast } from 'sonner';

export interface DeleteCourseResponse {
  deleteCourse: boolean;
}

const DELETE_COURSE = gql`
  mutation DeleteCourse($courseId: String!) {
    deleteCourse(courseId: $courseId)
  }
`;

export function useDeleteCourse() {
  const [deleteCourseMutation, { loading, error }] = useMutation<DeleteCourseResponse, { courseId: string }>(DELETE_COURSE, {
    onCompleted: (data) => {
      if (data.deleteCourse) {
        toast.success('Cours supprimé avec succès !');
      } else {
        toast.error('Erreur lors de la suppression');
      }
    },
    onError: (error) => {
      console.error('❌ FULL ERROR:', error);
      toast.error('Erreur lors de la suppression du cours');
    },
  });

  const deleteCourse = async (id: string) => {
    try {
      const result = await deleteCourseMutation({
        variables: { courseId: id },
      });
      return result.data?.deleteCourse || false;
    } catch (err) {
      return false;
    }
  };

  return {
    deleteCourse,
    loading,
    error,
  };
}
