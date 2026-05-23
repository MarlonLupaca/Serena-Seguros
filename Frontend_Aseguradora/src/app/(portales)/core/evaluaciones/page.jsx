'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdClose,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdAssessment,
  MdAttachFile,
  MdDownload,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';

const ESTADO_TABS = [
  { key: 'PENDIENTE', label: 'Pendientes', icon: MdPending, dot: 'bg-amber-400' },
  { key: 'ACEPTADA', label: 'Aceptadas', icon: MdCheckCircle, dot: 'bg-emerald-500' },
  { key: 'RECHAZADA', label: 'Rechazadas', icon: MdCancel, dot: 'bg-rose-400' },
];

const ESTADO_STYLES = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', icon: MdPending },
  ACEPTADA: { label: 'Aceptada', badge: 'bg-emerald-100 text-emerald-700', icon: MdCheckCircle },
  RECHAZADA: { label: 'Rechazada', badge: 'bg-rose-100 text-rose-600', icon: MdCancel },
};

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
};

function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EvaluacionesPage() {
  const [evaluaciones, setEvaluaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [tabActivo, setTabActivo] = useState('PENDIENTE');
  const [busqueda, setBusqueda] = useState('');
  const [modalRechazo, setModalRechazo] = useState(null);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [procesando, setProcesando] = useState(null);

  const [modalDetalle, setModalDetalle] = useState(null);
  const [documentosRiesgo, setDocumentosRiesgo] = useState([]);

  useEffect(() => {
    cargar();
  }, [tabActivo]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet(`/evaluaciones?estado=${tabActivo}`);
      setEvaluaciones(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las evaluaciones');
    } finally {
      setCargando(false);
    }
  };

  const aprobar = async (id) => {
    setProcesando(id);
    try {
      await apiPatch(`/evaluaciones/${id}/aprobar`);
      setEvaluaciones((prev) => prev.filter((ev) => ev.id_evaluacion !== id));
      toast.success('Evaluacion aprobada');
      setModalDetalle(null);
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo aprobar');
    } finally {
      setProcesando(null);
    }
  };

  const rechazar = async () => {
    if (!modalRechazo || !motivoRechazo.trim()) {
      toast.error('Debe indicar un motivo de rechazo');
      return;
    }
    setProcesando(modalRechazo);
    try {
      await apiPatch(`/evaluaciones/${modalRechazo}/rechazar`, { motivo_rechazo: motivoRechazo.trim() });
      setEvaluaciones((prev) => prev.filter((ev) => ev.id_evaluacion !== modalRechazo));
      setModalRechazo(null);
      setMotivoRechazo('');
      toast.success('Evaluacion rechazada');
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo rechazar');
    } finally {
      setProcesando(null);
    }
  };

  const abrirDetalle = async (ev) => {
    setModalDetalle(ev);
    setDocumentosRiesgo([]);
    try {
      const docs = await apiGet(`/documentos/cotizacion/${ev.id_cotizacion}`);
      setDocumentosRiesgo(docs || []);
    } catch (e) {
      console.warn('Error al cargar documentos del riesgo', e);
    }
  };

  const filtrados = evaluaciones.filter((ev) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      String(ev.id_evaluacion).includes(q) ||
      String(ev.id_cotizacion).includes(q) ||
      (ev.tipo_seguro || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Evaluaciones de riesgo</h1>
        <p className="text-xs text-text-soft mt-0.5">Revision y aprobacion de suscripciones</p>
      </div>

      <div className="flex gap-2">
        {ESTADO_TABS.map((tab) => {
          const active = tabActivo === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setTabActivo(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                active ? 'bg-primary text-text-inverse' : 'bg-bg border border-border text-text-soft hover:bg-bg-soft'
              }`}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2">
        <MdSearch size={14} className="text-text-soft shrink-0" />
        <input
          className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
          placeholder="Buscar por ID, cotizacion o tipo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando evaluaciones...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdAssessment size={22} className="text-text-soft" />
          </div>
          <p className="text-sm font-semibold text-text">Sin evaluaciones</p>
          <p className="text-xs text-text-soft max-w-xs">
            No hay evaluaciones {ESTADO_STYLES[tabActivo]?.label.toLowerCase()}s.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((ev) => {
            const tipoStyle = estiloTipo(ev.tipo_seguro);
            const TipoIcon = tipoStyle.icon;
            const estilo = ESTADO_STYLES[ev.estado_suscripcion];
            const EstadoIcon = estilo?.icon || MdPending;
            const isPending = ev.estado_suscripcion === 'PENDIENTE';

            return (
              <div
                key={ev.id_evaluacion}
                className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow"
              >
                <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}
                    >
                      <TipoIcon size={22} className={tipoStyle.accentText} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-text">EVAL-{String(ev.id_evaluacion).padStart(6, '0')}</p>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${estilo?.badge}`}
                        >
                          <EstadoIcon size={12} /> {estilo?.label}
                        </span>
                      </div>
                      <p className="text-xs text-text-soft mt-0.5">
                        Cotizacion COT-{String(ev.id_cotizacion).padStart(6, '0')} · {ev.tipo_seguro}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-text-soft flex-wrap">
                        <span>
                          Factor riesgo: <strong className="text-text">x{ev.factor_riesgo}</strong>
                        </span>
                        <span>
                          Suma asegurada:{' '}
                          <strong className="text-text">
                            S/ {Number(ev.suma_asegurada || 0).toLocaleString('es-PE')}
                          </strong>
                        </span>
                        <span>Fecha: {formatearFecha(ev.fecha_evaluacion)}</span>
                      </div>
                      {ev.estado_suscripcion === 'RECHAZADA' && ev.motivo_rechazo && (
                        <div className="mt-2 bg-rose-50 border border-rose-200 rounded-lg p-2 text-xs text-rose-700">
                          <span className="font-semibold">Motivo: </span>
                          {ev.motivo_rechazo}
                        </div>
                      )}
                    </div>
                    {isPending && (
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => abrirDetalle(ev)}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                        >
                          <MdSearch size={16} /> Revisar expediente
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalRechazo && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-bg rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <p className="text-sm font-bold text-text">Rechazar evaluacion</p>
              <button
                onClick={() => setModalRechazo(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
              >
                <MdClose size={15} />
              </button>
            </div>
            <div className="p-5 flex flex-col gap-3">
              <label className="text-xs font-medium text-text-soft">Motivo del rechazo *</label>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                rows={3}
                placeholder="Indique el motivo por el cual se rechaza la evaluacion..."
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none resize-y"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setModalRechazo(null)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={rechazar}
                  disabled={!motivoRechazo.trim() || procesando === modalRechazo}
                  className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-colors disabled:opacity-50"
                >
                  {procesando === modalRechazo ? 'Rechazando...' : 'Confirmar rechazo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalDetalle && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-bg rounded-2xl border border-border flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div>
                <p className="text-sm font-bold text-text">Expediente de Riesgo</p>
                <p className="text-xs text-text-soft mt-0.5">
                  EVAL-{String(modalDetalle.id_evaluacion).padStart(6, '0')} · {modalDetalle.tipo_seguro}
                </p>
              </div>
              <button
                onClick={() => setModalDetalle(null)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
              >
                <MdClose size={15} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex flex-col gap-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-soft rounded-xl p-3 border border-border">
                  <p className="text-xs text-text-soft">Suma Asegurada Solicitada</p>
                  <p className="text-sm font-bold text-text mt-1">
                    S/ {Number(modalDetalle.suma_asegurada || 0).toLocaleString('es-PE')}
                  </p>
                </div>
                <div className="bg-bg-soft rounded-xl p-3 border border-border">
                  <p className="text-xs text-text-soft">Factor de Riesgo Calculado</p>
                  <p className="text-sm font-bold text-text mt-1">x {modalDetalle.factor_riesgo}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-text mb-2">Datos declarados</p>
                <div className="bg-bg-soft rounded-xl border border-border p-4">
                  {modalDetalle.datos_riesgo ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                      {Object.entries(modalDetalle.datos_riesgo).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-text-soft capitalize">{key.replace(/_/g, ' ')}</p>
                          <p className="text-sm font-medium text-text mt-0.5">
                            {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-soft">No hay datos de riesgo registrados.</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-text mb-2">Documentos de respaldo</p>
                {documentosRiesgo.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {documentosRiesgo.map((doc) => {
                      const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/v1/documentos/${doc.id_documento}/archivo`;
                      return (
                        <div
                          key={doc.id_documento}
                          className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                            <MdAttachFile size={16} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-text truncate">{doc.nombre_archivo}</p>
                            <p className="text-[10px] text-text-soft mt-0.5">
                              Subido: {formatearFecha(doc.fecha_carga)}
                            </p>
                          </div>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-bg border border-border hover:bg-bg-soft text-text-soft hover:text-text transition-colors"
                            title="Descargar"
                          >
                            <MdDownload size={16} />
                          </a>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl border border-dashed border-border flex flex-col items-center justify-center text-center">
                    <MdAttachFile size={24} className="text-border mb-2" />
                    <p className="text-xs font-medium text-text-soft">Sin documentos</p>
                    <p className="text-[10px] text-text-soft mt-1">El solicitante no adjuntó archivos de respaldo.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-border shrink-0 flex gap-3">
              <button
                onClick={() => {
                  setModalRechazo(modalDetalle.id_evaluacion);
                  setMotivoRechazo('');
                  setModalDetalle(null);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 text-sm font-semibold transition-colors"
              >
                <MdCancel size={18} /> Rechazar
              </button>
              <button
                onClick={() => aprobar(modalDetalle.id_evaluacion)}
                disabled={procesando === modalDetalle.id_evaluacion}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
              >
                <MdCheckCircle size={18} />{' '}
                {procesando === modalDetalle.id_evaluacion ? 'Aprobando...' : 'Aprobar evaluación'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
