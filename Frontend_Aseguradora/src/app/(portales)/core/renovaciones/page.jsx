'use client';

import { useState } from 'react';
import {
  MdArrowBack,
  MdAutorenew,
  MdHandshake,
  MdWarningAmber,
  MdCheckCircle,
  MdCancel,
  MdPerson,
  MdPolicy,
  MdSchedule,
  MdCalendarToday,
  MdTrendingUp,
  MdHistory,
  MdEdit,
  MdSend,
  MdClose,
  MdOpenInNew,
  MdShield,
  MdLocalFireDepartment,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdBusiness,
  MdChevronRight,
  MdRefresh,
  MdBlock,
} from 'react-icons/md';

// ─── CONSTANTES ───────────────────────────────────────────────────────────────

const UMBRAL_SINIESTROS = 3;

const TIPO_POLIZA_ICON = {
  hogar: MdShield,
  auto: MdDirectionsCar,
  vida: MdHealthAndSafety,
  empresa: MdBusiness,
  incendio: MdLocalFireDepartment,
};

const ESTADO_CONFIG = {
  'por-vencer': { label: 'Por vencer', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  'revision-manual': { label: 'Revisión manual', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-500' },
  'auto-ok': { label: 'Auto-renovada', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  'manual-pendiente': { label: 'Manual pendiente', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  renovada: { label: 'Renovada', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  denegada: { label: 'Denegada', badge: 'bg-zinc-100 text-zinc-600', dot: 'bg-zinc-400' },
};

const POLIZAS_MOCK = [
  {
    id: 'POL-HOG-00123',
    tipo: 'hogar',
    cliente: 'María García López',
    plan: 'Hogar Protegido Plus',
    vencimiento: '05/05/2025',
    diasRestantes: 10,
    primaActual: 1200,
    primaPropuesta: 1260,
    estado: 'por-vencer',
    modoRenovacion: 'automatica',
    siniestros: 1,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
    accentBar: 'bg-sky-400',
    historialSiniestros: [{ fecha: '12/03/2024', tipo: 'Daño por agua', monto: 'S/ 2,400' }],
    condiciones: 'Cobertura estándar sin variaciones.',
  },
  {
    id: 'POL-AUT-00456',
    tipo: 'auto',
    cliente: 'Carlos Mendoza Ríos',
    plan: 'Auto Total',
    vencimiento: '02/05/2025',
    diasRestantes: 7,
    primaActual: 2800,
    primaPropuesta: 3360,
    estado: 'revision-manual',
    modoRenovacion: 'automatica',
    siniestros: 4,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
    accentBar: 'bg-rose-400',
    historialSiniestros: [
      { fecha: '08/01/2025', tipo: 'Choque frontal', monto: 'S/ 8,200' },
      { fecha: '14/08/2024', tipo: 'Robo de accesorios', monto: 'S/ 1,500' },
      { fecha: '22/04/2024', tipo: 'Colisión lateral', monto: 'S/ 3,100' },
      { fecha: '05/11/2023', tipo: 'Daño por granizo', monto: 'S/ 900' },
    ],
    condiciones: 'Se recomienda ajuste de deducible por siniestralidad elevada.',
  },
  {
    id: 'POL-VID-00789',
    tipo: 'vida',
    cliente: 'Lucía Torres Vega',
    plan: 'Vida Familia',
    vencimiento: '28/04/2025',
    diasRestantes: 3,
    primaActual: 980,
    primaPropuesta: 980,
    estado: 'manual-pendiente',
    modoRenovacion: 'manual',
    siniestros: 0,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    accentBar: 'bg-emerald-400',
    historialSiniestros: [],
    condiciones: 'Sin siniestros. Renovación sin ajuste de prima.',
  },
  {
    id: 'POL-EMP-00234',
    tipo: 'empresa',
    cliente: 'Inversiones Pacífico SAC',
    plan: 'Empresarial Integral',
    vencimiento: '10/05/2025',
    diasRestantes: 15,
    primaActual: 6500,
    primaPropuesta: 6500,
    estado: 'auto-ok',
    modoRenovacion: 'automatica',
    siniestros: 2,
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
    accentBar: 'bg-violet-400',
    historialSiniestros: [
      { fecha: '19/06/2024', tipo: 'Robo equipos', monto: 'S/ 4,800' },
      { fecha: '30/01/2024', tipo: 'Daño eléctrico', monto: 'S/ 1,200' },
    ],
    condiciones: 'Auto-renovación ejecutada correctamente.',
  },
  {
    id: 'POL-INC-00567',
    tipo: 'incendio',
    cliente: 'Roberto Salas Díaz',
    plan: 'Incendio Industrial',
    vencimiento: '08/05/2025',
    diasRestantes: 13,
    primaActual: 3200,
    primaPropuesta: 3520,
    estado: 'manual-pendiente',
    modoRenovacion: 'manual',
    siniestros: 1,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    accentBar: 'bg-amber-400',
    historialSiniestros: [{ fecha: '07/09/2024', tipo: 'Conato de incendio', monto: 'S/ 5,600' }],
    condiciones: 'Solicitud de renovación recibida desde Portal Comercial.',
  },
];

// ─── URGENCIA ─────────────────────────────────────────────────────────────────

function urgenciaDias(dias) {
  if (dias <= 5) return { color: 'text-rose-600', bg: 'bg-rose-100', label: `${dias}d` };
  if (dias <= 10) return { color: 'text-amber-600', bg: 'bg-amber-100', label: `${dias}d` };
  return { color: 'text-text-soft', bg: 'bg-bg-soft', label: `${dias}d` };
}

// ─── MODAL DENEGAR ────────────────────────────────────────────────────────────

function ModalDenegar({ poliza, onConfirm, onClose }) {
  const [motivo, setMotivo] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-rose-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Denegar renovación</p>
              <p className="text-xs text-text-soft mt-0.5">
                {poliza.id} · {poliza.cliente}
              </p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
              <MdClose size={18} />
            </button>
          </div>
          <div className="bg-bg-soft rounded-xl p-3.5 mb-4">
            <p className="text-xs text-text-soft mb-1.5">
              Motivo del rechazo <span className="text-rose-500">*</span>
            </p>
            <textarea
              className="w-full bg-transparent text-xs text-text resize-none outline-none placeholder:text-text-soft min-h-[80px]"
              placeholder="Indica el motivo para registrarlo y notificar al cliente..."
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
              // 👇 FIX: Pasamos el ID directamente desde el objeto seguro que recibió el Modal
              onClick={() => motivo.trim() && onConfirm(poliza.id, motivo)}
              disabled={!motivo.trim()}
              className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 disabled:opacity-40 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdBlock size={13} /> Denegar y notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL AJUSTAR CONDICIONES ────────────────────────────────────────────────

function ModalAjustar({ poliza, onConfirm, onClose }) {
  const [prima, setPrima] = useState(poliza.primaPropuesta);
  const [notas, setNotas] = useState(poliza.condiciones);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-sky-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Ajustar condiciones</p>
              <p className="text-xs text-text-soft mt-0.5">
                {poliza.id} · {poliza.cliente}
              </p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
              <MdClose size={18} />
            </button>
          </div>
          <div className="flex flex-col gap-3 mb-4">
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">Prima anual propuesta (S/)</p>
              <input
                type="number"
                className="w-full bg-transparent text-sm font-bold text-text outline-none"
                value={prima}
                onChange={(e) => setPrima(Number(e.target.value))}
              />
            </div>
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">Condiciones / notas</p>
              <textarea
                className="w-full bg-transparent text-xs text-text resize-none outline-none placeholder:text-text-soft min-h-[60px]"
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
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
              // 👇 FIX: Pasamos el ID directamente desde el objeto seguro que recibió el Modal
              onClick={() => onConfirm(poliza.id, { prima, notas })}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdCheckCircle size={13} /> Guardar y renovar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DETALLE PÓLIZA ───────────────────────────────────────────────────────────

function DetallePoliza({ poliza, onBack, onRenovar, onDenegar, onAjustar }) {
  const est = ESTADO_CONFIG[poliza.estado];
  const Icon = TIPO_POLIZA_ICON[poliza.tipo] || MdPolicy;
  const urg = urgenciaDias(poliza.diasRestantes);
  const tieneAltoSiniestro = poliza.siniestros >= UMBRAL_SINIESTROS;
  const variacion = poliza.primaPropuesta - poliza.primaActual;
  const pct = ((variacion / poliza.primaActual) * 100).toFixed(1);
  const esProcesable = ['por-vencer', 'revision-manual', 'manual-pendiente'].includes(poliza.estado);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a renovaciones
      </button>

      {/* Header */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${poliza.accentBar}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${poliza.accentBg}`}>
                <Icon size={20} className={poliza.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{poliza.plan}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                  {tieneAltoSiniestro && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                      <MdWarningAmber size={11} /> Alta siniestralidad
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-soft mt-0.5">{poliza.id}</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${urg.bg} ${urg.color}`}
            >
              <MdSchedule size={13} />
              Vence en {urg.label}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdPerson, label: 'Cliente', val: poliza.cliente },
              { icon: MdCalendarToday, label: 'Vencimiento', val: poliza.vencimiento },
              {
                icon: poliza.modoRenovacion === 'automatica' ? MdAutorenew : MdHandshake,
                label: 'Modo',
                val: poliza.modoRenovacion === 'automatica' ? 'Automática' : 'Manual',
              },
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
        </div>

        {/* Prima */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Impacto en prima</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-soft rounded-xl p-3">
              <p className="text-xs text-text-soft mb-0.5">Prima actual</p>
              <p className="text-base font-bold text-text">S/ {poliza.primaActual.toLocaleString()}</p>
            </div>
            <div
              className={`rounded-xl p-3 ${variacion > 0 ? 'bg-amber-50 border border-amber-200' : variacion < 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-bg-soft'}`}
            >
              <p className="text-xs text-text-soft mb-0.5">Prima propuesta</p>
              <div className="flex items-end gap-1.5">
                <p className="text-base font-bold text-text">S/ {poliza.primaPropuesta.toLocaleString()}</p>
                {variacion !== 0 && (
                  <span
                    className={`text-xs font-semibold mb-0.5 flex items-center gap-0.5 ${variacion > 0 ? 'text-amber-600' : 'text-emerald-600'}`}
                  >
                    <MdTrendingUp size={12} className={variacion < 0 ? 'rotate-180' : ''} />
                    {variacion > 0 ? '+' : ''}
                    {pct}%
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Siniestros */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Historial de siniestros</p>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${tieneAltoSiniestro ? 'bg-rose-100 text-rose-600' : 'bg-bg-soft text-text-soft'}`}
            >
              {poliza.siniestros} siniestro{poliza.siniestros !== 1 ? 's' : ''}
            </span>
          </div>
          {tieneAltoSiniestro && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 mb-3">
              <MdWarningAmber size={15} className="text-rose-500 mt-0.5 shrink-0" />
              <p className="text-xs text-rose-600">
                Alta siniestralidad detectada ({poliza.siniestros} siniestros). Revisión manual obligatoria antes de
                renovar.
              </p>
            </div>
          )}
          {poliza.historialSiniestros.length === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-bg-soft">
              <MdCheckCircle size={14} className="text-emerald-500" />
              <p className="text-xs text-text-soft">Sin siniestros registrados</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {poliza.historialSiniestros.map((s, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl border border-border">
                  <div className="flex items-center gap-2">
                    <MdHistory size={13} className="text-text-soft" />
                    <div>
                      <p className="text-xs font-medium text-text">{s.tipo}</p>
                      <p className="text-xs text-text-soft">{s.fecha}</p>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-text">{s.monto}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Condiciones */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">Condiciones de renovación</p>
          <p className="text-xs text-text bg-bg-soft rounded-xl p-3">{poliza.condiciones}</p>
        </div>

        {/* Acciones */}
        {esProcesable && (
          <div className="p-5 flex flex-wrap gap-2">
            <button
              onClick={() => onDenegar(poliza)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdBlock size={14} /> Denegar
            </button>
            <button
              onClick={() => onAjustar(poliza)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdEdit size={14} /> Ajustar condiciones
            </button>
            <button
              onClick={() => onRenovar(poliza)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdRefresh size={14} /> Renovar póliza
            </button>
          </div>
        )}

        {poliza.estado === 'renovada' && (
          <div className="p-5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <MdCheckCircle size={16} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-0.5">Póliza renovada exitosamente</p>
                <p className="text-xs text-emerald-600">La póliza fue actualizada y el cliente fue notificado.</p>
              </div>
            </div>
          </div>
        )}

        {poliza.estado === 'denegada' && (
          <div className="p-5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
              <MdCancel size={16} className="text-zinc-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-600 mb-0.5">Renovación denegada</p>
                <p className="text-xs text-zinc-500">El motivo fue registrado y el cliente fue notificado.</p>
              </div>
            </div>
          </div>
        )}

        {poliza.estado === 'auto-ok' && (
          <div className="p-5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <MdAutorenew size={16} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-0.5">Auto-renovación ejecutada</p>
                <p className="text-xs text-emerald-600">
                  El sistema procesó la renovación automáticamente sin incidencias.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CARD LISTA ───────────────────────────────────────────────────────────────

function RenovacionCard({ p, onSelect }) {
  const est = ESTADO_CONFIG[p.estado];
  const Icon = TIPO_POLIZA_ICON[p.tipo] || MdPolicy;
  const urg = urgenciaDias(p.diasRestantes);
  const tieneAltoSiniestro = p.siniestros >= UMBRAL_SINIESTROS;

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(p)}
    >
      <div className={`h-1 w-full ${p.accentBar}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${p.accentBg}`}>
            <Icon size={22} className={p.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{p.plan}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
              {tieneAltoSiniestro && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  <MdWarningAmber size={11} /> Alta siniestralidad
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {p.id} · {p.cliente}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <MdCalendarToday size={11} className="inline mr-1" />
              Vence: {p.vencimiento}
              <span className="mx-1.5">·</span>
              {p.modoRenovacion === 'automatica' ? (
                <>
                  <MdAutorenew size={11} className="inline mr-0.5" />
                  Automática
                </>
              ) : (
                <>
                  <MdHandshake size={11} className="inline mr-0.5" />
                  Manual
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${urg.bg} ${urg.color}`}>{urg.label}</span>
            <div className="text-right">
              <p className="text-xs text-text-soft">Prima</p>
              <p className="text-sm font-bold text-text">S/ {p.primaPropuesta.toLocaleString()}</p>
            </div>
            <button className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors">
              Ver <MdChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE PRINCIPAL ───────────────────────────────────────────────────────────

export default function RenovacionesPage() {
  const [polizas, setPolizas] = useState(POLIZAS_MOCK);
  const [seleccionada, setSeleccionada] = useState(null);
  const [modalDenegar, setModalDenegar] = useState(false);
  const [modalAjustar, setModalAjustar] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const filtros = [
    { key: 'todos', label: 'Todas' },
    { key: 'por-vencer', label: 'Por vencer' },
    { key: 'revision-manual', label: 'Revisión manual' },
    { key: 'manual-pendiente', label: 'Manual pendiente' },
    { key: 'auto-ok', label: 'Auto-renovadas' },
    { key: 'renovada', label: 'Renovadas' },
    { key: 'denegada', label: 'Denegadas' },
  ];

  const actualizarPoliza = (id, cambios) => {
    setPolizas((prev) => prev.map((p) => (p.id === id ? { ...p, ...cambios } : p)));
    setSeleccionada((prev) => (prev ? { ...prev, ...cambios } : prev));
  };

  const handleRenovar = (poliza) => {
    actualizarPoliza(poliza.id, { estado: 'renovada' });
  };

  // 👇 FIX: Ahora recibe el ID directamente, no confía ciegamente en `seleccionada.id`
  const handleDenegar = (id, motivo) => {
    actualizarPoliza(id, { estado: 'denegada' });
    setModalDenegar(false);
    console.log('Denegación registrada:', motivo);
  };

  // 👇 FIX: Ahora recibe el ID directamente
  const handleAjustar = (id, { prima, notas }) => {
    actualizarPoliza(id, {
      primaPropuesta: prima,
      condiciones: notas,
      estado: 'renovada',
    });
    setModalAjustar(false);
  };

  const filtradas = filtro === 'todos' ? polizas : polizas.filter((p) => p.estado === filtro);

  const urgentes = polizas.filter(
    (p) => p.diasRestantes <= 5 && !['renovada', 'denegada', 'auto-ok'].includes(p.estado)
  ).length;
  const revisionManual = polizas.filter((p) => p.estado === 'revision-manual').length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {modalDenegar && seleccionada && (
        <ModalDenegar poliza={seleccionada} onConfirm={handleDenegar} onClose={() => setModalDenegar(false)} />
      )}
      {modalAjustar && seleccionada && (
        <ModalAjustar poliza={seleccionada} onConfirm={handleAjustar} onClose={() => setModalAjustar(false)} />
      )}

      {seleccionada ? (
        <DetallePoliza
          poliza={seleccionada}
          onBack={() => setSeleccionada(null)}
          onRenovar={handleRenovar}
          onDenegar={() => setModalDenegar(true)}
          onAjustar={() => setModalAjustar(true)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-base font-bold text-text">Renovaciones</h1>
              <p className="text-xs text-text-soft mt-0.5">
                {urgentes > 0 && (
                  <span className="text-rose-500 font-semibold">
                    {urgentes} urgente{urgentes !== 1 ? 's' : ''} ·{' '}
                  </span>
                )}
                {revisionManual > 0 && (
                  <span className="text-rose-500 font-semibold">{revisionManual} con alta siniestralidad · </span>
                )}
                {polizas.length} pólizas totales
              </p>
            </div>
          </div>

          {/* Filtros */}
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
                  <span className="ml-1.5 tabular-nums">({polizas.filter((p) => p.estado === f.key).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Lista */}
          {filtradas.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-soft">No hay pólizas en este estado.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtradas
                .slice()
                .sort((a, b) => a.diasRestantes - b.diasRestantes)
                .map((p) => (
                  <RenovacionCard key={p.id} p={p} onSelect={setSeleccionada} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
