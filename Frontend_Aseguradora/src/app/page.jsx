'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { 
  MdPerson, MdMenu, MdClose, MdDirectionsCar, 
  MdFavorite, MdLocalHospital, MdShield, 
  MdArrowForward, MdCheckCircle, MdLocalOffer
} from 'react-icons/md';

const navItems = [
  { label: 'Seguros para ti', href: '#' },
  { label: 'Seguros para empresas', href: '#' },
  { label: 'Siniestros', href: '#' },
  { label: 'Promociones', href: '#' },
  { label: 'Atención al cliente', href: '#' },
];

const services = [
  { id: 1, title: 'Seguro Vehicular', desc: 'Maneja protegido todo el año con coberturas exclusivas.', icon: MdDirectionsCar, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 2, title: 'Seguro de Vida', desc: 'Protege a los que más amas y obtén beneficios en vida.', icon: MdFavorite, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 3, title: 'Seguro de Salud', desc: 'Emergencias y atenciones cubiertas en la mejor red de clínicas.', icon: MdLocalHospital, color: 'text-teal-500', bg: 'bg-teal-50' },
  { id: 4, title: 'SOAT Digital', desc: 'Adquiérelo en minutos y evita multas. 100% online.', icon: MdShield, color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="bg-bg min-h-screen font-sans">
      {/* Top Promotion Bar */}
      <div className="bg-primary text-white py-2 px-4 text-center text-sm font-medium flex items-center justify-center gap-2">
        <MdLocalOffer size={18} />
        <span>¡SOAT con descuento especial desde S/47.00! Adquiérelo hoy mismo.</span>
        <Link href="#" className="underline ml-2 font-bold hover:text-blue-100 transition-colors">Ver promoción</Link>
      </div>

      {/* Header */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 relative">
              <Image src="/img/logo.png" fill alt="logo" className="object-contain" />
            </div>
            <span className="text-text font-bold text-xl tracking-wide whitespace-nowrap">
              Serena <span className="text-primary">Seguros</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-text-soft hover:text-primary transition-colors duration-200 whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-text-soft hover:text-primary transition-colors duration-200 whitespace-nowrap"
            >
              <MdPerson size={20} />
              Iniciar sesión
            </Link>
            <Link
              href="/cotizar"
              className="bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              Cotizar ahora
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Abrir menú"
            className="lg:hidden p-2 -mr-1 rounded-lg hover:bg-bg-soft transition-colors text-text"
          >
            {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`lg:hidden absolute top-[100%] left-0 w-full z-50 transition-all duration-300 ease-in-out origin-top ${
            mobileOpen
              ? 'opacity-100 scale-y-100 pointer-events-auto'
              : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <div className="mx-4 mt-2 mb-4 rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
            <nav className="flex flex-col p-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-base font-medium text-text hover:text-primary hover:bg-bg-soft px-4 py-3 rounded-xl transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border mt-2 pt-4 px-2 pb-2 flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 text-base font-medium text-text hover:text-primary py-3 rounded-xl hover:bg-bg-soft transition-colors border border-border"
                >
                  <MdPerson size={20} />
                  Iniciar sesión
                </Link>

                <Link
                  href="#"
                  onClick={() => setMobileOpen(false)}
                  className="bg-primary hover:bg-primary-hover text-white text-base font-semibold py-3 rounded-xl text-center transition-all shadow-md"
                >
                  Cotizar gratis
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* HERO SECTION */}
        <section className="relative w-full h-[600px] flex items-center overflow-hidden">
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/img/hero_bg.png" 
              alt="Familia feliz" 
              fill 
              priority
              className="object-cover object-center lg:object-right"
              quality={100}
            />
            {/* Overlay Gradient for Text readability */}
            <div className="absolute inset-0 hero-gradient"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
            <div className="max-w-xl">
              <span className="inline-block py-1 px-3 rounded-full bg-teal-100 text-teal-800 text-sm font-semibold mb-4 tracking-wide">
                Protección 360°
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-text leading-tight mb-6">
                Seguros pensados <br/>
                <span className="text-primary">para ti y tu familia</span>
              </h1>
              <p className="text-lg md:text-xl text-text-soft mb-8 max-w-md">
                Asegura tu bienestar, tus bienes y tu futuro con planes 100% personalizados y asistencia 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                  Cotizar mi seguro
                  <MdArrowForward size={20} />
                </button>
                <button className="bg-white hover:bg-gray-50 text-text border border-border px-8 py-4 rounded-full font-bold text-lg transition-all shadow-sm hover:shadow-md flex items-center justify-center">
                  Conoce más
                </button>
              </div>
              
              <div className="mt-10 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <MdCheckCircle className="text-green-500" size={24} />
                  <span className="text-sm font-medium text-text-soft">100% Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <MdCheckCircle className="text-green-500" size={24} />
                  <span className="text-sm font-medium text-text-soft">Respaldo Total</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="py-20 bg-bg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">Encuentra el seguro ideal para ti</h2>
              <p className="text-lg text-text-soft max-w-2xl mx-auto">
                Explora nuestras opciones diseñadas para cubrir cada aspecto importante de tu vida con la mejor red de atención del país.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {services.map((service) => (
                <div key={service.id} className="bg-white border border-border rounded-2xl p-8 hover-lift cursor-pointer flex flex-col h-full group">
                  <div className={`w-14 h-14 rounded-2xl ${service.bg} ${service.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                    <service.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-text mb-3">{service.title}</h3>
                  <p className="text-text-soft mb-6 flex-grow">{service.desc}</p>
                  <div className="flex items-center text-primary font-semibold group-hover:text-primary-hover transition-colors mt-auto">
                    Solicitar ahora <MdArrowForward className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PROMO BANNER INLINE */}
        <section className="py-12 bg-bg-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-gradient-pastel rounded-3xl p-8 md:p-12 shadow-sm border border-white/50 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="relative z-10 max-w-2xl">
                <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Campaña Exclusiva</span>
                <h2 className="text-3xl md:text-4xl font-bold text-text mb-4">
                  Seguro de Vida con Devolución Total
                </h2>
                <p className="text-lg text-text-soft mb-0">
                  Obtén hasta el doble de lo pagado mientras proteges a los que amas. <br className="hidden md:block" />
                  <strong>¡GRATIS hasta S/200 de bono de bienvenida!</strong>
                </p>
              </div>
              <div className="relative z-10 shrink-0 w-full md:w-auto">
                <button className="w-full md:w-auto bg-text hover:bg-gray-800 text-white px-8 py-4 rounded-full font-bold text-lg transition-transform hover:scale-105 shadow-xl">
                  Ver promoción
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-text text-white py-12 border-t border-gray-800 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 relative bg-white rounded-full p-1">
                <Image src="/img/logo.png" fill alt="logo" className="object-contain p-1" />
              </div>
              <span className="font-bold text-xl tracking-wide">Serena Seguros</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Comprometidos con brindarte la mejor protección y tranquilidad para ti, tu familia y tu empresa.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-lg mb-4">Seguros</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Vehicular</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Vida</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Salud</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Hogar</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">SOAT</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Enlaces Útiles</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="#" className="hover:text-primary transition-colors">Siniestros</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Promociones</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Red de clínicas</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Pago en línea</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Facturación electrónica</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Atención al cliente: <br/><strong>(01) 513 5000</strong></li>
              <li>Emergencias 24/7: <br/><strong>(01) 415 1515</strong></li>
              <li>WhatsApp: <br/><strong>955 511 678</strong></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Serena Seguros. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}
