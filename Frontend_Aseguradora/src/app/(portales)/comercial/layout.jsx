'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';
import { useGuard } from '@/lib/useGuard';

import {
  MdHome,
  MdRequestQuote,
  MdDescription,
  MdWarning,
  MdPeople,
  MdAssignmentInd,
  MdCampaign,
  MdPieChart,
} from 'react-icons/md';
import { CiMoneyBill } from 'react-icons/ci';
import { GiProcessor } from 'react-icons/gi';

// 1. Configuramos el menú específico para el Empleado / Comercial
const employeeMenu = [
  {
    section: 'Principal',
    items: [
      { label: 'Inicio', icon: MdHome, href: '/comercial' },
      { label: 'Mis comisiones', icon: CiMoneyBill, href: '/comercial/comisiones' },
    ],
  },
  {
    section: 'Gestión Comercial',
    items: [
      { label: 'Leads', icon: MdAssignmentInd, href: '/comercial/leads' },
      { label: 'Clientes', icon: MdPeople, href: '/comercial/clientes' },
      { label: 'Siniestros', icon: MdWarning, href: '/comercial/siniestros' },
      { label: 'Campañas', icon: MdCampaign, href: '/comercial/campanas' },
      { label: 'Renovaciones y Endosos', icon: MdPieChart, href: '/comercial/renovaciones' },
    ],
  },
  {
    section: 'Herramientas',
    items: [{ label: 'Simulador', icon: GiProcessor, href: '/comercial/simulador' }],
  },
];

export default function DashboardLayout({ children }) {
  const { user, autorizado } = useGuard('COMERCIAL');

  if (!autorizado) return null;

  const sidebarUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.username,
  };

  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={employeeMenu} user={sidebarUser} />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        {/* HEADER REUTILIZABLE */}
        <AppHeader
          title="Portal Comercial"
          subtitle="Marketing y Ventas"
          searchPlaceholder="Buscar clientes, pólizas, siniestros..."
          indicatorTitle="Pendientes"
          indicatorValue="12 solicitudes"
        />
        <div className="px-8">{children}</div>
      </main>
    </div>
  );
}
