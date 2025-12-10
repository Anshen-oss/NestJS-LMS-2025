'use client';

import {
  useLoginMutation,
  useMeQuery,
  useRegisterUserMutation
} from '@/lib/generated/graphql';
import { useApolloClient } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  // image: string | null; // ❌ Enlève cette ligne
  role: 'USER' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export function useAuth() {
  const router = useRouter();
  const apolloClient = useApolloClient();

  // 1. Query : Vérifie si l'utilisateur est connecté
  const { data, loading, error, refetch } = useMeQuery({
    errorPolicy: 'ignore', // Ne pas throw d'erreur si non authentifié
  });

  // 2. Mutations : Login et Register
  const [loginMutation, { loading: loginLoading }] = useLoginMutation();
  const [registerMutation, { loading: registerLoading }] = useRegisterUserMutation();

  // 3. Login
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await loginMutation({
          variables: {
            input: { email, password }
          },
        });

        if (data?.login) {
          // Stocker le token
          localStorage.setItem('accessToken', data.login.accessToken);

          // Reset le cache Apollo
          await apolloClient.resetStore();

          return { success: true, user: data.login.user };
        }

        return { success: false, error: 'Login failed' };
      } catch (error: any) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }
    },
    [loginMutation, apolloClient]
  );

  // 4. Register
  const register = useCallback(
    async (email: string, password: string, name?: string) => {
      try {
        const { data } = await registerMutation({
          variables: {
            input: { email, password, name }
          },
        });

        if (data?.register) {
          // Stocker le token
          localStorage.setItem('accessToken', data.register.accessToken);

          // Reset le cache Apollo
          await apolloClient.resetStore();

          return { success: true, user: data.register.user };
        }

        return { success: false, error: 'Registration failed' };
      } catch (error: any) {
        console.error('Register error:', error);
        return { success: false, error: error.message };
      }
    },
    [registerMutation, apolloClient]
  );

  // 5. Logout
  const logout = useCallback(() => {
    // Supprimer le token
    localStorage.removeItem('accessToken');

    // Clear le cache Apollo
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
    refetch,
  };
}
