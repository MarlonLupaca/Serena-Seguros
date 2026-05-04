'use client';

import { useState } from 'react';
import {
  MdDirectionsCar,
  MdHome,
  MdFavorite,
  MdShield,
  MdCheckCircle,
  MdCancel,
  MdUploadFile,
  MdChevronRight,
  MdArrowBack,
  MdClose,
  MdVisibility,
  MdWarning,
  MdInfo,
  MdPictureAsPdf,
  MdReceipt,
  MdSend,
  MdLock,
  MdPerson,
  MdCalendarToday,
  MdAttachMoney,
  MdDescription,
} from 'react-icons/md';

// ─── Data ─────────────────────────────────────────────────────────────────────

const RAMOS = {
  vehicular: { label: 'Vehicular', icon: MdDirectionsCar, accentBg: 'bg-sky-100', accentText: 'text-sky-700' },
  hogar: { label: 'Hogar', icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-700' },
  vida: { label: 'Vida', icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-600' },
  salud: { label: 'Salud', icon: MdShield, accentBg: 'bg-emerald-100', accentText: 'text-emerald-700' },
};

const RIESGO_CONFIG = {
  bajo: {
    label: 'Riesgo bajo',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    barra: 'bg-emerald-400',
  },
  medio: { label: 'Riesgo medio', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', barra: 'bg-amber-400' },
  alto: { label: 'Riesgo alto', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400', barra: 'bg-rose-400' },
};

const COLA = [
  {
    id: 'COT-0184',
    cliente: 'Ricardo Montoya',
    clienteId: 'CLI-0091',
    ramo: 'vehicular',
    producto: 'Todo Riesgo',
    prima: 'S/ 1,240',
    primaAnual: 1240,
    vigencia: '01 may 2025 – 01 may 2026',
    riesgo: 'bajo',
    comercial: 'Ana Ríos',
    fechaCot: '24 abr 2025',
    documentos: [
      { nombre: 'DNI del titular', estado: 'ok' },
      { nombre: 'Tarjeta de propiedad', estado: 'ok' },
      { nombre: 'Inspección vehicular', estado: 'ok' },
    ],
    detalle: {
      marca: 'Toyota',
      modelo: 'Corolla 2023',
      placa: 'ABC-123',
      uso: 'Particular',
      zona: 'Lima Metropolitana',
    },
  },
  {
    id: 'COT-0183',
    cliente: 'Patricia Villanueva',
    clienteId: 'CLI-0090',
    ramo: 'hogar',
    producto: 'Premium',
    prima: 'S/ 480',
    primaAnual: 480,
    vigencia: '01 may 2025 – 01 may 2026',
    riesgo: 'medio',
    comercial: 'Carlos Vega',
    fechaCot: '23 abr 2025',
    documentos: [
      { nombre: 'DNI del titular', estado: 'ok' },
      { nombre: 'Título de propiedad', estado: 'ok' },
      { nombre: 'Tasación del inmueble', estado: 'pendiente' },
    ],
    detalle: { tipo: 'Departamento', zona: 'Lima Centro', valor: 'S/ 320,000', antiguedad: '8 años' },
  },
  {
    id: 'COT-0182',
    cliente: 'Óscar Llerena',
    clienteId: 'CLI-0088',
    ramo: 'vida',
    producto: 'Estándar',
    prima: 'S/ 160',
    primaAnual: 160,
    vigencia: '01 may 2025 – 01 may 2026',
    riesgo: 'alto',
    comercial: 'Lucía Paredes',
    fechaCot: '21 abr 2025',
    documentos: [
      { nombre: 'DNI del titular', estado: 'ok' },
      { nombre: 'Declaración de salud', estado: 'faltante' },
      { nombre: 'Examen médico', estado: 'faltante' },
    ],
    detalle: { edad: '52 años', sumaAsegurada: 'S/ 100,000', fumador: 'No', beneficiario: 'Carmen Llerena' },
  },
  {
    id: 'COT-0181',
    cliente: 'Sofía Ramos',
    clienteId: 'CLI-0022',
    ramo: 'salud',
    producto: 'Básico',
    prima: 'S/ 210',
    primaAnual: 210,
    vigencia: '01 may 2025 – 01 may 2026',
    riesgo: 'bajo',
    comercial: 'Diego Mora',
    fechaCot: '20 abr 2025',
    documentos: [
      { nombre: 'DNI del titular', estado: 'ok' },
      { nombre: 'Declaración de salud', estado: 'ok' },
    ],
    detalle: { edad: '28 años', beneficiarios: '1 adicional', cobertura: 'Nacional', deducible: 'S/ 500' },
  },
];

const DOCS_EXTRA = [
  'Tasación del inmueble',
  'Examen médico',
  'Declaración de salud',
  'Inspección adicional',
  'Carta de representante legal',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function docEstadoIcon(estado) {
  if (estado === 'ok') return <MdCheckCircle size={14} className="text-emerald-500 shrink-0" />;
  if (estado === 'faltante') return <MdCancel size={14} className="text-rose-400 shrink-0" />;
  return <MdWarning size={14} className="text-amber-500 shrink-0" />;
}
function docEstadoLabel(estado) {
  if (estado === 'ok') return <span className="text-xs font-medium text-emerald-600">Recibido</span>;
  if (estado === 'faltante') return <span className="text-xs font-medium text-rose-500">Faltante</span>;
  return <span className="text-xs font-medium text-amber-600">Pendiente</span>;
}
function docsCompletos(docs) {
  return docs.every((d) => d.estado === 'ok');
}
function docsFaltantes(docs) {
  return docs.filter((d) => d.estado !== 'ok');
}

// ─── Modales ──────────────────────────────────────────────────────────────────

function ModalBase({ titulo, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">{titulo}</p>
          <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">{children}</div>
        {footer && <div className="px-5 py-4 border-t border-border flex gap-2">{footer}</div>}
      </div>
    </div>
  );
}

function ModalConfirmar({ cot, onClose, onConfirmar }) {
  return (
    <ModalBase
      titulo="Confirmar emisión"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onConfirmar();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Confirmar y emitir
          </button>
        </>
      }
    >
      <p className="text-xs text-text-soft">Al confirmar, el sistema generará automáticamente:</p>
      <div className="flex flex-col gap-2">
        {[
          { icon: MdPictureAsPdf, label: 'Póliza en PDF' },
          { icon: MdReceipt, label: 'Recibos de prima' },
          { icon: MdSend, label: 'Envío al cliente por correo' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-bg-soft border border-border">
            <Icon size={15} className="text-primary shrink-0" />
            <p className="text-xs font-medium text-text">{label}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 p-3 rounded-xl bg-bg-soft border border-border">
        <MdLock size={13} className="text-text-soft shrink-0" />
        <p className="text-xs text-text-soft">
          La prima de <span className="font-semibold text-text">{cot.prima}/año</span> no puede modificarse.
        </p>
      </div>
    </ModalBase>
  );
}

function ModalRechazar({ cliente, onClose, onConfirmar }) {
  const [motivo, setMotivo] = useState('');
  return (
    <ModalBase
      titulo="Rechazar cotización"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!motivo.trim()}
            onClick={() => {
              onConfirmar(motivo);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Rechazar y notificar
          </button>
        </>
      }
    >
      <p className="text-xs text-text-soft">
        Motivo del rechazo para <span className="font-semibold text-text">{cliente}</span>. El sistema notificará al
        cliente y al comercial.
      </p>
      <textarea
        rows={4}
        className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2.5 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors resize-none"
        placeholder="Ej. El riesgo no es asegurable por historial de siniestros previos..."
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
    </ModalBase>
  );
}

function ModalSolicitarDocs({ cliente, onClose, onConfirmar }) {
  const [seleccionados, setSeleccionados] = useState([]);
  const toggle = (d) => setSeleccionados((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));
  return (
    <ModalBase
      titulo="Solicitar documentos"
      onClose={onClose}
      footer={
        <>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={seleccionados.length === 0}
            onClick={() => {
              onConfirmar(seleccionados);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Solicitar y notificar
          </button>
        </>
      }
    >
      <p className="text-xs text-text-soft">
        Documentos adicionales para <span className="font-semibold text-text">{cliente}</span>.
      </p>
      <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto">
        {DOCS_EXTRA.map((d) => (
          <button
            key={d}
            onClick={() => toggle(d)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors text-left ${seleccionados.includes(d) ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:bg-bg-soft text-text-soft'}`}
          >
            <div
              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${seleccionados.includes(d) ? 'bg-primary border-primary' : 'border-border'}`}
            >
              {seleccionados.includes(d) && <MdCheckCircle size={12} className="text-white" />}
            </div>
            {d}
          </button>
        ))}
      </div>
    </ModalBase>
  );
}

// ─── Detalle cotización ───────────────────────────────────────────────────────

function DetalleCotizacion({ cot, onBack, onEmitir, onRechazar, onSolicitar }) {
  const ramo = RAMOS[cot.ramo];
  const riesgo = RIESGO_CONFIG[cot.riesgo];
  const Icon = ramo.icon;
  const completos = docsCompletos(cot.documentos);
  const faltantes = docsFaltantes(cot.documentos);
  const esManual = cot.riesgo !== 'bajo';

  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalRechazar, setModalRechazar] = useState(false);
  const [modalDocs, setModalDocs] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a emisiones
      </button>

      {/* Cabecera */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${riesgo.barra}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ramo.accentBg}`}>
                <Icon size={22} className={ramo.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{cot.cliente}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${riesgo.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${riesgo.dot}`} />
                    {riesgo.label}
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  {cot.id} · {ramo.label} {cot.producto}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-soft">Prima anual</p>
              <p className="text-xl font-bold text-text mt-0.5">{cot.prima}</p>
              <div className="flex items-center gap-1 mt-0.5 justify-end">
                <MdLock size={10} className="text-text-soft" />
                <p className="text-[10px] text-text-soft">No modificable</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdCalendarToday, label: 'Vigencia', val: cot.vigencia },
              { icon: MdPerson, label: 'Comercial', val: cot.comercial },
              { icon: MdCalendarToday, label: 'Fecha cotización', val: cot.fechaCot },
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

        {/* Detalle del producto */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Detalle del riesgo</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {Object.entries(cot.detalle).map(([k, v]) => (
              <div key={k} className="flex flex-col">
                <span className="text-[10px] text-text-soft capitalize">{k.replace(/([A-Z])/g, ' $1')}</span>
                <span className="text-xs font-medium text-text">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Documentos */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Documentos requeridos</p>
          <div className="flex flex-col gap-1.5">
            {cot.documentos.map((d) => (
              <div
                key={d.nombre}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  {docEstadoIcon(d.estado)}
                  <p className="text-xs text-text">{d.nombre}</p>
                </div>
                <div className="flex items-center gap-2">
                  {docEstadoLabel(d.estado)}
                  {d.estado === 'ok' && (
                    <button className="flex items-center gap-1 text-xs text-text-soft hover:text-text border border-border rounded-lg px-2 py-1 transition-colors">
                      <MdVisibility size={11} /> Ver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        {!completos && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <MdWarning size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Faltan {faltantes.length} documento{faltantes.length > 1 ? 's' : ''} obligatorio
              {faltantes.length > 1 ? 's' : ''}. Debes solicitarlos antes de confirmar la emisión.
            </p>
          </div>
        )}

        {esManual && completos && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <MdInfo size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Riesgo {cot.riesgo}. Esta cotización requiere revisión manual antes de emitir.
            </p>
          </div>
        )}

        {/* Acciones */}
        <div className="p-5 flex flex-col gap-2">
          <button
            disabled={!completos}
            onClick={() => setModalConfirmar(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <MdPictureAsPdf size={15} /> Confirmar emisión
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setModalDocs(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdUploadFile size={13} /> Solicitar documentos
            </button>
            <button
              onClick={() => setModalRechazar(true)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-medium text-rose-500 transition-colors"
            >
              <MdCancel size={13} /> Rechazar
            </button>
          </div>
        </div>
      </div>

      {modalConfirmar && <ModalConfirmar cot={cot} onClose={() => setModalConfirmar(false)} onConfirmar={onEmitir} />}
      {modalRechazar && (
        <ModalRechazar cliente={cot.cliente} onClose={() => setModalRechazar(false)} onConfirmar={onRechazar} />
      )}
      {modalDocs && (
        <ModalSolicitarDocs cliente={cot.cliente} onClose={() => setModalDocs(false)} onConfirmar={onSolicitar} />
      )}
    </div>
  );
}

// ─── Card cola ────────────────────────────────────────────────────────────────

function CotizacionCard({ cot, onSelect }) {
  const ramo = RAMOS[cot.ramo];
  const riesgo = RIESGO_CONFIG[cot.riesgo];
  const Icon = ramo.icon;
  const completos = docsCompletos(cot.documentos);
  const faltantes = docsFaltantes(cot.documentos).length;

  return (
    <button
      onClick={() => onSelect(cot)}
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden text-left w-full group"
    >
      <div className={`h-1 w-full ${riesgo.barra}`} />
      <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${ramo.accentBg}`}>
          <Icon size={20} className={ramo.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-xs font-bold text-text">{cot.cliente}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${riesgo.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${riesgo.dot}`} />
              {riesgo.label}
            </span>
            {!completos && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <MdWarning size={10} /> {faltantes} doc. pendiente{faltantes > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-text-soft">
            {cot.id} · {ramo.label} {cot.producto}
          </p>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            <span className="text-xs text-text-soft flex items-center gap-1">
              <MdAttachMoney size={11} />
              {cot.prima}/año
            </span>
            <span className="text-xs text-text-soft flex items-center gap-1">
              <MdPerson size={11} />
              {cot.comercial}
            </span>
            <span className="text-xs text-text-soft">{cot.fechaCot}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {cot.riesgo === 'bajo' && completos && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">
              Emisión directa
            </span>
          )}
          {cot.riesgo !== 'bajo' && (
            <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700">
              Revisión manual
            </span>
          )}
          <div className="flex items-center gap-1 text-xs text-text-soft group-hover:text-text transition-colors">
            Revisar <MdChevronRight size={14} />
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS_FILTRO = ['Todas', 'Bajo', 'Medio', 'Alto'];

export default function EmisionesPage() {
  const [cola, setCola] = useState(COLA);
  const [detalle, setDetalle] = useState(null);
  const [filtro, setFiltro] = useState('Todas');

  const cotActual = cola.find((c) => c.id === detalle?.id);

  const handleEmitir = (cot) => {
    setCola((p) => p.filter((c) => c.id !== cot.id));
    setDetalle(null);
  };
  const handleRechazar = (cot) => {
    setCola((p) => p.filter((c) => c.id !== cot.id));
    setDetalle(null);
  };
  const handleSolicitar = () => setDetalle(null);

  const cotFiltradas = cola.filter((c) => filtro === 'Todas' || c.riesgo === filtro.toLowerCase());
  const countPorRiesgo = {
    bajo: cola.filter((c) => c.riesgo === 'bajo').length,
    medio: cola.filter((c) => c.riesgo === 'medio').length,
    alto: cola.filter((c) => c.riesgo === 'alto').length,
  };

  if (detalle && cotActual) {
    return (
      <div className="py-4 flex flex-col gap-4 pb-8">
        <DetalleCotizacion
          cot={cotActual}
          onBack={() => setDetalle(null)}
          onEmitir={() => handleEmitir(cotActual)}
          onRechazar={() => handleRechazar(cotActual)}
          onSolicitar={handleSolicitar}
        />
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-text">Emisiones</h1>
        <p className="text-xs text-text-soft mt-0.5">Cola de cotizaciones aceptadas pendientes de emisión</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          {
            label: 'Riesgo bajo',
            count: countPorRiesgo.bajo,
            badge: 'bg-emerald-100 text-emerald-700',
            desc: 'Emisión directa',
          },
          {
            label: 'Riesgo medio',
            count: countPorRiesgo.medio,
            badge: 'bg-amber-100 text-amber-700',
            desc: 'Revisión manual',
          },
          {
            label: 'Riesgo alto',
            count: countPorRiesgo.alto,
            badge: 'bg-rose-100 text-rose-600',
            desc: 'Revisión manual',
          },
        ].map(({ label, count, badge, desc }) => (
          <div key={label} className="bg-bg rounded-xl border border-border p-3">
            <p className="text-2xl font-bold text-text tabular-nums">{count}</p>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-1 ${badge}`}>
              {label}
            </span>
            <p className="text-[10px] text-text-soft mt-0.5">{desc}</p>
          </div>
        ))}
      </div>

      {/* Aviso prima */}
      <div className="flex items-center gap-2.5 p-3 rounded-xl bg-bg-soft border border-border">
        <MdLock size={13} className="text-text-soft shrink-0" />
        <p className="text-xs text-text-soft">
          La prima calculada por el motor de tarifas{' '}
          <span className="font-semibold text-text">no puede modificarse</span>.
        </p>
      </div>

      {/* Filtro por riesgo */}
      <div className="flex gap-1 bg-bg-soft border border-border rounded-xl p-1">
        {TABS_FILTRO.map((t) => (
          <button
            key={t}
            onClick={() => setFiltro(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${filtro === t ? 'bg-bg text-text shadow-sm border border-border' : 'text-text-soft hover:text-text'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Lista */}
      {cotFiltradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdCheckCircle size={22} className="text-emerald-400" />
          </div>
          <p className="text-sm font-semibold text-text">Cola vacía</p>
          <p className="text-xs text-text-soft">No hay cotizaciones pendientes de emisión.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {cotFiltradas.map((c) => (
            <CotizacionCard key={c.id} cot={c} onSelect={setDetalle} />
          ))}
        </div>
      )}
    </div>
  );
}
