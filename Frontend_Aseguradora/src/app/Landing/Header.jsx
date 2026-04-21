import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MdPerson, MdMenu, MdClose, MdPhone, MdCampaign } from 'react-icons/md';
import { navItems } from './data';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Estados para simular los menús desplegables de los nuevos íconos
  const [activeMenu, setActiveMenu] = useState(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  // Función para cerrar menús al hacer click fuera o al seleccionar
  const toggleMenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  return (
    <header
      className={`sticky top-0 z-50 bg-white/95 backdrop-blur-lg transition-all duration-300 ${
        scrolled ? 'shadow-[0_2px_24px_rgba(11,60,93,0.08)] border-b border-border' : 'border-b border-transparent'
      }`}
    >
      {/* Se ajustó la altura a min-h para mayor flexibilidad y los gaps en móvil */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-17.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0">
            <Image
              src="/img/logo.png"
              width={40}
              height={40}
              alt="logo"
              className="h-7 sm:h-8 object-contain w-fit shrink-0"
            />
            {/* Texto responsivo: más pequeño en móvil, grande en sm */}
            <span className="text-text font-bold text-lg sm:text-xl tracking-wide whitespace-nowrap">
              Serena <span className="text-primary">Seguros</span>
            </span>
          </div>
        </Link>

        {/* NAVIGATION DESKTOP */}
        <nav className="hidden lg:flex items-center gap-7">
          {navItems.map((i) => (
            <Link
              key={i.label}
              href={i.href}
              className="text-sm font-medium text-text-soft hover:text-primary transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all hover:after:w-full"
            >
              {i.label}
            </Link>
          ))}
        </nav>

        {/* ACTIONS (Iconos estilo Pacífico) */}
        <div className="flex items-center gap-1 sm:gap-4 shrink-0">
          {/* Teléfonos / Consultas */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('tel')}
              className="p-1.5 sm:p-2 text-text-soft hover:text-primary hover:bg-bg-soft rounded-full transition-colors"
            >
              <MdPhone size={24} />
            </button>
            {activeMenu === 'tel' && (
              /* Ancho dinámico para no desbordar en móvil */
              <div className="absolute right-0 mt-2 w-50  sm:w-64 bg-white border border-border shadow-xl rounded-2xl p-4 z-50">
                <p className="text-xs font-bold text-primary uppercase mb-2">Consultas y Ventas</p>
                <p className="text-sm font-semibold text-text mb-4">(01) 513 5000</p>
                <p className="text-xs font-bold text-red-500 uppercase mb-2">Emergencias</p>
                <p className="text-sm font-semibold text-text">(01) 415 1515</p>
              </div>
            )}
          </div>

          {/* Login (Solo Icono) */}
          <Link
            href="/login"
            className="p-1.5 sm:p-2 text-text-soft hover:text-primary hover:bg-bg-soft rounded-full transition-colors"
            title="Iniciar sesión"
          >
            <MdPerson size={26} />
          </Link>

          {/* Novedades / Promociones */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('news')}
              className="p-1.5 sm:p-2 text-text-soft hover:text-primary hover:bg-bg-soft rounded-full transition-colors"
            >
              <MdCampaign size={24} />
            </button>
            {activeMenu === 'news' && (
              /* Ancho dinámico para no desbordar en móvil */
              <div className="absolute right-0 mt-2 w-50 sm:w-72 bg-white border border-border shadow-xl rounded-2xl p-4 z-50">
                <p className="text-sm font-bold text-text mb-2">Novedades</p>
                <div className="space-y-3">
                  <div className="text-xs p-2 bg-bg-soft rounded-lg">
                    <span className="font-bold block text-primary">Seguro Vehicular</span>
                    ¡33% de dcto. solo por hoy!
                  </div>
                  <div className="text-xs p-2 bg-bg-soft rounded-lg">
                    <span className="font-bold block text-primary">SOAT</span>
                    Cómpralo desde S/47.00
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Menú Mobile Toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl hover:bg-bg-soft text-text transition-colors"
          >
            {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`lg:hidden absolute left-4 right-4 mt-1 z-50 transition-all duration-200 origin-top ${
          mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-95 pointer-events-none'
        }`}
      >
        {/* Se añadió max-height y overflow por si el usuario tiene el móvil en horizontal */}
        <div className="bg-white rounded-2xl border border-border shadow-2xl overflow-hidden max-h-[80vh] overflow-y-auto">
          <nav className="flex flex-col p-2">
            {navItems.map((i) => (
              <Link
                key={i.label}
                href={i.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-text hover:text-primary hover:bg-bg-soft transition-colors"
              >
                {i.label}
              </Link>
            ))}
            <div className="border-t border-border mt-2 pt-2">
              <Link
                onClick={() => setMobileOpen(false)}
                href="/login"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-text hover:text-primary hover:bg-bg-soft transition-colors rounded-xl"
              >
                <MdPerson size={20} /> Mi Cuenta (Iniciar sesión)
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
