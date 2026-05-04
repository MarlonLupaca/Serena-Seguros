'use client';

import { useState } from 'react';
import {
  MdReceipt,
  MdEdit,
  MdPersonAdd,
  MdWarning,
  MdLocalHospital,
  MdAccessTime,
  MdArrowForward,
  MdNotifications,
  MdPause,
  MdChevronRight,
  MdCircle,
  MdCheckCircle,
  MdRefresh,
} from 'react-icons/md';

// ─── Data ─────────────────────────────────────────────────────────────────────

const COLA_TAREAS = [
  {
    id: 'emisiones',
    label: 'Emisiones pendientes',
    icon: MdReceipt,
    count: 14,
    desc: 'Por confirmar y emitir',
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-700',
    urgentes: 3,
    modulo: 'Emisiones',
  },
  {
    id: 'endosos',
    label: 'Endosos en cola',
    icon: MdEdit,
    count: 8,
    desc: 'Cambios pendientes de procesar',
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-700',
    urgentes: 1,
    modulo: 'Endosos',
  },
  {
    id: 'activaciones',
    label: 'Clientes por activar',
    icon: MdPersonAdd,
    count: 22,
    desc: 'Registros incompletos',
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-700',
    urgentes: 0,
    modulo: 'Clientes',
  },
  {
    id: 'siniestros',
    label: 'Siniestros sin asignar',
    icon: MdLocalHospital,
    count: 5,
    desc: 'Sin perito asignado',
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
    urgentes: 5,
    modulo: 'Siniestros',
  },
];

const SINIESTROS_SLA = [
  {
    id: 'SIN-0041',
    cliente: 'Roberto Sánchez',
    tipo: 'Daños a terceros',
    ramo: 'Vehicular',
    sla: 'rojo',
    horasRestantes: -4,
    prioridad: 'Alta',
    perito: null,
  },
  {
    id: 'SIN-0039',
    cliente: 'María Flores',
    tipo: 'Robo total',
    ramo: 'Vehicular',
    sla: 'rojo',
    horasRestantes: -1,
    prioridad: 'Alta',
    perito: 'Carlos V.',
  },
  {
    id: 'SIN-0037',
    cliente: 'Jorge Castillo',
    tipo: 'Incendio parcial',
    ramo: 'Hogar',
    sla: 'amarillo',
    horasRestantes: 6,
    prioridad: 'Media',
    perito: 'Ana R.',
  },
  {
    id: 'SIN-0035',
    cliente: 'Lucía Paredes',
    tipo: 'Sismo estructural',
    ramo: 'Hogar',
    sla: 'amarillo',
    horasRestantes: 11,
    prioridad: 'Media',
    perito: null,
  },
];

