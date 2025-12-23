'use client';

import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { useAuth } from '@clerk/nextjs';
import { useMemo } from 'react';

// ✅ Configuration
const GRAPHQL_URI = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';

// ✅ Liste des opérations publiques (pas besoin d'auth)
const PUBLIC_OPERATIONS = [
  'GetAllCourses',
  'GetCourseBySlug',
  'GetPublicCourses',
];

// ✅ HTTP Link
const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
  credentials: 'include', // Pour les cookies si nécessaire
});

// ✅ Hook pour créer le client Apollo avec auth Clerk
export function useApolloClient() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  return useMemo(() => {
    // ✅ Auth Link - Ajoute le token Clerk aux headers
    const authLink = setContext(async (operation, { headers }) => {
      const operationName = operation.operationName || 'Unknown';

      // Si opération publique, skip le token
      if (PUBLIC_OPERATIONS.includes(operationName)) {
        console.log(`🌐 Public operation: ${operationName}`);
        return { headers };
      }

      // Si pas encore chargé ou pas connecté, skip le token
      if (!isLoaded || !isSignedIn) {
        console.log(`⏳ Auth not ready for: ${operationName}`);
        return { headers };
      }

      try {
        // Récupérer le token Clerk
        const token = await getToken();

        if (token) {
          console.log(`🔑 Token added for: ${operationName}`);
        } else {
          console.warn(`⚠️ No token available for: ${operationName}`);
        }

        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
          },
        };
      } catch (error) {
        //console.error(`❌ Error getting token for ${operationName}:`, error);
        return { headers };
      }
    });

    // ✅ Error Link - Gestion des erreurs
    const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
      const operationName = operation.operationName || 'Unknown';

      // GraphQL Errors
      if (graphQLErrors) {
        graphQLErrors.forEach(({ message, locations, path, extensions }) => {
          console.group(`❌ GraphQL Error - ${operationName}`);
          console.error('Message:', message);
          console.error('Path:', path);
          console.error('Locations:', locations);

          if (extensions?.code === 'UNAUTHENTICATED') {
            console.error('🔐 Authentication required!');
            console.error('Operation:', operationName);
            console.error('Variables:', operation.variables);
          }

          console.groupEnd();
        });
      }

      // Network Errors
      if (networkError) {
        console.group(`❌ Network Error - ${operationName}`);
        console.error('NetworkError full:', JSON.stringify(networkError, null, 2));

        console.error('Error:', networkError);
        console.error('Operation:', operationName);
        console.groupEnd();
      }
    });

    // ✅ Créer le client Apollo
    return new ApolloClient({
      link: from([errorLink, authLink, httpLink]),
      cache: new InMemoryCache({
        typePolicies: {
          Query: {
            fields: {
              // Cache personnalisé si nécessaire
              publicCourses: {
                merge(existing = [], incoming) {
                  return incoming;
                },
              },
            },
          },
        },
      }),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
          errorPolicy: 'all',
        },
        query: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all',
        },
        mutate: {
          errorPolicy: 'all',
        },
      },
    });
  }, [getToken, isLoaded, isSignedIn]);
}

// ✅ Helper pour vérifier si une opération est publique
export function isPublicOperation(operationName: string | undefined): boolean {
  return PUBLIC_OPERATIONS.includes(operationName || '');
}
