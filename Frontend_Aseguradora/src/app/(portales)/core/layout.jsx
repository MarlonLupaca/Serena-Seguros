'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';
import { useGuard } from '@/lib/useGuard';

import {
  MdHome,
  MdPeople,
  MdAssignmentTurnedIn,
  MdEditDocument,
  MdAutorenew,
  MdWarning,
  MdFactCheck,
  MdAssuredWorkload,
  MdHandshake,
  MdFolder,
  MdTune,
  MdInbox,
  MdMonetizationOn,
  MdCategory,
} from 'react-icons/md';

const segurosMenu = [
  {
    section: 'Principal',
    items: [
      { label: 'Inicio', icon: MdHome, href: '/core' },
      { label: 'Bandeja', icon: MdInbox, href: '/core/bandeja' },
    ],
  },
  {
    section: 'Pólizas',
    items: [{ label: 'Emisiones', icon: MdAssignmentTurnedIn, href: '/core/emisiones' }],
  },
  {
    section: 'Siniestros',
    items: [
      { label: 'Siniestros', icon: MdWarning, href: '/core/siniestros' },
      { label: 'Validaciones', icon: MdFactCheck, href: '/core/validaciones' },
    ],
  },
  {
    section: 'Operaciones',
    items: [
      { label: 'Reaseguro', icon: MdAssuredWorkload, href: '/core/reaseguro' },
      { label: 'Proveedores', icon: MdHandshake, href: '/core/proveedores' },
      { label: 'Documentos', icon: MdFolder, href: '/core/documentos' },
    ],
  },
  {
    section: 'Configuración',
    items: [{ label: 'Tarifas', icon: MdMonetizationOn, href: '/core/tarifas' }],
  },
];

export default function DashboardLayout({ children }) {
  const { user, autorizado } = useGuard('TECNICO');

  if (!autorizado) return null;

  const sidebarUser = {
    name: `${user.nombres} ${user.apellidos}`,
    email: user.username,
  };

  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={segurosMenu} user={sidebarUser} />
      </div>

      {/* CONTENIDO */}
      <main className="w-full overflow-y-auto">
        {/* HEADER REUTILIZABLE PARA SEGUROS / CORE */}
        <AppHeader
          title="Portal de Seguros"
          subtitle="Producción y Operaciones"
          searchPlaceholder="Buscar pólizas, siniestros, DNI..."
          indicatorTitle="SLA en riesgo"
          indicatorValue="3 siniestros"
        />
        <div className="px-8">{children}</div>
      </main>
    </div>
  );
}
