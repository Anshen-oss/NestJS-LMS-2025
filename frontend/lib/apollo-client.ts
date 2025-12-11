import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// ✅ Liste des queries publiques (accessibles sans authentification)
const PUBLIC_OPERATIONS = [
  'GetAllCourses',
  'GetCourseBySlug',
  'GetPublicCourses',
  // Ajoute d'autres queries publiques ici si nécessaire
];

const authLink = setContext((operation, { headers }) => {
  // Si c'est une query publique, ne pas envoyer de token
  if (PUBLIC_OPERATIONS.includes(operation.operationName || '')) {
    return { headers };
  }

  // Pour les autres queries, envoyer le token normalement
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// ✅ Gestion des erreurs d'authentification
const errorLink = onError((errorResponse) => {
  console.log('🔍 Operation:', errorResponse.operation.operationName);
  console.log('🔍 Full Error:', errorResponse);

  // Accède aux erreurs via errorResponse
  if (errorResponse.graphQLErrors && errorResponse.graphQLErrors.length > 0) {
    errorResponse.graphQLErrors.forEach((error) => {
      console.error('❌ GraphQL Error:', error);
    });
  }

  if (errorResponse.networkError) {
    console.error('❌ Network error:', errorResponse.networkError);
  }
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]), // ← errorLink en premier
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default client;
