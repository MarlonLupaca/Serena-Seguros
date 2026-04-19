'use client';

import { useState } from 'react';
import {
  MdDirectionsCar,
  MdFavorite,
  MdHome,
  MdHealthAndSafety,
  MdArrowForward,
  MdCheck,
  MdStar,
  MdPeople,
  MdSecurity,
  MdTrendingUp,
  MdFlight,
  MdPets,
  MdBusiness,
  MdKeyboardArrowDown,
} from 'react-icons/md';

const seguros = [
  {
    id: 'auto',
    icon: MdDirectionsCar,
    tab: 'Auto',
    nombre: 'Seguro de Auto',
    tagline: 'Maneja sin preocupaciones',
    descripcion:
      'Protege tu vehículo ante accidentes, robos y daños a terceros. Cobertura completa en todo el territorio nacional.',
    badge: 'Más popular',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    beneficios: [
      'Cobertura ante choques y volcaduras',
      'Robo total y parcial',
      'Responsabilidad civil a terceros',
      'Asistencia en carretera 24/7',
    ],
    planes: ['Básico', 'Estándar', 'Full'],
    desde: 'S/ 45',
  },
  {
    id: 'salud',
    icon: MdHealthAndSafety,
    tab: 'Salud',
    nombre: 'Seguro de Salud',
    tagline: 'Tu bienestar, nuestra prioridad',
    descripcion:
      'Accede a atención médica de calidad sin preocuparte por los costos. Red de clínicas a nivel nacional.',
    badge: 'Recomendado',
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    beneficios: [
      'Consultas médicas ilimitadas',
      'Hospitalización y cirugías',
      'Maternidad y pediatría',
      'Telemedicina incluida',
    ],
    planes: ['Individual', 'Familiar', 'Premium'],
    desde: 'S/ 89',
  },
  {
    id: 'vida',
    icon: MdFavorite,
    tab: 'Vida',
    nombre: 'Seguro de Vida',
    tagline: 'Protege a quienes más quieres',
    descripcion:
      'Garantiza el futuro económico de tu familia ante cualquier eventualidad. Tranquilidad para los tuyos.',
    badge: null,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
    beneficios: [
      'Capital asegurado para beneficiarios',
      'Cobertura por invalidez total',
      'Enfermedades graves',
      'Ahorro + protección',
    ],
    planes: ['Esencial', 'Plus', 'Platinum'],
    desde: 'S/ 35',
  },
  {
    id: 'hogar',
    icon: MdHome,
    tab: 'Hogar',
    nombre: 'Seguro de Hogar',
    tagline: 'Tu casa, siempre protegida',
    descripcion: 'Cubre tu vivienda ante siniestros, robos y daños accidentales. Para propietarios e inquilinos.',
    badge: null,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    beneficios: [
      'Incendio y daños estructurales',
      'Robo de contenido del hogar',
      'Fenómenos naturales',
      'Asistencia técnica urgente',
    ],
    planes: ['Básico', 'Estándar', 'Total'],
    desde: 'S/ 28',
  },
  {
    id: 'viaje',
    icon: MdFlight,
    tab: 'Viaje',
    nombre: 'Seguro de Viaje',
    tagline: 'Explora el mundo sin riesgos',
    descripcion:
      'Cobertura médica y asistencia para viajes nacionales e internacionales. Ideal para turismo y negocios.',
    badge: 'Nuevo',
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
    beneficios: [
      'Gastos médicos en el extranjero',
      'Cancelación y retraso de vuelos',
      'Pérdida de equipaje',
      'Evacuación médica de emergencia',
    ],
    planes: ['Mochilero', 'Turista', 'Business'],
    desde: 'S/ 22',
  },
  {
    id: 'mascota',
    icon: MdPets,
    tab: 'Mascotas',
    nombre: 'Seguro para Mascotas',
    tagline: 'Cuida a tu mejor amigo',
    descripcion: 'Atención veterinaria para perros y gatos. Porque tu mascota también merece la mejor protección.',
    badge: 'Nuevo',
    accentBg: 'bg-pink-100',
    accentText: 'text-pink-500',
    beneficios: [
      'Consultas veterinarias',
      'Cirugías y hospitalización',
      'Vacunas y desparasitación',
      'Emergencias 24/7',
    ],
    planes: ['Básico', 'Plus', 'Full'],
    desde: 'S/ 18',
  },
  {
    id: 'empresa',
    icon: MdBusiness,
    tab: 'Empresa',
    nombre: 'Seguro Empresarial',
    tagline: 'Protege tu negocio',
    descripcion: 'Soluciones integrales para empresas: cubre activos, responsabilidad civil y a tu equipo de trabajo.',
    badge: null,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
    beneficios: [
      'Daños a instalaciones y activos',
      'Responsabilidad civil empresarial',
      'Seguro colectivo de empleados',
      'Continuidad de negocio',
    ],
    planes: ['Pyme', 'Corporativo', 'Enterprise'],
    desde: 'S/ 150',
  },
];

const ALL_TABS = [{ id: 'todos', tab: 'Todos', icon: null, accentBg: null, accentText: null }, ...seguros];

