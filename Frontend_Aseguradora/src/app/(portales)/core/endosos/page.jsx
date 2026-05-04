'use client';

import { useState } from 'react';
import {
  MdArrowBack,
  MdCheckCircle,
  MdCancel,
  MdOpenInNew,
  MdAttachFile,
  MdTrendingUp,
  MdTrendingDown,
  MdSchedule,
  MdVerified,
  MdWarningAmber,
  MdPerson,
  MdPolicy,
  MdEdit,
  MdSend,
  MdPictureAsPdf,
  MdClose,
  MdArrowUpward,
} from 'react-icons/md';

// ─── DATA MOCK ───────────────────────────────────────────────────────────────

const UMBRAL_ALTO = 500;

const ENDOSOS_MOCK = [
  {
    id: 'END-2024-001',
    tipo: 'Cambio de Beneficiario',
    poliza: 'POL-VID-00123',
    cliente: 'María García López',
    estado: 'pendiente',
    fechaSolicitud: '20/04/2025',
    impacto: 0,
    tipoImpacto: 'neutro',
    documentos: ['DNI_beneficiario.pdf', 'Formulario_cambio.pdf'],
    descripcion: 'Cambio de beneficiario principal a hijo mayor de edad.',
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
  },
  {
    id: 'END-2024-002',
    tipo: 'Ampliación de Suma Asegurada',
    poliza: 'POL-HOG-00456',
    cliente: 'Carlos Mendoza Ríos',
    estado: 'pendiente',
    fechaSolicitud: '21/04/2025',
    impacto: 1240,
    tipoImpacto: 'adicional',
    documentos: ['Tasacion_inmueble.pdf', 'Solicitud_ampliacion.pdf', 'Foto_fachada.jpg'],
    descripcion: 'Incremento de suma asegurada de S/ 80,000 a S/ 120,000 por remodelación.',
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
  },
  {
    id: 'END-2024-003',
    tipo: 'Exclusión de Conductor',
    poliza: 'POL-AUT-00789',
    cliente: 'Lucía Torres Vega',
    estado: 'pendiente',
    fechaSolicitud: '22/04/2025',
    impacto: 180,
    tipoImpacto: 'devolucion',
    documentos: ['Solicitud_exclusion.pdf'],
    descripcion: 'Exclusión de conductor secundario registrado en la póliza.',
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
  },
  {
    id: 'END-2024-004',
    tipo: 'Cambio de Dirección de Riesgo',
    poliza: 'POL-HOG-00234',
    cliente: 'Roberto Salas Díaz',
    estado: 'escalado',
    fechaSolicitud: '19/04/2025',
    impacto: 870,
    tipoImpacto: 'adicional',
    documentos: ['Contrato_alquiler.pdf', 'Planos_nuevo.pdf', 'DNI_titular.pdf'],
    descripcion: 'Cambio de dirección de riesgo a zona de mayor exposición sísmica.',
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
  },
  {
    id: 'END-2024-005',
    tipo: 'Reducción de Cobertura',
    poliza: 'POL-EMP-00901',
    cliente: 'Inversiones Pacífico SAC',
    estado: 'aprobado',
    fechaSolicitud: '18/04/2025',
    impacto: 320,
    tipoImpacto: 'devolucion',
    documentos: ['Solicitud_reduccion.pdf', 'Acta_directorio.pdf'],
    descripcion: 'Reducción de cobertura de responsabilidad civil de S/500k a S/200k.',
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
  },
];

const ESTADO_CONFIG = {
  pendiente: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  escalado: { label: 'Escalado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  aprobado: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  rechazado: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-500' },
};

// ─── MODAL RECHAZO ────────────────────────────────────────────────────────────

