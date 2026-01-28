
'use client';

import { useAuth } from '@clerk/nextjs';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserAvatar {
  id: string;
  urlMedium: string;
  urlLarge: string;
}

interface StudentUser {
  id: string;
  name: string;
  email: string;
  image: string;
  avatar?: UserAvatar;
}

interface StudentUserContextType {
  user: StudentUser | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

const StudentUserContext = createContext<StudentUserContextType | undefined>(undefined);

export function StudentUserProvider({ children }: { children: React.ReactNode }) {
  const { getToken, isLoaded } = useAuth();
  const [user, setUser] = useState<StudentUser | null>(null);
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
      console.log('📦 [STUDENT CONTEXT] User fetched:', data.email);
      setUser(data);
    } catch (error) {
      console.error('❌ [STUDENT CONTEXT] Error fetching user:', error);
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
      console.log('📢 [STUDENT CONTEXT] Avatar update event received!');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('🔄 [STUDENT CONTEXT] Calling fetchUser()...');
      await fetchUser();
      console.log('✅ [STUDENT CONTEXT] fetchUser() completed!');
    };

    window.addEventListener('avatar-updated', handleAvatarUpdated);
    console.log('✅ [STUDENT CONTEXT] Listener attached!');

    return () => {
      console.log('🧹 [STUDENT CONTEXT] Removing listener');
      window.removeEventListener('avatar-updated', handleAvatarUpdated);
    };
  }, []);

  const refetch = async () => {
    console.log('🔄 [STUDENT CONTEXT] Refetching user...');
    await fetchUser();
    console.log('✅ [STUDENT CONTEXT] User refetched!');
  };

  return (
    <StudentUserContext.Provider value={{ user, loading, refetch }}>
      {children}
    </StudentUserContext.Provider>
  );
}

export function useStudentUser() {
  const context = useContext(StudentUserContext);
  if (!context) {
    throw new Error('useStudentUser must be used within StudentUserProvider');
  }
  return context;
}
