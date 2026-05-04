'use client';

import { useState } from 'react';
import {
  MdArrowBack,
  MdAdd,
  MdClose,
  MdSend,
  MdPolicy,
  MdCalendarToday,
  MdAttachMoney,
  MdWarningAmber,
  MdCheckCircle,
  MdLock,
  MdDownload,
  MdChevronRight,
  MdBusiness,
  MdShield,
  MdTrendingUp,
  MdTrendingDown,
  MdInfo,
  MdTableChart,
  MdNotificationsActive,
  MdPercent,
} from 'react-icons/md';

// ─── DATA ─────────────────────────────────────────────────────────────────────

const CONTRATOS_MOCK = [
  {
    id: 'RE-2025-001',
    reasegurador: 'Munich Re',
    tipo: 'Proporcional - Cuota Parte',
    ramos: ['Auto', 'Hogar'],
    cesion: 40,
    limiteContrato: 2000000,
    retencion: 1200000,
    acumulado: 980000,
    vigenciaDesde: '01/01/2025',
    vigenciaHasta: '31/12/2025',
    estado: 'vigente',
    accentBar: 'bg-sky-400',
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
  },
  {
    id: 'RE-2025-002',
    reasegurador: 'Swiss Re',
    tipo: 'No Proporcional - Exceso de Pérdida',
    ramos: ['Incendio', 'Empresa'],
    cesion: 60,
    limiteContrato: 5000000,
    retencion: 2000000,
    acumulado: 1870000,
    vigenciaDesde: '01/01/2025',
    vigenciaHasta: '31/12/2025',
    estado: 'vigente',
    accentBar: 'bg-violet-400',
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
  },
  {
    id: 'RE-2024-003',
    reasegurador: 'Hannover Re',
    tipo: 'Proporcional - Excedente',
    ramos: ['Vida'],
    cesion: 35,
    limiteContrato: 3000000,
    retencion: 1950000,
    acumulado: 1950000,
    vigenciaDesde: '01/01/2024',
    vigenciaHasta: '31/12/2024',
    estado: 'vencido',
    accentBar: 'bg-zinc-300',
    accentBg: 'bg-zinc-100',
    accentText: 'text-zinc-500',
  },
];

const CESIONES_MOCK = [
  {
    id: 'CES-001',
    poliza: 'POL-AUT-00456',
    cliente: 'Carlos Mendoza Ríos',
    ramo: 'Auto',
    prima: 2800,
    cesionPct: 40,
    montoCS: 1120,
    contrato: 'RE-2025-001',
    fecha: '20/04/2025',
    tipo: 'auto',
  },
  {
    id: 'CES-002',
    poliza: 'POL-HOG-00123',
    cliente: 'María García López',
    ramo: 'Hogar',
    prima: 1200,
    cesionPct: 40,
    montoCS: 480,
    contrato: 'RE-2025-001',
    fecha: '19/04/2025',
    tipo: 'hogar',
  },
  {
    id: 'CES-003',
    poliza: 'POL-INC-00567',
    cliente: 'Roberto Salas Díaz',
    ramo: 'Incendio',
    prima: 3200,
    cesionPct: 60,
    montoCS: 1920,
    contrato: 'RE-2025-002',
    fecha: '18/04/2025',
    tipo: 'incendio',
  },
  {
    id: 'CES-004',
    poliza: 'POL-EMP-00234',
    cliente: 'Inversiones Pacífico SAC',
    ramo: 'Empresa',
    prima: 6500,
    cesionPct: 60,
    montoCS: 3900,
    contrato: 'RE-2025-002',
    fecha: '17/04/2025',
    tipo: 'empresa',
  },
  {
    id: 'CES-005',
    poliza: 'POL-AUT-00789',
    cliente: 'Lucía Torres Vega',
    ramo: 'Auto',
    prima: 1800,
    cesionPct: 40,
    montoCS: 720,
    contrato: 'RE-2025-001',
    fecha: '16/04/2025',
    tipo: 'auto',
  },
];

const ALERTAS_MOCK = [
  {
    id: 'ALT-001',
    contrato: 'RE-2025-002',
    reasegurador: 'Swiss Re',
    pct: 93.5,
    retencion: 2000000,
    acumulado: 1870000,
    nivel: 'critico',
  },
  {
    id: 'ALT-002',
    contrato: 'RE-2025-001',
    reasegurador: 'Munich Re',
    pct: 81.7,
    retencion: 1200000,
    acumulado: 980000,
    nivel: 'alerta',
  },
];

