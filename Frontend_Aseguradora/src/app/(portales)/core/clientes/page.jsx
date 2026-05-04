'use client';

import { useState } from 'react';
import {
  MdPersonAdd,
  MdCheckCircle,
  MdCancel,
  MdUploadFile,
  MdChevronRight,
  MdArrowBack,
  MdClose,
  MdVisibility,
  MdEdit,
  MdDescription,
  MdPerson,
  MdPhone,
  MdEmail,
  MdLocationOn,
  MdCalendarToday,
  MdBadge,
  MdWarning,
  MdInfo,
  MdSwapHoriz,
  MdBlock,
} from 'react-icons/md';

// ─── Data ─────────────────────────────────────────────────────────────────────

const DOCS_REQUERIDOS = ['DNI / Carnet de extranjería', 'Comprobante de domicilio', 'Foto de perfil'];

const PENDIENTES_ACTIVACION = [
  {
    id: 'CLI-0091',
    nombre: 'Ricardo Montoya',
    email: 'r.montoya@gmail.com',
    telefono: '+51 987 001 122',
    zona: 'Lima Norte',
    fechaSolicitud: '24 abr 2025',
    documentos: [
      { nombre: 'DNI / Carnet de extranjería', estado: 'ok' },
      { nombre: 'Comprobante de domicilio', estado: 'ok' },
      { nombre: 'Foto de perfil', estado: 'faltante' },
    ],
    comercial: 'Ana Ríos',
  },
  {
    id: 'CLI-0090',
    nombre: 'Patricia Villanueva',
    email: 'patricia.v@empresa.pe',
    telefono: '+51 912 334 455',
    zona: 'Lima Centro',
    fechaSolicitud: '23 abr 2025',
    documentos: [
      { nombre: 'DNI / Carnet de extranjería', estado: 'ok' },
      { nombre: 'Comprobante de domicilio', estado: 'pendiente' },
      { nombre: 'Foto de perfil', estado: 'ok' },
    ],
    comercial: 'Carlos Vega',
  },
  {
    id: 'CLI-0088',
    nombre: 'Óscar Llerena',
    email: 'oscar.ll@hotmail.com',
    telefono: '+51 956 778 899',
    zona: 'Callao',
    fechaSolicitud: '21 abr 2025',
    documentos: [
      { nombre: 'DNI / Carnet de extranjería', estado: 'ok' },
      { nombre: 'Comprobante de domicilio', estado: 'ok' },
      { nombre: 'Foto de perfil', estado: 'ok' },
    ],
    comercial: 'Lucía Paredes',
  },
];

