'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';

export function useGuard(portalEsperado) {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) {
      router.replace('/login');
      return;
    }
    if (user.portal_acceso !== portalEsperado) {
      router.replace('/login');
    }
  }, [ready, user, portalEsperado, router]);

  return { user, ready, autorizado: ready && user && user.portal_acceso === portalEsperado };
}
