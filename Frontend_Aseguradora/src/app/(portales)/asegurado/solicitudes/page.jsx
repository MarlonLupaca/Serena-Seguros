'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdArrowForward,
  MdRefresh,
  MdClose,
  MdLock,
} from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary', label: 'Vehicular' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600', label: 'Salud' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500', label: 'Vida' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600', label: 'Hogar' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600', label: 'Viaje' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600', label: 'Empresa' },
};

const ESTADO_KANBAN = {
  NUEVO: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700' },
  CONTACTADO: { label: 'Contactado', badge: 'bg-violet-100 text-violet-700' },
  EN_PROPUESTA: { label: 'En propuesta', badge: 'bg-amber-100 text-amber-700' },
  NEGOCIACION: { label: 'Negociacion', badge: 'bg-blue-100 text-blue-700' },
  GANADO: { label: 'Ganado', badge: 'bg-emerald-100 text-emerald-700' },
  PERDIDO: { label: 'Perdido', badge: 'bg-rose-100 text-rose-600' },
};

const ESTADO_EVAL = {
  PENDIENTE: { label: 'Pendiente de aprobacion', badge: 'bg-amber-100 text-amber-700', icon: MdPending, description: 'Tu evaluacion esta siendo revisada por el area tecnica.' },
  ACEPTADA: { label: 'Aprobada', badge: 'bg-emerald-100 text-emerald-700', icon: MdCheckCircle, description: 'Evaluacion aprobada. Puedes continuar con la propuesta.' },
  RECHAZADA: { label: 'Rechazada', badge: 'bg-rose-100 text-rose-600', icon: MdCancel, description: 'Evaluacion rechazada. Puedes modificar tus datos y reintentar.' },
};

