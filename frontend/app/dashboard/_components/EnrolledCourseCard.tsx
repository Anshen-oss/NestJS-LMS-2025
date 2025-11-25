import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Clock } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface EnrolledCourseCardProps {
  enrollment: {
    id: string;
    status: string;
    createdAt: string;
    course: {
      id: string;
      title: string;
      slug: string;
      description: string;
      smallDescription: string;
      imageUrl: string | null;
      price: number;
      category: string;
      level: string;
      duration: number | null;
    };
  };
}

export function EnrolledCourseCard({ enrollment }: EnrolledCourseCardProps) {
  const { course, status, createdAt } = enrollment;

  // Formatage de la date
  const enrolledDate = new Date(createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Formatage de la durée
const formattedDuration = course.duration && course.duration > 0
  ? `${Math.floor(course.duration / 3600)}h ${Math.floor((course.duration % 3600) / 60)}min`
  : 'Durée non spécifiée';

    // Fonction pour obtenir le style du badge selon le statut
const getBadgeStyle = () => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 hover:bg-green-100';
    case 'Pending':
      return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 hover:bg-red-100';
    default:
      return '';
  }
};

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="flex flex-col md:flex-row">
        {/* Image du cours */}
        <div className="relative w-full md:w-64 h-48 md:h-auto">
          {course.imageUrl ? (
            <Image
              src={course.imageUrl}
              alt={course.title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-4xl font-bold">
                {course.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="flex-1 p-6">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-2xl font-bold mb-1">{course.title}</h3>
              <p className="text-sm text-muted-foreground">
                {course.category} • {course.level}
              </p>
            </div>
            <Badge className={getBadgeStyle()}>{status}</Badge>
          </div>

          <p className="text-muted-foreground mb-4 line-clamp-2">
            {course.smallDescription}
          </p>

          {/* Infos supplémentaires */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Inscrit le {enrolledDate}</span>
            </div>
            {/* 🆕 Affiche SEULEMENT si duration existe */}
            {course.duration && course.duration > 0 && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formattedDuration}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Link href={`/courses/${course.slug}`} className="flex-1">
              <Button className="w-full">Continuer le cours</Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
