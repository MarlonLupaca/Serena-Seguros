'use client';

import { useState, useRef } from 'react';
import {
  MdArrowBack,
  MdPerson,
  MdPolicy,
  MdMyLocation,
  MdCalendarToday,
  MdSchedule,
  MdCameraAlt,
  MdAttachFile,
  MdSend,
  MdClose,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdBusiness,
  MdLocalFireDepartment,
  MdCheckCircle,
  MdImage,
  MdDescription,
  MdChevronRight,
  MdLock,
  MdAssignment,
  MdErrorOutline,
} from 'react-icons/md';

// ─── SESIÓN SIMULADA ──────────────────────────────────────────────────────────

const EVALUADOR_SESION = { id: 'EV-02', nombre: 'Ana Flores', zona: 'Lima Norte' };

// ─── DATA ─────────────────────────────────────────────────────────────────────

const TIPO_POLIZA_ICON = {
  hogar: MdShield,
  auto: MdDirectionsCar,
  vida: MdHealthAndSafety,
  empresa: MdBusiness,
  incendio: MdLocalFireDepartment,
};

const SINIESTROS_ASIGNADOS = [
  {
    id: 'SIN-2025-001',
    tipo: 'auto',
    poliza: 'POL-AUT-00456',
    cliente: 'Carlos Mendoza Ríos',
    descripcion: 'Choque lateral en Av. Javier Prado. Daño en puerta delantera y guardafango.',
    fechaSiniestro: '24/04/2025',
    zona: 'Lima Norte',
    evaluadorId: 'EV-02',
    estado: 'asignado',
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
    accentBar: 'bg-sky-400',
  },
  {
    id: 'SIN-2025-006',
    tipo: 'hogar',
    poliza: 'POL-HOG-00789',
    cliente: 'Patricia Vega Luna',
    descripcion: 'Derrumbe parcial de techo por lluvias intensas. Afecta dormitorio principal.',
    fechaSiniestro: '23/04/2025',
    zona: 'Lima Norte',
    evaluadorId: 'EV-02',
    estado: 'asignado',
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    accentBar: 'bg-amber-400',
  },
  {
    id: 'SIN-2025-007',
    tipo: 'incendio',
    poliza: 'POL-INC-00112',
    cliente: 'Almacenes del Sur SAC',
    descripcion: 'Incendio parcial en área de oficinas. Daño en equipos y mobiliario.',
    fechaSiniestro: '22/04/2025',
    zona: 'Lima Norte',
    evaluadorId: 'EV-02',
    estado: 'enviado',
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
    accentBar: 'bg-rose-400',
    evaluacionEnviada: {
      descripcionDano:
        'Quemadura total de 4 equipos de cómputo, 2 escritorios y material de archivo. Estructura no comprometida.',
      montoEstimado: 11400,
      archivos: [
        { nombre: 'foto_oficina_01.jpg', tipo: 'imagen' },
        { nombre: 'foto_equipos.jpg', tipo: 'imagen' },
        { nombre: 'acta_bomberos.pdf', tipo: 'documento' },
      ],
    },
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function ArchivoChip({ archivo, onRemove }) {
  const esImagen = archivo.tipo === 'imagen';
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-bg-soft text-xs">
      {esImagen ? (
        <MdImage size={14} className="text-sky-500 shrink-0" />
      ) : (
        <MdDescription size={14} className="text-violet-500 shrink-0" />
      )}
      <span className="text-text truncate max-w-[140px]">{archivo.nombre}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(archivo.nombre)}
          className="text-text-soft hover:text-rose-500 transition-colors ml-auto shrink-0"
        >
          <MdClose size={13} />
        </button>
      )}
    </div>
  );
}

// ─── DETALLE / FORMULARIO ─────────────────────────────────────────────────────

