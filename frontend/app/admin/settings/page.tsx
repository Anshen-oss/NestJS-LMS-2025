// 'use client';

// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Separator } from '@/components/ui/separator';
// import { Switch } from '@/components/ui/switch';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { useToast } from '@/components/ui/use-toast';
// import { gql, useQuery } from '@apollo/client';
// import {
//   Bell,
//   Globe,
//   Loader2,
//   Lock,
//   Mail,
//   Palette,
//   Save,
//   Shield,
//   User,
// } from 'lucide-react';
// import { useState } from 'react';

// // ==================== GRAPHQL QUERIES ====================

// const GET_ME = gql`
//   query GetMe {
//     me {
//       id
//       name
//       email
//       role
//     }
//   }
// `;

// // ==================== TYPES ====================

// interface UserData {
//   id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// // ==================== COMPONENTS ====================

// function ProfileSection({ userData }: { userData: UserData }) {
//   const { toast } = useToast();
//   const [name, setName] = useState(userData.name);
//   const [email, setEmail] = useState(userData.email);
//   const [saving, setSaving] = useState(false);

//   const handleSave = async () => {
//     setSaving(true);
//     // TODO: Implémenter la mutation updateProfile
//     setTimeout(() => {
//       setSaving(false);
//       toast({
//         title: 'Profil mis à jour',
//         description: 'Vos informations ont été sauvegardées avec succès.',
//       });
//     }, 1000);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium">Profil</h3>
//         <p className="text-sm text-muted-foreground">
//           Gérez vos informations personnelles
//         </p>
//       </div>
//       <Separator />

//       <div className="space-y-4">
//         {/* Avatar */}
//         <div className="flex items-center gap-4">
//           <div className="h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
//             <span className="text-2xl font-bold text-white">
//               {userData.name.charAt(0).toUpperCase()}
//             </span>
//           </div>
//           <div>
//             <Button variant="outline" size="sm">
//               Changer l'avatar
//             </Button>
//             <p className="text-xs text-muted-foreground mt-2">
//               JPG, PNG ou GIF. Max 2MB.
//             </p>
//           </div>
//         </div>

//         {/* Name */}
//         <div className="space-y-2">
//           <Label htmlFor="name">Nom complet</Label>
//           <div className="flex gap-2">
//             <User className="h-4 w-4 text-muted-foreground mt-3" />
//             <Input
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Votre nom"
//             />
//           </div>
//         </div>

//         {/* Email */}
//         <div className="space-y-2">
//           <Label htmlFor="email">Email</Label>
//           <div className="flex gap-2">
//             <Mail className="h-4 w-4 text-muted-foreground mt-3" />
//             <Input
//               id="email"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               placeholder="votre@email.com"
//             />
//           </div>
//         </div>

//         {/* Role (read-only) */}
//         <div className="space-y-2">
//           <Label>Rôle</Label>
//           <div className="flex gap-2">
//             <Shield className="h-4 w-4 text-muted-foreground mt-3" />
//             <Input
//               value={userData.role}
//               disabled
//               className="bg-muted"
//             />
//           </div>
//           <p className="text-xs text-muted-foreground">
//             Contactez un administrateur pour changer votre rôle
//           </p>
//         </div>

//         {/* Save Button */}
//         <Button onClick={handleSave} disabled={saving} className="w-full">
//           {saving ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Enregistrement...
//             </>
//           ) : (
//             <>
//               <Save className="mr-2 h-4 w-4" />
//               Enregistrer les modifications
//             </>
//           )}
//         </Button>
//       </div>
//     </div>
//   );
// }

// function PreferencesSection() {
//   const { toast } = useToast();
//   const [theme, setTheme] = useState('light');
//   const [language, setLanguage] = useState('fr');
//   const [emailNotifications, setEmailNotifications] = useState(true);
//   const [pushNotifications, setPushNotifications] = useState(false);

//   const handleSave = () => {
//     toast({
//       title: 'Préférences sauvegardées',
//       description: 'Vos préférences ont été mises à jour.',
//     });
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium">Préférences</h3>
//         <p className="text-sm text-muted-foreground">
//           Personnalisez votre expérience
//         </p>
//       </div>
//       <Separator />

//       <div className="space-y-6">
//         {/* Theme */}
//         <div className="space-y-2">
//           <Label htmlFor="theme">Thème</Label>
//           <div className="flex gap-2">
//             <Palette className="h-4 w-4 text-muted-foreground mt-3" />
//             <Select value={theme} onValueChange={setTheme}>
//               <SelectTrigger id="theme">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="light">Clair</SelectItem>
//                 <SelectItem value="dark">Sombre</SelectItem>
//                 <SelectItem value="system">Système</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* Language */}
//         <div className="space-y-2">
//           <Label htmlFor="language">Langue</Label>
//           <div className="flex gap-2">
//             <Globe className="h-4 w-4 text-muted-foreground mt-3" />
//             <Select value={language} onValueChange={setLanguage}>
//               <SelectTrigger id="language">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="fr">Français</SelectItem>
//                 <SelectItem value="en">English</SelectItem>
//                 <SelectItem value="es">Español</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <Separator />

//         {/* Notifications */}
//         <div>
//           <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
//             <Bell className="h-4 w-4" />
//             Notifications
//           </h4>
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Notifications par email</Label>
//                 <p className="text-sm text-muted-foreground">
//                   Recevoir des mises à jour par email
//                 </p>
//               </div>
//               <Switch
//                 checked={emailNotifications}
//                 onCheckedChange={setEmailNotifications}
//               />
//             </div>

