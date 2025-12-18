'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useSetupUserRoleMutation } from '@/lib/generated/graphql';
import { useUser } from '@clerk/nextjs';
import {
  Award,
  BarChart,
  BookOpen,
  DollarSign,
  GraduationCap,
  TrendingUp,
  Users,
  Video
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [setupUserRole] = useSetupUserRoleMutation();

 const handleSelectRole = async (role: string) => {
  if (!user?.id) {
    toast.error('Erreur: utilisateur non trouvé');
    return;
  }

  setSelectedRole(role);
  setIsLoading(true);

  try {
    console.log('🔍 Starting setupUserRole');
    console.log('🔍 Clerk User ID:', user.id);
    console.log('🔍 Role:', role);

    const { data, errors } = await setupUserRole({
      variables: {
        clerkUserId: user.id,
        role: role,
      },
    });

    console.log('📦 Response data:', data);
    console.log('📦 Response errors:', errors);

    if (errors && errors.length > 0) {
      console.error('❌ GraphQL Errors:', errors);
      throw new Error(errors[0].message);
    }

    console.log('✅ User role setup successfully:', data);

    toast.success('Rôle configuré ! Redirection...');

    // Attendre que Clerk synchronise
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Force reload
    window.location.replace(role === 'STUDENT' ? '/student' : '/instructor');
  } catch (error: any) {
    console.error('❌ Full error object:', error);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);

    toast.error(`Erreur: ${error.message || 'Erreur inconnue'}`);
    setIsLoading(false);
    setSelectedRole(null);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-6">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="h-10 w-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Bienvenue sur Anshen LMS ! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Bonjour <span className="font-semibold text-blue-600">{user?.firstName}</span>,
            choisissez comment vous souhaitez utiliser la plateforme
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Étudiant */}
          <Card
            className={`relative overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              selectedRole === 'STUDENT'
                ? 'border-purple-500 shadow-2xl shadow-purple-200'
                : 'border-gray-200 hover:border-purple-300 hover:shadow-xl'
            }`}
            onClick={() => !isLoading && handleSelectRole('STUDENT')}
          >
            {/* Gradient Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>

            <div className="relative p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                  <GraduationCap className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Étudiant
                </h2>
                <p className="text-gray-600">
                  Apprenez et développez vos compétences
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Video className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Accès illimité</p>
                    <p className="text-sm text-gray-600">Tous les cours disponibles</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Suivi de progression</p>
                    <p className="text-sm text-gray-600">Dashboard personnalisé</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Award className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Certificats</p>
                    <p className="text-sm text-gray-600">Validez vos compétences</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Communauté</p>
                    <p className="text-sm text-gray-600">Échangez avec d'autres étudiants</p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Button
                className={`w-full h-12 text-base font-semibold transition-all ${
                  selectedRole === 'STUDENT'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                }`}
                disabled={isLoading}
              >
                {isLoading && selectedRole === 'STUDENT' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Chargement...
                  </div>
                ) : (
                  'Commencer en tant qu\'étudiant'
                )}
              </Button>
            </div>
          </Card>

          {/* Instructeur */}
          <Card
            className={`relative overflow-hidden bg-white cursor-pointer transition-all duration-300 hover:scale-105 border-2 ${
              selectedRole === 'INSTRUCTOR'
                ? 'border-blue-500 shadow-2xl shadow-blue-200'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-xl'
            }`}
            onClick={() => !isLoading && handleSelectRole('INSTRUCTOR')}
          >
            {/* Gradient Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>

            <div className="relative p-8">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg transform hover:rotate-6 transition-transform">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Instructeur
                </h2>
                <p className="text-gray-600">
                  Créez et partagez vos connaissances
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Cours illimités</p>
                    <p className="text-sm text-gray-600">Créez autant de cours que vous voulez</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <Video className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Outils avancés</p>
                    <p className="text-sm text-gray-600">Éditeur de contenu professionnel</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <BarChart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Analytics</p>
                    <p className="text-sm text-gray-600">Suivez vos performances</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    <DollarSign className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Revenus</p>
                    <p className="text-sm text-gray-600">Monétisez votre expertise</p>
                  </div>
                </div>
              </div>

              {/* Button */}
              <Button
                className={`w-full h-12 text-base font-semibold transition-all ${
                  selectedRole === 'INSTRUCTOR'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                    : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                }`}
                disabled={isLoading}
              >
                {isLoading && selectedRole === 'INSTRUCTOR' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Chargement...
                  </div>
                ) : (
                  'Commencer en tant qu\'instructeur'
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Vous pourrez toujours changer de rôle plus tard dans vos paramètres
          </p>
        </div>
      </div>
    </div>
  );
}
