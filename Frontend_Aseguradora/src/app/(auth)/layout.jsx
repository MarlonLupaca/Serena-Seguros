'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import { PORTAL_TO_PATH } from '@/lib/auth';

export default function AuthLayout({ children }) {
  const router = useRouter();
  const { user, ready } = useAuth();

  useEffect(() => {
    if (!ready) return;
    if (!user) return;
    const path = PORTAL_TO_PATH[user.portal_acceso];
    if (path) router.replace(path);
  }, [ready, user, router]);

  if (!ready) return null;
  if (user) return null;

  return children;
}
