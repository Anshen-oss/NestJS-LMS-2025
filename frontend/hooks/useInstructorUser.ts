'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useInstructorUser() {
  const { getToken, isLoaded } = useAuth();
  const [user, setUser] = useState<any>(null);
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
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      console.log('✅ User fetched:', data.email);
      setUser(data);
    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial
  useEffect(() => {
    fetchUser();
  }, [isLoaded, getToken]);

  // ✅ ÉCOUTE l'événement "avatar-updated"
  useEffect(() => {
    const handleAvatarUpdated = async () => {
      console.log('📢 Avatar update event received!');
      await new Promise(resolve => setTimeout(resolve, 500));
      await fetchUser();
      console.log('✅ Avatar refetched!');
    };

    window.addEventListener('avatar-updated', handleAvatarUpdated);
    return () => window.removeEventListener('avatar-updated', handleAvatarUpdated);
  }, [isLoaded, getToken]);

  const refetch = fetchUser;

  return { user, loading, refetch };
}
