'use client';

import Sidebar from '../componentsMain/Sidebar';
import AppHeader from '../componentsMain/AppHeader';

import { MdShield, MdDescription, MdWarning, MdPayment, MdFolder, MdPerson, MdHome, MdPostAdd } from 'react-icons/md';

// 1. Configuramos el menú específico para el Cliente
const clientMenu = [
  {
    section: 'Principal',
    items: [
      { label: 'Inicio', icon: MdHome, href: '/asegurado' },
      { label: 'Cotizar seguros', icon: MdShield, href: '/asegurado/seguros' },
      { label: 'Mis pólizas', icon: MdDescription, href: '/asegurado/polizas' },
      { label: 'Solicitar endoso', icon: MdPostAdd, href: '/asegurado/endeso' },
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
    section: 'Documentos',
    items: [{ label: 'Mis documentos', icon: MdFolder, href: '/asegurado/documentos' }],
  },
  {
    section: 'Cuenta',
    items: [{ label: 'Perfil', icon: MdPerson, href: '/asegurado/perfil' }],
  },
];

// 2. Datos del usuario cliente
const clientUser = {
  name: 'Juan Pérez',
  email: 'juan@correo.com',
};

export default function DashboardLayout({ children }) {
  return (
    <div className="h-screen w-screen bg-transparent flex overflow-hidden">
      {/* SIDEBAR REUTILIZABLE */}
      <div className="h-screen lg:p-3">
        <Sidebar menus={clientMenu} user={clientUser} />
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
