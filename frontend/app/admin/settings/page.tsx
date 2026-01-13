// 'use client';

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
// import { useToast } from '@/components/ui/use-toast';
// import { useUser } from '@clerk/nextjs';
// import {
//   Bell,
//   Info,
//   Loader2,
//   Mail,
//   Save,
//   Shield,
//   User,
// } from 'lucide-react';
// import { useState } from 'react';

// // ==================== TYPES ====================

// interface UserData {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// // ==================== MAIN COMPONENT ====================

// export default function SettingsPage() {
//   const { toast } = useToast();
// const { user, isLoaded } = useUser();

//   const [emailNotifications, setEmailNotifications] = useState(true);
//   const [pushNotifications, setPushNotifications] = useState(false);
//   const [courseUpdates, setCourseUpdates] = useState(true);
//   const [newEnrollments, setNewEnrollments] = useState(true);
//   const [marketingEmails, setMarketingEmails] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const handleSaveNotifications = async () => {
//     setSaving(true);
//     // TODO: Implémenter la mutation updateNotificationPreferences
//     setTimeout(() => {
//       setSaving(false);
//       toast({
//         title: 'Préférences sauvegardées',
//         description: 'Vos préférences de notifications ont été mises à jour.',
//       });
//     }, 1000);
//   };

//   if (isLoaded) {
//     return (
//       <div className="flex items-center justify-center min-h-[400px]">
//         <div className="flex flex-col items-center gap-4">
//           <Loader2 className="w-8 h-8 animate-spin text-primary" />
//           <p className="text-muted-foreground">Chargement...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !data?.me) {
//     return (
//       <Card className="border-destructive">
//         <CardContent className="pt-6">
//           <p className="text-destructive">
//             Erreur: {error?.message || 'Impossible de charger les données'}
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6 max-w-4xl">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold">Paramètres</h1>
//         <p className="text-muted-foreground mt-2">
//           Gérez les paramètres de votre compte et vos préférences
//         </p>
//       </div>

//       {/* Profile Info (Read-only) */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="space-y-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h3 className="text-lg font-medium">Informations du profil</h3>
//                 <p className="text-sm text-muted-foreground">
//                   Ces informations seront modifiables après l'intégration de Clerk
//                 </p>
//               </div>
//               <Badge variant="secondary">
//                 <Info className="h-3 w-3 mr-1" />
//                 Lecture seule
//               </Badge>
//             </div>

//             <Separator />

//             <div className="space-y-4">
//               {/* Avatar */}
//               <div className="flex items-center gap-4">
//                 <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
//                   <span className="text-2xl font-bold text-white">
//                     {user?.fullName.charAt(0).toUpperCase()}
//                   </span>
//                 </div>
//                 <div>
//                   <p className="font-medium">{user?.fullName}</p>
//                   <p className="text-sm text-muted-foreground">{user?.primaryEmailAddress}</p>
//                   <Badge variant="outline" className="mt-1">
//                     {user?.publicMetadata.role}
//                   </Badge>
//                 </div>
//               </div>

//               {/* Info boxes */}
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="flex items-start gap-3 p-4 rounded-lg border bg-blue-50 border-blue-200">
//                   <User className="h-5 w-5 text-blue-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-blue-900">Profil</p>
//                     <p className="text-xs text-blue-700 mt-1">
//                       La modification du nom et de l'avatar sera disponible via Clerk
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-start gap-3 p-4 rounded-lg border bg-purple-50 border-purple-200">
//                   <Shield className="h-5 w-5 text-purple-600 mt-0.5" />
//                   <div>
//                     <p className="text-sm font-medium text-purple-900">Sécurité</p>
//                     <p className="text-xs text-purple-700 mt-1">
//                       Mot de passe et 2FA seront gérés par Clerk
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Notifications Preferences */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-medium flex items-center gap-2">
//                 <Bell className="h-5 w-5" />
//                 Préférences de notifications
//               </h3>
//               <p className="text-sm text-muted-foreground mt-1">
//                 Choisissez comment vous souhaitez être notifié
//               </p>
//             </div>

//             <Separator />

//             <div className="space-y-6">
//               {/* Email Notifications Section */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-medium flex items-center gap-2">
//                   <Mail className="h-4 w-4" />
//                   Notifications par email
//                 </h4>

//                 <div className="space-y-4 pl-6">
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label>Mises à jour des cours</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Recevoir un email quand un cours est publié ou modifié
//                       </p>
//                     </div>
//                     <Switch
//                       checked={courseUpdates}
//                       onCheckedChange={setCourseUpdates}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label>Nouvelles inscriptions</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Être notifié quand un étudiant s'inscrit à vos cours
//                       </p>
//                     </div>
//                     <Switch
//                       checked={newEnrollments}
//                       onCheckedChange={setNewEnrollments}
//                     />
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label>Tous les emails</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Activer/désactiver toutes les notifications par email
//                       </p>
//                     </div>
//                     <Switch
//                       checked={emailNotifications}
//                       onCheckedChange={setEmailNotifications}
//                     />
//                   </div>
//                 </div>
//               </div>

//               <Separator />

//               {/* Push Notifications Section */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-medium flex items-center gap-2">
//                   <Bell className="h-4 w-4" />
//                   Notifications navigateur
//                 </h4>

