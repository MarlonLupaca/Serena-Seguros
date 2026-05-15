'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';
import { useGuard } from '@/lib/useGuard';

import {
  MdHome,
  MdBadge,
  MdEventAvailable,
  MdPayments,
  MdAssessment,
  MdDomain,
  MdInventory,
  MdShoppingCart,
  MdDirectionsCar,
  MdStorefront,
  MdPriceCheck,
  MdReceiptLong,
  MdAccountBalance,
  MdAccountBalanceWallet,
  MdCalculate,
} from 'react-icons/md';

// 1. Configuramos el menú específico para Operaciones / Administración
const operativoMenu = [
  {
    section: 'Principal',
    items: [{ label: 'Inicio', icon: MdHome, href: '/finanzas' }],
  },
  {
    section: 'Recursos Humanos',
    items: [
      { label: 'Empleados', icon: MdBadge, href: '/finanzas/empleados' },
      { label: 'Nómina', icon: MdPayments, href: '/finanzas/nomina' },
    ],
  },
  {
    section: 'Logística',
    items: [
      { label: 'Activos fijos', icon: MdDomain, href: '/finanzas/activos' },
      { label: 'Compras', icon: MdShoppingCart, href: '/finanzas/compras' },
    ],
  },
  {
    section: 'Finanzas',
    items: [
      { label: 'Cobranza', icon: MdPriceCheck, href: '/finanzas/cobranza' },
      { label: 'Tesorería', icon: MdAccountBalanceWallet, href: '/finanzas/tesoreria' },
      { label: 'Contabilidad', icon: MdAccountBalance, href: '/finanzas/contabilidad' },
      { label: 'Presupuesto', icon: MdCalculate, href: '/finanzas/presupuesto' },
    ],
  },
];

export default function DashboardLayout({ children }) {
  const { user, autorizado } = useGuard('OPERATIVO');

  if (!autorizado) return null;

  const sidebarUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.username,
  };

  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={operativoMenu} user={sidebarUser} />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        {/* HEADER REUTILIZABLE PARA OPERATIVO / ERP */}
        <AppHeader
          title=" Portal Operativo"
          subtitle="RRHH, Logística y Finanzas"
          searchPlaceholder="Buscar empleados, facturas, activos..."
          indicatorTitle="Por Procesar"
          indicatorValue="7 facturas"
        />
        <div className="px-8">{children}</div>
      </main>
    </div>
  );
}
