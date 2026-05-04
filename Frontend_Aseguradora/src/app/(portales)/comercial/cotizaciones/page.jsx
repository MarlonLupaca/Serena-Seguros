'use client';

import { useState } from 'react';
import {
  MdAdd,
  MdSearch,
  MdChevronRight,
  MdClose,
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdWarningAmber,
  MdUploadFile,
  MdAttachFile,
  MdDeleteOutline,
  MdPerson,
  MdFavorite,
  MdDirectionsCar,
  MdHome,
  MdLocalHospital,
  MdBusiness,
  MdCalendarToday,
  MdReceiptLong,
  MdEdit,
  MdFilterList,
} from 'react-icons/md';

/* ─── datos simulados ─── */
const CLIENTES = [
  { id: 'C-001', nombre: 'Carlos Mendoza', dni: '47821345', email: 'c.mendoza@gmail.com' },
  { id: 'C-002', nombre: 'Lucía Paredes', dni: '52310987', email: 'l.paredes@outlook.com' },
  { id: 'C-003', nombre: 'Roberto Silva', dni: '60145230', email: 'r.silva@empresa.pe' },
  { id: 'C-004', nombre: 'Ana Torres', dni: '38921765', email: 'a.torres@gmail.com' },
];

const TIPOS = [
  {
    id: 'vida',
    label: 'Vida',
    icon: MdFavorite,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
    bar: 'bg-rose-400',
  },
  {
    id: 'vehicular',
    label: 'Vehicular',
    icon: MdDirectionsCar,
    accentBg: 'bg-blue-100',
    accentText: 'text-blue-500',
    bar: 'bg-blue-400',
  },
  {
    id: 'hogar',
    label: 'Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-500',
    bar: 'bg-amber-400',
  },
  {
    id: 'salud',
    label: 'Salud',
    icon: MdLocalHospital,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-500',
    bar: 'bg-emerald-400',
  },
  {
    id: 'empresarial',
    label: 'Empresarial',
    icon: MdBusiness,
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-500',
    bar: 'bg-violet-400',
  },
];

