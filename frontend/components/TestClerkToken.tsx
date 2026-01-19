// components/TestClerkToken.tsx
'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';

export function TestClerkToken() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const testToken = async () => {
      console.log('🧪 Testing Clerk Token:');
      console.log('   isLoaded:', isLoaded);
      console.log('   isSignedIn:', isSignedIn);

      if (isLoaded && isSignedIn) {
        try {
          const token = await getToken();
          console.log('   ✅ Token:', token?.substring(0, 50) + '...');
        } catch (error) {
          console.log('   ❌ Error getting token:', error);
        }
      } else {
        console.log('   ⚠️ Not signed in yet');
      }
    };

    testToken();
  }, [isLoaded, isSignedIn, getToken]);

  return null; // Composant invisible, juste pour tester
}
