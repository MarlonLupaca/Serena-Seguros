'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MdPerson, MdMenu, MdClose } from 'react-icons/md';

const navItems = [
  { label: 'Inicio', href: '#' },
  { label: 'Catálogo', href: '#' },
  { label: 'Cotizar', href: '#' },
  { label: 'Siniestros', href: '#' },
  { label: 'Contacto', href: '#' },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-bg min-h-screen">
      <header className="w-full bg-white border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 relative">
              <Image src="/img/logo.png" fill alt="logo" className="object-contain" />
            </div>
            <span className="text-text font-bold text-xl tracking-wide whitespace-nowrap">
              Serena <span className="text-primary">Seguros</span>
            </span>
          </Link>

          {/* NAV — desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-text-soft hover:text-text transition-colors duration-150 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ACCIONES — desktop */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm text-text-soft hover:text-text transition-colors duration-150 whitespace-nowrap"
            >
              <MdPerson size={18} />
              Iniciar sesión
            </Link>
            <Link
              href="/cotizar"
              className="bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold px-5 py-2 rounded-full transition-all duration-150 shadow-sm whitespace-nowrap"
            >
              Cotizar gratis
            </Link>
          </div>

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
            className="md:hidden p-2 -mr-1 rounded-lg hover:bg-bg-soft transition-colors text-text"
          >
            {mobileOpen ? <MdClose size={22} /> : <MdMenu size={22} />}
          </button>
        </div>

        {/* Mobile menu (overlay SIN fondo oscuro) */}
        <div
          className={`md:hidden absolute top-16 left-0 w-full z-50 transition-all duration-200 ${
            mobileOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <div className="mx-4 mt-2 rounded-2xl border border-border bg-white shadow-lg">
            <nav className="flex flex-col p-3 gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-text-soft hover:text-text hover:bg-bg-soft px-3 py-2.5 rounded-lg transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border mt-2 pt-3 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 text-sm text-text-soft hover:text-text px-3 py-2.5 rounded-lg hover:bg-bg-soft transition-colors"
                >
                  <MdPerson size={18} />
                  Iniciar sesión
                </Link>

                <Link
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold px-5 py-2.5 rounded-full text-center transition-all duration-150 shadow-sm"
                >
                  Cotizar gratis
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-bg-soft border border-border rounded-2xl p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-text">Bienvenido</h1>
          <p className="text-text-soft mt-2">Gestiona tus pólizas, siniestros y documentos desde un solo lugar.</p>
        </div>
      </main>
    </div>
  );
}