const SOLICITUDES_CAMBIO = [
  {
    id: 'CAM-0031',
    clienteId: 'CLI-0045',
    cliente: 'Carmen Delgado',
    tipo: 'Cambio de dirección',
    valorAnterior: 'Av. Brasil 1240, Jesús María',
    valorNuevo: 'Calle Los Pinos 340, San Borja',
    fecha: '25 abr 2025',
    doc: 'Comprobante de domicilio adjunto',
  },
  {
    id: 'CAM-0030',
    clienteId: 'CLI-0038',
    cliente: 'Jorge Castillo',
    tipo: 'Corrección de apellido',
    valorAnterior: 'Castilo',
    valorNuevo: 'Castillo',
    fecha: '24 abr 2025',
    doc: 'DNI adjunto',
  },
  {
    id: 'CAM-0029',
    clienteId: 'CLI-0022',
    cliente: 'Sofía Ramos',
    tipo: 'Cambio de correo',
    valorAnterior: 'sofia.r@hotmail.com',
    valorNuevo: 'sofia.ramos@gmail.com',
    fecha: '22 abr 2025',
    doc: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function DocEstado({ estado }) {
  if (estado === 'ok') return <MdCheckCircle size={14} className="text-emerald-500 shrink-0" />;
  if (estado === 'faltante') return <MdCancel size={14} className="text-rose-400 shrink-0" />;
  return <MdWarning size={14} className="text-amber-500 shrink-0" />;
}

function docLabel(estado) {
  if (estado === 'ok') return 'Recibido';
  if (estado === 'faltante') return 'Faltante';
  return 'Pendiente';
}

function docColor(estado) {
  if (estado === 'ok') return 'text-emerald-600';
  if (estado === 'faltante') return 'text-rose-500';
  return 'text-amber-600';
}

function documentosCompletos(docs) {
  return docs.every((d) => d.estado === 'ok');
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

function ModalRechazar({ nombre, onClose, onConfirmar }) {
  const [comentario, setComentario] = useState('');
  return (
    <ModalBase
      titulo="Rechazar registro"
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
            disabled={!comentario.trim()}
            onClick={() => {
              onConfirmar(comentario);
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
        Indica el motivo del rechazo para <span className="font-semibold text-text">{nombre}</span>. El sistema
        notificará al cliente.
      </p>
      <textarea
        rows={4}
        className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2.5 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors resize-none"
        placeholder="Ej. Los documentos no son legibles o no corresponden al titular..."
        value={comentario}
        onChange={(e) => setComentario(e.target.value)}
      />
    </ModalBase>
  );
}

function ModalSolicitarDocs({ nombre, docs, onClose, onConfirmar }) {
  const faltantes = docs.filter((d) => d.estado !== 'ok');
  const [seleccionados, setSeleccionados] = useState(faltantes.map((d) => d.nombre));
  const [extra, setExtra] = useState('');
  const toggle = (n) => setSeleccionados((p) => (p.includes(n) ? p.filter((x) => x !== n) : [...p, n]));

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
        Selecciona los documentos que faltan para <span className="font-semibold text-text">{nombre}</span>.
      </p>
      <div className="flex flex-col gap-1.5">
        {DOCS_REQUERIDOS.map((d) => (
          <button
            key={d}
            onClick={() => toggle(d)}
            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors text-left ${
              seleccionados.includes(d)
                ? 'border-primary bg-primary/5 text-primary'
                : 'border-border hover:bg-bg-soft text-text-soft'
            }`}
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
      <textarea
        rows={2}
        className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2.5 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors resize-none"
        placeholder="Instrucciones adicionales (opcional)"
        value={extra}
        onChange={(e) => setExtra(e.target.value)}
      />
    </ModalBase>
  );
}

function ModalRechazarCambio({ cambio, onClose, onConfirmar }) {
  const [motivo, setMotivo] = useState('');
  return (
    <ModalBase
      titulo="Rechazar solicitud"
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
        Motivo del rechazo para <span className="font-semibold text-text">{cambio.tipo}</span> de {cambio.cliente}.
      </p>
      <textarea
        rows={3}
        className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2.5 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors resize-none"
        placeholder="Indica el motivo..."
        value={motivo}
        onChange={(e) => setMotivo(e.target.value)}
      />
    </ModalBase>
  );
}

// ─── Detalle cliente ──────────────────────────────────────────────────────────

function DetalleCliente({ cliente, onBack, onActivar, onRechazar, onSolicitarDocs }) {
  const [modalRechazar, setModalRechazar] = useState(false);
  const [modalDocs, setModalDocs] = useState(false);
  const completos = documentosCompletos(cliente.documentos);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a clientes
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-primary" />
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl bg-bg-soft border border-border flex items-center justify-center text-sm font-bold text-text-soft shrink-0">
              {cliente.nombre
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-bold text-text">{cliente.nombre}</p>
              <p className="text-xs text-text-soft">
                {cliente.id} · Solicitud: {cliente.fechaSolicitud}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: MdEmail, val: cliente.email },
              { icon: MdPhone, val: cliente.telefono },
              { icon: MdLocationOn, val: cliente.zona },
              { icon: MdPerson, val: cliente.comercial },
            ].map(({ icon: Icon, val }) => (
              <div key={val} className="bg-bg-soft rounded-xl p-2.5 flex items-center gap-2">
                <Icon size={12} className="text-text-soft shrink-0" />
                <p className="text-xs text-text truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Documentos adjuntos</p>
          <div className="flex flex-col gap-2">
            {cliente.documentos.map((d) => (
              <div
                key={d.nombre}
                className="flex items-center justify-between gap-3 py-1.5 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-2">
                  <DocEstado estado={d.estado} />
                  <p className="text-xs text-text">{d.nombre}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium ${docColor(d.estado)}`}>{docLabel(d.estado)}</span>
                  {d.estado === 'ok' && (
                    <button className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors border border-border rounded-lg px-2 py-1">
                      <MdVisibility size={11} /> Ver
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!completos && (
          <div className="mx-5 mt-4 flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <MdWarning size={15} className="text-amber-500 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-700">
              Hay documentos faltantes o pendientes. Puedes solicitar los documentos o rechazar el registro.
            </p>
          </div>
        )}

        <div className="p-5 flex flex-col gap-2">
          <button
            onClick={onActivar}
            disabled={!completos}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
          >
            <MdCheckCircle size={15} /> Activar cliente
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

      {modalRechazar && (
        <ModalRechazar nombre={cliente.nombre} onClose={() => setModalRechazar(false)} onConfirmar={onRechazar} />
      )}
      {modalDocs && (
        <ModalSolicitarDocs
          nombre={cliente.nombre}
          docs={cliente.documentos}
          onClose={() => setModalDocs(false)}
          onConfirmar={onSolicitarDocs}
        />
      )}
    </div>
  );
}

// ─── Cards ────────────────────────────────────────────────────────────────────

function CardActivacion({ cliente, onSelect }) {
  const completos = documentosCompletos(cliente.documentos);
  const faltantes = cliente.documentos.filter((d) => d.estado !== 'ok').length;

  return (
    <button
      onClick={() => onSelect(cliente)}
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden text-left w-full group"
    >
      <div className={`h-1 w-full ${completos ? 'bg-emerald-400' : 'bg-amber-400'}`} />
      <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className="w-10 h-10 rounded-xl bg-bg-soft border border-border flex items-center justify-center text-xs font-bold text-text-soft shrink-0">
          {cliente.nombre
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <p className="text-xs font-bold text-text">{cliente.nombre}</p>
            {completos ? (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                <MdCheckCircle size={10} /> Listo para activar
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <MdWarning size={10} /> {faltantes} doc. pendiente{faltantes > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-text-soft">
            {cliente.id} · {cliente.email}
          </p>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
            <MdCalendarToday size={10} /> {cliente.fechaSolicitud} · <MdPerson size={10} /> {cliente.comercial}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-text-soft group-hover:text-text transition-colors shrink-0 mt-1">
          Revisar <MdChevronRight size={14} />
        </div>
      </div>
    </button>
  );
}

function CardCambio({ cambio, onAprobar, onRechazar }) {
  const [modalRechazar, setModalRechazar] = useState(false);
  return (
    <>
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-violet-400" />
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                <p className="text-xs font-bold text-text">{cambio.cliente}</p>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  <MdSwapHoriz size={11} /> {cambio.tipo}
                </span>
              </div>
              <p className="text-xs text-text-soft">
                {cambio.id} · {cambio.clienteId} · {cambio.fecha}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 bg-bg-soft rounded-xl p-3 mb-3">
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] text-text-soft uppercase tracking-wide">Valor anterior</p>
              <p className="text-xs font-medium text-text line-through opacity-60">{cambio.valorAnterior}</p>
            </div>
            <div className="w-full h-px bg-border" />
            <div className="flex flex-col gap-0.5">
              <p className="text-[10px] text-text-soft uppercase tracking-wide">Valor nuevo</p>
              <p className="text-xs font-bold text-text">{cambio.valorNuevo}</p>
            </div>
          </div>

          {cambio.doc && (
            <div className="flex items-center gap-2 mb-3">
              <MdDescription size={12} className="text-text-soft" />
              <p className="text-xs text-text-soft">{cambio.doc}</p>
              <button className="ml-auto text-xs text-text-soft hover:text-text transition-colors border border-border rounded-lg px-2 py-1 flex items-center gap-1">
                <MdVisibility size={11} /> Ver
              </button>
            </div>
          )}
          {!cambio.doc && (
            <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200">
              <MdInfo size={12} className="text-amber-500 shrink-0" />
              <p className="text-xs text-amber-700">Sin documento de respaldo adjunto</p>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onAprobar(cambio)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdCheckCircle size={13} /> Aprobar
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
      {modalRechazar && (
        <ModalRechazarCambio
          cambio={cambio}
          onClose={() => setModalRechazar(false)}
          onConfirmar={(motivo) => onRechazar(cambio, motivo)}
        />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TABS = ['Por activar', 'Cambios de datos'];

export default function ClientesPage() {
  const [tab, setTab] = useState('Por activar');
  const [clienteDetalle, setClienteDetalle] = useState(null);
  const [pendientes, setPendientes] = useState(PENDIENTES_ACTIVACION);
  const [cambios, setCambios] = useState(SOLICITUDES_CAMBIO);

  const handleActivar = (cliente) => {
    setPendientes((p) => p.filter((c) => c.id !== cliente.id));
    setClienteDetalle(null);
  };

  const handleRechazar = (cliente) => {
    setPendientes((p) => p.filter((c) => c.id !== cliente.id));
    setClienteDetalle(null);
  };

  const handleSolicitarDocs = () => setClienteDetalle(null);

  const handleAprobarCambio = (cambio) => {
    setCambios((p) => p.filter((c) => c.id !== cambio.id));
  };

  const handleRechazarCambio = (cambio) => {
    setCambios((p) => p.filter((c) => c.id !== cambio.id));
  };

  if (clienteDetalle) {
    return (
      <div className="py-4 flex flex-col gap-4 pb-8">
        <DetalleCliente
          cliente={clienteDetalle}
          onBack={() => setClienteDetalle(null)}
          onActivar={() => handleActivar(clienteDetalle)}
          onRechazar={(comentario) => handleRechazar(clienteDetalle, comentario)}
          onSolicitarDocs={handleSolicitarDocs}
        />
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-text">Clientes</h1>
        <p className="text-xs text-text-soft mt-0.5">Activaciones pendientes y solicitudes de cambio</p>
      </div>

      {/* Aviso desactivar */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-bg-soft border border-border">
        <MdBlock size={13} className="text-text-soft mt-0.5 shrink-0" />
        <p className="text-xs text-text-soft">
          Los clientes no pueden eliminarse, solo desactivarse. Para desactivar un cliente ve a su perfil.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-soft border border-border rounded-xl p-1">
        {TABS.map((t) => {
          const count = t === 'Por activar' ? pendientes.length : cambios.length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-colors ${
                tab === t ? 'bg-bg text-text shadow-sm border border-border' : 'text-text-soft hover:text-text'
              }`}
            >
              {t}
              {count > 0 && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    tab === t
                      ? t === 'Por activar'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-violet-100 text-violet-700'
                      : 'bg-bg-soft text-text-soft border border-border'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab: Por activar */}
      {tab === 'Por activar' && (
        <>
          {pendientes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
                <MdCheckCircle size={22} className="text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-text">Todo al día</p>
              <p className="text-xs text-text-soft">No hay registros pendientes de activación.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {pendientes.map((c) => (
                <CardActivacion key={c.id} cliente={c} onSelect={setClienteDetalle} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab: Cambios de datos */}
      {tab === 'Cambios de datos' && (
        <>
          {cambios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
                <MdCheckCircle size={22} className="text-emerald-400" />
              </div>
              <p className="text-sm font-semibold text-text">Sin solicitudes pendientes</p>
              <p className="text-xs text-text-soft">No hay cambios de datos por revisar.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cambios.map((c) => (
                <CardCambio key={c.id} cambio={c} onAprobar={handleAprobarCambio} onRechazar={handleRechazarCambio} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
