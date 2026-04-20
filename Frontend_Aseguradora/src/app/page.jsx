'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import {
  MdPerson,
  MdMenu,
  MdClose,
  MdDirectionsCar,
  MdFavorite,
  MdLocalHospital,
  MdShield,
  MdArrowForward,
  MdCheckCircle,
  MdLocalOffer,
  MdFlight,
  MdHome,
  MdPets,
  MdSupportAgent,
  MdPhoneInTalk,
  MdWhatsapp,
  MdStar,
  MdLock,
  MdBolt,
  MdVerified,
  MdLocationOn,
  MdEmail,
  MdArrowOutward,
  MdFacebook,
  MdOutlineKeyboardArrowRight,
} from 'react-icons/md';
import { FaInstagram, FaLinkedin, FaYoutube, FaTiktok, FaApple, FaGooglePlay } from 'react-icons/fa';

const navItems = [
  { label: 'Seguros para ti', href: '#seguros' },
  { label: 'Empresas', href: '#empresas' },
  { label: 'Siniestros', href: '#siniestros' },
  { label: 'Promociones', href: '#promos' },
  { label: 'Atención al cliente', href: '#contacto' },
];

const quoteTabs = [
  { id: 'auto', label: 'Vehicular', icon: MdDirectionsCar },
  { id: 'soat', label: 'SOAT', icon: MdShield },
  { id: 'vida', label: 'Vida', icon: MdFavorite },
  { id: 'salud', label: 'Salud', icon: MdLocalHospital },
  { id: 'viajes', label: 'Viajes', icon: MdFlight },
  { id: 'hogar', label: 'Hogar', icon: MdHome },
  { id: 'mascot', label: 'Mascotas', icon: MdPets },
];

const services = [
  {
    title: 'Seguro Vehicular',
    desc: 'Maneja tranquilo con la red más grande de talleres y grúa 24/7.',
    icon: MdDirectionsCar,
    tag: 'Más vendido',
  },
  {
    title: 'SOAT Digital',
    desc: 'Compra en 3 minutos y recíbelo al instante en tu correo.',
    icon: MdShield,
    tag: 'Desde S/47',
  },
  { title: 'Seguro de Vida', desc: 'Protege a los que amas y recibe hasta el 100% de lo pagado.', icon: MdFavorite },
  {
    title: 'Seguro de Salud',
    desc: 'Atención en las mejores clínicas del país con copagos bajos.',
    icon: MdLocalHospital,
  },
  { title: 'Viajes', desc: 'Cobertura internacional con asistencia médica ilimitada.', icon: MdFlight },
  { title: 'Hogar', desc: 'Tu casa protegida ante robo, incendio y desastres naturales.', icon: MdHome },
  { title: 'Mascotas', desc: 'Consultas, vacunas y emergencias para tu engreído.', icon: MdPets, tag: 'Nuevo' },
  { title: 'Empresas', desc: 'Seguros corporativos hechos a la medida de tu negocio.', icon: MdVerified },
];

const stats = [
  { n: '+1.2M', l: 'clientes protegidos' },
  { n: '+35', l: 'años de experiencia' },
  { n: '24/7', l: 'asistencia inmediata' },
  { n: '4.8★', l: 'satisfacción promedio' },
];

const benefits = [
  { icon: MdBolt, t: 'Cotización en 3 minutos', d: '100% online, sin papeleos ni llamadas interminables.' },
  { icon: MdSupportAgent, t: 'Asistencia 24/7', d: 'Un equipo humano siempre disponible para ayudarte.' },
  { icon: MdLock, t: 'Pagos seguros', d: 'Transacciones encriptadas y múltiples medios de pago.' },
  { icon: MdVerified, t: 'Respaldo SBS', d: 'Regulados por la Superintendencia de Banca y Seguros.' },
];

const promos = [
  {
    badge: 'Hasta 30% OFF',
    title: 'Seguro Vehicular Full',
    desc: 'Llantas, lunas y auto sustituto incluidos.',
    color: 'from-[#0033a0] to-[#00b5e2]',
  },
  {
    badge: 'Desde S/47',
    title: 'SOAT Digital 2026',
    desc: 'Recíbelo en minutos en tu correo.',
    color: 'from-[#00b5e2] to-[#0099c2]',
  },
  {
    badge: '2x1',
    title: 'Viajes Internacionales',
    desc: 'Lleva un acompañante sin costo este verano.',
    color: 'from-[#001a4d] to-[#0033a0]',
  },
];