const stats = [
  { icon: MdPeople, value: '+50k', label: 'Clientes protegidos' },
  { icon: MdStar, value: '4.9', label: 'Calificación promedio' },
  { icon: MdSecurity, value: '99.2%', label: 'Siniestros atendidos' },
  { icon: MdTrendingUp, value: '15 años', label: 'De experiencia' },
];

function SeguroCard({ seguro }) {
  const Icon = seguro.icon;
  return (
    <div className="bg-bg rounded-2xl border border-border flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-1.5 w-full ${seguro.accentBg}`} />
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${seguro.accentBg}`}>
              <Icon size={22} className={seguro.accentText} />
            </div>
            <div>
              <h3 className="text-base font-bold text-text leading-tight">{seguro.nombre}</h3>
              <p className={`text-xs font-medium ${seguro.accentText}`}>{seguro.tagline}</p>
            </div>
          </div>
          {seguro.badge && (
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-text-inverse">
              {seguro.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-text-soft leading-relaxed">{seguro.descripcion}</p>
        <ul className="flex flex-col gap-2">
          {seguro.beneficios.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-text-soft">
              <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <div className="flex gap-1.5 flex-wrap">
          {seguro.planes.map((p) => (
            <span
              key={p}
              className="text-xs px-2.5 py-1 rounded-full bg-bg-soft border border-border text-text-soft font-medium"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-text-soft block">Desde</span>
            <span className="text-xl font-bold text-text">
              {seguro.desde}
              <span className="text-xs font-normal text-text-soft">/mes</span>
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors">
            Cotizar
            <MdArrowForward size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerSeguros() {
  const [activeTab, setActiveTab] = useState('todos');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const filtered = activeTab === 'todos' ? seguros : seguros.filter((s) => s.id === activeTab);
  const currentTab = ALL_TABS.find((s) => s.id === activeTab);
  const CurrentIcon = currentTab?.icon;

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5">
        <p className="text-xl font-bold text-text">Ver seguros</p>
        <p className="text-sm text-text-soft mt-0.5">
          Explora nuestros planes, compara coberturas y cotiza en minutos.
        </p>
      </div>

      <div className="flex-1 w-full py-8 flex flex-col gap-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-base font-bold text-text leading-tight">{value}</p>
                <p className="text-xs text-text-soft">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="relative">
          {/* Desktop: scroll horizontal */}
          <div className="hidden lg:flex gap-2 overflow-x-hidden pb-1">
            {ALL_TABS.map((s) => {
              const active = activeTab === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`o flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                    active
                      ? s.accentBg
                        ? `${s.accentBg} ${s.accentText} border-transparent`
                        : 'bg-primary/10 text-primary border-transparent'
                      : 'bg-transparent border-border text-text-soft hover:text-text'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {s.tab}
                </button>
              );
            })}
          </div>

          {/* Móvil: 3 tabs visibles + botón "Más" */}
          <div className="lg:hidden flex gap-2">
            {ALL_TABS.slice(0, 3).map((s) => {
              const active = activeTab === s.id;
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveTab(s.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                    active
                      ? s.accentBg
                        ? `${s.accentBg} ${s.accentText} border-transparent`
                        : 'bg-primary/10 text-primary border-transparent'
                      : 'bg-transparent border-border text-text-soft hover:text-text'
                  }`}
                >
                  {Icon && <Icon size={14} />}
                  {s.tab}
                </button>
              );
            })}

            {/* Botón "Más" */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap border ${
                  ALL_TABS.slice(3).some((s) => s.id === activeTab)
                    ? 'bg-primary/10 text-primary border-transparent'
                    : 'bg-transparent border-border text-text-soft hover:text-text'
                }`}
              >
                {ALL_TABS.slice(3).some((s) => s.id === activeTab)
                  ? ALL_TABS.find((s) => s.id === activeTab)?.tab
                  : 'Más'}
                <MdKeyboardArrowDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 left-0 bg-bg border border-border rounded-2xl overflow-hidden z-50 shadow-lg min-w-40">
                  {ALL_TABS.slice(3).map((s) => {
                    const active = activeTab === s.id;
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setActiveTab(s.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors border-b border-border last:border-0 ${
                          active ? `${s.accentText ?? 'text-primary'} bg-primary/5` : 'text-text-soft hover:bg-bg-soft'
                        }`}
                      >
                        {Icon && <Icon size={16} />}
                        {s.tab}
                        {active && <MdCheck size={14} className="ml-auto" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Grid de cards */}
        <div
          className={`grid gap-5 ${filtered.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'}`}
        >
          {filtered.map((s) => (
            <SeguroCard key={s.id} seguro={s} />
          ))}
        </div>

        {/* CTA asesor */}
        <div className="bg-linear-to-r from-primary to-text rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-text-inverse mb-1">¿No sabes cuál elegir?</h3>
            <p className="text-sm text-white/75">Un asesor te ayuda a encontrar el plan perfecto para ti, sin costo.</p>
          </div>
          <button className="shrink-0 px-5 py-2.5 rounded-xl bg-bg hover:bg-bg-soft text-primary text-sm font-semibold transition-colors flex items-center gap-2">
            Hablar con un asesor
            <MdArrowForward size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
