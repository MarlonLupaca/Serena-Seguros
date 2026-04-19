'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import {
  MdHome,
  MdRequestQuote,
  MdDescription,
  MdWarning,
  MdTrackChanges,
  MdPayment,
  MdFolder,
  MdPerson,
  MdChevronLeft,
  MdChevronRight,
  MdLogout,
  MdMenu,
  MdClose,
} from 'react-icons/md';

const menu = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: MdHome, href: '/employee' },
      { label: 'Solicitudes', icon: MdRequestQuote, href: '/employee/solicitudes' },
    ],
  },
  {
    section: 'Pólizas',
    items: [
      { label: 'Gestión de pólizas', icon: MdDescription, href: '/employee/gestionPolizas' },
      { label: 'Clientes', icon: MdPerson, href: '/employee/clientes' },
    ],
  },
  {
    section: 'Siniestros',
    items: [
      { label: 'Siniestros', icon: MdWarning, href: '/employee/siniestros' },
      { label: 'Evaluaciones', icon: MdTrackChanges, href: '/employee/evaluaciones' },
    ],
  },
  {
    section: 'Documentos',
    items: [{ label: 'Validar documentos', icon: MdFolder, href: '/employee/validarDocumentos' }],
  },
  {
    section: 'Pagos',
    items: [{ label: 'Pagos y facturación', icon: MdPayment, href: '/employee/facturacion' }],
  },
];

export default function SidebarEmployee() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Ver seguros');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    console.log('Cerrando sesión...');
  };

  return (
    <>
      {/* BOTÓN MÓVIL */}
      <button
        onClick={() => setIsOpen(true)}
        className=" lg:hidden fixed top-4 left-4 z-41 p-2 rounded-lg bg-primary text-white shadow-lg"
      >
        <MdMenu size={24} />
      </button>

      {/* OVERLAY */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsOpen(false)} />}

      <div className="h-full flex bg-bg-soft rounded-2xl  ">
        <aside
          className={`
              fixed left-0 z-100 lg:relative h-full 
            flex flex-col bg-bg border-r rounded-2xl border-border transition-all duration-300
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} 
            ${collapsed ? 'lg:w-16' : 'lg:w-60 w-72'}
          `}
        >
          {/* LOGO */}
          <div
            className={`flex items-center justify-between px-4 py-5 border-b border-border ${
              collapsed ? 'lg:justify-center' : 'px-8'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Image
                src="/img/logo.png"
                width={500}
                height={500}
                alt="logo"
                className="h-7 object-contain w-fit shrink-0"
              />

              <span
                className={`
                  text-text font-bold text-[16px] tracking-wide whitespace-nowrap
                  transition-all duration-300 ease-in-out overflow-hidden
                  ${collapsed && !isOpen ? 'max-w-0 opacity-0 ml-0' : 'max-w-[200px] opacity-100 ml-1'}
                `}
              >
                Serena <span className="text-primary">Seguros</span>
              </span>
            </div>

            {/* Cerrar móvil */}
            <button onClick={() => setIsOpen(false)} className="lg:hidden text-text-soft">
              <MdClose size={24} />
            </button>
          </div>

          {/* TOGGLE DESKTOP */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden lg:flex cursor-pointer absolute -right-3.5 top-[4.2rem] z-10 w-7 h-7 rounded-full items-center justify-center bg-bg border border-border text-text-soft hover:text-text hover:bg-bg-soft transition-colors shadow-sm"
          >
            {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
          </button>

          {/* NAV */}
          <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col">
            {menu.map(({ section, items }) => (
              <div key={section}>
                {(!collapsed || isOpen) && (
                  <span className="px-8 text-xs font-semibold uppercase tracking-wider text-text/40">{section}</span>
                )}
                <div className="mt-1 flex flex-col">
                  {items.map(({ label, icon: Icon, href }) => {
                    const isActive = active === label;
                    return (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => {
                          setActive(label);
                          setIsOpen(false);
                        }}
                        title={collapsed ? label : undefined}
                        className={`w-full flex items-center gap-3 px-8 py-2 text-sm font-medium transition-colors relative
                          ${isActive ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft hover:text-text'}
                          ${collapsed ? 'lg:justify-center lg:px-0' : ''}
                        `}
                      >
                        {isActive && <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-primary" />}
                        <Icon size={18} className="shrink-0" />
                        {(!collapsed || isOpen) && <span>{label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className={`border-t border-border p-3 flex flex-col gap-2 ${collapsed ? 'items-center' : ''}`}>
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <MdPerson size={18} className="text-primary" />
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-text truncate">Analista</span>
                  <span className="text-xs text-text-soft truncate">analista@empresa.com</span>
                </div>
              )}
            </div>

            <Link
              href="/login"
              onClick={() => console.log('logout')}
              title={collapsed ? 'Cerrar sesión' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
              text-text-soft hover:bg-red-500/10 hover:text-red-500 transition-colors
              ${collapsed ? 'justify-center px-0' : ''}
            `}
            >
              <MdLogout size={18} />
              {!collapsed && <span>Cerrar sesión</span>}
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