function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft', label: tipo };
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function MisSolicitudesPage() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-cotizaciones');
      setCotizaciones(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const filtradas = cotizaciones.filter((c) => {
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      String(c.id_cotizacion).includes(q) ||
      (c.producto_interes || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-8 py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Mis solicitudes</h1>
          <p className="text-xs text-text-soft mt-0.5">
            {cotizaciones.length} solicitud{cotizaciones.length !== 1 ? 'es' : ''} de seguro
          </p>
        </div>
        <button
          onClick={cargar}
          disabled={cargando}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
        >
          <MdRefresh size={14} className={cargando ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2">
        <MdSearch size={14} className="text-text-soft shrink-0" />
        <input
          className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
          placeholder="Buscar por ID o tipo de seguro..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando solicitudes...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdShield size={22} className="text-text-soft" />
          </div>
          <p className="text-sm font-semibold text-text">Sin solicitudes</p>
          <p className="text-xs text-text-soft max-w-xs">
            Aun no has realizado ninguna solicitud de seguro. Ve a "Cotizar y contratar" para comenzar.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map((cot) => {
            const tipoStyle = estiloTipo(cot.producto_interes);
            const TipoIcon = tipoStyle.icon;
            const kanban = ESTADO_KANBAN[cot.estado_kanban] || { label: cot.estado_kanban, badge: 'bg-bg-soft text-text-soft' };
            const evalInfo = cot.estado_evaluacion ? ESTADO_EVAL[cot.estado_evaluacion] : null;
            const EvalIcon = evalInfo?.icon || MdPending;

            return (
              <div
                key={cot.id_cotizacion}
                className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setDetalle(cot)}
              >
                <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
                      <TipoIcon size={22} className={tipoStyle.accentText} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-text">COT-{String(cot.id_cotizacion).padStart(6, '0')}</p>
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${kanban.badge}`}>
                          {kanban.label}
                        </span>
                        {cot.tipo_origen === 'RENOVACION' && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Renovacion
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-soft mt-0.5">{tipoStyle.label}</p>
                      <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
                        <span>{formatearFecha(cot.fecha_ingreso)}</span>
                        {cot.prima_estimada && <span>Prima: {formatearMoneda(cot.prima_estimada)}</span>}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {evalInfo ? (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${evalInfo.badge}`}>
                          <EvalIcon size={13} /> {evalInfo.label}
                        </span>
                      ) : cot.estado_kanban !== 'GANADO' && cot.estado_kanban !== 'PERDIDO' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-bg-soft text-text-soft">
                          Sin evaluacion
                        </span>
                      ) : null}
                      <button className="flex items-center gap-1 text-xs text-primary font-medium hover:underline">
                        Ver detalle <MdArrowForward size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {detalle && (
        <DetalleModal cotizacion={detalle} onClose={() => setDetalle(null)} onRefresh={cargar} />
      )}
    </div>
  );
}

function DetalleModal({ cotizacion, onClose, onRefresh }) {
  const [evaluacion, setEvaluacion] = useState(null);
  const [propuesta, setPropuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [verificando, setVerificando] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [declaracionVeraz, setDeclaracionVeraz] = useState(false);
  const [aceptando, setAceptando] = useState(false);

  const tipoStyle = estiloTipo(cotizacion.producto_interes);
  const TipoIcon = tipoStyle.icon;

  useEffect(() => {
    cargarDetalle();
  }, [cotizacion.id_cotizacion]);

  const cargarDetalle = async () => {
    setCargando(true);
    try {
      const [evalResp, propResp] = await Promise.allSettled([
        apiGet(`/mis-cotizaciones/${cotizacion.id_cotizacion}/evaluacion`),
        apiGet(`/mis-cotizaciones/${cotizacion.id_cotizacion}/propuesta`),
      ]);
      if (evalResp.status === 'fulfilled') setEvaluacion(evalResp.value);
      if (propResp.status === 'fulfilled') setPropuesta(propResp.value);
    } catch (e) {
      // silently ignore — fields stay null
    } finally {
      setCargando(false);
    }
  };

  const verificarEstado = async () => {
    setVerificando(true);
    try {
      const resp = await apiGet(`/mis-cotizaciones/${cotizacion.id_cotizacion}/evaluacion`);
      setEvaluacion(resp);
      onRefresh();
    } catch (e) {
      // ignore
    } finally {
      setVerificando(false);
    }
  };

  const aceptarPropuesta = async () => {
    if (!aceptaTerminos || !declaracionVeraz) {
      toast.error('Debes aceptar los términos y declarar la veracidad de la información.');
      return;
    }
    setAceptando(true);
    try {
      await apiPost(`/mis-cotizaciones/${cotizacion.id_cotizacion}/aceptar`, {
        acepta_terminos: aceptaTerminos,
        declaracion_veraz: declaracionVeraz,
      });
      toast.success('¡Felicidades! Póliza emitida exitosamente.');
      onRefresh();
      onClose();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo aceptar la propuesta.');
    } finally {
      setAceptando(false);
    }
  };

  const estadoEval = evaluacion?.estado_suscripcion || cotizacion.estado_evaluacion;
  const evalInfo = estadoEval ? ESTADO_EVAL[estadoEval] : null;
  const EvalIcon = evalInfo?.icon || MdPending;

  const pasos = [
    { key: 'solicitud', label: 'Solicitud creada', done: true },
    { key: 'evaluacion', label: 'Evaluacion de riesgo', done: !!estadoEval },
    { key: 'aprobacion', label: 'Aprobacion tecnica', done: estadoEval === 'ACEPTADA' || cotizacion.estado_kanban === 'GANADO' },
    { key: 'propuesta', label: 'Propuesta formal', done: !!propuesta },
    { key: 'contratacion', label: 'Contratacion', done: cotizacion.estado_kanban === 'GANADO' },
  ];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tipoStyle.accentBg}`}>
              <TipoIcon size={18} className={tipoStyle.accentText} />
            </div>
            <div>
              <p className="text-sm font-bold text-text">COT-{String(cotizacion.id_cotizacion).padStart(6, '0')}</p>
              <p className="text-xs text-text-soft">{tipoStyle.label} · {formatearFecha(cotizacion.fecha_ingreso)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {cargando ? (
            <div className="py-8 text-center text-sm text-text-soft">Cargando detalle...</div>
          ) : (
            <>
              {/* Progress tracker */}
              <div className="flex items-center gap-1">
                {pasos.map((paso, i) => (
                  <div key={paso.key} className="flex items-center gap-1 flex-1">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold shrink-0 ${
                      paso.done ? 'bg-primary text-text-inverse' : 'bg-bg-soft text-text-soft border border-border'
                    }`}>
                      {paso.done ? <MdCheckCircle size={14} /> : i + 1}
                    </div>
                    <p className={`text-xs truncate ${paso.done ? 'text-text font-medium' : 'text-text-soft'}`}>
                      {paso.label}
                    </p>
                    {i < pasos.length - 1 && (
                      <div className={`flex-1 h-px ${paso.done ? 'bg-primary' : 'bg-border'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Evaluation status */}
              {estadoEval && (
                <div className={`rounded-xl p-4 border ${
                  estadoEval === 'ACEPTADA' ? 'bg-emerald-50 border-emerald-200' :
                  estadoEval === 'RECHAZADA' ? 'bg-rose-50 border-rose-200' :
                  'bg-amber-50 border-amber-200'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <EvalIcon size={16} className={
                      estadoEval === 'ACEPTADA' ? 'text-emerald-600' :
                      estadoEval === 'RECHAZADA' ? 'text-rose-500' :
                      'text-amber-600'
                    } />
                    <p className={`text-sm font-semibold ${
                      estadoEval === 'ACEPTADA' ? 'text-emerald-700' :
                      estadoEval === 'RECHAZADA' ? 'text-rose-700' :
                      'text-amber-700'
                    }`}>{evalInfo?.label}</p>
                  </div>
                  <p className={`text-xs ${
                    estadoEval === 'ACEPTADA' ? 'text-emerald-600' :
                    estadoEval === 'RECHAZADA' ? 'text-rose-600' :
                    'text-amber-600'
                  }`}>{evalInfo?.description}</p>
                  {estadoEval === 'RECHAZADA' && (evaluacion?.motivo_rechazo || cotizacion.motivo_rechazo) && (
                    <div className="mt-2 p-2 bg-white/50 rounded-lg text-xs text-rose-700">
                      <span className="font-semibold">Motivo: </span>
                      {evaluacion?.motivo_rechazo || cotizacion.motivo_rechazo}
                    </div>
                  )}
                  {evaluacion?.factor_riesgo && (
                    <p className="text-xs mt-2 opacity-75">Factor de riesgo: x{evaluacion.factor_riesgo}</p>
                  )}
                </div>
              )}

              {/* Action for PENDIENTE */}
              {estadoEval === 'PENDIENTE' && (
                <button
                  onClick={verificarEstado}
                  disabled={verificando}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border hover:bg-bg-soft text-sm font-semibold text-text transition-colors disabled:opacity-50"
                >
                  <MdRefresh size={16} className={verificando ? 'animate-spin' : ''} />
                  {verificando ? 'Verificando...' : 'Verificar estado de evaluacion'}
                </button>
              )}

              {/* Proposal info */}
              {propuesta && (
                <div className="flex flex-col gap-3">
                  <div className="bg-bg-soft rounded-xl p-4 border border-border">
                    <p className="text-xs font-semibold text-text mb-3">Propuesta formal</p>
                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-text-soft">Prima</p>
                        <p className="font-bold text-text">{formatearMoneda(propuesta.prima_calculada)}</p>
                      </div>
                      <div>
                        <p className="text-text-soft">Suma asegurada</p>
                        <p className="font-bold text-text">{formatearMoneda(propuesta.suma_asegurada)}</p>
                      </div>
                      <div>
                        <p className="text-text-soft">Valida hasta</p>
                        <p className="font-bold text-text">{formatearFecha(propuesta.valida_hasta)}</p>
                      </div>
                      <div>
                        <p className="text-text-soft">Deducible</p>
                        <p className="font-bold text-text">{formatearMoneda(propuesta.deducible)}</p>
                      </div>
                      <div>
                        <p className="text-text-soft">Frecuencia</p>
                        <p className="font-bold text-text">{propuesta.frecuencia_pago}</p>
                      </div>
                      <div>
                        <p className="text-text-soft">Vigencia</p>
                        <p className="font-bold text-text">{propuesta.vigencia_meses} meses</p>
                      </div>
                    </div>
                  </div>

                  {cotizacion.estado_kanban !== 'GANADO' && cotizacion.estado_kanban !== 'PERDIDO' && (
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-sm font-semibold text-blue-900 mb-3">Contratación de Póliza</p>
                      <div className="flex flex-col gap-2 mb-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aceptaTerminos}
                            onChange={(e) => setAceptaTerminos(e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-border focus:ring-primary cursor-pointer"
                          />
                          <span className="text-xs text-blue-800">Acepto los términos y condiciones de la póliza.</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={declaracionVeraz}
                            onChange={(e) => setDeclaracionVeraz(e.target.checked)}
                            className="w-4 h-4 rounded text-primary border-border focus:ring-primary cursor-pointer"
                          />
                          <span className="text-xs text-blue-800">Declaro que toda la información brindada es veraz.</span>
                        </label>
                      </div>
                      <button
                        onClick={aceptarPropuesta}
                        disabled={aceptando || !aceptaTerminos || !declaracionVeraz}
                        className="w-full py-2.5 flex items-center justify-center gap-2 rounded-xl bg-primary text-text-inverse text-sm font-semibold hover:bg-primary-hover disabled:opacity-50 transition-colors"
                      >
                        {aceptando ? 'Aceptando...' : 'Aceptar y Contratar'} <MdCheckCircle size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Summary info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-soft rounded-xl p-3 border border-border">
                  <p className="text-xs text-text-soft">Estado</p>
                  <p className="text-sm font-bold text-text">{ESTADO_KANBAN[cotizacion.estado_kanban]?.label || cotizacion.estado_kanban}</p>
                </div>
                <div className="bg-bg-soft rounded-xl p-3 border border-border">
                  <p className="text-xs text-text-soft">Prima estimada</p>
                  <p className="text-sm font-bold text-text">{formatearMoneda(cotizacion.prima_estimada)}</p>
                </div>
              </div>

              {/* Info message if no evaluation yet */}
              {!estadoEval && cotizacion.estado_kanban !== 'GANADO' && cotizacion.estado_kanban !== 'PERDIDO' && (
                <div className="bg-bg-soft rounded-xl p-4 border border-border text-center">
                  <MdLock size={24} className="text-text-soft mx-auto mb-2" />
                  <p className="text-sm font-semibold text-text">Pendiente de evaluacion</p>
                  <p className="text-xs text-text-soft mt-1">
                    Tu solicitud esta en proceso. Puedes continuar el flujo desde "Cotizar y contratar" o esperar a que el comercial gestione tu cotizacion.
                  </p>
                </div>
              )}

              {cotizacion.estado_kanban === 'GANADO' && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                  <MdCheckCircle size={24} className="text-emerald-500 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-emerald-700">Solicitud completada</p>
                  <p className="text-xs text-emerald-600 mt-1">
                    Tu poliza fue emitida exitosamente. Revisala en "Mis polizas".
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
