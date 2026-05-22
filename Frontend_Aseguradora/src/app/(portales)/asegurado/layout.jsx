'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';
import { useGuard } from '@/lib/useGuard';

import { MdShield, MdDescription, MdWarning, MdPayment, MdFolder, MdPerson, MdHome, MdPostAdd, MdRequestQuote } from 'react-icons/md';

// 1. Configuramos el menú específico para el Cliente
const clientMenu = [
  {
    section: 'Principal',
    items: [
      { label: 'Inicio', icon: MdHome, href: '/asegurado' },
      { label: 'Cotizar y contratar', icon: MdShield, href: '/asegurado/seguros' },
      { label: 'Mis solicitudes', icon: MdRequestQuote, href: '/asegurado/solicitudes' },
      { label: 'Mis pólizas', icon: MdDescription, href: '/asegurado/polizas' },
    ],
  },
  {
    section: 'Siniestros',
    items: [{ label: 'Reportar', icon: MdWarning, href: '/asegurado/reportar' }],
  },
  {
    section: 'Pagos',
    items: [{ label: 'Mis pagos', icon: MdPayment, href: '/asegurado/pagos' }],
  },
  {
    section: 'Cuenta',
    items: [{ label: 'Perfil', icon: MdPerson, href: '/asegurado/perfil' }],
  },
];

export default function DashboardLayout({ children }) {
  const { user, autorizado } = useGuard('ASEGURADO');

  if (!autorizado) return null;

  const sidebarUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.username,
  };

  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={clientMenu} user={sidebarUser} />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        {/* HEADER REUTILIZABLE PARA CLIENTE */}
        <AppHeader
          title="Portal Asegurado"
          subtitle="Gestión de Seguros Personales"
          searchPlaceholder="Buscar pólizas, pagos, asistencias..."
          indicatorTitle="Pólizas Activas"
          indicatorValue="3 vigentes"
        />
        {children}
      </main>
    </div>
  );
}
