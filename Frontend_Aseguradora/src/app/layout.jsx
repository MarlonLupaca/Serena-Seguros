import { Nunito } from 'next/font/google';
import './globals.css';

const nunito = Nunito({
  variable: '--font-nunito',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Serena Seguros',
  description: 'Pagina de Gestion de seguros sociales',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${nunito.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-bg" suppressHydrationWarning>{children}</body>
    </html>
  );
}
