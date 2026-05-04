'use client';

import { useState } from 'react';
import {
  MdDirectionsCar,
  MdFavorite,
  MdHome,
  MdCreditCard,
  MdWarningAmber,
  MdAccessTime,
  MdCheckCircle,
  MdInfo,
  MdCalendarToday,
  MdChevronRight,
  MdShield,
} from 'react-icons/md';

const polizas = [
  {
    id: 'POL-001',
    label: 'Seguro de Vida',
    icon: MdFavorite,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
    bar: 'bg-rose-400',
    vencimiento: '15 Ago 2025',
  },
  {
    id: 'POL-002',
    label: 'Seguro Vehicular',
    icon: MdDirectionsCar,
    accentBg: 'bg-blue-100',
    accentText: 'text-blue-500',
    bar: 'bg-blue-400',
    vencimiento: '03 Jul 2025',
  },
  {
    id: 'POL-003',
    label: 'Seguro de Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-500',
    bar: 'bg-amber-400',
    vencimiento: '22 Nov 2025',
  },
];

const proximoPago = { poliza: 'Seguro Vehicular', monto: 'S/ 185.00', fecha: '03 Jun 2025', diasRestantes: 4 };

const siniestro = {
  id: 'SIN-2024-087',
  poliza: 'Seguro Vehicular',
  descripcion: 'Choque frontal – av. Javier Prado',
  estado: 'En evaluación',
  fecha: '18 May 2025',
};

const notificaciones = [
  {
    id: 1,
    icon: MdAccessTime,
    color: 'text-amber-500',
    bg: 'bg-amber-50',
    titulo: 'Pago próximo a vencer',
    desc: 'Tu cuota de Seguro Vehicular vence en 4 días.',
    hora: 'Hace 2h',
  },
  {
    id: 2,
    icon: MdInfo,
    color: 'text-blue-500',
    bg: 'bg-blue-50',
    titulo: 'Siniestro actualizado',
    desc: 'El perito asignado revisará tu caso el 25 May.',
    hora: 'Hace 1d',
  },
  {
    id: 3,
    icon: MdCheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
    titulo: 'Pago confirmado',
    desc: 'Se procesó tu cuota de Seguro de Vida correctamente.',
    hora: 'Hace 3d',
  },
];

function SectionHeader({ title, onClick }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-bold text-text">{title}</p>
      <button onClick={onClick} className="flex items-center gap-0.5 text-xs text-primary hover:underline">
        Ver todo <MdChevronRight size={14} />
      </button>
    </div>
  );
}

function Card({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow cursor-pointer overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

export default function Home() {
  const [toast, setToast] = useState(null);
  const nav = (m) => {
    setToast(`Navegando a: ${m}`);
    setTimeout(() => setToast(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 p-6 relative">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50">
          {toast}
        </div>
      )}

      {/* Header */}
      <div>
        <p className="text-xs text-text-soft">Bienvenido de vuelta</p>
        <p className="text-xl font-bold text-text">Carlos Mendoza</p>
      </div>

      {/* Fila superior: pólizas (2/3) + próximo pago (1/3) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Pólizas — ocupa 2 columnas */}
        <div className="col-span-2 flex flex-col">
          <SectionHeader title="Pólizas activas" onClick={() => nav('Mis pólizas')} />
          <div className="grid grid-cols-3 gap-3 flex-1">
            {polizas.map((p) => {
              const Icon = p.icon;
              return (
                <Card key={p.id} onClick={() => nav(`Póliza ${p.id}`)} className="flex flex-col">
                  <div className={`h-1 w-full ${p.bar}`} />
                  <div className="p-4 flex flex-col gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.accentBg}`}>
                      <Icon size={20} className={p.accentText} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-text leading-snug">{p.label}</p>
                      <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                        <MdCalendarToday size={11} /> {p.vencimiento}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 self-start">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Próximo pago — ocupa 1 columna */}
        <div className="flex flex-col">
          <SectionHeader title="Próximo pago" onClick={() => nav('Mis pagos')} />
          <Card onClick={() => nav('Mis pagos')} className="flex-1 flex flex-col">
            <div className="h-1 w-full bg-amber-400" />
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                <MdCreditCard size={20} className="text-amber-500" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs text-text-soft">Póliza</p>
                <p className="text-sm font-bold text-text">{proximoPago.poliza}</p>
                <p className="text-xs text-text-soft flex items-center gap-1 mt-1">
                  <MdCalendarToday size={11} /> {proximoPago.fecha}
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-text">{proximoPago.monto}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 mt-2">
                  <MdAccessTime size={11} /> {proximoPago.diasRestantes}d restantes
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nav('Pagar cuota');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdCreditCard size={13} /> Pagar ahora
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Fila inferior: siniestro (1/3) + notificaciones (2/3) */}
      <div className="grid grid-cols-3 gap-4">
        {/* Siniestro activo */}
        <div className="flex flex-col">
          <SectionHeader title="Siniestro activo" onClick={() => nav('Mis siniestros')} />
          <Card onClick={() => nav('Mis siniestros')} className="flex-1 flex flex-col">
            <div className="h-1 w-full bg-amber-400" />
            <div className="p-5 flex flex-col gap-4 flex-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                <MdWarningAmber size={20} className="text-amber-500" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <p className="text-xs font-bold text-text">{siniestro.id}</p>
                <p className="text-xs text-text-soft">{siniestro.poliza}</p>
                <p className="text-xs text-text-soft mt-1 leading-relaxed">{siniestro.descripcion}</p>
              </div>
              <div>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {siniestro.estado}
                </span>
                <p className="text-xs text-text-soft mt-2 flex items-center gap-1">
                  <MdCalendarToday size={11} /> {siniestro.fecha}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Notificaciones — ocupa 2 columnas */}
        <div className="col-span-2 flex flex-col">
          <SectionHeader title="Notificaciones recientes" onClick={() => nav('Notificaciones')} />
          <div className="flex flex-col gap-3 flex-1">
            {notificaciones.map((n) => {
              const Icon = n.icon;
              return (
                <Card key={n.id} onClick={() => nav('Notificaciones')} className="flex-1">
                  <div className="flex items-start gap-3 p-4 h-full">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.bg}`}>
                      <Icon size={16} className={n.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text">{n.titulo}</p>
                      <p className="text-xs text-text-soft mt-0.5 leading-relaxed">{n.desc}</p>
                    </div>
                    <span className="text-xs text-text-soft shrink-0">{n.hora}</span>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
