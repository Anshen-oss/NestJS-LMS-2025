'use client';

import { useAuth } from '@clerk/nextjs';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserAvatar {
  id: string;
  urlMedium: string;
  urlLarge: string;
}

interface InstructorUser {
  id: string;
  name: string;
  email: string;
  image: string;
  avatar?: UserAvatar;
}

interface InstructorUserContextType {
  user: InstructorUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const InstructorUserContext = createContext<InstructorUserContextType | undefined>(undefined);

export function InstructorUserProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth();
  const [user, setUser] = useState<InstructorUser | null>(null);
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
      console.log('📦 FULL API RESPONSE:', data);
      console.log('✅ User fetched from context:', data.email);
      setUser(data);
    } catch (error) {
      console.error('❌ Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Initial fetch
  useEffect(() => {
    fetchUser();
  }, [isLoaded, getToken]);

useEffect(() => {

  const handleAvatarUpdated = async () => {
    console.log('📢 [CONTEXT] Avatar update event RECEIVED!');

    await new Promise(resolve => setTimeout(resolve, 300));

    console.log('🔄 [CONTEXT] Calling fetchUser()...');

    await fetchUser();

    console.log('✅ [CONTEXT] fetchUser() completed!');
  };

  window.addEventListener('avatar-updated', handleAvatarUpdated);
  console.log('✅ [CONTEXT] Listener ATTACHED successfully!');

  return () => {
    console.log('🧹 [CONTEXT] Removing listener on cleanup');
    window.removeEventListener('avatar-updated', handleAvatarUpdated);
  };
}, []); // ← VIDE

  const refetch = async () => {
    console.log('🔄 Refetching user in context...');
    await fetchUser();
    console.log('✅ User refetched and shared with all components!');
  };

  return (
    <InstructorUserContext.Provider value={{ user, loading, refetch }}>
      {children}
    </InstructorUserContext.Provider>
  );
}

export function useInstructorUser() {
  const context = useContext(InstructorUserContext);
  if (!context) {
    throw new Error('useInstructorUser must be used within InstructorUserProvider');
  }
  return context;
}
