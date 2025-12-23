'use client';

import { Button } from '@/components/ui/button';
import {
  GetMyEnrolledCoursesDocument,
  IsEnrolledDocument,
  useEnrollInCourseMutation,
} from '@/lib/generated/graphql';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [enrollInCourse, { loading }] = useEnrollInCourseMutation({
    // ✅ Refetch après enrollment
    refetchQueries: [
      { query: GetMyEnrolledCoursesDocument },
      {
        query: IsEnrolledDocument,
        variables: { courseId },
      },
    ],
    awaitRefetchQueries: true,
    onCompleted: (data) => {
      const { success, message, checkoutUrl } = data.enrollInCourse;

      if (success) {
        if (checkoutUrl) {
          // ✅ CRITIQUE : Redirection vers Stripe Checkout
          console.log('🔄 Redirecting to Stripe:', checkoutUrl);
          window.location.href = checkoutUrl;
        } else {
          // Cas rare : Déjà enrollé
          toast.info(message);
        }
      } else {
        toast.error(message);
      }
    },
    onError: (error) => {
      console.error('❌ Enrollment error:', error);
      toast.error(error.message || 'Une erreur est survenue');
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
    <Button
      onClick={handleEnroll}
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 size-4 animate-spin" />
          Chargement...
        </>
      ) : (
        'Enroll now!'
      )}
    </Button>
  );
}
