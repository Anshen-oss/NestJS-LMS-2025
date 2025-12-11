// hooks/use-admin-actions.ts
import { useToast } from '@/components/ui/use-toast';
import { gql, useMutation } from '@apollo/client';

// ==================== MUTATIONS ====================

const UPDATE_USER_ROLE = gql`
  mutation UpdateUserRole($input: UpdateUserRoleInput!) {
    updateUserRole(input: $input) {
      success
      message
    }
  }
`;

const PROMOTE_TO_INSTRUCTOR = gql`
  mutation PromoteToInstructor($userId: String!) {
    promoteToInstructor(userId: $userId) {
      success
      message
    }
  }
`;

const DELETE_COURSE = gql`
  mutation DeleteCourse($courseId: String!) {
    deleteCourse(courseId: $courseId) {
      success
      message
    }
  }
`;

const DEACTIVATE_USER = gql`
  mutation DeactivateUser($userId: String!) {
    deactivateUser(userId: $userId) {
      success
      message
    }
  }
`;

// ==================== HOOK ====================

export function useAdminActions() {
  const { toast } = useToast();

  // Modifier le rôle d'un utilisateur
  const [updateUserRoleMutation, { loading: updatingRole }] = useMutation(
    UPDATE_USER_ROLE,
    {
      onCompleted: (data) => {
        toast({
          title: 'Succès',
          description: data.updateUserRole.message,
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      },
      refetchQueries: ['GetAllUsers'], // Rafraîchir la liste
    }
  );

  // Promouvoir en instructeur
  const [promoteToInstructorMutation, { loading: promoting }] = useMutation(
    PROMOTE_TO_INSTRUCTOR,
    {
      onCompleted: (data) => {
        toast({
          title: 'Succès',
          description: data.promoteToInstructor.message,
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      },
      refetchQueries: ['GetAllUsers'],
    }
  );

  // Supprimer un cours
  const [deleteCourseMutation, { loading: deleting }] = useMutation(
    DELETE_COURSE,
    {
      onCompleted: (data) => {
        toast({
          title: 'Succès',
          description: data.deleteCourse.message,
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      },
      refetchQueries: ['GetAllCourses'],
    }
  );

  // Désactiver un utilisateur
  const [deactivateUserMutation, { loading: deactivating }] = useMutation(
    DEACTIVATE_USER,
    {
      onCompleted: (data) => {
        toast({
          title: 'Succès',
          description: data.deactivateUser.message,
        });
      },
      onError: (error) => {
        toast({
          title: 'Erreur',
          description: error.message,
          variant: 'destructive',
        });
      },
      refetchQueries: ['GetAllUsers'],
    }
  );

  // Fonctions simplifiées
  const updateUserRole = (userId: string, newRole: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT') => {
    return updateUserRoleMutation({
      variables: { input: { userId, newRole } },
    });
  };

  const promoteToInstructor = (userId: string) => {
    return promoteToInstructorMutation({
      variables: { userId },
    });
  };

  const deleteCourse = (courseId: string) => {
    return deleteCourseMutation({
      variables: { courseId },
    });
  };

  const deactivateUser = (userId: string) => {
    return deactivateUserMutation({
      variables: { userId },
    });
  };

  return {
    updateUserRole,
    promoteToInstructor,
    deleteCourse,
    deactivateUser,
    loading: updatingRole || promoting || deleting || deactivating,
  };
}