const POLIZAS_SUSPENDIDAS = [
  {
    id: 'POL-2291',
    cliente: 'Empresa Textil SAC',
    ramo: 'Vehicular',
    cuota: 'Cuota 4/12',
    diasMora: 18,
    monto: 'S/ 620',
  },
  {
    id: 'POL-2187',
    cliente: 'Carmen Delgado',
    ramo: 'Hogar',
    cuota: 'Cuota 2/6',
    diasMora: 12,
    monto: 'S/ 290',
  },
  {
    id: 'POL-2104',
    cliente: 'Luis Herrera',
    ramo: 'Vida',
    cuota: 'Cuota 6/12',
    diasMora: 9,
    monto: 'S/ 160',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SlaChip({ sla, horas }) {
  if (sla === 'rojo') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
        <MdCircle size={7} className="text-rose-500" />
        {Math.abs(horas)}h vencido
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
      <MdCircle size={7} className="text-amber-500" />
      {horas}h restantes
    </span>
  );
}

function SectionHeader({ title, count, countColor = 'bg-bg-soft text-text-soft', action, onAction }) {
  return (
    <div className="flex items-center justify-between gap-3 mb-3">
      <div className="flex items-center gap-2">
        <p className="text-sm font-bold text-text">{title}</p>
        {count !== undefined && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${countColor}`}>{count}</span>
        )}
      </div>
      {action && (
        <button
          onClick={onAction}
          className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors"
        >
          {action} <MdChevronRight size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EmployeeDashboard() {
  const [lastRefresh] = useState(new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }));

  const totalUrgentes = COLA_TAREAS.reduce((a, t) => a + t.urgentes, 0);
  const totalCola = COLA_TAREAS.reduce((a, t) => a + t.count, 0);

  return (
    <div className="py-2 flex flex-col gap-6 pb-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Panel de trabajo</h1>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
            <MdAccessTime size={11} /> Actualizado a las {lastRefresh}
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
          <MdRefresh size={13} /> Actualizar
        </button>
      </div>

      {/* Banner resumen */}
      {totalUrgentes > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200">
          <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <MdNotifications size={18} className="text-rose-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-rose-700">
              {totalUrgentes} tareas urgentes requieren atención inmediata
            </p>
            <p className="text-xs text-rose-500 mt-0.5">
              {totalCola} tareas en cola total · {SINIESTROS_SLA.filter((s) => s.sla === 'rojo').length} siniestros con
              SLA vencido
            </p>
          </div>
        </div>
      )}

      {/* ── Cola de tareas ── */}
      <div>
        <SectionHeader
          title="Cola de tareas"
          count={totalCola}
          countColor="bg-bg-soft text-text-soft border border-border"
        />
        <div className="grid grid-cols-2 gap-3">
          {COLA_TAREAS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden text-left group"
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.accentBg}`}>
                      <Icon size={18} className={t.accentText} />
                    </div>
                    {t.urgentes > 0 && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600">
                        {t.urgentes} urgentes
                      </span>
                    )}
                  </div>
                  <p className="text-2xl font-bold text-text tabular-nums">{t.count}</p>
                  <p className="text-xs font-semibold text-text mt-0.5">{t.label}</p>
                  <p className="text-xs text-text-soft mt-0.5">{t.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs text-text-soft group-hover:text-text transition-colors">
                    Ir a {t.modulo} <MdArrowForward size={12} />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Siniestros con SLA crítico ── */}
      <div>
        <SectionHeader
          title="Siniestros con SLA crítico"
          count={SINIESTROS_SLA.length}
          countColor="bg-rose-100 text-rose-600"
          action="Ver todos"
        />
        <div className="flex flex-col gap-2">
          {SINIESTROS_SLA.map((s) => (
            <button
              key={s.id}
              className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden text-left w-full group"
            >
              <div className={`h-1 w-full ${s.sla === 'rojo' ? 'bg-rose-400' : 'bg-amber-400'}`} />
              <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-xs font-bold text-text">{s.cliente}</p>
                    <SlaChip sla={s.sla} horas={s.horasRestantes} />
                  </div>
                  <p className="text-xs text-text-soft">
                    {s.id} · {s.tipo} · {s.ramo}
                  </p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="text-xs text-text-soft flex items-center gap-1">
                      {s.perito ? (
                        <>
                          <MdCheckCircle size={11} className="text-emerald-500" /> {s.perito}
                        </>
                      ) : (
                        <>
                          <MdWarning size={11} className="text-rose-400" /> Sin perito
                        </>
                      )}
                    </span>
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        s.prioridad === 'Alta' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      Prioridad {s.prioridad}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-xs text-text-soft group-hover:text-text transition-colors shrink-0 mt-1">
                  Ver <MdChevronRight size={14} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Pólizas suspendidas por mora ── */}
      <div>
        <SectionHeader
          title="Pólizas suspendidas por mora"
          count={POLIZAS_SUSPENDIDAS.length}
          countColor="bg-amber-100 text-amber-700"
          action="Ver cobros"
        />
        <div className="flex flex-col gap-2">
          {POLIZAS_SUSPENDIDAS.map((p) => (
            <button
              key={p.id}
              className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden text-left w-full group"
            >
              <div className="h-1 w-full bg-amber-400" />
              <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                  <MdPause size={18} className="text-amber-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-xs font-bold text-text">{p.cliente}</p>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      <MdCircle size={7} /> {p.diasMora}d en mora
                    </span>
                  </div>
                  <p className="text-xs text-text-soft">
                    {p.id} · {p.ramo} · {p.cuota}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <p className="text-sm font-bold text-text">{p.monto}</p>
                  <div className="flex items-center gap-1 text-xs text-text-soft group-hover:text-text transition-colors">
                    Gestionar <MdChevronRight size={13} />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
