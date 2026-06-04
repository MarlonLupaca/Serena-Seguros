import { Roboto } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';
import ToastProvider from '@/components/ToastProvider';

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
});

export const metadata = {
  title: 'Serena Seguros',
  description: 'Pagina de Gestion de seguros sociales',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${roboto.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-gradient-pastel" suppressHydrationWarning>
        <AuthProvider>
          <ToastProvider />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
