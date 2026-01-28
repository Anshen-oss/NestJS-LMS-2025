'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUserSettings } from '@/hooks/useUserProfile';
import {
  Bell,
  Camera,
  Globe,
  Loader2,
  Palette,
  Save,
  Shield,
  User
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AdminSettingsPage() {
  // 🎣 Hook combiné pour tous les settings
  const { user, updateProfile, updatePreferences, loading, errors, refetch } = useUserSettings();

  // États locaux pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profession: '',
    dateOfBirth: '',
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    courseUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
    videoQuality: 'auto',
    autoplay: true,
    subtitles: false,
    language: 'fr',
    timezone: 'Europe/Paris',
    theme: 'auto',
  });

  const [isSaving, setIsSaving] = useState(false);

  // 🔄 Charger les données du user quand elles arrivent
  useEffect(() => {
    if (user) {
      const formattedDateOfBirth = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '';

      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        bio: user.bio || '',
        profession: user.profession || '',
        dateOfBirth: formattedDateOfBirth,
      });

      if (user.preferences) {
        setPreferences({
          emailNotifications: user.preferences.emailNotifications ?? true,
          courseUpdates: user.preferences.courseUpdates ?? true,
          weeklyDigest: user.preferences.weeklyDigest ?? false,
          marketingEmails: user.preferences.marketingEmails ?? false,
          videoQuality: user.preferences.videoQuality ?? 'auto',
          autoplay: user.preferences.autoplay ?? true,
          subtitles: user.preferences.subtitles ?? false,
          language: user.preferences.language ?? 'fr',
          timezone: user.preferences.timezone ?? 'Europe/Paris',
          theme: user.preferences.theme ?? 'auto',
        });
      }
    }
  }, [user]);

  // 💾 Sauvegarder le profil
  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        bio: formData.bio,
        profession: formData.profession,
        dateOfBirth: formData.dateOfBirth,
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
        <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-200 mb-2">Paramètres</h1>
        <p className="text-gray-400 text-lg">
          Gérez vos préférences et paramètres de compte
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <User className="w-4 h-4 mr-2" />
            Profil
          </TabsTrigger>
          <TabsTrigger
            value="avatar"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Link href="/admin/settings/avatar" className="flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Avatar
            </Link>
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="preferences"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Palette className="w-4 h-4 mr-2" />
            Préférences
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-purple-600 data-[state=active]:bg-transparent px-6 py-3"
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
                <CardDescription className='text-gray-600'>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    placeholder="Parlez un peu de vous..."
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    maxLength={500}
                    className='text-gray-600'
                  />
                  <p className="text-xs text-gray-800">
                    {formData.bio.length}/500 caractères
                  </p>
                </div>

                {/* Profession */}
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    placeholder="Ex: Développeur Web, Designer..."
                    value={formData.profession}
                    onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                    maxLength={100}
                    className='text-gray-600'
                  />
                  <p className="text-xs text-gray-600">
                    {formData.profession.length}/100 caractères
                  </p>
                </div>

                {/* Date de naissance */}
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date de naissance (optionnel)</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    className='text-gray-600'
                  />
                  {formData.dateOfBirth && (
                    <p className="text-xs text-gray-500">
                      Sélectionné : {new Date(formData.dateOfBirth).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleSaveProfile}
                  disabled={isSaving || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
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
                <CardTitle>Notifications par email</CardTitle>
                <CardDescription>
                  Choisissez les emails que vous souhaitez recevoir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications" className="text-base">
                      Notifications par email
                    </Label>
                    <p className="text-sm text-gray-500">
                      Recevoir des notifications sur votre adresse email
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
                    <Label htmlFor="course-updates" className="text-base">
                      Mises à jour des cours
                    </Label>
                    <p className="text-sm text-gray-500">
                      Nouvelles leçons, chapitres ajoutés
                    </p>
                  </div>
                  <Switch
                    id="course-updates"
                    checked={preferences.courseUpdates}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, courseUpdates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-digest" className="text-base">
                      Résumé hebdomadaire
                    </Label>
                    <p className="text-sm text-gray-500">
                      Récapitulatif de votre progression chaque semaine
                    </p>
                  </div>
                  <Switch
                    id="weekly-digest"
                    checked={preferences.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, weeklyDigest: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing" className="text-base">
                      Emails promotionnels
                    </Label>
                    <p className="text-sm text-gray-500">
                      Offres spéciales et nouveaux cours
                    </p>
                  </div>
                  <Switch
                    id="marketing"
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, marketingEmails: checked })
                    }
                  />
                </div>

                <Button
                  onClick={handleSavePreferences}
                  disabled={isSaving || loading}
                  className="w-full bg-purple-600 hover:bg-purple-700"
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
                  className="w-full bg-purple-600 hover:bg-purple-700"
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
                  className="w-full bg-purple-600 hover:bg-purple-700"
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
