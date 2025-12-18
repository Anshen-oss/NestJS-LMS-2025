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
import { useUser } from '@clerk/nextjs';
import {
  Bell,
  Globe,
  Lock,
  Mail,
  Palette,
  Save,
  Shield,
  User,
  Video,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { user, isLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);

  // États pour les préférences
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [courseUpdates, setCourseUpdates] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);

  const [videoQuality, setVideoQuality] = useState('auto');
  const [autoplay, setAutoplay] = useState(true);
  const [subtitles, setSubtitles] = useState(false);

  const [language, setLanguage] = useState('fr');
  const [timezone, setTimezone] = useState('Europe/Paris');

  const handleSave = async () => {
    setIsSaving(true);
    // Simuler une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Paramètres enregistrés avec succès !');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const userName = user?.fullName || user?.firstName || '';
  const userEmail = user?.primaryEmailAddress?.emailAddress || '';

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
            value="learning"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-3"
          >
            <Video className="w-4 h-4 mr-2" />
            Apprentissage
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

        {/* PROFIL */}
        <TabsContent value="profile" className="mt-6">
          <div className="max-w-2xl">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Gérez vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Photo de profil */}
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold">
                    {userName.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      Changer la photo
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Nom */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.firstName || ''}
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.lastName || ''}
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userEmail}
                    disabled
                  />
                  <p className="text-xs text-gray-500">
                    Votre email ne peut pas être modifié ici. Utilisez les paramètres Clerk.
                  </p>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    placeholder="Parlez un peu de vous..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500">
                    Maximum 500 caractères
                  </p>
                </div>

                {/* Profession */}
                <div className="space-y-2">
                  <Label htmlFor="profession">Profession</Label>
                  <Input
                    id="profession"
                    placeholder="Ex: Développeur Web, Designer..."
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* NOTIFICATIONS */}
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
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
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
                    checked={courseUpdates}
                    onCheckedChange={setCourseUpdates}
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
                    checked={weeklyDigest}
                    onCheckedChange={setWeeklyDigest}
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
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* APPRENTISSAGE */}
        <TabsContent value="learning" className="mt-6">
          <div className="max-w-2xl space-y-6">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Préférences vidéo</CardTitle>
                <CardDescription>
                  Configurez la lecture des vidéos de cours
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="video-quality">Qualité vidéo</Label>
                  <Select value={videoQuality} onValueChange={setVideoQuality}>
                    <SelectTrigger id="video-quality">
                      <SelectValue placeholder="Sélectionner la qualité" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Automatique</SelectItem>
                      <SelectItem value="1080p">1080p (Full HD)</SelectItem>
                      <SelectItem value="720p">720p (HD)</SelectItem>
                      <SelectItem value="480p">480p</SelectItem>
                      <SelectItem value="360p">360p</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    La qualité automatique s'adapte à votre connexion
                  </p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoplay" className="text-base">
                      Lecture automatique
                    </Label>
                    <p className="text-sm text-gray-500">
                      Lancer automatiquement la leçon suivante
                    </p>
                  </div>
                  <Switch
                    id="autoplay"
                    checked={autoplay}
                    onCheckedChange={setAutoplay}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="subtitles" className="text-base">
                      Sous-titres activés par défaut
                    </Label>
                    <p className="text-sm text-gray-500">
                      Afficher les sous-titres automatiquement
                    </p>
                  </div>
                  <Switch
                    id="subtitles"
                    checked={subtitles}
                    onCheckedChange={setSubtitles}
                  />
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Téléchargements</CardTitle>
                <CardDescription>
                  Gérez vos téléchargements de cours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium">Cours téléchargés</p>
                      <p className="text-sm text-gray-500">0 cours (0 GB)</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Gérer
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Les téléchargements sont disponibles sur l'application mobile
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PRÉFÉRENCES */}
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
                  <Select value={language} onValueChange={setLanguage}>
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
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger id="timezone">
                      <SelectValue placeholder="Sélectionner le fuseau" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (GMT+9)</SelectItem>
                      <SelectItem value="Australia/Sydney">Sydney (GMT+11)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSave} disabled={isSaving}>
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
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-white border-2 mb-2"></div>
                      Clair
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center"
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-900 mb-2"></div>
                      Sombre
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center border-blue-600"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-900 mb-2"></div>
                      Auto
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* SÉCURITÉ */}
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
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Lock className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-600">Mot de passe</p>
                      <p className="text-sm text-gray-500">
                        Dernière modification il y a 30 jours
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-600">Authentification à deux facteurs</p>
                      <p className="text-sm text-gray-500">
                        Non activée
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Activer
                  </Button>
                </div>

                <Separator />

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-600">Email de récupération</p>
                      <p className="text-sm text-gray-500">
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Modifier
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600">Zone de danger</CardTitle>
                <CardDescription>
                  Actions irréversibles sur votre compte
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-600">Supprimer le compte</p>
                    <p className="text-sm text-gray-500">
                      Supprimer définitivement votre compte et toutes vos données
                    </p>
                  </div>
                  <Button variant="destructive" size="sm">
                    Supprimer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
