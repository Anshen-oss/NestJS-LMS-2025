// lib/apolloClient.ts - CORRIGÉ v2

'use client';

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

const GRAPHQL_URI = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
const PUBLIC_OPERATIONS = ['GetAllCourses', 'GetCourseBySlug', 'GetPublicCourses'];

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  credentials: 'include',
});

export function useApolloClient() {
  const { getToken } = useAuth();  // ✅ Enlever isLoaded et isSignedIn

  return useMemo(() => {
    const authLink = setContext(async (operation, { headers }) => {
      const operationName = operation.operationName || 'Unknown';

      // ✅ Si c'est une opération publique, pas besoin de token
      if (PUBLIC_OPERATIONS.includes(operationName)) {
        console.log(`📢 Public operation: ${operationName}`);
        return { headers };
      }

      // ✅ TOUJOURS essayer de récupérer le token
      // getToken() retournera null si l'utilisateur n'est pas connecté
      try {
        const token = await getToken();
        if (token) {
          console.log(`🔐 Adding token to operation: ${operationName}`);
          return {
            headers: {
              ...headers,
              authorization: `Bearer ${token}`,
            },
          };
        } else {
          console.log(`⚠️ No token available for operation: ${operationName}`);
          return { headers };
        }
      } catch (error) {
        console.error(`❌ Error getting token for ${operationName}:`, error);
        return { headers };
      }
    });

    const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          console.group(`❌ GraphQL Error - ${operation.operationName}`);
          console.error('Message:', message);
          console.error('Full Error:', { message, locations, path, extensions });
          console.groupEnd();
        });
      }
      if (networkError) {
        console.group(`❌ Network Error`);
        console.error('Error:', networkError);
        console.groupEnd();
      }
    });

    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              publicCourses: { merge(existing = [], incoming) { return incoming; } },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: { fetchPolicy: 'cache-and-network', errorPolicy: 'all' },
        query: { fetchPolicy: 'network-only', errorPolicy: 'all' },
        mutate: { errorPolicy: 'all' },
      },
    });
  }, [getToken]);
}

export function isPublicOperation(operationName: string | undefined): boolean {
  return PUBLIC_OPERATIONS.includes(operationName || '');
}
