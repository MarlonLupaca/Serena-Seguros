'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';

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
      { label: 'Cotizaciones', icon: MdRequestQuote, href: '/comercial/cotizaciones' },
      { label: 'Mis comisiones', icon: CiMoneyBill, href: '/comercial/comisiones' },
    ],
  },
  {
    section: 'Gestión Comercial',
    items: [
      { label: 'Leads', icon: MdAssignmentInd, href: '/comercial/leads' },
      { label: 'Clientes', icon: MdPeople, href: '/comercial/clientes' },
      { label: 'Campañas', icon: MdCampaign, href: '/comercial/campanas' },
      { label: 'Segmentación', icon: MdPieChart, href: '/comercial/segmentacion' },
    ],
  },
  {
    section: 'Cartera',
    items: [
      { label: 'Pólizas', icon: MdDescription, href: '/comercial/polizas' },
      { label: 'Siniestros', icon: MdWarning, href: '/comercial/siniestros' },
    ],
  },
  {
    section: 'Herramientas',
    items: [{ label: 'Simulador', icon: GiProcessor, href: '/comercial/simulador' }],
  },
];

// 2. Datos del usuario empleado
const employeeUser = {
  name: 'Agente Comercial',
  email: 'agente@empresa.com',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={employeeMenu} user={employeeUser} />
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
