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
    section: 'Desempeño Core',
    items: [
      { label: 'Producción', icon: MdTrendingUp, href: '/ejecutivo/produccion' },
      { label: 'Comercial', icon: MdBusinessCenter, href: '/ejecutivo/comercial' },
      { label: 'Siniestralidad', icon: MdQueryStats, href: '/ejecutivo/siniestralidad' },
    ],
  },
  {
    section: 'Estrategia y Finanzas',
    items: [
      { label: 'Financiero', icon: MdAccountBalance, href: '/ejecutivo/financiero' },
      { label: 'Objetivos', icon: MdTrackChanges, href: '/ejecutivo/objetivos' },
      { label: 'Simulaciones', icon: MdInsights, href: '/ejecutivo/simulaciones' },
    ],
  },
  {
    section: 'Administración',
    items: [
      { label: 'Informes', icon: MdAssessment, href: '/ejecutivo/informes' },
      { label: 'Auditoria', icon: MdHistory, href: '/ejecutivo/auditoria' },
      { label: 'Configuración', icon: MdSettings, href: '/ejecutivo/configuracion' },
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
