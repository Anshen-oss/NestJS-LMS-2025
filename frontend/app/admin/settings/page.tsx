'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@clerk/nextjs';
import {
  Bell,
  Info,
  Loader2,
  Mail,
  Save,
  Shield,
  User,
} from 'lucide-react';
import { useState } from 'react';

// ==================== TYPES ====================

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

// ==================== MAIN COMPONENT ====================

export default function SettingsPage() {
  const { toast } = useToast();
const { user, isLoaded } = useUser();

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [newEnrollments, setNewEnrollments] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveNotifications = async () => {
    setSaving(true);
    // TODO: Implémenter la mutation updateNotificationPreferences
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Préférences sauvegardées',
        description: 'Vos préférences de notifications ont été mises à jour.',
      });
    }, 1000);
  };

  if (isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.me) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">
            Erreur: {error?.message || 'Impossible de charger les données'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Gérez les paramètres de votre compte et vos préférences
        </p>
      </div>

      {/* Profile Info (Read-only) */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Informations du profil</h3>
                <p className="text-sm text-muted-foreground">
                  Ces informations seront modifiables après l'intégration de Clerk
                </p>
              </div>
              <Badge variant="secondary">
                <Info className="h-3 w-3 mr-1" />
                Lecture seule
              </Badge>
            </div>

            <Separator />

            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {user?.fullName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress}</p>
                  <Badge variant="outline" className="mt-1">
                    {user?.publicMetadata.role}
                  </Badge>
                </div>
              </div>

              {/* Info boxes */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-blue-50 border-blue-200">
                  <User className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">Profil</p>
                    <p className="text-xs text-blue-700 mt-1">
                      La modification du nom et de l'avatar sera disponible via Clerk
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border bg-purple-50 border-purple-200">
                  <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-purple-900">Sécurité</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Mot de passe et 2FA seront gérés par Clerk
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Preferences */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Préférences de notifications
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choisissez comment vous souhaitez être notifié
              </p>
            </div>

            <Separator />

            <div className="space-y-6">
              {/* Email Notifications Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Notifications par email
                </h4>

                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mises à jour des cours</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir un email quand un cours est publié ou modifié
                      </p>
                    </div>
                    <Switch
                      checked={courseUpdates}
                      onCheckedChange={setCourseUpdates}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nouvelles inscriptions</Label>
                      <p className="text-sm text-muted-foreground">
                        Être notifié quand un étudiant s'inscrit à vos cours
                      </p>
                    </div>
                    <Switch
                      checked={newEnrollments}
                      onCheckedChange={setNewEnrollments}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tous les emails</Label>
                      <p className="text-sm text-muted-foreground">
                        Activer/désactiver toutes les notifications par email
                      </p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push Notifications Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications navigateur
                </h4>

                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notifications push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des notifications instantanées dans le navigateur
                      </p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>

                  {pushNotifications && (
                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                      <p className="text-sm text-blue-800">
                        💡 Les notifications push vous alertent en temps réel (comme Facebook/Twitter)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Marketing Section */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Marketing</h4>

                <div className="space-y-4 pl-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Emails marketing</Label>
                      <p className="text-sm text-muted-foreground">
                        Recevoir des nouvelles, promotions et conseils
                      </p>
                    </div>
                    <Switch
                      checked={marketingEmails}
                      onCheckedChange={setMarketingEmails}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <Button onClick={handleSaveNotifications} disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer les préférences
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-purple-900">
                🚀 Fonctionnalités à venir
              </p>
              <ul className="text-sm text-purple-700 mt-2 space-y-1 list-disc list-inside">
                <li>Modification du profil (nom, email, avatar) via Clerk</li>
                <li>Changement de mot de passe et 2FA via Clerk</li>
                <li>Choix du thème (clair/sombre)</li>
                <li>Sélection de la langue (i18n)</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