function ModalRechazo({ endoso, onConfirm, onClose }) {
  const [motivo, setMotivo] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-rose-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Rechazar endoso</p>
              <p className="text-xs text-text-soft mt-0.5">
                {endoso.id} · {endoso.cliente}
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
              placeholder="Describe el motivo del rechazo para notificar al cliente..."
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
              <MdSend size={13} /> Rechazar y notificar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ESCALAR ────────────────────────────────────────────────────────────

function ModalEscalar({ endoso, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-violet-400" />
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-text">Escalar al Portal Ejecutivo</p>
              <p className="text-xs text-text-soft mt-0.5">
                {endoso.id} · {endoso.cliente}
              </p>
            </div>
            <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
              <MdClose size={18} />
            </button>
          </div>
          <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50 border border-violet-200 mb-4">
            <MdArrowUpward size={16} className="text-violet-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-violet-700 mb-0.5">Impacto económico alto</p>
              <p className="text-xs text-violet-600">
                Este endoso supera el umbral de S/ {UMBRAL_ALTO.toLocaleString()} y requiere aprobación ejecutiva. El
                caso quedará en estado <strong>Escalado</strong> hasta recibir respuesta.
              </p>
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
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <MdSend size={13} /> Escalar ahora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DETALLE ENDOSO ───────────────────────────────────────────────────────────

function DetalleEndoso({ endoso, onBack, onAprobar, onEscalar, onRechazar }) {
  const est = ESTADO_CONFIG[endoso.estado];
  const esAlto = endoso.impacto > UMBRAL_ALTO;
  const esPendiente = endoso.estado === 'pendiente';

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a la cola
      </button>

      {/* Header */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${endoso.accentBg.replace('100', '400')}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${endoso.accentBg}`}>
                <MdEdit size={20} className={endoso.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{endoso.tipo}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                  {esAlto && esPendiente && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                      <MdWarningAmber size={11} /> Impacto alto
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-soft mt-0.5">{endoso.id}</p>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdPerson, label: 'Cliente', val: endoso.cliente },
              { icon: MdPolicy, label: 'Póliza', val: endoso.poliza },
              { icon: MdSchedule, label: 'Solicitud', val: endoso.fechaSolicitud },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon size={11} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-xs font-semibold text-text truncate">{val}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 bg-bg-soft rounded-xl p-3">
            <p className="text-xs text-text-soft mb-1">Descripción</p>
            <p className="text-xs text-text">{endoso.descripcion}</p>
          </div>
        </div>

        {/* Documentos */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">
            Documentos adjuntos ({endoso.documentos.length})
          </p>
          <div className="flex flex-col gap-2">
            {endoso.documentos.map((doc) => (
              <div
                key={doc}
                className="flex items-center justify-between p-2.5 rounded-xl border border-border hover:bg-bg-soft transition-colors"
              >
                <div className="flex items-center gap-2">
                  <MdAttachFile size={14} className="text-text-soft" />
                  <span className="text-xs text-text">{doc}</span>
                </div>
                <button className="text-xs text-primary flex items-center gap-1 hover:underline">
                  <MdOpenInNew size={12} /> Ver
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Impacto económico */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Impacto económico</p>
          {endoso.tipoImpacto === 'neutro' ? (
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-bg-soft">
              <MdCheckCircle size={16} className="text-emerald-500" />
              <p className="text-xs text-text">Sin impacto económico — ajuste administrativo</p>
            </div>
          ) : (
            <div
              className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                endoso.tipoImpacto === 'adicional' ? 'bg-sky-50 border-sky-200' : 'bg-emerald-50 border-emerald-200'
              }`}
            >
              {endoso.tipoImpacto === 'adicional' ? (
                <MdTrendingUp size={18} className="text-sky-500 mt-0.5 shrink-0" />
              ) : (
                <MdTrendingDown size={18} className="text-emerald-500 mt-0.5 shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={`text-xs font-bold mb-0.5 ${endoso.tipoImpacto === 'adicional' ? 'text-sky-700' : 'text-emerald-700'}`}
                >
                  {endoso.tipoImpacto === 'adicional' ? 'Prima adicional' : 'Devolución de prima'}
                </p>
                <p
                  className={`text-xl font-bold ${endoso.tipoImpacto === 'adicional' ? 'text-sky-700' : 'text-emerald-700'}`}
                >
                  S/ {endoso.impacto.toLocaleString()}
                </p>
                {esAlto && (
                  <p className="text-xs text-text-soft mt-1">
                    Supera umbral de S/ {UMBRAL_ALTO.toLocaleString()} → requiere aprobación ejecutiva
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Acciones */}
        {esPendiente && (
          <div className="p-5 flex flex-wrap gap-2">
            <button
              onClick={() => onRechazar(endoso)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdCancel size={14} /> Rechazar
            </button>
            {esAlto ? (
              <button
                onClick={() => onEscalar(endoso)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold transition-colors"
              >
                <MdArrowUpward size={14} /> Escalar al Portal Ejecutivo
              </button>
            ) : (
              <button
                onClick={() => onAprobar(endoso)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdCheckCircle size={14} /> Aprobar y ejecutar endoso
              </button>
            )}
          </div>
        )}

        {endoso.estado === 'aprobado' && (
          <div className="p-5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 mb-4">
              <MdVerified size={16} className="text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-emerald-700 mb-0.5">Endoso aprobado y ejecutado</p>
                <p className="text-xs text-emerald-600">La póliza fue actualizada y se generó el PDF del endoso.</p>
              </div>
            </div>
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
              <MdPictureAsPdf size={14} /> Descargar PDF del endoso
            </button>
          </div>
        )}

        {endoso.estado === 'escalado' && (
          <div className="p-5">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-violet-50 border border-violet-200">
              <MdSchedule size={16} className="text-violet-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-violet-700 mb-0.5">Esperando aprobación ejecutiva</p>
                <p className="text-xs text-violet-600">
                  El caso fue escalado al Portal Ejecutivo. Recibirás una notificación cuando se resuelva.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CARD COLA ────────────────────────────────────────────────────────────────

function EndosoCard({ e, onSelect }) {
  const est = ESTADO_CONFIG[e.estado];
  const esAlto = e.impacto > UMBRAL_ALTO;

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(e)}
    >
      <div className={`h-1 w-full ${e.accentBg.replace('100', '400')}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${e.accentBg}`}>
            <MdEdit size={22} className={e.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{e.tipo}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
              {esAlto && e.estado === 'pendiente' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  <MdWarningAmber size={11} /> Impacto alto
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {e.id} · {e.cliente}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <MdPolicy size={11} className="inline mr-1" />
              {e.poliza}
              <span className="mx-1.5">·</span>
              <MdSchedule size={11} className="inline mr-1" />
              {e.fechaSolicitud}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {e.tipoImpacto === 'neutro' ? (
              <span className="text-xs text-text-soft">Sin impacto</span>
            ) : (
              <div className="text-right">
                <p className="text-xs text-text-soft">
                  {e.tipoImpacto === 'adicional' ? 'Prima adicional' : 'Devolución'}
                </p>
                <p
                  className={`text-base font-bold ${e.tipoImpacto === 'adicional' ? 'text-sky-600' : 'text-emerald-600'}`}
                >
                  S/ {e.impacto.toLocaleString()}
                </p>
              </div>
            )}
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors">
              Revisar <MdOpenInNew size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
// ─── PAGE PRINCIPAL ───────────────────────────────────────────────────────────

export default function EndososPage() {
  const [endosos, setEndosos] = useState(ENDOSOS_MOCK);
  const [seleccionado, setSeleccionado] = useState(null);
  const [modalRechazo, setModalRechazo] = useState(false);
  const [modalEscalar, setModalEscalar] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'pendiente', label: 'Pendientes' },
    { key: 'escalado', label: 'Escalados' },
    { key: 'aprobado', label: 'Aprobados' },
    { key: 'rechazado', label: 'Rechazados' },
  ];

  // Agregamos ?. por seguridad en el map
  const endososFiltrados = filtro === 'todos' ? endosos : endosos.filter((e) => e?.estado === filtro);

  // Validamos que 'id' exista y usamos ?.
  const actualizarEstado = (id, nuevoEstado) => {
    if (!id) return;
    setEndosos((prev) => prev.map((e) => (e?.id === id ? { ...e, estado: nuevoEstado } : e)));
  };

  const handleAprobar = (endoso) => {
    if (!endoso?.id) return;
    actualizarEstado(endoso.id, 'aprobado');
    // Validamos que prev exista antes de mutarlo
    setSeleccionado((prev) => (prev ? { ...prev, estado: 'aprobado' } : null));
  };

  const handleEscalar = () => {
    if (!seleccionado?.id) return; // Evita el "Cannot read properties of null"
    actualizarEstado(seleccionado.id, 'escalado');
    setSeleccionado((prev) => (prev ? { ...prev, estado: 'escalado' } : null));
    setModalEscalar(false);
  };

  const handleRechazar = (motivo) => {
    if (!seleccionado?.id) return; // Evita el "Cannot read properties of null"
    actualizarEstado(seleccionado.id, 'rechazado');
    setSeleccionado((prev) => (prev ? { ...prev, estado: 'rechazado' } : null));
    setModalRechazo(false);
    console.log('Motivo rechazo:', motivo);
  };

  const pendientesCount = endosos.filter((e) => e?.estado === 'pendiente').length;
  const escaladosCount = endosos.filter((e) => e?.estado === 'escalado').length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* Modales */}
      {modalRechazo && seleccionado && (
        <ModalRechazo endoso={seleccionado} onConfirm={handleRechazar} onClose={() => setModalRechazo(false)} />
      )}
      {modalEscalar && seleccionado && (
        <ModalEscalar endoso={seleccionado} onConfirm={handleEscalar} onClose={() => setModalEscalar(false)} />
      )}

      {seleccionado ? (
        <DetalleEndoso
          endoso={seleccionado}
          onBack={() => setSeleccionado(null)}
          onAprobar={handleAprobar}
          onEscalar={() => setModalEscalar(true)}
          onRechazar={() => setModalRechazo(true)}
        />
      ) : (
        <>
          {/* Header */}
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-base font-bold text-text">Cola de Endosos</h1>
              <p className="text-xs text-text-soft mt-0.5">
                {pendientesCount} pendiente{pendientesCount !== 1 ? 's' : ''} · {escaladosCount} escalado
                {escaladosCount !== 1 ? 's' : ''}
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
                  <span className="ml-1.5 tabular-nums">({endosos.filter((e) => e?.estado === f.key).length})</span>
                )}
              </button>
            ))}
          </div>

          {/* Lista */}
          {endososFiltrados.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-soft">No hay endosos en este estado.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {endososFiltrados.map((e) => (
                <EndosoCard key={e?.id} e={e} onSelect={setSeleccionado} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
