import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

interface DeleteCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle: string;
  onConfirm: () => void;
  loading?: boolean;
}

export function DeleteCourseDialog({
  open,
  onOpenChange,
  courseTitle,
  onConfirm,
  loading = false,
}: DeleteCourseDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Cette action ne peut pas être annulée. Cela supprimera définitivement le cours{' '}
              <span className="font-semibold text-gray-900">"{courseTitle}"</span> ainsi que :
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Tous les chapitres</li>
              <li>Toutes les leçons</li>
              <li>Tous les fichiers associés</li>
              <li>Les progressions des étudiants</li>
            </ul>
            <p className="text-red-600 font-medium mt-4">
              ⚠️ Cette action est irréversible !
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Suppression...
              </>
            ) : (
              'Supprimer définitivement'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
