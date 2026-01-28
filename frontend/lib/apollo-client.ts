'use client';

import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { initializeApollo } from "./apollo-instance";

let cachedGetToken: (() => Promise<string | null>) | null = null;

export function useApolloClient() {
  const { getToken, isLoaded } = useAuth();

  //console.log('🔐 useApolloClient - isLoaded?', isLoaded, 'getToken?', !!getToken);

  // ✅ Mets à jour le getToken en cache quand il devient disponible
  if (isLoaded && getToken) {
    cachedGetToken = getToken;
    //console.log('✅ Cached getToken from Clerk');
  }

  return useMemo(() => {
    // ✅ Utilise le getToken en cache (ou null si pas encore disponible)
    //console.log('🔐 Creating/Getting Apollo client with cachedGetToken:', !!cachedGetToken);
    return initializeApollo(cachedGetToken);
  }, [isLoaded, getToken]);
}
