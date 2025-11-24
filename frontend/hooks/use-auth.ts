'use client';

import { LOGIN_MUTATION, ME_QUERY, REGISTER_MUTATION } from '@/lib/graphql/auth';
import { useApolloClient, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  image: string | null;
  role: 'USER' | 'ADMIN';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export function useAuth() {
  const router = useRouter();
  const apolloClient = useApolloClient(); // ✅ Ajouté pour resetStore

  // 1. useQuery : Vérifie si l'utilisateur est connecté
  const { data, loading, error, refetch } = useQuery(ME_QUERY, {
    errorPolicy: 'ignore', // Ne pas throw d'erreur si non authentifié
  });

    // 2. useMutation : Login et Register
  const [loginMutation, { loading: loginLoading }] = useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] = useMutation(REGISTER_MUTATION);

    // 3. useCallback : Mémorise les fonctions login/register
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await loginMutation({
          variables: { email, password },
        });

        if (data?.login) {
          // Stocker le token
          localStorage.setItem('token', data.login.accessToken);

          // ✅ MODIFIÉ : Reset le cache Apollo et refetch
          await apolloClient.resetStore();

          return { success: true, user: data.login.user };
        }
      } catch (error: any) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
    },
    [loginMutation, apolloClient]
  );

  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        const { data } = await registerMutation({
          variables: { email, password, name },
        });

        if (data?.register) {
          // Stocker le token
          localStorage.setItem('token', data.register.accessToken);

          // ✅ MODIFIÉ : Reset le cache Apollo et refetch
          await apolloClient.resetStore();

          return { success: true, user: data.register.user };
        }
      } catch (error: any) {
        console.error('Register error:', error);
        return { success: false, error: error.message };
      }
    },
    [registerMutation, apolloClient]
  );

  const logout = useCallback(() => {
    // Supprimer le token
    localStorage.removeItem('token');

    // ✅ MODIFIÉ : Clear le cache Apollo
    apolloClient.clearStore();

    // Rediriger vers la page de login
    router.push('/login');
    router.refresh();
  }, [router, apolloClient]);

  return {
    user: data?.me as User | undefined,
    isAuthenticated: !!data?.me,
    isLoading: loading,
    error,
    login,
    register,
    logout,
    loginLoading,
    registerLoading,
  };
}
