// import { Button } from '@/components/ui/button';
// import { useGetCourseProgressQuery } from '@/lib/generated/graphql';
// import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
// import Link from 'next/link';
// import { ProgressBar } from './ProgressBar';

// interface CourseProgressHeaderProps {
//   courseId: string;
//   courseTitle: string;
//   courseDuration?: number;
// }

// export function CourseProgressHeader({
//   courseId,
//   courseTitle,
//   courseDuration,
// }: CourseProgressHeaderProps) {
//   const { data, loading } = useGetCourseProgressQuery({
//     variables: { courseId },
//   });

//   const progress = data?.courseProgress || {
//     completedCount: 0,
//     totalCount: 0,
//     percentage: 0,
//   };

//   // ✅ CORRECTION : Convertir SECONDES en heures (pas minutes !)
//   console.log('🕐 courseDuration reçu:', courseDuration); // Debug

//   // courseDuration est en SECONDES dans la base
//   const durationInMinutes = courseDuration ? Math.floor(courseDuration / 60) : 0;
//   const durationInHours = Math.floor(durationInMinutes / 60);
//   const durationMinutes = durationInMinutes % 60;

//   console.log('🕐 Converti:', durationInHours, 'h', durationMinutes, 'min'); // Debug

//   return (
//     <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
//       <div className="max-w-7xl mx-auto px-6 py-4">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-4">
//             <Link href="/student/dashboard">
//               <Button variant="ghost" size="sm" className="gap-2">
//                 <ArrowLeft className="w-4 h-4" />
//                 Retour
//               </Button>
//             </Link>
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">{courseTitle}</h1>
//               <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
//                 <span className="flex items-center gap-1">
//                   <BookOpen className="w-4 h-4" />
//                   {progress.totalCount} leçons
//                 </span>
//                 {courseDuration && courseDuration > 0 && (
//                   <span className="flex items-center gap-1">
//                     <Clock className="w-4 h-4" />
//                     {durationInHours}h{durationMinutes > 0 ? ` ${durationMinutes}min` : ''}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Barre de progression */}
//         {!loading && progress.totalCount > 0 && (
//           <ProgressBar
//             percentage={progress.percentage}
//             completedCount={progress.completedCount}
//             totalCount={progress.totalCount}
//             size="md"
//           />
//         )}
//       </div>
//     </div>
//   );
// }


import { Button } from '@/components/ui/button';
import { useGetCourseProgressQuery } from '@/lib/generated/graphql';
import { ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ProgressBar } from './ProgressBar';

interface CourseProgressHeaderProps {
  courseId: string;
  courseTitle: string;
  courseDuration?: number;
}

export function CourseProgressHeader({
  courseId,
  courseTitle,
  courseDuration,
}: CourseProgressHeaderProps) {
  const router = useRouter();
  const { data, loading } = useGetCourseProgressQuery({
    variables: { courseId },
  });

  const progress = data?.courseProgress || {
    completedCount: 0,
    totalCount: 0,
    percentage: 0,
  };

  // Conversion SECONDES → heures et minutes
  const durationInMinutes = courseDuration ? Math.floor(courseDuration / 60) : 0;
  const durationInHours = Math.floor(durationInMinutes / 60);
  const durationMinutes = durationInMinutes % 60;

  return (
    <div className="border-b bg-white sticky top-0 z-10 shadow-sm">
      <div className="bg-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Bouton Retour - Couleurs lisibles */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="border-gray-300 text-gray-900 hover:bg-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{courseTitle}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1.5">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" />
                    {progress.totalCount} leçons
                  </span>
                  {courseDuration && courseDuration > 0 && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {durationInHours}h{durationMinutes > 0 ? ` ${durationMinutes}min` : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          {!loading && progress.totalCount > 0 && (
            <ProgressBar
              percentage={progress.percentage}
              completedCount={progress.completedCount}
              totalCount={progress.totalCount}
              size="md"
            />
          )}
        </div>
      </div>
    </div>
  );
}