const ESTADOS = {
  pendiente: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', label: 'Pendiente' },
  aprobada: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Aprobada' },
  rechazada: { badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400', label: 'Rechazada' },
  doc_requerido: { badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400', label: 'Doc. requerido' },
  en_revision: { badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400', label: 'En revisión' },
};

const COTIZACIONES_INIT = [
  {
    id: 'COT-2025-001',
    clienteId: 'C-001',
    tipo: 'vehicular',
    fecha: '10 May 2025',
    monto: 'S/ 1,240.00',
    estado: 'aprobada',
    docs: [],
    motivoRechazo: '',
  },
  {
    id: 'COT-2025-002',
    clienteId: 'C-002',
    tipo: 'vida',
    fecha: '14 May 2025',
    monto: 'S/ 890.00',
    estado: 'doc_requerido',
    docs: [],
    motivoRechazo: '',
  },
  {
    id: 'COT-2025-003',
    clienteId: 'C-003',
    tipo: 'hogar',
    fecha: '18 May 2025',
    monto: 'S/ 560.00',
    estado: 'rechazada',
    docs: [],
    motivoRechazo: 'Cliente indica que el monto supera su presupuesto mensual.',
  },
  {
    id: 'COT-2025-004',
    clienteId: 'C-001',
    tipo: 'salud',
    fecha: '20 May 2025',
    monto: 'S/ 1,050.00',
    estado: 'en_revision',
    docs: [],
    motivoRechazo: '',
  },
  {
    id: 'COT-2025-005',
    clienteId: 'C-004',
    tipo: 'empresarial',
    fecha: '22 May 2025',
    monto: 'S/ 3,200.00',
    estado: 'pendiente',
    docs: [],
    motivoRechazo: '',
  },
];

/* ─── helpers ─── */
const getTipo = (id) => TIPOS.find((t) => t.id === id);
const getCliente = (id) => CLIENTES.find((c) => c.id === id);

const STEPS = ['Cliente', 'Tipo de seguro', 'Datos', 'Documentos', 'Confirmar'];

/* ─── sub-componentes pequeños ─── */
function Badge({ estado }) {
  const e = ESTADOS[estado];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${e.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} />
      {e.label}
    </span>
  );
}

function StepBar({ current }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${i < current ? 'bg-primary text-text-inverse' : i === current ? 'bg-primary text-text-inverse ring-4 ring-primary/20' : 'bg-bg-soft text-text-soft border border-border'}`}
            >
              {i < current ? <MdCheckCircle size={16} /> : i + 1}
            </div>
            <span
              className={`text-xs whitespace-nowrap ${i === current ? 'text-text font-semibold' : 'text-text-soft'}`}
            >
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-4 ${i < current ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Modal nueva cotización ─── */
function NuevaCotizacionModal({ onClose, onCrear }) {
  const [step, setStep] = useState(0);
  const [busqCliente, setBusqCliente] = useState('');
  const [clienteId, setClienteId] = useState(null);
  const [tipoId, setTipoId] = useState(null);
  const [form, setForm] = useState({ cobertura: '', prima: '', vigencia: '', notas: '' });
  const [archivos, setArchivos] = useState([]);

  const clientesFiltrados = CLIENTES.filter(
    (c) => c.nombre.toLowerCase().includes(busqCliente.toLowerCase()) || c.dni.includes(busqCliente)
  );
  const cliente = getCliente(clienteId);
  const tipo = getTipo(tipoId);

  const canNext = () => {
    if (step === 0) return !!clienteId;
    if (step === 1) return !!tipoId;
    if (step === 2) return form.cobertura && form.prima && form.vigencia;
    return true;
  };

  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...files.map((f) => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }))]);
  };

  const handleCrear = () => {
    const TipoObj = getTipo(tipoId);
    onCrear({
      clienteId,
      tipo: tipoId,
      monto: `S/ ${parseFloat(form.prima).toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
      estado: 'pendiente',
      docs: archivos,
      motivoRechazo: '',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        {/* header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="text-sm font-bold text-text">Nueva cotización</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-soft text-text-soft transition-colors">
            <MdClose size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1">
          <StepBar current={step} />

          {/* Step 0: Seleccionar cliente */}
          {step === 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-text-soft mb-1">Busca por nombre o DNI</p>
              <div className="relative">
                <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
                <input
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                  placeholder="Nombre o DNI del cliente..."
                  value={busqCliente}
                  onChange={(e) => setBusqCliente(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2 mt-1">
                {clientesFiltrados.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setClienteId(c.id)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-colors
                      ${clienteId === c.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-bg-soft flex items-center justify-center shrink-0">
                      <MdPerson size={18} className="text-text-soft" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text">{c.nombre}</p>
                      <p className="text-xs text-text-soft">
                        {c.id} · DNI {c.dni}
                      </p>
                    </div>
                    {clienteId === c.id && <MdCheckCircle size={18} className="text-primary shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Tipo de seguro */}
          {step === 1 && (
            <div className="grid grid-cols-3 gap-3">
              {TIPOS.map((t) => {
                const Icon = t.icon;
                return (
                  <div
                    key={t.id}
                    onClick={() => setTipoId(t.id)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors
                      ${tipoId === t.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${t.accentBg}`}>
                      <Icon size={22} className={t.accentText} />
                    </div>
                    <p className="text-xs font-semibold text-text">{t.label}</p>
                    {tipoId === t.id && <MdCheckCircle size={15} className="text-primary" />}
                  </div>
                );
              })}
            </div>
          )}

          {/* Step 2: Datos de la cotización */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Cobertura</label>
                  <input
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    placeholder="Ej: Cobertura total"
                    value={form.cobertura}
                    onChange={(e) => setForm({ ...form, cobertura: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Prima mensual (S/)</label>
                  <input
                    type="number"
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    placeholder="0.00"
                    value={form.prima}
                    onChange={(e) => setForm({ ...form, prima: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-soft">Vigencia</label>
                <input
                  className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                  placeholder="Ej: 12 meses"
                  value={form.vigencia}
                  onChange={(e) => setForm({ ...form, vigencia: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-soft">Notas adicionales</label>
                <textarea
                  rows={3}
                  className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary resize-none"
                  placeholder="Condiciones especiales, observaciones..."
                  value={form.notas}
                  onChange={(e) => setForm({ ...form, notas: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Documentos */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-text-soft">Adjunta documentos si el Portal de Seguros los solicita.</p>
              <label className="flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors">
                <MdUploadFile size={28} className="text-text-soft" />
                <p className="text-xs font-semibold text-text">Haz clic para adjuntar</p>
                <p className="text-xs text-text-soft">PDF, JPG, PNG hasta 10 MB</p>
                <input type="file" multiple className="hidden" onChange={handleFile} />
              </label>
              {archivos.length > 0 && (
                <div className="flex flex-col gap-2">
                  {archivos.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft">
                      <MdAttachFile size={16} className="text-primary shrink-0" />
                      <p className="text-xs text-text flex-1 truncate">{f.name}</p>
                      <span className="text-xs text-text-soft">{f.size}</span>
                      <button
                        onClick={() => setArchivos(archivos.filter((_, j) => j !== i))}
                        className="text-text-soft hover:text-rose-500 transition-colors"
                      >
                        <MdDeleteOutline size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 4: Confirmar */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              <div className={`h-1 w-full ${tipo?.bar} rounded-full`} />
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Cliente', val: cliente?.nombre },
                  { label: 'DNI', val: cliente?.dni },
                  { label: 'Tipo de seguro', val: tipo?.label },
                  { label: 'Cobertura', val: form.cobertura },
                  { label: 'Prima mensual', val: `S/ ${form.prima}` },
                  { label: 'Vigencia', val: form.vigencia },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-bg-soft rounded-xl p-3">
                    <p className="text-xs text-text-soft">{label}</p>
                    <p className="text-sm font-semibold text-text mt-0.5">{val || '—'}</p>
                  </div>
                ))}
              </div>
              {form.notas && (
                <div className="bg-bg-soft rounded-xl p-3">
                  <p className="text-xs text-text-soft">Notas</p>
                  <p className="text-xs text-text mt-0.5 leading-relaxed">{form.notas}</p>
                </div>
              )}
              {archivos.length > 0 && (
                <div className="bg-bg-soft rounded-xl p-3">
                  <p className="text-xs text-text-soft mb-2">Documentos adjuntos ({archivos.length})</p>
                  {archivos.map((f, i) => (
                    <p key={i} className="text-xs text-text flex items-center gap-1.5">
                      <MdAttachFile size={12} className="text-primary" />
                      {f.name}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-between p-5 border-t border-border">
          <button
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdArrowBack size={14} /> {step === 0 ? 'Cancelar' : 'Anterior'}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Siguiente <MdArrowForward size={14} />
            </button>
          ) : (
            <button
              onClick={handleCrear}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdCheckCircle size={14} /> Crear cotización
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Modal adjuntar documentos ─── */
function AdjuntarDocsModal({ cotizacion, onClose, onGuardar }) {
  const [archivos, setArchivos] = useState(cotizacion.docs || []);
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    setArchivos((prev) => [...prev, ...files.map((f) => ({ name: f.name, size: (f.size / 1024).toFixed(0) + ' KB' }))]);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="text-sm font-bold text-text">Adjuntar documentos</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-soft text-text-soft">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="text-xs text-text-soft">
            Cotización <span className="font-semibold text-text">{cotizacion.id}</span>
          </p>
          <label className="flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors">
            <MdUploadFile size={24} className="text-text-soft" />
            <p className="text-xs font-semibold text-text">Haz clic para adjuntar</p>
            <input type="file" multiple className="hidden" onChange={handleFile} />
          </label>
          {archivos.length > 0 && (
            <div className="flex flex-col gap-2">
              {archivos.map((f, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft">
                  <MdAttachFile size={15} className="text-primary shrink-0" />
                  <p className="text-xs text-text flex-1 truncate">{f.name}</p>
                  <span className="text-xs text-text-soft">{f.size}</span>
                  <button
                    onClick={() => setArchivos(archivos.filter((_, j) => j !== i))}
                    className="text-text-soft hover:text-rose-500"
                  >
                    <MdDeleteOutline size={15} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-2 p-5 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onGuardar(archivos)}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Modal motivo rechazo ─── */
function MotivoRechazoModal({ cotizacion, onClose, onGuardar }) {
  const [motivo, setMotivo] = useState(cotizacion.motivoRechazo || '');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="text-sm font-bold text-text">Motivo de rechazo</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-soft text-text-soft">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200">
            <MdWarningAmber size={15} className="text-rose-500 mt-0.5 shrink-0" />
            <p className="text-xs text-rose-700">Registra el motivo por el cual el cliente rechazó esta cotización.</p>
          </div>
          <p className="text-xs text-text-soft">
            Cotización <span className="font-semibold text-text">{cotizacion.id}</span>
          </p>
          <textarea
            rows={4}
            className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary resize-none"
            placeholder="Describe el motivo del rechazo..."
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-5 border-t border-border">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!motivo.trim()}
            onClick={() => onGuardar(motivo)}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Registrar rechazo
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Tarjeta cotización ─── */
function CotizacionCard({ c, onAdjuntar, onMotivo }) {
  const tipo = getTipo(c.tipo);
  const cliente = getCliente(c.clienteId);
  const Icon = tipo?.icon;
  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipo?.bar}`} />
      <div className="p-4 flex items-start gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipo?.accentBg}`}>
          <Icon size={20} className={tipo?.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">{c.id}</p>
            <Badge estado={c.estado} />
          </div>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
            <MdPerson size={11} /> {cliente?.nombre} · {cliente?.id}
          </p>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
            <MdCalendarToday size={11} /> {c.fecha}
          </p>
          {c.estado === 'rechazada' && c.motivoRechazo && (
            <p className="text-xs text-rose-600 mt-1 bg-rose-50 rounded-lg px-2 py-1 leading-relaxed">
              <span className="font-semibold">Motivo:</span> {c.motivoRechazo}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-sm font-bold text-text">{c.monto}</p>
          <div className="flex gap-1.5">
            {c.estado === 'doc_requerido' && (
              <button
                onClick={() => onAdjuntar(c)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdUploadFile size={13} /> Adjuntar docs
              </button>
            )}
            {c.estado === 'rechazada' && (
              <button
                onClick={() => onMotivo(c)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors"
              >
                <MdEdit size={13} /> {c.motivoRechazo ? 'Editar motivo' : 'Registrar motivo'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Página principal ─── */
export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState(COTIZACIONES_INIT);
  const [showNueva, setShowNueva] = useState(false);
  const [adjuntarTarget, setAdjuntarTarget] = useState(null);
  const [motivoTarget, setMotivoTarget] = useState(null);
  const [busq, setBusq] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCrear = (data) => {
    const nueva = {
      ...data,
      id: `COT-2025-${String(cotizaciones.length + 1).padStart(3, '0')}`,
      fecha: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setCotizaciones([nueva, ...cotizaciones]);
    setShowNueva(false);
    showToast('Cotización creada correctamente');
  };

  const handleGuardarDocs = (docs) => {
    setCotizaciones(cotizaciones.map((c) => (c.id === adjuntarTarget.id ? { ...c, docs } : c)));
    setAdjuntarTarget(null);
    showToast('Documentos adjuntados correctamente');
  };

  const handleGuardarMotivo = (motivo) => {
    setCotizaciones(cotizaciones.map((c) => (c.id === motivoTarget.id ? { ...c, motivoRechazo: motivo } : c)));
    setMotivoTarget(null);
    showToast('Motivo de rechazo registrado');
  };

  const filtradas = cotizaciones.filter((c) => {
    const cliente = getCliente(c.clienteId);
    const matchBusq =
      c.id.toLowerCase().includes(busq.toLowerCase()) || cliente?.nombre.toLowerCase().includes(busq.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || c.estado === filtroEstado;
    return matchBusq && matchEstado;
  });

  const contadores = Object.fromEntries(
    Object.keys(ESTADOS).map((k) => [k, cotizaciones.filter((c) => c.estado === k).length])
  );

  return (
    <div className="py-4 flex flex-col gap-6 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-text">Cotizaciones</p>
          <p className="text-xs text-text-soft mt-0.5">{cotizaciones.length} cotizaciones registradas</p>
        </div>
        <button
          onClick={() => setShowNueva(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={16} /> Nueva cotización
        </button>
      </div>

      {/* Resumen por estado */}
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(ESTADOS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFiltroEstado(filtroEstado === key ? 'todos' : key)}
            className={`rounded-xl border p-3 text-left transition-colors ${filtroEstado === key ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
          >
            <p className="text-xs text-text-soft">{val.label}</p>
            <p className="text-xl font-bold text-text mt-0.5">{contadores[key] ?? 0}</p>
          </button>
        ))}
      </div>

      {/* Buscador */}
      <div className="relative">
        <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
          placeholder="Buscar por ID o nombre de cliente..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
        />
      </div>

      {/* Listado */}
      <div className="flex flex-col gap-3">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-soft gap-2">
            <MdReceiptLong size={32} />
            <p className="text-sm font-semibold text-text">Sin resultados</p>
            <p className="text-xs">Prueba con otro filtro o búsqueda</p>
          </div>
        ) : (
          filtradas.map((c) => (
            <CotizacionCard key={c.id} c={c} onAdjuntar={setAdjuntarTarget} onMotivo={setMotivoTarget} />
          ))
        )}
      </div>

      {showNueva && <NuevaCotizacionModal onClose={() => setShowNueva(false)} onCrear={handleCrear} />}
      {adjuntarTarget && (
        <AdjuntarDocsModal
          cotizacion={adjuntarTarget}
          onClose={() => setAdjuntarTarget(null)}
          onGuardar={handleGuardarDocs}
        />
      )}
      {motivoTarget && (
        <MotivoRechazoModal
          cotizacion={motivoTarget}
          onClose={() => setMotivoTarget(null)}
          onGuardar={handleGuardarMotivo}
        />
      )}
    </div>
  );
}
