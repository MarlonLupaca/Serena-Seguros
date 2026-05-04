'use client';

import { useState } from 'react';
import {
  MdDownload,
  MdCalendarToday,
  MdChevronRight,
  MdFavorite,
  MdDirectionsCar,
  MdHome,
  MdLocalHospital,
  MdBusiness,
  MdReceiptLong,
  MdCheckCircle,
  MdAccessTime,
  MdAccountBalanceWallet,
  MdTrendingUp,
  MdFilterList,
  MdSearch,
  MdChevronLeft,
} from 'react-icons/md';

/* ─── datos simulados ─── */
const TIPOS = {
  vida: { label: 'Vida', icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500', bar: 'bg-rose-400' },
  vehicular: {
    label: 'Vehicular',
    icon: MdDirectionsCar,
    accentBg: 'bg-blue-100',
    accentText: 'text-blue-500',
    bar: 'bg-blue-400',
  },
  hogar: { label: 'Hogar', icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-500', bar: 'bg-amber-400' },
  salud: {
    label: 'Salud',
    icon: MdLocalHospital,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-500',
    bar: 'bg-emerald-400',
  },
  empresarial: {
    label: 'Empresarial',
    icon: MdBusiness,
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-500',
    bar: 'bg-violet-400',
  },
};

const COMISIONES = [
  {
    id: 'COM-001',
    poliza: 'POL-2025-041',
    tipo: 'vehicular',
    cliente: 'Carlos Mendoza',
    evento: 'Emisión',
    fecha: '02 May 2025',
    prima: 1240.0,
    pct: 12,
    monto: 148.8,
    estado: 'liquidada',
  },
  {
    id: 'COM-002',
    poliza: 'POL-2025-038',
    tipo: 'vida',
    cliente: 'Lucía Paredes',
    evento: 'Renovación',
    fecha: '05 May 2025',
    prima: 890.0,
    pct: 15,
    monto: 133.5,
    estado: 'liquidada',
  },
  {
    id: 'COM-003',
    poliza: 'POL-2025-044',
    tipo: 'hogar',
    cliente: 'Roberto Silva',
    evento: 'Emisión',
    fecha: '10 May 2025',
    prima: 560.0,
    pct: 10,
    monto: 56.0,
    estado: 'pendiente',
  },
  {
    id: 'COM-004',
    poliza: 'POL-2025-047',
    tipo: 'salud',
    cliente: 'Ana Torres',
    evento: 'Emisión',
    fecha: '14 May 2025',
    prima: 1050.0,
    pct: 12,
    monto: 126.0,
    estado: 'pendiente',
  },
  {
    id: 'COM-005',
    poliza: 'POL-2025-050',
    tipo: 'empresarial',
    cliente: 'Jorge Quispe',
    evento: 'Emisión',
    fecha: '18 May 2025',
    prima: 3200.0,
    pct: 8,
    monto: 256.0,
    estado: 'devengada',
  },
  {
    id: 'COM-006',
    poliza: 'POL-2025-051',
    tipo: 'vehicular',
    cliente: 'María Flores',
    evento: 'Renovación',
    fecha: '20 May 2025',
    prima: 980.0,
    pct: 12,
    monto: 117.6,
    estado: 'devengada',
  },
  {
    id: 'COM-007',
    poliza: 'POL-2025-033',
    tipo: 'vida',
    cliente: 'Carlos Mendoza',
    evento: 'Renovación',
    fecha: '22 May 2025',
    prima: 1100.0,
    pct: 15,
    monto: 165.0,
    estado: 'pendiente',
  },
];

const LIQUIDACIONES = [
  { id: 'LIQ-2025-04', periodo: 'Abril 2025', fecha: '30 Abr 2025', monto: 892.4, comisiones: 6, estado: 'pagada' },
  { id: 'LIQ-2025-03', periodo: 'Marzo 2025', fecha: '31 Mar 2025', monto: 1140.8, comisiones: 8, estado: 'pagada' },
  { id: 'LIQ-2025-02', periodo: 'Febrero 2025', fecha: '28 Feb 2025', monto: 760.5, comisiones: 5, estado: 'pagada' },
  { id: 'LIQ-2025-01', periodo: 'Enero 2025', fecha: '31 Ene 2025', monto: 654.2, comisiones: 4, estado: 'pagada' },
];

const ESTADO_COM = {
  liquidada: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Liquidada' },
  pendiente: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', label: 'Pendiente' },
  devengada: { badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400', label: 'Devengada' },
};

const fmt = (n) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/* ─── resumen mensual calculado ─── */
const devengado = COMISIONES.filter((c) => c.estado === 'devengada').reduce((a, c) => a + c.monto, 0);
const liquidado = COMISIONES.filter((c) => c.estado === 'liquidada').reduce((a, c) => a + c.monto, 0);
const pendiente = COMISIONES.filter((c) => c.estado === 'pendiente').reduce((a, c) => a + c.monto, 0);
const total = devengado + liquidado + pendiente;

/* ─── componentes ─── */
function Badge({ estado }) {
  const e = ESTADO_COM[estado];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${e.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} />
      {e.label}
    </span>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div className="mb-3">
      <p className="text-sm font-bold text-text">{title}</p>
      {sub && <p className="text-xs text-text-soft mt-0.5">{sub}</p>}
    </div>
  );
}

function ComisionRow({ c }) {
  const t = TIPOS[c.tipo];
  const Icon = t.icon;

  return (
    <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] items-center gap-4 px-4 py-3.5 border-b border-border last:border-0 hover:bg-bg-soft transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.accentBg}`}>
          <Icon size={15} className={t.accentText} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-bold text-text truncate">{c.poliza}</p>
          <p className="text-xs text-text-soft truncate">{c.cliente}</p>
        </div>
      </div>

      <p className="text-xs text-text-soft">{c.fecha}</p>

      <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-bg-soft text-text-soft w-fit">
        {c.evento}
      </span>

      <p className="text-xs text-text-soft tabular-nums">{fmt(c.prima)}</p>

      <p className="text-xs font-semibold text-text tabular-nums">
        {fmt(c.monto)} <span className="text-text-soft font-normal">({c.pct}%)</span>
      </p>

      <div className="flex justify-end">
        <Badge estado={c.estado} />
      </div>
    </div>
  );
}

export default function ComisionesPage() {
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [busq, setBusq] = useState('');
  const [liqExpanded, setLiqExpanded] = useState(null);

  const filtradas = COMISIONES.filter((c) => {
    const matchE = filtroEstado === 'todos' || c.estado === filtroEstado;

    const matchB =
      c.poliza.toLowerCase().includes(busq.toLowerCase()) || c.cliente.toLowerCase().includes(busq.toLowerCase());

    return matchE && matchB;
  });

  const handlePDF = () => {
    alert('Simulación: se generaría el PDF con el resumen mensual de comisiones.');
  };

  return (
    <div className="py-4 flex flex-col gap-8 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-text">Comisiones</p>
          <p className="text-xs text-text-soft mt-0.5">Mayo 2025</p>
        </div>

        <button
          onClick={handlePDF}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
        >
          <MdDownload size={15} /> Descargar PDF
        </button>
      </div>

      {/* Resumen mensual */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total generado', val: total, icon: MdTrendingUp, bg: 'bg-bg-soft', text: 'text-text' },
          { label: 'Devengado', val: devengado, icon: MdReceiptLong, bg: 'bg-blue-50', text: 'text-blue-600' },
          { label: 'Liquidado', val: liquidado, icon: MdCheckCircle, bg: 'bg-emerald-50', text: 'text-emerald-600' },
          { label: 'Pendiente de pago', val: pendiente, icon: MdAccessTime, bg: 'bg-amber-50', text: 'text-amber-600' },
        ].map(({ label, val, icon: Icon, bg, text }) => (
          <div key={label} className={`rounded-2xl border border-border p-5 flex flex-col gap-3 ${bg}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-soft">{label}</p>
              <Icon size={16} className={text} />
            </div>

            <p className={`text-2xl font-bold ${text} tabular-nums`}>{fmt(val)}</p>

            <div className="h-1 w-full bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  text === 'text-blue-600'
                    ? 'bg-blue-400'
                    : text === 'text-emerald-600'
                      ? 'bg-emerald-500'
                      : text === 'text-amber-600'
                        ? 'bg-amber-400'
                        : 'bg-primary'
                }`}
                style={{ width: total > 0 ? `${Math.round((val / total) * 100)}%` : '0%' }}
              />
            </div>

            <p className="text-xs text-text-soft tabular-nums">
              {total > 0 ? Math.round((val / total) * 100) : 0}% del total
            </p>
          </div>
        ))}
      </div>

      {/* Detalle */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionHeader title="Detalle por póliza" sub={`${filtradas.length} comisiones`} />

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-bg-soft border border-border rounded-xl p-1">
              {['todos', 'devengada', 'liquidada', 'pendiente'].map((e) => (
                <button
                  key={e}
                  onClick={() => setFiltroEstado(e)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                    filtroEstado === e
                      ? 'bg-bg text-text shadow-sm border border-border'
                      : 'text-text-soft hover:text-text'
                  }`}
                >
                  {e === 'todos' ? 'Todos' : ESTADO_COM[e].label}
                </button>
              ))}
            </div>

            <div className="relative">
              <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />

              <input
                className="pl-8 pr-3 py-2 text-xs rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary w-48"
                placeholder="Póliza o cliente..."
                value={busq}
                onChange={(e) => setBusq(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-2.5 bg-bg-soft border-b border-border">
            {['Póliza / Cliente', 'Fecha', 'Evento', 'Prima', 'Comisión', 'Estado'].map((h) => (
              <p key={h} className="text-xs font-semibold text-text-soft">
                {h}
              </p>
            ))}
          </div>

          {filtradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2 text-text-soft">
              <MdReceiptLong size={28} />
              <p className="text-sm font-semibold text-text">Sin resultados</p>
              <p className="text-xs">Prueba con otro filtro</p>
            </div>
          ) : (
            filtradas.map((c) => <ComisionRow key={c.id} c={c} />)
          )}

          {filtradas.length > 0 && (
            <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_1fr] gap-4 px-4 py-3 bg-bg-soft border-t border-border">
              <p className="text-xs font-bold text-text col-span-4">Total filtrado</p>
              <p className="text-xs font-bold text-text tabular-nums">
                {fmt(filtradas.reduce((a, c) => a + c.monto, 0))}
              </p>
              <div />
            </div>
          )}
        </div>
      </div>

      {/* Historial de liquidaciones */}
      <div>
        <SectionHeader title="Historial de liquidaciones" sub="Liquidaciones anteriores procesadas" />

        <div className="flex flex-col gap-3">
          {LIQUIDACIONES.map((liq) => (
            <div key={liq.id} className="bg-bg rounded-2xl border border-border overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onClick={() => setLiqExpanded(liqExpanded === liq.id ? null : liq.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setLiqExpanded(liqExpanded === liq.id ? null : liq.id);
                  }
                }}
                className="w-full flex items-center gap-4 p-4 hover:bg-bg-soft transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <MdAccountBalanceWallet size={18} className="text-emerald-600" />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm font-bold text-text">{liq.periodo}</p>

                  <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
                    <MdCalendarToday size={11} />
                    Pagada el {liq.fecha} · {liq.comisiones} comisiones
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <p className="text-sm font-bold text-text tabular-nums">{fmt(liq.monto)}</p>

                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Pagada
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert(`Simulación: descargando PDF de ${liq.periodo}`);
                    }}
                    className="p-2 rounded-lg border border-border hover:bg-bg-soft text-text-soft transition-colors"
                  >
                    <MdDownload size={14} />
                  </button>

                  {liqExpanded === liq.id ? (
                    <MdChevronLeft size={16} className="text-text-soft" />
                  ) : (
                    <MdChevronRight size={16} className="text-text-soft" />
                  )}
                </div>
              </div>

              {liqExpanded === liq.id && (
                <div className="border-t border-border px-4 py-3 bg-bg-soft">
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'ID liquidación', val: liq.id },
                      { label: 'Periodo', val: liq.periodo },
                      { label: 'Fecha de pago', val: liq.fecha },
                      {
                        label: 'Comisiones incl.',
                        val: `${liq.comisiones} pólizas`,
                      },
                      { label: 'Monto total', val: fmt(liq.monto) },
                      { label: 'Estado', val: 'Pagada' },
                    ].map(({ label, val }) => (
                      <div key={label} className="bg-bg rounded-xl p-3 border border-border">
                        <p className="text-xs text-text-soft">{label}</p>
                        <p className="text-xs font-semibold text-text mt-0.5">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
