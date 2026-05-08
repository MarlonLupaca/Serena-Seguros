'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

import { MdChevronLeft, MdChevronRight, MdLogout, MdMenu, MdClose, MdPerson } from 'react-icons/md';

export default function Sidebar({ menus, user }) {
  const [collapsed, setCollapsed] = useState(false);
  const [active, setActive] = useState(menus[0]?.items[0]?.label || '');
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <>
      {/* BOTÓN MÓVIL */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-41 p-2 rounded-lg bg-primary text-white shadow-lg lg:hidden"
      >
        <MdMenu size={24} />
      </button>

      {/* OVERLAY */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-50 lg:hidden" onClick={() => setIsOpen(false)} />}

      <div className="h-full flex bg-bg-soft rounded-2xl">
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
                  ${collapsed && !isOpen ? 'max-w-0 opacity-0 ml-0' : 'max-w-50 opacity-100 ml-1'}
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
            {menus.map(({ section, items }) => (
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

          {/* FOOTER */}
          <div
            className={`border-t border-border p-3 flex flex-col gap-2 ${collapsed ? 'items-center lg:items-center' : ''}`}
          >
            <div className={`flex items-center gap-3 ${collapsed ? 'justify-center lg:justify-center' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <MdPerson size={18} className="text-primary" />
              </div>
              {(!collapsed || isOpen) && (
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold text-text truncate">{user.name}</span>
                  <span className="text-xs text-text-soft truncate">{user.email}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              title={collapsed ? 'Cerrar sesión' : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium
                text-text-soft hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer
                ${collapsed ? 'justify-center lg:justify-center px-0' : ''}
              `}
            >
              <MdLogout size={18} className="shrink-0" />
              {(!collapsed || isOpen) && <span>Cerrar sesión</span>}
            </button>
          </div>
        </aside>
      </div>
    </>
  );
}
