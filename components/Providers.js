'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { AuthProvider } from '@/context/AuthContext';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>{children}</ToastProvider>
    </AuthProvider>
  );
}
