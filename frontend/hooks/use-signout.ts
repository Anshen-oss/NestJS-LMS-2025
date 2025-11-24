'use client';

import { useAuth } from './use-auth';

export function useSignout() {
  const { logout } = useAuth();
  return logout;
}