//                 <div className="space-y-4 pl-6">
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label>Notifications push</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Recevoir des notifications instantanées dans le navigateur
//                       </p>
//                     </div>
//                     <Switch
//                       checked={pushNotifications}
//                       onCheckedChange={setPushNotifications}
//                     />
//                   </div>

//                   {pushNotifications && (
//                     <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
//                       <p className="text-sm text-blue-800">
//                         💡 Les notifications push vous alertent en temps réel (comme Facebook/Twitter)
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <Separator />

//               {/* Marketing Section */}
//               <div className="space-y-4">
//                 <h4 className="text-sm font-medium">Marketing</h4>

//                 <div className="space-y-4 pl-6">
//                   <div className="flex items-center justify-between">
//                     <div className="space-y-0.5">
//                       <Label>Emails marketing</Label>
//                       <p className="text-sm text-muted-foreground">
//                         Recevoir des nouvelles, promotions et conseils
//                       </p>
//                     </div>
//                     <Switch
//                       checked={marketingEmails}
//                       onCheckedChange={setMarketingEmails}
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Save Button */}
//             <Button onClick={handleSaveNotifications} disabled={saving} className="w-full">
//               {saving ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   Enregistrement...
//                 </>
//               ) : (
//                 <>
//                   <Save className="mr-2 h-4 w-4" />
//                   Enregistrer les préférences
//                 </>
//               )}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Info Card */}
//       <Card className="border-purple-200 bg-purple-50">
//         <CardContent className="pt-6">
//           <div className="flex items-start gap-3">
//             <Info className="h-5 w-5 text-purple-600 mt-0.5" />
//             <div>
//               <p className="text-sm font-medium text-purple-900">
//                 🚀 Fonctionnalités à venir
//               </p>
//               <ul className="text-sm text-purple-700 mt-2 space-y-1 list-disc list-inside">
//                 <li>Modification du profil (nom, email, avatar) via Clerk</li>
//                 <li>Changement de mot de passe et 2FA via Clerk</li>
//                 <li>Choix du thème (clair/sombre)</li>
//                 <li>Sélection de la langue (i18n)</li>
//               </ul>
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
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
  Globe,
  Loader2,
  Palette,
  Save,
  Shield,
  User,
  Video
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StudentSettingsPage() {
  // 🎣 Hook combiné pour tout les settings
  const { user, updateProfile, updatePreferences, loading, errors, refetch } = useUserSettings();

  // États locaux pour le formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    profession: '',
    dateOfBirth: '', // Format: YYYY-MM-DD
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
      // 🔧 FIX : Convertir la date ISO en format YYYY-MM-DD pour l'input date
      const formattedDateOfBirth = user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split('T')[0]
        : '';

      setFormData({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        bio: user.bio || '',
        profession: user.profession || '',
        dateOfBirth: formattedDateOfBirth, // ✅ Format correct
      });

      // Charger les préférences si elles existent
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
        dateOfBirth: formData.dateOfBirth, // Format YYYY-MM-DD ✅
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

        {/* PROFIL TAB */}
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
                    {formData.firstName.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <Button className='text-gray-900' variant="outline" size="sm" disabled>
                      Changer la photo
                    </Button>
                    <p className="text-xs text-gray-600 mt-2">
                      Disponible bientôt
                    </p>
                  </div>
                </div>

                <Separator />

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
                  className="w-full"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </Button>

                {/* Afficher les erreurs */}
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

        {/* APPRENTISSAGE TAB */}
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
                  <Select
                    value={preferences.videoQuality}
                    onValueChange={(value) =>
                      setPreferences({ ...preferences, videoQuality: value })
                    }
                  >
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
                    checked={preferences.autoplay}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, autoplay: checked })
                    }
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
                    checked={preferences.subtitles}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, subtitles: checked })
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



{/* APPARENCE - SECTION MISE À JOUR */}
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
        {/* BOUTON CLAIR */}
        <Button
          variant={preferences.theme === 'light' ? 'default' : 'outline'}
          className="h-20 flex flex-col items-center justify-center"
          onClick={async () => {
            // 1️⃣ Changer localement
            setPreferences({ ...preferences, theme: 'light' });
            // 2️⃣ Appliquer immédiatement + sauvegarder en BD
            await updatePreferences({ theme: 'light' });
          }}
        >
          <div className="w-8 h-8 rounded-full bg-white border-2 mb-2"></div>
          Clair
        </Button>

        {/* BOUTON SOMBRE */}
        <Button
          variant={preferences.theme === 'dark' ? 'default' : 'outline'}
          className="h-20 flex flex-col items-center justify-center"
          onClick={async () => {
            // 1️⃣ Changer localement
            setPreferences({ ...preferences, theme: 'dark' });
            // 2️⃣ Appliquer immédiatement + sauvegarder en BD
            await updatePreferences({ theme: 'dark' });
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gray-900 mb-2"></div>
          Sombre
        </Button>

        {/* BOUTON AUTO */}
        <Button
          variant={preferences.theme === 'auto' ? 'default' : 'outline'}
          className="h-20 flex flex-col items-center justify-center"
          onClick={async () => {
            // 1️⃣ Changer localement
            setPreferences({ ...preferences, theme: 'auto' });
            // 2️⃣ Appliquer immédiatement + sauvegarder en BD
            await updatePreferences({ theme: 'auto' });
          }}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-900 mb-2"></div>
          Auto
        </Button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        💡 Le changement s'applique immédiatement
      </p>
    </div>
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
