'use client';

import { useState } from 'react';
import {
  MdArrowBack,
  MdWarningAmber,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdPolicy,
  MdSchedule,
  MdCalendarToday,
  MdClose,
  MdSend,
  MdBlock,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdBusiness,
  MdLocalFireDepartment,
  MdChevronRight,
  MdAssignment,
  MdPictureAsPdf,
  MdArrowUpward,
  MdMyLocation,
  MdPeople,
  MdAttachMoney,
  MdGavel,
  MdNotificationsActive,
  MdDone,
  MdHourglassEmpty,
  MdErrorOutline,
} from 'react-icons/md';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const UMBRAL_BAJO = 3000;
const UMBRAL_MEDIO = 15000;

const TIPO_POLIZA_ICON = {
  hogar: MdShield,
  auto: MdDirectionsCar,
  vida: MdHealthAndSafety,
  empresa: MdBusiness,
  incendio: MdLocalFireDepartment,
};

const ESTADO_CONFIG = {
  nuevo: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  validando: { label: 'Validando', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  asignado: { label: 'Asignado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  'en-evaluacion': { label: 'En evaluación', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'escala-operativo': { label: 'Escalado Operativo', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  'escala-ejecutivo': { label: 'Escalado Ejecutivo', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-500' },
  liquidado: { label: 'Liquidado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  rechazado: { label: 'Rechazado', badge: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' },
};

const SLA_CONFIG = {
  verde: { color: 'text-emerald-600', bg: 'bg-emerald-100', bar: 'bg-emerald-500', label: 'En tiempo' },
  amarillo: { color: 'text-amber-600', bg: 'bg-amber-100', bar: 'bg-amber-400', label: 'Por vencer' },
  rojo: { color: 'text-rose-600', bg: 'bg-rose-100', bar: 'bg-rose-500', label: 'Vencido' },
};

const EVALUADORES_MOCK = [
  { id: 'EV-01', nombre: 'Jorge Quispe', zona: 'Lima Norte', tipo: ['auto', 'hogar'], disponible: true },
  { id: 'EV-02', nombre: 'Ana Flores', zona: 'Lima Sur', tipo: ['hogar', 'incendio'], disponible: true },
  { id: 'EV-03', nombre: 'Luis Paredes', zona: 'Lima Este', tipo: ['empresa', 'incendio'], disponible: false },
  { id: 'EV-04', nombre: 'Carmen Ríos', zona: 'Lima Centro', tipo: ['auto', 'vida'], disponible: true },
];

const SINIESTROS_MOCK = [
  {
    id: 'SIN-2025-001',
    tipo: 'auto',
    poliza: 'POL-AUT-00456',
    cliente: 'Carlos Mendoza Ríos',
    descripcion: 'Choque lateral en Av. Javier Prado. Daño en puerta delantera y guardafango.',
    fechaSiniestro: '24/04/2025',
    fechaReporte: '25/04/2025',
    zona: 'Lima Este',
    estado: 'nuevo',
    slaHoras: 72,
    slaTranscurrido: 8,
    vigente: true,
    cubierto: true,
    montoEstimado: null,
    evaluadorAsignado: null,
    informeEvaluador: null,
    recuperacion: null,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
    accentBar: 'bg-sky-400',
  },
  {
    id: 'SIN-2025-002',
    tipo: 'hogar',
    poliza: 'POL-HOG-00123',
    cliente: 'María García López',
    descripcion: 'Inundación por rotura de tubería en cocina. Daño en paredes y mobiliario.',
    fechaSiniestro: '22/04/2025',
    fechaReporte: '23/04/2025',
    zona: 'Lima Norte',
    estado: 'en-evaluacion',
    slaHoras: 72,
    slaTranscurrido: 52,
    vigente: true,
    cubierto: true,
    montoEstimado: 8500,
    evaluadorAsignado: { id: 'EV-02', nombre: 'Ana Flores', zona: 'Lima Sur' },
    informeEvaluador: 'Daño en 3 paredes y mobiliario de cocina. Requiere demolición parcial y reposición.',
    recuperacion: null,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    accentBar: 'bg-amber-400',
  },
  {
    id: 'SIN-2025-003',
    tipo: 'incendio',
    poliza: 'POL-INC-00567',
    cliente: 'Roberto Salas Díaz',
    descripcion: 'Incendio en almacén. Pérdida total de mercadería sector B.',
    fechaSiniestro: '20/04/2025',
    fechaReporte: '20/04/2025',
    zona: 'Lima Este',
    estado: 'escala-ejecutivo',
    slaHoras: 48,
    slaTranscurrido: 120,
    vigente: true,
    cubierto: true,
    montoEstimado: 48000,
    evaluadorAsignado: { id: 'EV-03', nombre: 'Luis Paredes', zona: 'Lima Este' },
    informeEvaluador:
      'Pérdida total de mercadería en sector B. Estructura comprometida parcialmente. Monto valorizado según inventario auditado.',
    recuperacion: { monto: 12000, descripcion: 'Subrogación contra empresa transportista por negligencia' },
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
    accentBar: 'bg-rose-400',
  },
  {
    id: 'SIN-2025-004',
    tipo: 'auto',
    poliza: 'POL-AUT-00789',
    cliente: 'Lucía Torres Vega',
    descripcion: 'Robo total del vehículo estacionado en vía pública.',
    fechaSiniestro: '23/04/2025',
    fechaReporte: '24/04/2025',
    zona: 'Lima Centro',
    estado: 'asignado',
    slaHoras: 72,
    slaTranscurrido: 24,
    vigente: true,
    cubierto: true,
    montoEstimado: null,
    evaluadorAsignado: { id: 'EV-04', nombre: 'Carmen Ríos', zona: 'Lima Centro' },
    informeEvaluador: null,
    recuperacion: null,
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
    accentBar: 'bg-violet-400',
  },
  {
    id: 'SIN-2025-005',
    tipo: 'vida',
    poliza: 'POL-VID-00321',
    cliente: 'Pedro Huanca',
    descripcion: 'Invalidez permanente por accidente laboral. Solicitud de indemnización.',
    fechaSiniestro: '15/04/2025',
    fechaReporte: '18/04/2025',
    zona: 'Lima Sur',
    estado: 'nuevo',
    slaHoras: 96,
    slaTranscurrido: 170,
    vigente: false,
    cubierto: false,
    montoEstimado: null,
    evaluadorAsignado: null,
    informeEvaluador: null,
    recuperacion: null,
    accentBg: 'bg-zinc-100',
    accentText: 'text-zinc-500',
    accentBar: 'bg-zinc-300',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getSLA(transcurrido, total) {
  const pct = (transcurrido / total) * 100;
  if (pct >= 100) return { ...SLA_CONFIG.rojo, pct: 100 };
  if (pct >= 70) return { ...SLA_CONFIG.amarillo, pct };
  return { ...SLA_CONFIG.verde, pct };
}

function nivelMonto(monto) {
  if (!monto) return null;
  if (monto <= UMBRAL_BAJO)
    return {
      nivel: 'bajo',
      label: 'Bajo',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      action: 'Aprobar liquidación directa',
    };
  if (monto <= UMBRAL_MEDIO)
    return {
      nivel: 'medio',
      label: 'Medio',
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      action: 'Escalar a Portal Operativo',
    };
  return {
    nivel: 'alto',
    label: 'Alto',
    color: 'text-rose-600',
    bg: 'bg-rose-50 border-rose-200',
    action: 'Escalar a Portal Ejecutivo',
  };
}

// ─── MODALES ──────────────────────────────────────────────────────────────────

function ModalRechazar({ siniestro, onConfirm, onClose }) {
  const [motivo, setMotivo] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-rose-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Rechazar siniestro</p>
              <p className="text-xs text-text-soft mt-0.5">
                {siniestro.id} · {siniestro.cliente}
              </p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text">
              <MdClose size={18} />
            </button>
          </div>
          <div className="bg-bg-soft rounded-xl p-3.5 mb-4">
            <p className="text-xs text-text-soft mb-1.5">
              Motivo <span className="text-rose-500">*</span>
            </p>
            <textarea
              className="w-full bg-transparent text-xs text-text resize-none outline-none placeholder:text-text-soft min-h-[80px]"
              placeholder="Describe el motivo para notificar al cliente..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => motivo.trim() && onConfirm(motivo)}
              disabled={!motivo.trim()}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdBlock size={13} /> Rechazar y notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalAsignar({ siniestro, onConfirm, onClose }) {
  const [seleccionado, setSeleccionado] = useState(null);
  const compatibles = EVALUADORES_MOCK.filter((e) => e.tipo.includes(siniestro.tipo));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-violet-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Asignar evaluador</p>
              <p className="text-xs text-text-soft mt-0.5">
                {siniestro.id} · Zona: {siniestro.zona}
              </p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text">
              <MdClose size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-2 mb-4">
            {compatibles.map((ev) => (
              <button
                key={ev.id}
                onClick={() => ev.disponible && setSeleccionado(ev)}
                className={`flex items-center justify-between p-3 rounded-xl border transition-colors text-left ${
                  !ev.disponible
                    ? 'opacity-40 cursor-not-allowed border-border'
                    : seleccionado?.id === ev.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-bg-soft'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-bg-soft flex items-center justify-center">
                    <MdPerson size={16} className="text-text-soft" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-text">{ev.nombre}</p>
                    <p className="text-xs text-text-soft">{ev.zona}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${ev.disponible ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'}`}
                >
                  {ev.disponible ? 'Disponible' : 'Ocupado'}
                </span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => seleccionado && onConfirm(seleccionado)}
              disabled={!seleccionado}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdDone size={13} /> Asignar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalInforme({ siniestro, onConfirm, onClose }) {
  const [monto, setMonto] = useState('');
  const [informe, setInforme] = useState('');
  const nivel = nivelMonto(Number(monto));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-amber-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Registrar informe del evaluador</p>
              <p className="text-xs text-text-soft mt-0.5">{siniestro.id}</p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text">
              <MdClose size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">
                Monto estimado (S/) <span className="text-rose-500">*</span>
              </p>
              <input
                type="number"
                className="w-full bg-transparent text-sm font-bold text-text outline-none"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
            {monto && nivel && (
              <div
                className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium ${nivel.bg} ${nivel.color}`}
              >
                <MdAttachMoney size={14} />
                Nivel {nivel.label} → {nivel.action}
              </div>
            )}
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">
                Informe del evaluador <span className="text-rose-500">*</span>
              </p>
              <textarea
                className="w-full bg-transparent text-xs text-text resize-none outline-none placeholder:text-text-soft min-h-[70px]"
                placeholder="Detalle técnico del daño evaluado..."
                value={informe}
                onChange={(e) => setInforme(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => monto && informe.trim() && onConfirm(Number(monto), informe)}
              disabled={!monto || !informe.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdSend size={13} /> Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalRecuperacion({ siniestro, onConfirm, onClose }) {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-teal-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Registrar recuperación por subrogación</p>
              <p className="text-xs text-text-soft mt-0.5">{siniestro.id}</p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text">
              <MdClose size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">
                Monto recuperado (S/) <span className="text-rose-500">*</span>
              </p>
              <input
                type="number"
                className="w-full bg-transparent text-sm font-bold text-text outline-none"
                placeholder="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">
                Descripción <span className="text-rose-500">*</span>
              </p>
              <textarea
                className="w-full bg-transparent text-xs text-text resize-none outline-none placeholder:text-text-soft min-h-[60px]"
                placeholder="Contra quién se ejerce la subrogación y por qué..."
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => monto && descripcion.trim() && onConfirm(Number(monto), descripcion)}
              disabled={!monto || !descripcion.trim()}
              className="flex-1 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdGavel size={13} /> Registrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DETALLE ──────────────────────────────────────────────────────────────────

function DetalleSiniestro({ s, onBack, onRechazar, onAsignar, onInforme, onAprobar, onEscalar, onRecuperacion }) {
  const est = ESTADO_CONFIG[s.estado];
  const Icon = TIPO_POLIZA_ICON[s.tipo] || MdPolicy;
  const sla = getSLA(s.slaTranscurrido, s.slaHoras);
  const nivel = nivelMonto(s.montoEstimado);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a siniestros
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${s.accentBar}`} />
        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.accentBg}`}>
                <Icon size={20} className={s.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text capitalize">{s.tipo}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                  {!s.vigente && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                      <MdErrorOutline size={11} /> Póliza no vigente
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-soft mt-0.5">{s.id}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdPerson, label: 'Cliente', val: s.cliente },
              { icon: MdPolicy, label: 'Póliza', val: s.poliza },
              { icon: MdMyLocation, label: 'Zona', val: s.zona },
              { icon: MdCalendarToday, label: 'Fecha siniestro', val: s.fechaSiniestro },
              { icon: MdSchedule, label: 'Fecha reporte', val: s.fechaReporte },
              { icon: MdAssignment, label: 'Cobertura', val: s.cubierto ? 'Cubierto' : 'No cubierto' },
            ].map(({ icon: Ic, label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <div className="flex items-center gap-1 mb-0.5">
                  <Ic size={11} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-xs font-semibold text-text truncate">{val}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 bg-bg-soft rounded-xl p-3">
            <p className="text-xs text-text-soft mb-1">Descripción</p>
            <p className="text-xs text-text">{s.descripcion}</p>
          </div>
        </div>

        {/* SLA */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">SLA</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${sla.bg} ${sla.color}`}>{sla.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-bg-soft rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${sla.bar}`}
                style={{ width: `${Math.min(sla.pct, 100)}%` }}
              />
            </div>
            <span className="text-xs text-text-soft tabular-nums shrink-0">
              {s.slaTranscurrido}h / {s.slaHoras}h
            </span>
          </div>
        </div>

        {/* Evaluador */}
        {s.evaluadorAsignado && (
          <div className="p-5 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Evaluador asignado</p>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-bg-soft">
              <div className="w-8 h-8 rounded-full bg-bg flex items-center justify-center border border-border">
                <MdPerson size={16} className="text-text-soft" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text">{s.evaluadorAsignado.nombre}</p>
                <p className="text-xs text-text-soft">{s.evaluadorAsignado.zona}</p>
              </div>
            </div>
          </div>
        )}

        {/* Informe */}
        {s.informeEvaluador && (
          <div className="p-5 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Informe del evaluador</p>
            <p className="text-xs text-text bg-bg-soft rounded-xl p-3">{s.informeEvaluador}</p>
            {s.montoEstimado && nivel && (
              <div className={`mt-3 flex items-start gap-3 p-3.5 rounded-xl border ${nivel.bg}`}>
                <MdAttachMoney size={16} className={`${nivel.color} mt-0.5 shrink-0`} />
                <div>
                  <p className={`text-xs font-bold mb-0.5 ${nivel.color}`}>
                    Monto estimado: S/ {s.montoEstimado.toLocaleString()} — Nivel {nivel.label}
                  </p>
                  <p className="text-xs text-text-soft">{nivel.action}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recuperación por subrogación */}
        {s.recuperacion && (
          <div className="p-5 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">
              Recuperación por subrogación
            </p>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-teal-50 border border-teal-200">
              <MdGavel size={15} className="text-teal-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-teal-700 mb-0.5">S/ {s.recuperacion.monto.toLocaleString()}</p>
                <p className="text-xs text-teal-600">{s.recuperacion.descripcion}</p>
              </div>
            </div>
          </div>
        )}

        {/* Acciones */}
        <div className="p-5 flex flex-col gap-2">
          {/* Nuevo → validar */}
          {s.estado === 'nuevo' && (
            <>
              {!s.vigente || !s.cubierto ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                    <MdWarningAmber size={15} className="text-rose-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-rose-600">
                      {!s.vigente
                        ? 'Póliza no vigente a la fecha del siniestro.'
                        : 'El tipo de siniestro no está cubierto por la póliza.'}{' '}
                      Procede el rechazo.
                    </p>
                  </div>
                  <button
                    onClick={() => onRechazar(s)}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
                  >
                    <MdBlock size={14} /> Rechazar y notificar cliente
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onAsignar(s)}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                >
                  <MdPeople size={14} /> Asignar evaluador
                </button>
              )}
            </>
          )}

          {/* Asignado → registrar informe */}
          {s.estado === 'asignado' && (
            <button
              onClick={() => onInforme(s)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdAssignment size={14} /> Registrar informe del evaluador
            </button>
          )}

          {/* En evaluación → procesar monto */}
          {s.estado === 'en-evaluacion' && s.montoEstimado && nivel && (
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => onRechazar(s)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
              >
                <MdBlock size={14} /> Rechazar
              </button>
              {nivel.nivel === 'bajo' && (
                <button
                  onClick={() => onAprobar(s)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                >
                  <MdCheckCircle size={14} /> Aprobar liquidación directa
                </button>
              )}
              {nivel.nivel === 'medio' && (
                <button
                  onClick={() => onEscalar(s, 'operativo')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors"
                >
                  <MdArrowUpward size={14} /> Escalar a Portal Operativo
                </button>
              )}
              {nivel.nivel === 'alto' && (
                <button
                  onClick={() => onEscalar(s, 'ejecutivo')}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors"
                >
                  <MdArrowUpward size={14} /> Escalar a Portal Ejecutivo
                </button>
              )}
            </div>
          )}

          {/* Liquidado → carta + subrogación */}
          {s.estado === 'liquidado' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <MdCheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-xs text-emerald-600">Liquidación aprobada. Carta enviada al cliente.</p>
              </div>
              <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
                <MdPictureAsPdf size={14} /> Descargar carta de liquidación
              </button>
              {!s.recuperacion && (
                <button
                  onClick={() => onRecuperacion(s)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-teal-300 hover:bg-teal-50 text-teal-600 text-xs font-medium transition-colors"
                >
                  <MdGavel size={14} /> Registrar recuperación por subrogación
                </button>
              )}
            </div>
          )}

          {(s.estado === 'escala-operativo' || s.estado === 'escala-ejecutivo') && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <MdHourglassEmpty size={15} className="text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-amber-700 mb-0.5">
                  Esperando aprobación del {s.estado === 'escala-operativo' ? 'Portal Operativo' : 'Portal Ejecutivo'}
                </p>
                <p className="text-xs text-amber-600">Recibirás una notificación cuando se resuelva.</p>
              </div>
            </div>
          )}

          {s.estado === 'rechazado' && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <MdCancel size={15} className="text-zinc-400 mt-0.5 shrink-0" />
              <p className="text-xs text-zinc-500">Siniestro rechazado. El cliente fue notificado con el motivo.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────

function SiniestroCard({ s, onSelect }) {
  const est = ESTADO_CONFIG[s.estado];
  const Icon = TIPO_POLIZA_ICON[s.tipo] || MdPolicy;
  const sla = getSLA(s.slaTranscurrido, s.slaHoras);

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(s)}
    >
      <div className={`h-1 w-full ${s.accentBar}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.accentBg}`}>
            <Icon size={22} className={s.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text capitalize">{s.tipo}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} /> {est.label}
              </span>
              {(!s.vigente || !s.cubierto) && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  <MdErrorOutline size={11} /> {!s.vigente ? 'No vigente' : 'No cubierto'}
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {s.id} · {s.cliente}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <MdPolicy size={11} className="inline mr-1" />
              {s.poliza}
              <span className="mx-1.5">·</span>
              <MdMyLocation size={11} className="inline mr-1" />
              {s.zona}
            </p>
            {/* mini SLA */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-20 h-1.5 bg-bg-soft rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${sla.bar}`} style={{ width: `${Math.min(sla.pct, 100)}%` }} />
              </div>
              <span className={`text-xs font-medium ${sla.color}`}>
                {sla.label} · {s.slaTranscurrido}h/{s.slaHoras}h
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {s.montoEstimado ? (
              <p className="text-sm font-bold text-text">S/ {s.montoEstimado.toLocaleString()}</p>
            ) : (
              <p className="text-xs text-text-soft">Sin monto</p>
            )}
            <button className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors">
              Ver <MdChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function SiniestrosPage() {
  const [siniestros, setSiniestros] = useState(SINIESTROS_MOCK);
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('todos');
  const [modal, setModal] = useState(null); // 'rechazar' | 'asignar' | 'informe' | 'recuperacion'

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'nuevo', label: 'Nuevos' },
    { key: 'asignado', label: 'Asignados' },
    { key: 'en-evaluacion', label: 'En evaluación' },
    { key: 'escala-operativo', label: 'Escala Operativo' },
    { key: 'escala-ejecutivo', label: 'Escala Ejecutivo' },
    { key: 'liquidado', label: 'Liquidados' },
    { key: 'rechazado', label: 'Rechazados' },
  ];

  const actualizar = (id, cambios) => {
    setSiniestros((p) => p.map((s) => (s.id === id ? { ...s, ...cambios } : s)));
    setSeleccionado((p) => (p ? { ...p, ...cambios } : p));
  };

  const handleRechazar = (motivo) => {
    const id = seleccionado?.id;
    setModal(null);
    if (id) actualizar(id, { estado: 'rechazado' });
  };

  const handleAsignar = (ev) => {
    const id = seleccionado?.id;
    setModal(null);
    if (id) actualizar(id, { estado: 'asignado', evaluadorAsignado: ev });
  };

  const handleInforme = (monto, informe) => {
    const id = seleccionado?.id;
    setModal(null);
    if (id) actualizar(id, { estado: 'en-evaluacion', montoEstimado: monto, informeEvaluador: informe });
  };

  const handleRecuperacion = (monto, descripcion) => {
    const id = seleccionado?.id;
    setModal(null);
    if (id) actualizar(id, { recuperacion: { monto, descripcion } });
  };
  const handleAprobar = (s) => {
    actualizar(s.id, { estado: 'liquidado' });
  };
  const handleEscalar = (s, nivel) => {
    actualizar(s.id, { estado: nivel === 'operativo' ? 'escala-operativo' : 'escala-ejecutivo' });
  };

  const filtrados = filtro === 'todos' ? siniestros : siniestros.filter((s) => s.estado === filtro);
  const nuevos = siniestros.filter((s) => s.estado === 'nuevo').length;
  const slaVencidos = siniestros.filter(
    (s) =>
      getSLA(s.slaTranscurrido, s.slaHoras).color === 'text-rose-600' && !['liquidado', 'rechazado'].includes(s.estado)
  ).length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {modal === 'rechazar' && seleccionado && (
        <ModalRechazar siniestro={seleccionado} onConfirm={handleRechazar} onClose={() => setModal(null)} />
      )}
      {modal === 'asignar' && seleccionado && (
        <ModalAsignar siniestro={seleccionado} onConfirm={handleAsignar} onClose={() => setModal(null)} />
      )}
      {modal === 'informe' && seleccionado && (
        <ModalInforme siniestro={seleccionado} onConfirm={handleInforme} onClose={() => setModal(null)} />
      )}
      {modal === 'recuperacion' && seleccionado && (
        <ModalRecuperacion siniestro={seleccionado} onConfirm={handleRecuperacion} onClose={() => setModal(null)} />
      )}

      {seleccionado ? (
        <DetalleSiniestro
          s={seleccionado}
          onBack={() => setSeleccionado(null)}
          onRechazar={() => setModal('rechazar')}
          onAsignar={() => setModal('asignar')}
          onInforme={() => setModal('informe')}
          onAprobar={handleAprobar}
          onEscalar={handleEscalar}
          onRecuperacion={() => setModal('recuperacion')}
        />
      ) : (
        <>
          <div>
            <h1 className="text-base font-bold text-text">Siniestros</h1>
            <p className="text-xs text-text-soft mt-0.5">
              {nuevos > 0 && (
                <span className="text-sky-600 font-semibold">
                  {nuevos} nuevo{nuevos !== 1 ? 's' : ''} ·{' '}
                </span>
              )}
              {slaVencidos > 0 && (
                <span className="text-rose-500 font-semibold">
                  {slaVencidos} SLA vencido{slaVencidos !== 1 ? 's' : ''} ·{' '}
                </span>
              )}
              {siniestros.length} casos totales
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            {filtros.map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltro(f.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                  filtro === f.key
                    ? 'bg-primary text-text-inverse border-primary'
                    : 'border-border text-text-soft hover:bg-bg-soft'
                }`}
              >
                {f.label}
                {f.key !== 'todos' && (
                  <span className="ml-1.5 tabular-nums">({siniestros.filter((s) => s.estado === f.key).length})</span>
                )}
              </button>
            ))}
          </div>

          {filtrados.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-soft">No hay siniestros en este estado.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtrados
                .slice()
                .sort((a, b) => {
                  const pa = getSLA(a.slaTranscurrido, a.slaHoras).pct;
                  const pb = getSLA(b.slaTranscurrido, b.slaHoras).pct;
                  return pb - pa;
                })
                .map((s) => (
                  <SiniestroCard key={s.id} s={s} onSelect={setSeleccionado} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