//             <div className="flex items-center justify-between">
//               <div className="space-y-0.5">
//                 <Label>Notifications push</Label>
//                 <p className="text-sm text-muted-foreground">
//                   Recevoir des notifications dans le navigateur
//                 </p>
//               </div>
//               <Switch
//                 checked={pushNotifications}
//                 onCheckedChange={setPushNotifications}
//               />
//             </div>
//           </div>
//         </div>

//         {/* Save Button */}
//         <Button onClick={handleSave} className="w-full">
//           <Save className="mr-2 h-4 w-4" />
//           Enregistrer les préférences
//         </Button>
//       </div>
//     </div>
//   );
// }

// function SecuritySection() {
//   const { toast } = useToast();
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const handleChangePassword = async () => {
//     if (newPassword !== confirmPassword) {
//       toast({
//         title: 'Erreur',
//         description: 'Les mots de passe ne correspondent pas.',
//         variant: 'destructive',
//       });
//       return;
//     }

//     setSaving(true);
//     // TODO: Implémenter la mutation changePassword
//     setTimeout(() => {
//       setSaving(false);
//       setCurrentPassword('');
//       setNewPassword('');
//       setConfirmPassword('');
//       toast({
//         title: 'Mot de passe modifié',
//         description: 'Votre mot de passe a été mis à jour avec succès.',
//       });
//     }, 1000);
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h3 className="text-lg font-medium">Sécurité</h3>
//         <p className="text-sm text-muted-foreground">
//           Gérez la sécurité de votre compte
//         </p>
//       </div>
//       <Separator />

//       <div className="space-y-6">
//         {/* Change Password */}
//         <div className="space-y-4">
//           <h4 className="text-sm font-medium flex items-center gap-2">
//             <Lock className="h-4 w-4" />
//             Changer le mot de passe
//           </h4>

//           <div className="space-y-2">
//             <Label htmlFor="current-password">Mot de passe actuel</Label>
//             <Input
//               id="current-password"
//               type="password"
//               value={currentPassword}
//               onChange={(e) => setCurrentPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="new-password">Nouveau mot de passe</Label>
//             <Input
//               id="new-password"
//               type="password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
//             <Input
//               id="confirm-password"
//               type="password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//               placeholder="••••••••"
//             />
//           </div>

//           <Button onClick={handleChangePassword} disabled={saving} className="w-full">
//             {saving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                 Modification...
//               </>
//             ) : (
//               <>
//                 <Lock className="mr-2 h-4 w-4" />
//                 Changer le mot de passe
//               </>
//             )}
//           </Button>
//         </div>

//         <Separator />

//         {/* Two-Factor Authentication */}
//         <div className="space-y-4">
//           <h4 className="text-sm font-medium flex items-center gap-2">
//             <Shield className="h-4 w-4" />
//             Authentification à deux facteurs
//           </h4>

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label>Activer la 2FA</Label>
//               <p className="text-sm text-muted-foreground">
//                 Ajouter une couche de sécurité supplémentaire
//               </p>
//             </div>
//             <Switch
//               checked={twoFactorEnabled}
//               onCheckedChange={setTwoFactorEnabled}
//             />
//           </div>

//           {twoFactorEnabled && (
//             <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
//               <p className="text-sm text-yellow-800">
//                 ⚠️ La configuration de la 2FA sera disponible prochainement.
//               </p>
//             </div>
//           )}
//         </div>

//         <Separator />

//         {/* Danger Zone */}
//         <div className="space-y-4">
//           <h4 className="text-sm font-medium text-red-600">Zone dangereuse</h4>
//           <div className="rounded-lg border border-red-200 bg-red-50 p-4 space-y-3">
//             <div>
//               <p className="text-sm font-medium text-red-900">
//                 Supprimer le compte
//               </p>
//               <p className="text-sm text-red-700">
//                 Cette action est irréversible. Toutes vos données seront supprimées.
//               </p>
//             </div>
//             <Button variant="destructive" size="sm">
//               Supprimer mon compte
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ==================== MAIN COMPONENT ====================

// export default function SettingsPage() {
//   const { data, loading, error } = useQuery<{ me: UserData }>(GET_ME, {
//     fetchPolicy: 'network-only',
//   });

//   if (loading) {
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
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-3xl font-bold">Paramètres</h1>
//         <p className="text-muted-foreground mt-2">
//           Gérez les paramètres de votre compte et vos préférences
//         </p>
//       </div>

//       {/* Tabs */}
//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="profile">Profil</TabsTrigger>
//           <TabsTrigger value="preferences">Préférences</TabsTrigger>
//           <TabsTrigger value="security">Sécurité</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile">
//           <Card>
//             <CardContent className="pt-6">
//               <ProfileSection userData={data.me} />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="preferences">
//           <Card>
//             <CardContent className="pt-6">
//               <PreferencesSection />
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="security">
//           <Card>
//             <CardContent className="pt-6">
//               <SecuritySection />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { gql, useQuery } from '@apollo/client';
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

// ==================== GRAPHQL QUERIES ====================

const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      role
    }
  }
`;

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
  const { data, loading, error } = useQuery<{ me: UserData }>(GET_ME, {
    fetchPolicy: 'network-only',
  });

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

  if (loading) {
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
                    {data.me.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium">{data.me.name}</p>
                  <p className="text-sm text-muted-foreground">{data.me.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {data.me.role}
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
