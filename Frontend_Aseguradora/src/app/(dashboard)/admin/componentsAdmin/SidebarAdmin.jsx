'use client';

import Link from 'next/link';
import { useState } from 'react';

import {
  MdHome,
  MdPeople,
  MdAdminPanelSettings,
  MdDescription,
  MdWarning,
  MdPayment,
  MdSettings,
  MdAssessment,
  MdChevronLeft,
  MdChevronRight,
  MdLogout,
} from 'react-icons/md';

const menu = [
  {
    section: 'Principal',
    items: [
      { label: 'Dashboard', icon: MdHome, href: '/admin' },
      { label: 'Reportes', icon: MdAssessment, href: '/admin/reportes' },
    ],
  },
  {
    section: 'Usuarios',
    items: [
      { label: 'Usuarios', icon: MdPeople, href: '/admin/usuarios' },
      { label: 'Roles y permisos', icon: MdAdminPanelSettings, href: '/admin/roles' },
    ],
  },
  {
    section: 'Operaciones',
    items: [
      { label: 'Pólizas', icon: MdDescription, href: '/admin/polizas' },
      { label: 'Siniestros', icon: MdWarning, href: '/admin/siniestros' },
      { label: 'Pagos', icon: MdPayment, href: '/admin/pagos' },
    ],
  },
  {
    section: 'Sistema',
    items: [{ label: 'Configuración', icon: MdSettings, href: '/admin/configuracion' }],
  },
];

export default function SidebarAdmin() {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState('Dashboard');

  return (
    <div className="h-full flex bg-bg-soft rounded-2xl">
      <aside
        className={`relative flex flex-col bg-bg border-r rounded-2xl border-border transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-2.5 px-4 py-5 border-b border-border ${collapsed ? 'justify-center' : ''}`}
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 6V12L9 16L2.5 12V6L9 2Z" fill="white" />
            </svg>
          </div>
          {!collapsed && <span className="text-base font-bold text-text whitespace-nowrap">Admin Panel</span>}
        </div>

        {/* Toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="cursor-pointer absolute -right-3.5 top-[4.2rem] z-10 w-7 h-7 rounded-full flex items-center justify-center bg-bg border border-border text-text-soft hover:text-text hover:bg-bg-soft transition-colors shadow-sm"
        >
          {collapsed ? <MdChevronRight size={16} /> : <MdChevronLeft size={16} />}
        </button>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 flex flex-col">
          {menu.map(({ section, items }) => (
            <div key={section}>
              {!collapsed && (
                <span className="px-8 text-xs font-semibold uppercase tracking-wider text-text/40">{section}</span>
              )}
              <div className="mt-1 flex flex-col">
                {items.map(({ label, icon: Icon, href }) => {
                  const isActive = active === label;
                  return (
                    <Link
                      key={label}
                      href={href}
                      onClick={() => setActive(label)}
                      title={collapsed ? label : undefined}
                      className={`w-full flex items-center gap-3 px-8 py-2 text-sm font-medium transition-colors relative
                        ${isActive ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft hover:text-text'}
                        ${collapsed ? 'justify-center px-0' : ''}
                      `}
                    >
                      {isActive && <span className="absolute left-0 top-1 bottom-1 w-1 rounded-r-full bg-primary" />}
                      <Icon size={18} className="shrink-0" />
                      {!collapsed && <span>{label}</span>}
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
              <MdAdminPanelSettings size={18} className="text-primary" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-semibold text-text truncate">Administrador</span>
                <span className="text-xs text-text-soft truncate">admin@empresa.com</span>
              </div>
            )}
          </div>

          <Link
            href="/login"
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
  );
}
