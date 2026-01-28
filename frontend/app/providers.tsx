'use client';

import { AdminUserProvider } from '@/app/contexts/AdminUserContext';
import { StudentUserProvider } from '@/app/contexts/StudentUserContext';
import { useApolloClient } from '@/lib/apollo-client';
import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const client = useApolloClient();

  return (
    <AdminUserProvider>
      <StudentUserProvider>
        <ApolloProvider client={client}>
          {children}
        </ApolloProvider>
      </StudentUserProvider>
    </AdminUserProvider>
  );
}
