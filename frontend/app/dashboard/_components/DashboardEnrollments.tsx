'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useGetMyEnrollmentsQuery } from '@/lib/generated/graphql';
import { AlertCircle, Loader2 } from 'lucide-react';
import { EnrolledCourseCard } from './EnrolledCourseCard';

export function DashboardEnrollments() {
  const { data, loading, error } = useGetMyEnrollmentsQuery();

    // État de chargement
    if(loading) {
          return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Chargement de vos cours...</span>
      </div>
    );
    }

   // Gestion d'erreur
   if(error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erreur</AlertTitle>
        <AlertDescription>
          Impossible de charger vos cours. Veuillez réessayer plus tard.
          <br />
          <span className="text-sm text-muted-foreground">
            {error.message}
          </span></AlertDescription>
      </Alert>
    )
   }

   const enrollments = data?.myEnrollments || [];

  // Aucun enrollment

  if(enrollments.length === 0) {
       return (
      <div className="text-center py-12">
        <h3 className="text-2xl font-bold mb-2">
          Vous n'êtes inscrit à aucun cours
        </h3>
        <p className="text-muted-foreground mb-6">
          Explorez notre catalogue et inscrivez-vous à votre premier cours !
        </p>
        <a
          href="/courses"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Découvrir les cours
        </a>
      </div>
    );
  }

  // Affichage des enrollments
    return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Mes cours</h2>
      <div className="space-y-6">
        {enrollments.map((enrollment: any) => (
          <EnrolledCourseCard key={enrollment.id} enrollment={enrollment} />
        ))}
      </div>
    </div>
  );

}
