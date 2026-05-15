'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';
import { useGuard } from '@/lib/useGuard';

import {
  MdHome,
  MdFactCheck,
  MdTrendingUp,
  MdBusinessCenter,
  MdQueryStats,
  MdAccountBalance,
  MdTrackChanges,
  MdInsights,
  MdAssessment,
  MdHistory,
  MdSettings,
} from 'react-icons/md';

// 1. Definimos el menú Ejecutivo (Nivel Gerencial / Directorios)
const adminMenu = [
  {
    section: 'Principal',
    items: [
      { label: 'Inicio', icon: MdHome, href: '/ejecutivo' },
      { label: 'Aprobaciones', icon: MdFactCheck, href: '/ejecutivo/aprobaciones' },
    ],
  },

  {
    section: 'Estrategia y Finanzas',
    items: [
      { label: 'Objetivos', icon: MdTrackChanges, href: '/ejecutivo/objetivos' },
      { label: 'Escenarios', icon: MdInsights, href: '/ejecutivo/escenarios' },
    ],
  },
  {
    section: 'Administración',
    items: [
      { label: 'Reportes', icon: MdAssessment, href: '/ejecutivo/reportes' },
      { label: 'Auditoria', icon: MdHistory, href: '/ejecutivo/auditoria' },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const { user, autorizado } = useGuard('EJECUTIVO');

  if (!autorizado) return null;

  const sidebarUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.username,
  };

  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={adminMenu} user={sidebarUser} />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        {/* HEADER REUTILIZABLE PARA EJECUTIVO */}
        <AppHeader
          title="Portal Ejecutivo"
          subtitle="Gerencia General"
          searchPlaceholder="Buscar métricas, informes, áreas..."
          indicatorTitle="Por Aprobar"
          indicatorValue="5 urgentes"
        />
        <div className="px-8">{children}</div>
      </main>
    </div>
  );
}
