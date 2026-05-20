'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '16px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 500,
        },
        success: {
          style: { background: 'var(--color-success-soft)', color: 'var(--color-success-text)' },
        },
        error: {
          style: { background: 'var(--color-danger-soft)', color: 'var(--color-danger-text)' },
        },
      }}
    />
  );
}
