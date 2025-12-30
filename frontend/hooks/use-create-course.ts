import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

// ================================================================
// TYPES
// ================================================================

export interface CreateCourseInput {
  title: string;
  description: string;
  smallDescription: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  price: number;
  imageUrl?: string;
  requirements?: string;
  outcomes?: string;
}

export interface CreateCourseResponse {
  createCourse: {
    id: string;
    title: string;
    slug: string;
    status: string;
  };
}

// ================================================================
// GRAPHQL MUTATION
// ================================================================

const CREATE_COURSE = gql`
  mutation CreateCourse($input: CreateCourseInput!) {
    createCourse(input: $input) {
      id
      title
      slug
      status
      description
      smallDescription
      category
      level
      price
      imageUrl
      requirements
      outcomes
      createdAt
    }
  }
`;

// ================================================================
// HOOK
// ================================================================

/**
 * Hook pour créer un nouveau cours
 */
export function useCreateCourse() {
  const router = useRouter();

  const [createCourseMutation, { loading, error }] = useMutation<
    CreateCourseResponse,
    { input: CreateCourseInput }
  >(CREATE_COURSE, {
    onCompleted: (data) => {
      toast.success('Cours créé avec succès !');
      // Rediriger vers la page d'édition INSTRUCTOR
      router.push(`/instructor/courses/${data.createCourse.id}/edit`);
    },
    onError: (error) => {
      console.error('Erreur création cours:', error);
      toast.error('Erreur lors de la création du cours');
    },
  });

  const createCourse = async (input: CreateCourseInput) => {
    try {
      await createCourseMutation({
        variables: { input },
      });
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  return {
    createCourse,
    loading,
    error,
  };
}