const PERIODOS_BORDEREAU = ['Abril 2025', 'Marzo 2025', 'Febrero 2025', 'Enero 2025'];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function pctColor(pct) {
  if (pct >= 90) return { bar: 'bg-rose-500', text: 'text-rose-600', bg: 'bg-rose-100' };
  if (pct >= 70) return { bar: 'bg-amber-400', text: 'text-amber-600', bg: 'bg-amber-100' };
  return { bar: 'bg-emerald-500', text: 'text-emerald-600', bg: 'bg-emerald-100' };
}

// ─── MODAL NUEVO CONTRATO ─────────────────────────────────────────────────────

function ModalNuevoContrato({ onConfirm, onClose }) {
  const [form, setForm] = useState({
    reasegurador: '',
    tipo: 'Proporcional - Cuota Parte',
    ramos: '',
    cesion: '',
    limiteContrato: '',
    vigenciaDesde: '',
    vigenciaHasta: '',
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));
  const completo =
    form.reasegurador && form.cesion && form.limiteContrato && form.vigenciaDesde && form.vigenciaHasta && form.ramos;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-lg overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="h-1 w-full bg-sky-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-sm font-bold text-text">Nuevo contrato de reaseguro</p>
              <p className="text-xs text-text-soft mt-0.5">Registra condiciones, límites y vigencia</p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text">
              <MdClose size={18} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { label: 'Reasegurador', key: 'reasegurador', placeholder: 'Ej: Munich Re' },
              { label: 'Ramos cubiertos', key: 'ramos', placeholder: 'Ej: Auto, Hogar, Incendio' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="bg-bg-soft rounded-xl p-3.5">
                <p className="text-xs text-text-soft mb-1.5">
                  {label} <span className="text-rose-500">*</span>
                </p>
                <input
                  className="w-full bg-transparent text-xs text-text outline-none placeholder:text-text-soft"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => set(key, e.target.value)}
                />
              </div>
            ))}

            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1.5">
                Tipo de contrato <span className="text-rose-500">*</span>
              </p>
              <select
                className="w-full bg-transparent text-xs text-text outline-none"
                value={form.tipo}
                onChange={(e) => set('tipo', e.target.value)}
              >
                <option>Proporcional - Cuota Parte</option>
                <option>Proporcional - Excedente</option>
                <option>No Proporcional - Exceso de Pérdida</option>
                <option>No Proporcional - Stop Loss</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-soft rounded-xl p-3.5">
                <p className="text-xs text-text-soft mb-1.5">
                  Cesión (%) <span className="text-rose-500">*</span>
                </p>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full bg-transparent text-sm font-bold text-text outline-none placeholder:text-text-soft placeholder:font-normal placeholder:text-xs"
                  placeholder="0"
                  value={form.cesion}
                  onChange={(e) => set('cesion', e.target.value)}
                />
              </div>
              <div className="bg-bg-soft rounded-xl p-3.5">
                <p className="text-xs text-text-soft mb-1.5">
                  Límite contrato (S/) <span className="text-rose-500">*</span>
                </p>
                <input
                  type="number"
                  className="w-full bg-transparent text-sm font-bold text-text outline-none placeholder:text-text-soft placeholder:font-normal placeholder:text-xs"
                  placeholder="0"
                  value={form.limiteContrato}
                  onChange={(e) => set('limiteContrato', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-soft rounded-xl p-3.5">
                <p className="text-xs text-text-soft mb-1.5">
                  Vigencia desde <span className="text-rose-500">*</span>
                </p>
                <input
                  type="date"
                  className="w-full bg-transparent text-xs text-text outline-none"
                  value={form.vigenciaDesde}
                  onChange={(e) => set('vigenciaDesde', e.target.value)}
                />
              </div>
              <div className="bg-bg-soft rounded-xl p-3.5">
                <p className="text-xs text-text-soft mb-1.5">
                  Vigencia hasta <span className="text-rose-500">*</span>
                </p>
                <input
                  type="date"
                  className="w-full bg-transparent text-xs text-text outline-none"
                  value={form.vigenciaHasta}
                  onChange={(e) => set('vigenciaHasta', e.target.value)}
                />
              </div>
            </div>

            {/* Aviso */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-soft border border-border">
              <MdLock size={13} className="text-text-soft shrink-0" />
              <p className="text-xs text-text-soft">
                Una vez asociado a una póliza emitida, la proporción de cesión no puede modificarse.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={() => completo && onConfirm(form)}
              disabled={!completo}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdSend size={13} /> Registrar contrato
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL BORDEREAU ──────────────────────────────────────────────────────────

function ModalBordereau({ onClose }) {
  const [periodo, setPeriodo] = useState(PERIODOS_BORDEREAU[0]);
  const [tipo, setTipo] = useState('primas');

  const totalPrimas = CESIONES_MOCK.reduce((a, c) => a + c.prima, 0);
  const totalCesion = CESIONES_MOCK.reduce((a, c) => a + c.montoCS, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-xl overflow-hidden shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="h-1 w-full bg-violet-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Bordereau</p>
              <p className="text-xs text-text-soft mt-0.5">Reporte de primas y siniestros cedidos por período</p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text">
              <MdClose size={18} />
            </button>
          </div>

          {/* Controles */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <select
              className="px-3 py-1.5 rounded-xl border border-border bg-bg text-xs text-text outline-none"
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
            >
              {PERIODOS_BORDEREAU.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
            <div className="flex rounded-xl border border-border overflow-hidden">
              {['primas', 'siniestros'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTipo(t)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors capitalize ${tipo === t ? 'bg-primary text-text-inverse' : 'text-text-soft hover:bg-bg-soft'}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { label: 'Prima total emitida', val: `S/ ${totalPrimas.toLocaleString()}`, icon: MdAttachMoney },
              { label: 'Total cedido', val: `S/ ${totalCesion.toLocaleString()}`, icon: MdTrendingUp },
            ].map(({ label, val, icon: Ic }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-3">
                <div className="flex items-center gap-1 mb-0.5">
                  <Ic size={11} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-sm font-bold text-text">{val}</p>
              </div>
            ))}
          </div>

          {/* Tabla */}
          <div className="rounded-xl border border-border overflow-hidden mb-4">
            <div className="grid grid-cols-4 bg-bg-soft px-3 py-2 text-xs font-semibold text-text-soft">
              <span>Póliza</span>
              <span>Ramo</span>
              <span className="text-right">Prima</span>
              <span className="text-right">Cedido</span>
            </div>
            {CESIONES_MOCK.map((c) => (
              <div key={c.id} className="grid grid-cols-4 px-3 py-2.5 text-xs border-t border-border items-center">
                <span className="text-text-soft truncate">{c.poliza}</span>
                <span className="text-text font-medium">{c.ramo}</span>
                <span className="text-right text-text tabular-nums">S/ {c.prima.toLocaleString()}</span>
                <span className="text-right font-semibold text-sky-600 tabular-nums">
                  S/ {c.montoCS.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
            <MdDownload size={14} /> Descargar bordereau ({periodo})
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DETALLE CONTRATO ─────────────────────────────────────────────────────────

function DetalleContrato({ contrato, cesiones, onBack }) {
  const pct = Math.round((contrato.acumulado / contrato.retencion) * 100);
  const col = pctColor(pct);
  const cesionesContrato = cesiones.filter((c) => c.contrato === contrato.id);
  const totalCedido = cesionesContrato.reduce((a, c) => a + c.montoCS, 0);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a reaseguro
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${contrato.accentBar}`} />

        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${contrato.accentBg}`}>
              <MdBusiness size={20} className={contrato.accentText} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-text">{contrato.reasegurador}</p>
                <span
                  className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                    contrato.estado === 'vigente' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${contrato.estado === 'vigente' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                  />
                  {contrato.estado === 'vigente' ? 'Vigente' : 'Vencido'}
                </span>
              </div>
              <p className="text-xs text-text-soft mt-0.5">{contrato.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { icon: MdShield, label: 'Tipo', val: contrato.tipo },
              { icon: MdPercent, label: 'Cesión', val: `${contrato.cesion}%` },
              { icon: MdAttachMoney, label: 'Límite contrato', val: `S/ ${contrato.limiteContrato.toLocaleString()}` },
              { icon: MdCalendarToday, label: 'Desde', val: contrato.vigenciaDesde },
              { icon: MdCalendarToday, label: 'Hasta', val: contrato.vigenciaHasta },
              { icon: MdPolicy, label: 'Ramos', val: contrato.ramos.join(', ') },
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

        {/* Retención */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Acumulación vs. Retención</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.bg} ${col.text}`}>{pct}%</span>
          </div>
          <div className="h-2 bg-bg-soft rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all ${col.bar}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-text-soft">
            <span>
              Acumulado: <strong className="text-text">S/ {contrato.acumulado.toLocaleString()}</strong>
            </span>
            <span>
              Límite retención: <strong className="text-text">S/ {contrato.retencion.toLocaleString()}</strong>
            </span>
          </div>
          {pct >= 90 && (
            <div className="mt-3 flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200">
              <MdWarningAmber size={14} className="text-rose-500 mt-0.5 shrink-0" />
              <p className="text-xs text-rose-600">
                Acumulación crítica. Se acerca al límite de retención. Revisar con el reasegurador.
              </p>
            </div>
          )}
        </div>

        {/* Aviso inmutabilidad */}
        <div className="mx-5 mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-bg-soft border border-border">
          <MdLock size={13} className="text-text-soft shrink-0" />
          <p className="text-xs text-text-soft">La proporción de cesión no puede modificarse en pólizas ya emitidas.</p>
        </div>

        {/* Cesiones vinculadas */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Cesiones vinculadas</p>
            <span className="text-xs text-text-soft tabular-nums">
              Total cedido: <strong className="text-text">S/ {totalCedido.toLocaleString()}</strong>
            </span>
          </div>
          {cesionesContrato.length === 0 ? (
            <p className="text-xs text-text-soft text-center py-4">Sin cesiones registradas.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {cesionesContrato.map((c) => (
                <div key={c.id} className="flex items-center justify-between p-2.5 rounded-xl border border-border">
                  <div>
                    <p className="text-xs font-semibold text-text">{c.poliza}</p>
                    <p className="text-xs text-text-soft">
                      {c.cliente} · {c.ramo} · {c.fecha}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <p className="text-xs text-text-soft">Prima: S/ {c.prima.toLocaleString()}</p>
                    <p className="text-xs font-bold text-sky-600">Cedido: S/ {c.montoCS.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CARD CONTRATO ────────────────────────────────────────────────────────────

function ContratoCard({ c, onSelect }) {
  const pct = Math.round((c.acumulado / c.retencion) * 100);
  const col = pctColor(pct);

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(c)}
    >
      <div className={`h-1 w-full ${c.accentBar}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.accentBg}`}>
            <MdBusiness size={22} className={c.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{c.reasegurador}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  c.estado === 'vigente' ? 'bg-emerald-100 text-emerald-700' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${c.estado === 'vigente' ? 'bg-emerald-500' : 'bg-zinc-400'}`}
                />
                {c.estado === 'vigente' ? 'Vigente' : 'Vencido'}
              </span>
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {c.id} · {c.tipo}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <MdCalendarToday size={11} className="inline mr-1" />
              {c.vigenciaDesde} – {c.vigenciaHasta}
              <span className="mx-1.5">·</span>
              <MdPercent size={11} className="inline mr-0.5" />
              {c.cesion}% cesión
            </p>
            {/* mini barra retención */}
            <div className="flex items-center gap-2 mt-2">
              <div className="w-24 h-1.5 bg-bg-soft rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
              </div>
              <span className={`text-xs font-medium ${col.text}`}>{pct}% retención</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-sm font-bold text-text">S/ {c.limiteContrato.toLocaleString()}</p>
            <p className="text-xs text-text-soft">límite</p>
            <button className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors">
              Ver <MdChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CARD CESIÓN ──────────────────────────────────────────────────────────────

function CesionCard({ c }) {
  return (
    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-bg-soft transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-bg-soft flex items-center justify-center shrink-0">
          <MdPolicy size={15} className="text-text-soft" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-text truncate">{c.poliza}</p>
          <p className="text-xs text-text-soft">
            {c.cliente} · {c.ramo} · {c.fecha}
          </p>
        </div>
      </div>
      <div className="text-right shrink-0 ml-3">
        <p className="text-xs text-text-soft tabular-nums">Prima: S/ {c.prima.toLocaleString()}</p>
        <div className="flex items-center gap-1 justify-end">
          <MdTrendingUp size={11} className="text-sky-500" />
          <p className="text-xs font-bold text-sky-600 tabular-nums">
            S/ {c.montoCS.toLocaleString()} ({c.cesionPct}%)
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function ReaseguroPage() {
  const [contratos, setContratos] = useState(CONTRATOS_MOCK);
  const [cesiones] = useState(CESIONES_MOCK);
  const [alertas] = useState(ALERTAS_MOCK);
  const [seleccionado, setSeleccionado] = useState(null);
  const [tab, setTab] = useState('contratos');
  const [modal, setModal] = useState(null);

  const handleNuevoContrato = (form) => {
    const nuevo = {
      id: `RE-2025-00${contratos.length + 1}`,
      reasegurador: form.reasegurador,
      tipo: form.tipo,
      ramos: form.ramos.split(',').map((r) => r.trim()),
      cesion: Number(form.cesion),
      limiteContrato: Number(form.limiteContrato),
      retencion: Number(form.limiteContrato) * 0.6,
      acumulado: 0,
      vigenciaDesde: form.vigenciaDesde,
      vigenciaHasta: form.vigenciaHasta,
      estado: 'vigente',
      accentBar: 'bg-emerald-400',
      accentBg: 'bg-emerald-100',
      accentText: 'text-emerald-600',
    };
    setContratos((p) => [nuevo, ...p]);
    setModal(null);
  };

  const totalCedidoMes = cesiones.reduce((a, c) => a + c.montoCS, 0);
  const contratosVigentes = contratos.filter((c) => c.estado === 'vigente').length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {modal === 'nuevo' && <ModalNuevoContrato onConfirm={handleNuevoContrato} onClose={() => setModal(null)} />}
      {modal === 'bordereau' && <ModalBordereau onClose={() => setModal(null)} />}

      {seleccionado ? (
        <DetalleContrato contrato={seleccionado} cesiones={cesiones} onBack={() => setSeleccionado(null)} />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-base font-bold text-text">Reaseguro</h1>
              <p className="text-xs text-text-soft mt-0.5">
                {contratosVigentes} contrato{contratosVigentes !== 1 ? 's' : ''} vigente
                {contratosVigentes !== 1 ? 's' : ''}
                {alertas.length > 0 && (
                  <span className="text-rose-500 font-semibold">
                    {' '}
                    · {alertas.length} alerta{alertas.length !== 1 ? 's' : ''} activa{alertas.length !== 1 ? 's' : ''}
                  </span>
                )}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModal('bordereau')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
              >
                <MdTableChart size={14} /> Bordereau
              </button>
              <button
                onClick={() => setModal('nuevo')}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdAdd size={14} /> Nuevo contrato
              </button>
            </div>
          </div>

          {/* Alertas de retención */}
          {alertas.length > 0 && (
            <div className="flex flex-col gap-2">
              {alertas.map((a) => {
                const col = pctColor(a.pct);
                return (
                  <div
                    key={a.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                      a.nivel === 'critico' ? 'bg-rose-50 border-rose-200' : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <MdNotificationsActive
                      size={15}
                      className={
                        a.nivel === 'critico' ? 'text-rose-500 mt-0.5 shrink-0' : 'text-amber-500 mt-0.5 shrink-0'
                      }
                    />
                    <div className="flex-1">
                      <p
                        className={`text-xs font-bold mb-0.5 ${a.nivel === 'critico' ? 'text-rose-700' : 'text-amber-700'}`}
                      >
                        {a.nivel === 'critico' ? 'Acumulación crítica' : 'Alerta de retención'} — {a.reasegurador}
                      </p>
                      <p className={`text-xs ${a.nivel === 'critico' ? 'text-rose-600' : 'text-amber-600'}`}>
                        Acumulado S/ {a.acumulado.toLocaleString()} de S/ {a.retencion.toLocaleString()} ({a.pct}%).
                        Contrato {a.contrato}.
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Resumen rápido */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Contratos vigentes', val: contratosVigentes, icon: MdBusiness },
              { label: 'Cesiones este mes', val: `S/ ${totalCedidoMes.toLocaleString()}`, icon: MdTrendingUp },
              { label: 'Pólizas cedidas', val: cesiones.length, icon: MdPolicy },
            ].map(({ label, val, icon: Ic }) => (
              <div key={label} className="bg-bg rounded-xl border border-border p-3.5">
                <div className="flex items-center gap-1 mb-1">
                  <Ic size={12} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-sm font-bold text-text">{val}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex rounded-xl border border-border overflow-hidden w-fit">
            {[
              { key: 'contratos', label: 'Contratos' },
              { key: 'cesiones', label: 'Cesiones automáticas' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-4 py-2 text-xs font-medium transition-colors ${tab === t.key ? 'bg-primary text-text-inverse' : 'text-text-soft hover:bg-bg-soft'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Contratos */}
          {tab === 'contratos' && (
            <div className="flex flex-col gap-3">
              {contratos.length === 0 ? (
                <p className="text-center py-12 text-xs text-text-soft">No hay contratos registrados.</p>
              ) : (
                contratos.map((c) => <ContratoCard key={c.id} c={c} onSelect={setSeleccionado} />)
              )}
            </div>
          )}

          {/* Cesiones */}
          {tab === 'cesiones' && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-bg-soft border border-border mb-1">
                <MdInfo size={13} className="text-text-soft shrink-0" />
                <p className="text-xs text-text-soft">
                  Cesiones generadas automáticamente por el sistema en cada emisión de póliza. Solo lectura.
                </p>
              </div>
              {cesiones.map((c) => (
                <CesionCard key={c.id} c={c} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
