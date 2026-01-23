'use client';

import { MediaPicker } from '@/components/media/MediaPicker';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserSettings } from '@/hooks/useUserProfile';
import { gql, useMutation } from '@apollo/client';

import {
  Bell,
  Globe,
  Loader2,
  Palette,
  Save,
  Shield,
  User
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

// ==================== GRAPHQL MUTATION ====================
const UPDATE_USER_AVATAR = gql`
  mutation UpdateUserAvatar($avatarUrl: String!) {
    updateUserAvatar(avatarUrl: $avatarUrl) {
      id
      image
      name
      email
    }
  }
`;

export default function AdminSettingsPage() {
  // 🎣 Hook combiné pour settings
  const { user, updateProfile, updatePreferences, loading, errors, refetch } = useUserSettings();

  // 🔄 Mutation pour avatar
  const [updateAvatarMutation, { loading: avatarLoading }] = useMutation(UPDATE_USER_AVATAR, {
    onCompleted: () => {
      toast.success('✅ Avatar mis à jour avec succès!');
      refetch();
    },
    onError: (error) => {
      toast.error(`❌ Erreur: ${error.message}`);
    }
  });

  // États locaux pour le formulaire
  const [formData, setFormData] = useState({
    bio: '',
    profession: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    systemAlerts: true,
    weeklyReport: false,
    language: 'fr',
    timezone: 'Europe/Paris',
    theme: 'auto',
  });

  const [isSaving, setIsSaving] = useState(false);

  // 🔄 Charger les données du user
  useEffect(() => {
    if (user) {
      setFormData({
        bio: user.bio || '',
        profession: user.profession || '',
      });

      if (user.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          systemAlerts: user.preferences.systemAlerts ?? true,
          weeklyReport: user.preferences.weeklyReport ?? false,
          language: user.preferences.language ?? 'fr',
          timezone: user.preferences.timezone ?? 'Europe/Paris',
          theme: user.preferences.theme ?? 'auto',
        });
      }
    }
  }, [user]);

  // 📤 Gérer la sélection du MediaPicker
  const handleAvatarSelect = async (media: any) => {
    try {
      await updateAvatarMutation({
        variables: {
          avatarUrl: media.urlLarge || media.urlMedium || media.urlOriginal,
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour de l\'avatar:', error);
    }
  };

  // 💾 Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        bio: formData.bio,
        profession: formData.profession,
      });
      await refetch();
    } finally {
      setIsSaving(false);
    }
  };

  // 💾 Sauvegarder les préférences
  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await updatePreferences(preferences);
      await refetch();
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-200 mb-2">Paramètres Admin</h1>
        <p className="text-gray-400 text-lg">
          Gérez votre profil et les paramètres de la plateforme
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <User className="w-4 h-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Palette className="w-4 h-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Shield className="w-4 h-4 mr-2" />
            Sécurité
          </TabsTrigger>
        </TabsList>

        {/* PROFIL TAB */}
        <TabsContent value="profile" className="mt-6">
          <div className="max-w-2xl">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez votre profil Admin et votre avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 👤 USER INFO */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600"><span className="font-semibold">Nom:</span> {user?.name || 'N/A'}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Email:</span> {user?.email || 'N/A'}</p>
                    <p className="text-sm text-gray-600"><span className="font-semibold">Rôle:</span> <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">ADMIN</span></p>
                  </div>
                </div>

                <Separator />

                {/* 📸 AVATAR SECTION */}
                <div className="space-y-4">
                  <Label className="text-base font-semibold">Photo de profil</Label>

                  {/* Avatar actuel */}
                  {user?.image ? (
                    <div className="flex items-center gap-6">
                      <img
                        src={user.image}
                        alt={user.name || 'Avatar'}
                        className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                      />
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Avatar actuel</p>
                        <MediaPicker
                          onSelectAction={handleAvatarSelect}
                          buttonLabel="Changer l'avatar"
                          previewSize="medium"
                          showUpload={true}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center text-red-600 text-3xl font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Aucun avatar</p>
                        <MediaPicker
                          onSelectAction={handleAvatarSelect}
                          buttonLabel="Ajouter un avatar"
                          previewSize="medium"
                          showUpload={true}
                        />
                      </div>
                    </div>
                  )}

                  {avatarLoading && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Mise à jour de l'avatar...
                    </div>
                  )}
                </div>

                <Separator />

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie (optionnel)</Label>
                  <textarea
                    id="bio"
                    placeholder="Décrivez votre rôle et votre expérience..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    maxLength={500}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600"
                  />
                  <p className="text-xs text-gray-600">
                    {formData.bio.length}/500 caractères
                  </p>
                </div>

                {/* Profession */}
                <div className="space-y-2">
                  <Label htmlFor="profession">Titre (optionnel)</Label>
                  <input
                    id="profession"
                    type="text"
                    placeholder="Ex: Administrateur Système, PDG..."
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    maxLength={100}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-600"
                  />
                  <p className="text-xs text-gray-600">
                    {formData.profession.length}/100 caractères
                  </p>
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving || loading}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>

                {errors.profile && (
                  <div className="p-3 bg-red-50 text-red-700 rounded">
                    ❌ {errors.profile}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS TAB */}
        <TabsContent value="notifications" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Choisissez les alertes que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">
                      Notifications par email
                    </Label>
                    <p className="text-sm text-gray-500">
                      Alertes générales de la plateforme
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="system-alerts" className="text-base">
                      Alertes système
                    </Label>
                    <p className="text-sm text-gray-500">
                      Problèmes de sécurité et maintenance
                    </p>
                  </div>
                  <Switch
                    id="system-alerts"
                    checked={preferences.systemAlerts}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, systemAlerts: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report" className="text-base">
                      Rapport hebdomadaire
                    </Label>
                    <p className="text-sm text-gray-500">
                      Statistiques et métriques de la plateforme
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={preferences.weeklyReport}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, weeklyReport: checked })
                    }
                  />
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving || loading}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>

                {errors.preferences && (
                  <div className="p-3 bg-red-50 text-red-700 rounded">
                    ❌ {errors.preferences}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRÉFÉRENCES TAB */}
        <TabsContent value="preferences" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Langue et région</CardTitle>
                <CardDescription>
                  Configurez vos préférences linguistiques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">
                    <Globe className="w-4 h-4 inline mr-2" />
                    Langue de l'interface
                  </Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, language: value })
                    }
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Sélectionner la langue" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Español</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select
                    value={preferences.timezone}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, timezone: value })
                    }
                  >
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Sélectionner le fuseau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="Europe/London">Londres (GMT+0)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Angeles (GMT-8)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="Asia/Shanghai">Shanghai (GMT+8)</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney (GMT+11)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving || loading}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription className="text-gray-600">
                  Personnalisez l'interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Thème</Label>
                  <div className="grid grid-cols-3 gap-4">
                    <Button
                      variant={preferences.theme === 'light' ? 'default' : 'outline'}
                      className="h-20 flex flex-col items-center justify-center"
                      onClick={() => setPreferences({ ...preferences, theme: 'light' })}
                    >
                      <div className="w-8 h-8 rounded-full bg-white border-2 mb-2"></div>
                      Clair
                    </Button>
                    <Button
                      variant={preferences.theme === 'dark' ? 'default' : 'outline'}
                      className="h-20 flex flex-col items-center justify-center"
                      onClick={() => setPreferences({ ...preferences, theme: 'dark' })}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-900 mb-2"></div>
                      Sombre
                    </Button>
                    <Button
                      variant={preferences.theme === 'auto' ? 'default' : 'outline'}
                      className="h-20 flex flex-col items-center justify-center"
                      onClick={() => setPreferences({ ...preferences, theme: 'auto' })}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-900 mb-2"></div>
                      Auto
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving || loading}
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SECURITY TAB */}
        <TabsContent value="security" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Authentification</CardTitle>
                <CardDescription className="text-gray-600">
                  Gérez vos paramètres de sécurité via Clerk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Les paramètres de sécurité comme le mot de passe et l'authentification à deux facteurs
                  sont gérés via Clerk.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
