'use client';

import { Button } from '@/components/ui/button';
import {
  GetMyEnrolledCoursesDocument,
  IsEnrolledDocument,
  useEnrollInCourseMutation,
} from '@/lib/generated/graphql';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const router = useRouter();

  const [enrollInCourse, { loading }] = useEnrollInCourseMutation({
    // ✅ Refetch après enrollment
    refetchQueries: [
      { query: GetMyEnrolledCoursesDocument },
      {
        query: IsEnrolledDocument,
        variables: { courseId }
      },
    ],
    awaitRefetchQueries: true, // ✅ Attendre que les queries soient refetchées
    onCompleted: (data) => {
      const { success, message, checkoutUrl } = data.enrollInCourse;

      if (success) {
        if (checkoutUrl) {
          // Rediriger vers Stripe Checkout
          window.location.href = checkoutUrl;
        } else {
          // Déjà enrollé
          toast.success(message);
          router.push('/dashboard');
        }
      } else {
        toast.error(message);
      }
    },
    onError: (error) => {
      console.error('Enrollment error:', error);
      toast.error(error.message || 'An unexpected error occurred');
    },
  });

  const handleEnroll = () => {
    enrollInCourse({
      variables: {
        input: { courseId },
      },
    });
  };

  return (
    <Button onClick={handleEnroll} disabled={loading} className="w-full">
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          Loading...
        </>
      ) : (
        'Enroll now!'
      )}
    </Button>
  );
}
