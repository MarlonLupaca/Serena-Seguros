'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdFactCheck,
  MdSearch,
  MdPerson,
  MdBadge,
  MdEmail,
  MdPhone,
  MdCalendarToday,
  MdCheckCircle,
  MdCancel,
  MdEditNote,
  MdClose,
  MdDescription,
  MdInsertDriveFile,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  APROBADO: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  CORRECCION: { label: 'En correccion', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ValidacionesPage() {
  const [validaciones, setValidaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('PENDIENTE');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
const [accion, setAccion] = useState(null);
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/validaciones');
      setValidaciones(data || []);
      if (data && data[0]) setSeleccionada((s) => s ?? data[0]);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las validaciones');
    } finally {
      setCargando(false);
    }
  };
const filtradas = validaciones.filter((v) => {
    const matchFiltro = filtro === 'todos' || v.estado === filtro;
    const t = busqueda.toLowerCase();
    const matchBusq =
      t === '' ||
      (v.cliente_nombre || '').toLowerCase().includes(t) ||
      (v.cliente_documento || '').includes(t) ||
      String(v.id_validacion).includes(t);
    return matchFiltro && matchBusq;
  });

  const aprobar = async () => {
    if (!seleccionada) return;
    setEnviando(true);
    try {
      const data = await apiPatch(`/validaciones/${seleccionada.id_validacion}/aprobar`);
      actualizarTras(data, 'Validación aprobada');
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo aprobar');
    } finally {
      setEnviando(false);
    }
  };

  const confirmarRechazoOCorreccion = async () => {
    if (!seleccionada || !motivo.trim()) return;
    setEnviando(true);
    const ruta = accion === 'rechazar' ? 'rechazar' : 'correccion';
    try {
      const data = await apiPatch(`/validaciones/${seleccionada.id_validacion}/${ruta}`, { motivo: motivo.trim() });
      actualizarTras(data, ruta === 'rechazar' ? 'Validación rechazada' : 'Se solicitó corrección al cliente');
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo guardar');
    } finally {
      setEnviando(false);
    }
  };

  const actualizarTras = (data, msg) => {
    setValidaciones((prev) => prev.map((v) => (v.id_validacion === data.id_validacion ? data : v)));
    setSeleccionada(data);
    setAccion(null);
    setMotivo('');
    toast.success(msg);
  };

  const counts = Object.keys(ESTADOS).reduce(
    (acc, k) => ({ ...acc, [k]: validaciones.filter((v) => v.estado === k).length }),
    { total: validaciones.length }
  );

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div>
        <h1 className="text-base font-bold text-text">Validación de identidad y documentos</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Revisa los datos digitados y los documentos adjuntos antes de activar al cliente o emitir póliza.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Kpi label="Total" val={counts.total} dot="bg-text-soft" />
        {Object.entries(ESTADOS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFiltro(filtro === k ? 'todos' : k)}
            className={`text-left rounded-xl border p-3 transition-colors ${
              filtro === k ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
              <p className="text-xs text-text-soft">{v.label}</p>
            </div>
            <p className="text-lg font-bold text-text">{counts[k] || 0}</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Lista a la izquierda */}
        <div className="lg:col-span-1 flex flex-col gap-3">
          <div className="relative">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar cliente o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
            />
          </div>

          {cargando ? (
            <div className="bg-bg rounded-2xl border border-border p-6 text-center text-sm text-text-soft">
              Cargando...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 text-center">
              {error}
            </div>
          ) : filtradas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-6 text-center">
              <MdFactCheck size={28} className="text-text-soft mx-auto mb-2 opacity-40" />
              <p className="text-sm text-text-soft">Sin validaciones</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
              {filtradas.map((v) => {
                const est = ESTADOS[v.estado] || ESTADOS.PENDIENTE;
                const activa = seleccionada?.id_validacion === v.id_validacion;
                return (
                  <button
                    key={v.id_validacion}
                    onClick={() => {
                      setSeleccionada(v);
                      setAccion(null);
                      setMotivo('');
                    }}
                    className={`text-left p-3 rounded-xl border transition-colors ${
                      activa ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-bold text-text truncate">
                        VAL-{String(v.id_validacion).padStart(6, '0')}
                      </p>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${est.badge}`}
                      >
                        {est.label}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-text truncate">{v.cliente_nombre}</p>
                    <p className="text-xs text-text-soft mt-0.5">DNI {v.cliente_documento}</p>
                    <p className="text-[11px] text-text-soft mt-1">Ingresó: {formatearFecha(v.fecha_ingreso)}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Doble panel a la derecha */}
        <div className="lg:col-span-2">
          {!seleccionada ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Selecciona una validación de la lista.
            </div>
          ) : (
            <div className="bg-bg rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-bold text-text">
                    VAL-{String(seleccionada.id_validacion).padStart(6, '0')}
                  </p>
                  <p className="text-xs text-text-soft mt-0.5">
                    Ingresó: {formatearFecha(seleccionada.fecha_ingreso)}
                    {seleccionada.fecha_resolucion && (
                      <> · Resuelta: {formatearFecha(seleccionada.fecha_resolucion)}</>
                    )}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    ESTADOS[seleccionada.estado]?.badge || 'bg-bg-soft text-text-soft'
                  }`}
                >
                  {ESTADOS[seleccionada.estado]?.label || seleccionada.estado}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border">
                {/* IZQUIERDA: datos digitados */}
                <div className="p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
                    Datos del cliente
                  </p>
                  <Campo icono={MdPerson} label="Nombre completo" valor={seleccionada.cliente_nombre} />
                  <Campo icono={MdBadge} label="Documento" valor={seleccionada.cliente_documento} />
                  <Campo icono={MdEmail} label="Email" valor={seleccionada.cliente_email} />
                  <Campo
                    icono={MdPhone}
                    label="Teléfono"
                    valor={seleccionada.cliente_telefono || 'Sin registrar'}
                  />
                  {seleccionada.validador_nombre && (
                    <Campo
                      icono={MdCalendarToday}
                      label="Validado por"
                      valor={seleccionada.validador_nombre}
                    />
                  )}
                  {seleccionada.motivo_rechazo && (
                    <div className="mt-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
                      <p className="text-xs font-semibold text-rose-700 mb-1">
                        Motivo registrado
                      </p>
                      <p className="text-xs text-rose-600">{seleccionada.motivo_rechazo}</p>
                    </div>
                  )}
                </div>

                {/* DERECHA: documentos adjuntos */}
                <div className="p-5 flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
                    Documentos adjuntos
                  </p>
                  {seleccionada.id_documento ? (
                    <div className="p-3 rounded-xl border border-border bg-bg-soft flex items-start gap-3">
                      <MdInsertDriveFile size={28} className="text-primary shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text">
                          Documento adjunto #{seleccionada.id_documento}
                        </p>
                        <p className="text-xs text-text-soft mt-0.5">
                          Cargado por el cliente para validación
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border-2 border-dashed border-border rounded-xl text-center text-xs text-text-soft">
                      <MdDescription size={28} className="mx-auto mb-2 opacity-40" />
                      No se adjuntó documento. Solicita al cliente cargar su identificación.
                    </div>
                  )}
                </div>
              </div>

              {/* Acciones */}
              {seleccionada.estado === 'PENDIENTE' ? (
                <div className="px-5 py-4 border-t border-border flex flex-wrap gap-2">
                  <button
                    onClick={aprobar}
                    disabled={enviando}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <MdCheckCircle size={14} /> Aprobar
                  </button>
                  <button
                    onClick={() => {
                      setAccion('correccion');
                      setMotivo('');
                    }}
                    disabled={enviando}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-sky-200 hover:bg-sky-50 text-sky-700 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <MdEditNote size={14} /> Solicitar corrección
                  </button>
                  <button
                    onClick={() => {
                      setAccion('rechazar');
                      setMotivo('');
                    }}
                    disabled={enviando}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    <MdCancel size={14} /> Rechazar
                  </button>
                </div>
              ) : (
                <div className="px-5 py-3 border-t border-border bg-bg-soft text-xs text-text-soft">
                  Validación cerrada — sin acciones adicionales.
                </div>
              )}

              {accion && (
                <ModalMotivo
                  titulo={accion === 'rechazar' ? 'Rechazar validación' : 'Solicitar corrección'}
                  motivo={motivo}
                  setMotivo={setMotivo}
                  enviando={enviando}
                  onCancelar={() => {
                    setAccion(null);
                    setMotivo('');
                  }}
                  onConfirmar={confirmarRechazoOCorreccion}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, val, dot }) {
  return (
    <div className="bg-bg rounded-xl border border-border p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        <p className="text-xs text-text-soft">{label}</p>
      </div>
      <p className="text-lg font-bold text-text">{val}</p>
    </div>
  );
}

function Campo({ icono: Icono, label, valor }) {
  return (
    <div>
      <p className="text-[11px] text-text-soft flex items-center gap-1 mb-0.5">
        <Icono size={11} /> {label}
      </p>
      <p className="text-sm font-semibold text-text break-words">{valor || '—'}</p>
    </div>
  );
}

function ModalMotivo({ titulo, motivo, setMotivo, enviando, onCancelar, onConfirmar }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">{titulo}</p>
          <button onClick={onCancelar} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onConfirmar();
          }}
          className="p-5 flex flex-col gap-3"
        >
          <label className="text-xs font-medium text-text-soft">Motivo (obligatorio)</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
            rows={4}
            placeholder="Detalla el motivo para que el cliente lo entienda..."
            className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={enviando || !motivo.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Guardando...' : 'Confirmar'}
            </button>
            <button
              type="button"
              onClick={onCancelar}
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
