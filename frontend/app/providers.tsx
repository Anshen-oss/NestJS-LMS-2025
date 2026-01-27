'use client';

import { useApolloClient } from '@/lib/apollo-client';
import { ApolloProvider } from '@apollo/client';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const client = useApolloClient();

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
