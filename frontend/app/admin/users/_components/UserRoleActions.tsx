'use client';

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
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import {
  useBanUserMutation,
  usePromoteToInstructorMutation,
  useUnbanUserMutation,
  useUpdateUserRoleMutation,
} from '@/lib/generated/graphql';
import { Ban, CheckCircle, Crown, Loader2, MoreVertical, UserCog } from 'lucide-react';
import { useState } from 'react';

interface UserRoleActionsProps {
  user: any;
  onSuccess?: () => void;
}

type ActionType = 'promote' | 'demote' | 'ban' | 'unban' | null;

export function UserRoleActions({ user, onSuccess }: UserRoleActionsProps) {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const [promoteToInstructor] = usePromoteToInstructorMutation();
  const [updateUserRole] = useUpdateUserRoleMutation();
  const [banUser] = useBanUserMutation();
  const [unbanUser] = useUnbanUserMutation();

  const handlePromote = async () => {
    setIsLoading(true);
    try {
      await promoteToInstructor({
        variables: {
          input: { userId: user.id },
        },
      });

      toast({
        title: '✅ Promotion réussie',
        description: `${user.name} est maintenant instructeur !`,
      });

      setActionType(null);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.message || 'Impossible de promouvoir cet utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemote = async () => {
    setIsLoading(true);
    try {
      await updateUserRole({
        variables: {
          input: {
            userId: user.id,
            newRole: 'STUDENT',
          },
        },
      });

      toast({
        title: '✅ Rôle modifié',
        description: `${user.name} est maintenant étudiant`,
      });

      setActionType(null);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.message || 'Impossible de modifier le rôle',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBan = async () => {
    setIsLoading(true);
    try {
      await banUser({
        variables: {
          userId: user.id,
          reason: 'Banni par un administrateur',
        },
      });

      toast({
        title: '✅ Utilisateur banni',
        description: `${user.name} a été banni de la plateforme`,
      });

      setActionType(null);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.message || 'Impossible de bannir cet utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnban = async () => {
    setIsLoading(true);
    try {
      await unbanUser({
        variables: { userId: user.id },
      });

      toast({
        title: '✅ Utilisateur débanni',
        description: `${user.name} peut à nouveau accéder à la plateforme`,
      });

      setActionType(null);
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: '❌ Erreur',
        description: error.message || 'Impossible de débannir cet utilisateur',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAction = () => {
    switch (actionType) {
      case 'promote':
        handlePromote();
        break;
      case 'demote':
        handleDemote();
        break;
      case 'ban':
        handleBan();
        break;
      case 'unban':
        handleUnban();
        break;
    }
  };

  // Ne pas permettre d'actions sur les admins
  if (user.role === 'ADMIN') {
    return (
      <Button variant="ghost" size="sm" disabled>
        <MoreVertical className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="hover:bg-gray-100">
            <MoreVertical className="h-4 w-4 text-gray-700" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Promouvoir STUDENT → INSTRUCTOR */}
          {user.role === 'STUDENT' && (
            <DropdownMenuItem onClick={() => setActionType('promote')}>
              <Crown className="h-4 w-4 mr-2" />
              Promouvoir en instructeur
            </DropdownMenuItem>
          )}

          {/* Rétrograder INSTRUCTOR → STUDENT */}
          {user.role === 'INSTRUCTOR' && (
            <DropdownMenuItem onClick={() => setActionType('demote')}>
              <UserCog className="h-4 w-4 mr-2" />
              Rétrograder en étudiant
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Bannir / Débannir */}
          {user.banned ? (
            <DropdownMenuItem onClick={() => setActionType('unban')}>
              <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
              Débannir
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem
              onClick={() => setActionType('ban')}
              className="text-red-600"
            >
              <Ban className="h-4 w-4 mr-2" />
              Bannir
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de confirmation */}
      <AlertDialog open={actionType !== null} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'promote' && 'Promouvoir en instructeur ?'}
              {actionType === 'demote' && 'Rétrograder en étudiant ?'}
              {actionType === 'ban' && 'Bannir cet utilisateur ?'}
              {actionType === 'unban' && 'Débannir cet utilisateur ?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'promote' &&
                `${user.name} pourra créer et gérer des cours.`}
              {actionType === 'demote' &&
                `${user.name} ne pourra plus créer de cours.`}
              {actionType === 'ban' &&
                `${user.name} ne pourra plus accéder à la plateforme.`}
              {actionType === 'unban' &&
                `${user.name} pourra à nouveau accéder à la plateforme.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmAction} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  En cours...
                </>
              ) : (
                'Confirmer'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