function DetalleEvaluacion({ s, onBack, onEnviar }) {
  const Icon = TIPO_POLIZA_ICON[s.tipo] || MdPolicy;
  const yaEnviado = s.estado === 'enviado';

  const [descripcionDano, setDescripcionDano] = useState(yaEnviado ? s.evaluacionEnviada.descripcionDano : '');
  const [montoEstimado, setMontoEstimado] = useState(yaEnviado ? String(s.evaluacionEnviada.montoEstimado) : '');
  const [archivos, setArchivos] = useState(yaEnviado ? s.evaluacionEnviada.archivos : []);
  const [enviando, setEnviando] = useState(false);
  const fileRef = useRef();

  const completo = descripcionDano.trim() && montoEstimado && archivos.length > 0;

  const handleArchivo = (e) => {
    const files = Array.from(e.target.files);
    const nuevos = files.map((f) => ({
      nombre: f.name,
      tipo: f.type.startsWith('image/') ? 'imagen' : 'documento',
    }));
    setArchivos((prev) => [...prev, ...nuevos.filter((n) => !prev.find((p) => p.nombre === n.nombre))]);
    e.target.value = '';
  };

  const handleEnviar = () => {
    if (!completo) return;
    setEnviando(true);
    setTimeout(() => {
      onEnviar(s.id, { descripcionDano, montoEstimado: Number(montoEstimado), archivos });
      setEnviando(false);
    }, 600);
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis casos
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${s.accentBar}`} />

        {/* Header */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${s.accentBg}`}>
              <Icon size={20} className={s.accentText} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-text capitalize">{s.tipo}</p>
                {yaEnviado && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Evaluación enviada
                  </span>
                )}
              </div>
              <p className="text-xs text-text-soft mt-0.5">{s.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdPerson, label: 'Asegurado', val: s.cliente },
              { icon: MdPolicy, label: 'Póliza', val: s.poliza },
              { icon: MdMyLocation, label: 'Zona', val: s.zona },
              { icon: MdCalendarToday, label: 'Fecha siniestro', val: s.fechaSiniestro },
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
            <p className="text-xs text-text-soft mb-1">Hecho reportado por el cliente</p>
            <p className="text-xs text-text">{s.descripcion}</p>
          </div>
        </div>

        {/* Aviso solo lectura */}
        {yaEnviado && (
          <div className="mx-5 mt-5 flex items-start gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <MdCheckCircle size={15} className="text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-emerald-700 mb-0.5">Evaluación completada</p>
              <p className="text-xs text-emerald-600">
                Esta evaluación ya fue enviada al operador de siniestros. No puedes modificarla.
              </p>
            </div>
          </div>
        )}

        {/* Bloque: no puede aprobar */}
        <div className="mx-5 mt-4 flex items-center gap-2 p-2.5 rounded-xl bg-bg-soft border border-border">
          <MdLock size={13} className="text-text-soft shrink-0" />
          <p className="text-xs text-text-soft">
            Solo puedes registrar tu evaluación. La aprobación y liquidación corresponden al operador de siniestros.
          </p>
        </div>

        {/* Formulario */}
        <div className="p-5 flex flex-col gap-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Tu evaluación en campo</p>

          {/* Descripción del daño */}
          <div>
            <p className="text-xs text-text-soft mb-1.5">
              Descripción del daño observado <span className="text-rose-500">*</span>
            </p>
            <div
              className={`rounded-xl border p-3.5 transition-colors ${yaEnviado ? 'bg-bg-soft border-border' : 'border-border bg-bg focus-within:border-primary'}`}
            >
              <textarea
                readOnly={yaEnviado}
                className="w-full bg-transparent text-xs text-text resize-none outline-none placeholder:text-text-soft min-h-[90px]"
                placeholder="Describe detalladamente el daño que observaste en campo..."
                value={descripcionDano}
                onChange={(e) => setDescripcionDano(e.target.value)}
              />
            </div>
          </div>

          {/* Archivos */}
          <div>
            <p className="text-xs text-text-soft mb-1.5">
              Fotos y documentos de respaldo <span className="text-rose-500">*</span>
            </p>
            {archivos.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {archivos.map((a) => (
                  <ArchivoChip
                    key={a.nombre}
                    archivo={a}
                    onRemove={yaEnviado ? null : (nombre) => setArchivos((p) => p.filter((x) => x.nombre !== nombre))}
                  />
                ))}
              </div>
            )}
            {!yaEnviado && (
              <>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleArchivo}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      fileRef.current.accept = 'image/*';
                      fileRef.current.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                  >
                    <MdCameraAlt size={14} /> Adjuntar fotos
                  </button>
                  <button
                    onClick={() => {
                      fileRef.current.accept = '.pdf,.doc,.docx';
                      fileRef.current.click();
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                  >
                    <MdAttachFile size={14} /> Adjuntar documentos
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Monto estimado */}
          <div>
            <p className="text-xs text-text-soft mb-1.5">
              Monto estimado de la pérdida (S/) <span className="text-rose-500">*</span>
            </p>
            <div
              className={`rounded-xl border p-3.5 transition-colors ${yaEnviado ? 'bg-bg-soft border-border' : 'border-border bg-bg focus-within:border-primary'}`}
            >
              <input
                type="number"
                readOnly={yaEnviado}
                className="w-full bg-transparent text-base font-bold text-text outline-none placeholder:text-text-soft placeholder:font-normal placeholder:text-sm"
                placeholder="0.00"
                value={montoEstimado}
                onChange={(e) => setMontoEstimado(e.target.value)}
              />
            </div>
          </div>

          {/* Enviar */}
          {!yaEnviado && (
            <button
              onClick={handleEnviar}
              disabled={!completo || enviando}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? (
                <>
                  <MdSchedule size={14} className="animate-spin" /> Enviando...
                </>
              ) : (
                <>
                  <MdSend size={14} /> Enviar evaluación al operador
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── CARD LISTA ───────────────────────────────────────────────────────────────

function EvaluacionCard({ s, onSelect }) {
  const Icon = TIPO_POLIZA_ICON[s.tipo] || MdPolicy;
  const yaEnviado = s.estado === 'enviado';

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
              {yaEnviado ? (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Enviado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Pendiente
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
            <p className="text-xs text-text-soft mt-0.5 line-clamp-1">
              <MdAssignment size={11} className="inline mr-1" />
              {s.descripcion}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {yaEnviado && s.evaluacionEnviada?.montoEstimado ? (
              <p className="text-sm font-bold text-text">S/ {s.evaluacionEnviada.montoEstimado.toLocaleString()}</p>
            ) : (
              <p className="text-xs text-text-soft italic">Sin monto aún</p>
            )}
            <button className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors">
              {yaEnviado ? 'Ver' : 'Evaluar'} <MdChevronRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function EvaluacionesPage() {
  const [casos, setCasos] = useState(SINIESTROS_ASIGNADOS.filter((s) => s.evaluadorId === EVALUADOR_SESION.id));
  const [seleccionado, setSeleccionado] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const handleEnviar = (id, datos) => {
    setCasos((prev) => prev.map((s) => (s.id === id ? { ...s, estado: 'enviado', evaluacionEnviada: datos } : s)));
    setSeleccionado((prev) => (prev?.id === id ? { ...prev, estado: 'enviado', evaluacionEnviada: datos } : prev));
  };

  const filtrados = filtro === 'todos' ? casos : casos.filter((s) => s.estado === filtro);
  const pendientes = casos.filter((s) => s.estado === 'asignado').length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {seleccionado ? (
        <DetalleEvaluacion s={seleccionado} onBack={() => setSeleccionado(null)} onEnviar={handleEnviar} />
      ) : (
        <>
          {/* Header */}
          <div>
            <h1 className="text-base font-bold text-text">Mis evaluaciones</h1>
            <p className="text-xs text-text-soft mt-0.5">
              <MdPerson size={11} className="inline mr-1" />
              {EVALUADOR_SESION.nombre} · {EVALUADOR_SESION.zona}
              {pendientes > 0 && (
                <span className="text-amber-600 font-semibold">
                  {' '}
                  · {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
                </span>
              )}
            </p>
          </div>

          {/* Aviso aislamiento */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-bg-soft border border-border">
            <MdLock size={13} className="text-text-soft shrink-0" />
            <p className="text-xs text-text-soft">
              Solo ves los siniestros asignados a ti. No puedes ver ni aprobar casos de otros evaluadores.
            </p>
          </div>

          {/* Filtros */}
          <div className="flex gap-2 flex-wrap">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'asignado', label: 'Pendientes' },
              { key: 'enviado', label: 'Enviados' },
            ].map((f) => (
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
                <span className="ml-1.5 tabular-nums">
                  ({casos.filter((s) => (f.key === 'todos' ? true : s.estado === f.key)).length})
                </span>
              </button>
            ))}
          </div>

          {/* Lista */}
          {filtrados.length === 0 ? (
            <div className="text-center py-12 text-xs text-text-soft">No hay casos en este estado.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtrados.map((s) => (
                <EvaluacionCard key={s.id} s={s} onSelect={setSeleccionado} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
