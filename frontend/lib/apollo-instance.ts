'use client';

import { ApolloClient, ApolloLink, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const GRAPHQL_URI = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql';
const PUBLIC_OPERATIONS = ['GetAllCourses', 'GetCourseBySlug', 'GetPublicCourses'];

let apolloClient: ApolloClient<any> | null = null;
let currentGetToken: (() => Promise<string | null>) | null = null;

export function initializeApollo(getToken: (() => Promise<string | null>) | null) {
  console.log('📡 initializeApollo called with getToken:', !!getToken);

  // ✅ RECRÉÉ LE CLIENT si getToken change!
  if (currentGetToken !== getToken) {
    console.log('📡 getToken changed! Recreating Apollo Client...');
    currentGetToken = getToken;
    apolloClient = null;  // ← Reset le client!
  }

  // Si client existe déjà avec le même getToken, le retourne
  if (apolloClient) {
    console.log('📡 Returning EXISTING Apollo Client');
    return apolloClient;
  }

  const httpLink = createHttpLink({
    uri: GRAPHQL_URI,
    credentials: 'include',
  });

  const logLink = new ApolloLink((operation, forward) => {
    console.log('📤 SENDING REQUEST:', operation.operationName);
    return forward(operation);
  });

  const authLink = setContext(async (operation, { headers }) => {
    const operationName = operation.operationName || 'Unknown';
    console.log('🔗 authLink executing for:', operationName);

    if (PUBLIC_OPERATIONS.includes(operationName)) {
      console.log(`📢 Public operation: ${operationName}`);
      return { headers };
    }

    try {
      if (!getToken) {
        console.log(`⚠️ No getToken available for operation: ${operationName}`);
        return { headers };
      }

      const token = await getToken();
      console.log(`🔐 Token: ${token ? 'YES' : 'NO'} for ${operationName}`);

      if (token) {
        return {
          headers: {
            ...headers,
            authorization: `Bearer ${token}`,
          },
        };
      } else {
        return { headers };
      }
    } catch (error) {
      console.error(`❌ Error getting token for ${operationName}:`, error);
      return { headers };
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message }) => {
        console.error(`❌ GraphQL Error - ${operation.operationName}:`, message);
      });
    }
    if (networkError) {
      console.error(`❌ Network Error:`, networkError);
    }
  });

  console.log('📡 Creating NEW Apollo Client...');
  apolloClient = new ApolloClient({
    link: from([errorLink, logLink, authLink, httpLink]),
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

  return apolloClient;
}

export function getApolloClient() {
  return apolloClient;
}
