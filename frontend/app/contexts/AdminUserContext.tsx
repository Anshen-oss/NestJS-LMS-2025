'use client';

import { useAuth } from '@clerk/nextjs';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserAvatar {
  id: string;
  urlMedium: string;
  urlLarge: string;
}

interface AdminUser {
  id: string;
  name: string;
  email: string;
  image: string;
  avatar?: UserAvatar;
}

interface AdminUserContextType {
  user: AdminUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const AdminUserContext = createContext<AdminUserContextType | undefined>(undefined);

export function AdminUserProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    if (!isLoaded) return;

    try {
      const token = await getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:4000/api/user/me', {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to fetch');

      const data = await res.json();
      console.log('📦 [ADMIN CONTEXT] User fetched:', data.email);
      setUser(data);
    } catch (error) {
      console.error('❌ [ADMIN CONTEXT] Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchUser();
  }, [isLoaded]);

  // ✅ Avatar sync listener
  useEffect(() => {
    const handleAvatarUpdated = async () => {
      console.log('📢 [ADMIN CONTEXT] Avatar update event received!');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('🔄 [ADMIN CONTEXT] Calling fetchUser()...');
      await fetchUser();
      console.log('✅ [ADMIN CONTEXT] fetchUser() completed!');
    };

    window.addEventListener('avatar-updated', handleAvatarUpdated);
    console.log('✅ [ADMIN CONTEXT] Listener attached!');

    return () => {
      console.log('🧹 [ADMIN CONTEXT] Removing listener');
      window.removeEventListener('avatar-updated', handleAvatarUpdated);
    };
  }, []);

  const refetch = async () => {
    console.log('🔄 [ADMIN CONTEXT] Refetching user...');
    await fetchUser();
    console.log('✅ [ADMIN CONTEXT] User refetched!');
  };

  return (
    <AdminUserContext.Provider value={{ user, loading, refetch }}>
      {children}
    </AdminUserContext.Provider>
  );
}

export function useAdminUser() {
  const context = useContext(AdminUserContext);
  if (!context) {
    throw new Error('useAdminUser must be used within AdminUserProvider');
  }
  return context;
}
