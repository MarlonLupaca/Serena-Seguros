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
    items: [{ label: 'Inicio', icon: MdHome, href: '/operativo' }],
  },
  {
    section: 'Recursos Humanos',
    items: [
      { label: 'Empleados', icon: MdBadge, href: '/operativo/empleados' },
      { label: 'Vacaciones y permisos', icon: MdEventAvailable, href: '/operativo/vacaciones' },
      { label: 'Nómina', icon: MdPayments, href: '/operativo/nomina' },
      { label: 'Evaluaciones', icon: MdAssessment, href: '/operativo/evaluaciones' },
    ],
  },
  {
    section: 'Logística',
    items: [
      { label: 'Activos fijos', icon: MdDomain, href: '/operativo/activos' },
      { label: 'Inventario', icon: MdInventory, href: '/operativo/inventario' },
      { label: 'Compras', icon: MdShoppingCart, href: '/operativo/compras' },
      { label: 'Flota vehicular', icon: MdDirectionsCar, href: '/operativo/flota' },
      { label: 'Proveedores', icon: MdStorefront, href: '/operativo/proveedores' },
    ],
  },
  {
    section: 'Finanzas',
    items: [
      { label: 'Cobranza', icon: MdPriceCheck, href: '/operativo/cobranza' },
      { label: 'Facturación', icon: MdReceiptLong, href: '/operativo/facturacion' },
      { label: 'Tesorería', icon: MdAccountBalanceWallet, href: '/operativo/tesoreria' },
      { label: 'Contabilidad', icon: MdAccountBalance, href: '/operativo/contabilidad' },
      { label: 'Presupuesto', icon: MdCalculate, href: '/operativo/presupuesto' },
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