const testimonials = [
  {
    name: 'María Gutiérrez',
    role: 'Cliente vehicular',
    text: 'La atención fue rapidísima cuando tuve el choque. En menos de 30 min tenía grúa y taller asignado.',
  },
  {
    name: 'Jorge Ramírez',
    role: 'Cliente SOAT',
    text: 'Compré mi SOAT desde el celular en el estacionamiento. Increíblemente simple.',
  },
  {
    name: 'Lucía Pérez',
    role: 'Cliente de salud',
    text: 'La red de clínicas es excelente y nunca he tenido problemas con los reembolsos.',
  },
];

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('auto');

  return (
    <div className="min-h-screen font-sans  text-text">
      {/* Barra superior */}
      <div className="bg-[color:var(--color-bg-deep)] text-white/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-9 flex items-center justify-between gap-4">
          <div className="hidden md:flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MdPhoneInTalk size={14} /> (01) 513-5000
            </span>
            <span className="flex items-center gap-1.5">
              <MdWhatsapp size={14} /> 955 511 678
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="#" className="hover:text-accent transition-colors">
              Red de clínicas
            </Link>
            <Link href="#" className="hover:text-accent transition-colors">
              Siniestros
            </Link>
            <Link href="#" className="hover:text-accent transition-colors">
              Pago en línea
            </Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-9 w-9 relative">
              <Image src="/img/logo.png" fill alt="logo" className="object-contain" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              Serena <span className="text-primary">Seguros</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navItems.map((i) => (
              <Link
                key={i.label}
                href={i.href}
                className="text-sm font-medium text-text-soft hover:text-primary transition-colors relative group"
              >
                {i.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-semibold text-text hover:text-primary transition-colors"
            >
              <MdPerson size={20} /> Iniciar sesión
            </Link>
            <Link href="/cotizar" className="btn-primary text-sm">
              Cotizar ahora
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menú"
            className="lg:hidden p-2 -mr-1 rounded-lg hover:bg-bg-soft text-text"
          >
            {mobileOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>

        {/* Mobile */}
        <div
          className={`lg:hidden transition-all duration-300 origin-top ${mobileOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'}`}
        >
          <div className="mx-4 mb-4 rounded-2xl border border-border bg-white shadow-xl overflow-hidden">
            <nav className="flex flex-col p-2">
              {navItems.map((i) => (
                <Link
                  key={i.label}
                  href={i.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 rounded-xl text-text hover:text-primary hover:bg-bg-soft font-medium"
                >
                  {i.label}
                </Link>
              ))}
              <div className="border-t border-border mt-2 pt-3 px-2 pb-2 flex flex-col gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border font-medium"
                >
                  <MdPerson size={20} /> Iniciar sesión
                </Link>
                <Link href="/cotizar" onClick={() => setMobileOpen(false)} className="btn-primary text-center">
                  Cotizar ahora
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden hero-bg text-white">
          <span className="hero-blob bg-[#00b5e2] w-[500px] h-[500px] -top-40 -right-32"></span>
          <span className="hero-blob bg-[#ffcb05]/40 w-[360px] h-[360px] bottom-[-80px] left-[30%]"></span>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-28 lg:pt-24 lg:pb-36 grid lg:grid-cols-2 gap-12 items-center">
            <div className="fade-up">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold tracking-wider uppercase text-[color:var(--color-accent)]">
                <MdBolt size={14} /> Protección 360°
              </span>
              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
                Protege lo que más <br />
                importa,<span className="text-[color:var(--color-accent)]"> cotiza en minutos.</span>
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-lg">
                Seguros vehiculares, de vida, salud, viajes y más. 100% online, con asistencia humana cuando la
                necesites.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/cotizar" className="btn-accent flex items-center gap-2">
                  Cotizar mi seguro <MdArrowForward size={18} />
                </Link>
                <Link href="#seguros" className="btn-ghost flex items-center gap-2">
                  Conoce nuestros planes
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="flex items-center gap-2">
                  <MdCheckCircle className="text-[color:var(--color-accent)]" size={20} /> 100% Online
                </span>
                <span className="flex items-center gap-2">
                  <MdCheckCircle className="text-[color:var(--color-accent)]" size={20} /> Regulado por SBS
                </span>
                <span className="flex items-center gap-2">
                  <MdCheckCircle className="text-[color:var(--color-accent)]" size={20} /> Asistencia 24/7
                </span>
              </div>
            </div>

            {/* Tarjeta cotizador */}
            <div className="relative fade-up">
              <div className="absolute -inset-4 bg-white/10 rounded-[28px] blur-2xl"></div>
              <div className="relative bg-white text-text rounded-3xl shadow-2xl p-6 md:p-8 border border-white/60">
                <h3 className="font-bold text-lg">Cotiza tu seguro</h3>
                <p className="text-sm text-text-soft">Elige el tipo de seguro que necesitas</p>

                <div className="mt-5 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {quoteTabs.map((t) => {
                    const Icon = t.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`tab-pill text-sm ${activeTab === t.id ? 'active' : ''}`}
                      >
                        <Icon size={18} /> {t.label}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="flex flex-col">
                    <span className="text-xs font-semibold text-text-soft mb-1.5">DNI</span>
                    <input
                      type="text"
                      placeholder="Ingresa tu DNI"
                      className="rounded-xl border border-border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="text-xs font-semibold text-text-soft mb-1.5">Celular</span>
                    <input
                      type="tel"
                      placeholder="9XX XXX XXX"
                      className="rounded-xl border border-border px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-sm"
                    />
                  </label>
                </div>

                <label className="flex items-start gap-2 mt-4 text-xs text-text-soft">
                  <input type="checkbox" className="mt-0.5 accent-[color:var(--color-primary)]" />
                  Acepto las{' '}
                  <Link href="#" className="text-primary underline">
                    políticas de privacidad
                  </Link>
                  .
                </label>

                <button className="btn-primary w-full mt-5 flex items-center justify-center gap-2">
                  Continuar cotización <MdArrowForward size={18} />
                </button>

                <p className="mt-3 text-xs text-text-mute text-center">
                  ¿Necesitas ayuda? Llámanos al <strong className="text-text">(01) 513-5000</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Onda decorativa */}
          <svg className="block w-full" viewBox="0 0 1440 80" preserveAspectRatio="none" aria-hidden>
            <path d="M0,48 C360,96 1080,0 1440,48 L1440,80 L0,80 Z" fill="#ffffff" />
          </svg>
        </section>

        {/* STATS */}
        <section className="-mt-10 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-3xl shadow-[0_30px_60px_-30px_rgba(0,51,160,0.25)] border border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {stats.map((s, i) => (
                <div key={i} className="py-8 px-4 text-center">
                  <div className="text-3xl md:text-4xl font-extrabold text-primary">{s.n}</div>
                  <div className="text-sm text-text-soft mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEGUROS */}
        <section id="seguros" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="max-w-2xl mb-12">
              <span className="eyebrow">Nuestros seguros</span>
              <h2 className="section-title mt-2">Encuentra el seguro ideal para cada momento de tu vida</h2>
              <p className="mt-4 text-text-soft text-lg">
                Desde tu auto hasta tu familia — elige la cobertura perfecta y cotiza en línea en pocos minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="card p-7 flex flex-col group relative">
                    {s.tag && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-[color:var(--color-yellow)] text-[color:var(--color-text)]">
                        {s.tag}
                      </span>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white transition-colors">
                      <Icon size={28} />
                    </div>
                    <h3 className="text-lg font-bold">{s.title}</h3>
                    <p className="mt-2 text-sm text-text-soft flex-grow">{s.desc}</p>
                    <Link
                      href="#"
                      className="mt-5 text-primary font-semibold text-sm inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                    >
                      Cotizar <MdArrowForward size={16} />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BENEFICIOS */}
        <section className="py-20 md:py-28 bg-bg-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">Por qué elegirnos</span>
              <h2 className="section-title mt-2">Una experiencia simple y confiable</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.t} className="card p-7 text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-accent/15 text-accent flex items-center justify-center mb-4">
                      <Icon size={26} />
                    </div>
                    <h3 className="font-bold">{b.t}</h3>
                    <p className="text-sm text-text-soft mt-2">{b.d}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROMOS */}
        <section id="promos" className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
              <div>
                <span className="eyebrow">Promociones</span>
                <h2 className="section-title mt-2">Ofertas por tiempo limitado</h2>
              </div>
              <Link
                href="#"
                className="text-primary font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Ver todas <MdArrowForward size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {promos.map((p) => (
                <article
                  key={p.title}
                  className={`relative overflow-hidden rounded-3xl p-8 text-white bg-gradient-to-br ${p.color} min-h-[280px] flex flex-col justify-end group`}
                >
                  <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 group-hover:scale-110 transition-transform"></div>
                  <span className="relative inline-flex self-start items-center gap-1 px-3 py-1 rounded-full bg-[color:var(--color-yellow)] text-[color:var(--color-text)] text-xs font-bold uppercase tracking-wider mb-4">
                    <MdLocalOffer size={14} /> {p.badge}
                  </span>
                  <h3 className="relative text-2xl font-extrabold">{p.title}</h3>
                  <p className="relative mt-1 text-white/85 text-sm">{p.desc}</p>
                  <Link
                    href="#"
                    className="relative mt-5 inline-flex items-center gap-1 text-sm font-bold group-hover:gap-2 transition-all"
                  >
                    Ver promoción <MdArrowOutward size={16} />
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* SINIESTROS */}
        <section
          id="siniestros"
          className="py-20 md:py-28 bg-[color:var(--color-bg-deep)] text-white relative overflow-hidden"
        >
          <span className="hero-blob bg-[#00b5e2] w-[420px] h-[420px] -top-32 -right-20 opacity-40"></span>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center relative">
            <div>
              <span className="eyebrow">¿Tuviste un siniestro?</span>
              <h2 className="section-title text-white mt-2">Estamos contigo las 24 horas</h2>
              <p className="mt-4 text-white/80 text-lg max-w-xl">
                Reporta tu caso en línea o llámanos. Nuestro equipo resolverá tu emergencia lo antes posible.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#" className="btn-accent inline-flex items-center gap-2">
                  Reportar siniestro <MdArrowForward size={18} />
                </Link>
                <Link href="#" className="btn-ghost inline-flex items-center gap-2">
                  <MdPhoneInTalk size={18} /> (01) 415 1515
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { n: '1', t: 'Mantén la calma', d: 'Revisa que todos estén bien y toma fotos del lugar.' },
                { n: '2', t: 'Llámanos', d: 'Te guiamos en cada paso desde el primer minuto.' },
                { n: '3', t: 'Reporta online', d: 'Sube tus documentos desde la app o el portal.' },
                { n: '4', t: 'Solución rápida', d: 'Asignamos taller, grúa o atención médica.' },
              ].map((s) => (
                <div key={s.n} className="rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur">
                  <div className="text-3xl font-extrabold text-[color:var(--color-accent)]">{s.n}</div>
                  <div className="mt-1 font-bold">{s.t}</div>
                  <div className="text-sm text-white/70 mt-1">{s.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section className="py-20 md:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="eyebrow">Testimonios</span>
              <h2 className="section-title mt-2">Lo que dicen nuestros clientes</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="card p-7">
                  <div className="flex gap-0.5 text-[color:var(--color-yellow)] mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MdStar key={i} size={20} />
                    ))}
                  </div>
                  <p className="text-text-soft">“{t.text}”</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{t.name}</div>
                      <div className="text-xs text-text-mute">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* APP */}
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-[32px] overflow-hidden relative bg-gradient-to-br from-[#0033a0] via-[#0033a0] to-[#00b5e2] text-white p-10 md:p-16 grid md:grid-cols-2 gap-10 items-center">
              <span className="hero-blob bg-[#ffcb05]/50 w-80 h-80 -top-10 -left-10"></span>
              <div className="relative">
                <span className="eyebrow text-white/80">Serena App</span>
                <h2 className="section-title text-white mt-2">Toda tu protección en la palma de tu mano</h2>
                <p className="mt-4 text-white/85 text-lg">
                  Gestiona tus pólizas, reporta siniestros, paga cuotas y accede a tu seguro desde donde estés.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="#"
                    className="inline-flex items-center gap-3 bg-black/80 hover:bg-black text-white px-5 py-3 rounded-2xl transition-colors"
                  >
                    <FaApple size={26} />
                    <span className="text-left">
                      <div className="text-[10px] opacity-80">Descarga en</div>
                      <div className="font-bold -mt-0.5">App Store</div>
                    </span>
                  </Link>
                  <Link
                    href="#"
                    className="inline-flex items-center gap-3 bg-black/80 hover:bg-black text-white px-5 py-3 rounded-2xl transition-colors"
                  >
                    <FaGooglePlay size={22} />
                    <span className="text-left">
                      <div className="text-[10px] opacity-80">Disponible en</div>
                      <div className="font-bold -mt-0.5">Google Play</div>
                    </span>
                  </Link>
                </div>
              </div>
              <div className="relative flex justify-center md:justify-end">
                <div className="relative w-64 h-[420px] md:w-72 md:h-[480px] rounded-[36px] bg-white/10 border border-white/30 backdrop-blur-xl shadow-2xl p-4">
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 bg-black/30 rounded-full"></div>
                  <div className="mt-8 space-y-3">
                    <div className="h-10 rounded-xl bg-white/25"></div>
                    <div className="h-24 rounded-2xl bg-white/35"></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="h-20 rounded-xl bg-white/25"></div>
                      <div className="h-20 rounded-xl bg-white/25"></div>
                    </div>
                    <div className="h-16 rounded-xl bg-white/25"></div>
                    <div className="h-12 rounded-xl bg-[color:var(--color-yellow)]/90"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="contacto" className="py-16 bg-bg-soft">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="eyebrow">¿Listo para empezar?</span>
            <h2 className="section-title mt-2">Cotiza tu seguro hoy y obtén tu mejor tarifa</h2>
            <p className="mt-4 text-text-soft text-lg">Rápido, simple y sin letras chicas.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/cotizar" className="btn-primary inline-flex items-center gap-2">
                Cotizar ahora <MdArrowForward size={18} />
              </Link>
              <Link
                href="#"
                className="inline-flex items-center gap-2 font-semibold text-primary hover:text-primary-hover px-5 py-3"
              >
                <MdWhatsapp size={20} /> Escríbenos por WhatsApp
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-[color:var(--color-bg-deep)] text-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-10 w-10 relative bg-white rounded-full p-1.5">
                <Image src="/img/logo.png" fill alt="logo" className="object-contain p-1" />
              </div>
              <span className="font-extrabold text-xl text-white">Serena Seguros</span>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              Comprometidos con brindarte la mejor protección y tranquilidad para ti, tu familia y tu empresa.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[MdFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTiktok].map((Ic, i) => (
                <Link
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-accent hover:text-[#001a4d] flex items-center justify-center transition-colors"
                >
                  <Ic size={16} />
                </Link>
              ))}
            </div>
          </div>

          {[
            { h: 'Seguros', items: ['Vehicular', 'Vida', 'Salud', 'SOAT', 'Viajes', 'Hogar', 'Mascotas'] },
            {
              h: 'Ayuda',
              items: ['Siniestros', 'Promociones', 'Red de clínicas', 'Pago en línea', 'Facturación electrónica'],
            },
            {
              h: 'Empresa',
              items: ['Sobre nosotros', 'Sostenibilidad', 'Trabaja con nosotros', 'Transparencia', 'Prensa'],
            },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="font-bold text-white mb-4">{col.h}</h4>
              <ul className="space-y-2 text-sm">
                {col.items.map((it) => (
                  <li key={it}>
                    <Link href="#" className="hover:text-accent transition-colors inline-flex items-center gap-1 group">
                      <MdOutlineKeyboardArrowRight
                        className="opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all"
                        size={16}
                      />
                      {it}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-wrap items-center justify-between gap-4 text-xs text-white/60">
            <div className="flex flex-wrap items-center gap-4">
              <span className="flex items-center gap-1.5">
                <MdLocationOn size={14} /> Av. Juan de Arona 830, San Isidro, Lima
              </span>
              <span className="flex items-center gap-1.5">
                <MdEmail size={14} /> contacto@serenaseguros.pe
              </span>
            </div>
            <span>&copy; {new Date().getFullYear()} Serena Seguros. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
