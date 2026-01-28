'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export default function TestPage() {
  const { getToken, isLoaded } = useAuth();
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    console.log('🟢 TestPage mounted');
    console.log('🔐 isLoaded:', isLoaded);

    if (!isLoaded) {
      console.log('⏳ Clerk not loaded yet');
      return;
    }

    const test = async () => {
      try {
        console.log('🔄 Getting token...');
        const token = await getToken();
        console.log('🔑 Token received:', token ? 'YES' : 'NO');

        if (!token) {
          console.log('❌ No token!');
          setResult({ error: 'No token' });
          return;
        }

        console.log('📡 Calling API...');
        const res = await fetch('http://localhost:4000/api/user/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        console.log('📊 Response status:', res.status);
        const data = await res.json();
        console.log('✅ User data:', data);
        console.log('🖼️ Avatar:', data.avatar);
        setResult(data);
      } catch (error) {
        console.error('❌ Error:', error);
        setResult({ error: String(error) });
      }
    };

    test();
  }, [isLoaded, getToken]);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Test Page</h1>
      <p>Check console (F12)</p>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}
