'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdHandshake,
  MdAutoAwesome,
  MdPerson,
  MdCalendarToday,
  MdMoreVert,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
  MdClose,
  MdArrowForward,
  MdCheckCircle,
  MdCancel,
  MdPending,
  MdDescription,
  MdAssessment,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost } from '@/lib/api';
import FormularioRiesgo from '@/components/riesgo/FormularioRiesgo';
import { valoresIniciales, validarCampos } from '@/lib/riesgo/camposPorTipo';
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';

const ESTADOS = {
  NUEVO: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  CONTACTADO: { label: 'Contactado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  EN_PROPUESTA: { label: 'En propuesta', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  NEGOCIACION: { label: 'Negociación', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  GANADO: { label: 'Ganado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  PERDIDO: { label: 'Perdido', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
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

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADOS_LEAD = ['NUEVO', 'CONTACTADO', 'EN_PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/cotizaciones');
      setLeads((data || []).filter((c) => ESTADOS_LEAD.includes(c.estado_kanban)));
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los leads');
    } finally {
      setCargando(false);
    }
  };

  const filtrados = leads.filter((l) => {
    const matchBusq =
      busqueda === '' ||
      String(l.id_cotizacion).includes(busqueda.toLowerCase()) ||
      (l.agente_asignado || '').toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || l.estado_kanban === filtroEstado;
    return matchBusq && matchEstado;
  });

  const counts = ESTADOS_LEAD.reduce((acc, k) => {
    acc[k] = leads.filter((l) => l.estado_kanban === k).length;
    return acc;
  }, {});

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Leads</h1>
          <p className="text-xs text-text-soft mt-0.5">{leads.length} leads activos</p>
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {ESTADOS_LEAD.map((k) => {
          const cfg = ESTADOS[k];
          return (
            <div key={k} className="bg-bg rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <p className="text-xs text-text-soft truncate">{cfg.label}</p>
              </div>
              <p className="text-lg font-bold text-text">{counts[k] || 0}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-bg border border-border rounded-xl px-3 py-2">
          <MdSearch size={14} className="text-text-soft shrink-0" />
          <input
            className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
            placeholder="Buscar por ID o agente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text outline-none cursor-pointer"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          {ESTADOS_LEAD.map((k) => (
            <option key={k} value={k}>
              {ESTADOS[k].label}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando leads...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdHandshake size={22} className="text-text-soft" />
          </div>
          <p className="text-sm font-semibold text-text">Sin leads</p>
          <p className="text-xs text-text-soft max-w-xs">No hay leads que coincidan con los filtros.</p>
        </div>
      ) : (
        <DataTable
          data={filtrados}
          columns={[
            { label: 'ID Lead' },
            { label: 'Producto' },
            { label: 'Agente & Fecha' },
            { label: 'Estado' },
            { label: 'Prima Estimada', align: 'right' },
            { label: 'Acciones', align: 'right' }
          ]}
          renderRow={(lead) => (
            <LeadTableRow
              key={lead.id_cotizacion}
              lead={lead}
              onVerDetalle={() => setLeadSeleccionado(lead)}
            />
          )}
        />
      )}

      {leadSeleccionado && (
        <LeadDetailPanel
          lead={leadSeleccionado}
          onClose={() => setLeadSeleccionado(null)}
          onActualizar={(updated) => {
            setLeads((prev) => prev.map((l) => (l.id_cotizacion === updated.id_cotizacion ? { ...l, ...updated } : l)));
            setLeadSeleccionado((prev) => (prev ? { ...prev, ...updated } : null));
          }}
        />
      )}
    </div>
  );
}

function LeadTableRow({ lead, onVerDetalle }) {
  const tipoStyle = estiloTipo(lead.producto_interes);
  const Icon = tipoStyle.icon;
  const est = ESTADOS[lead.estado_kanban];

  return (
    <TableRow>
      <TableCell className="text-sm font-medium text-text">
        COT-{String(lead.id_cotizacion).padStart(6, '0')}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
            <Icon size={16} className={tipoStyle.accentText} />
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{lead.producto_interes}</p>
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 mt-1">
              <MdAutoAwesome size={9} /> Asegurado
            </span>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1 text-xs text-text-soft">
          <span className="flex items-center gap-1">
            <MdPerson size={11} /> {lead.agente_asignado || 'Sin asignar'}
          </span>
          <span className="flex items-center gap-1">
            <MdCalendarToday size={11} /> {formatearFecha(lead.fecha_ingreso)}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${est.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
          {est.label}
        </span>
      </TableCell>
      <TableCell align="right" className="text-sm font-bold text-text">
        {formatearMoneda(lead.prima_estimada)}
      </TableCell>
      <TableCell align="right">
        <div className="flex items-center justify-end gap-2 relative">
          <button
            onClick={onVerDetalle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-medium transition-colors"
          >
            <MdAssessment size={13} /> Gestionar
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

const ESTADO_EVAL = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', icon: MdPending },
  ACEPTADA: { label: 'Aceptada', badge: 'bg-emerald-100 text-emerald-700', icon: MdCheckCircle },
  RECHAZADA: { label: 'Rechazada', badge: 'bg-rose-100 text-rose-600', icon: MdCancel },
};

function LeadDetailPanel({ lead, onClose, onActualizar }) {
  const [evaluacion, setEvaluacion] = useState(null);
  const [propuesta, setPropuesta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [vista, setVista] = useState('resumen');

  const [datosRiesgo, setDatosRiesgo] = useState(() => valoresIniciales(lead.producto_interes));
  const [sumaAsegurada, setSumaAsegurada] = useState('');
  const [enviandoEval, setEnviandoEval] = useState(false);
  const [generandoProp, setGenerandoProp] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, [lead.id_cotizacion]);

  const cargarDatos = async () => {
    setCargando(true);
    setError('');
    try {
      const [evalResp, propResp] = await Promise.allSettled([
        apiGet(`/cotizaciones/${lead.id_cotizacion}/evaluacion`),
        apiGet(`/cotizaciones/${lead.id_cotizacion}/propuesta`),
      ]);
      if (evalResp.status === 'fulfilled') setEvaluacion(evalResp.value);
      if (propResp.status === 'fulfilled') setPropuesta(propResp.value);
    } catch (e) {
      setError('No se pudo cargar la informacion del lead');
    } finally {
      setCargando(false);
    }
  };

  const enviarEvaluacion = async () => {
    const faltantes = validarCampos(lead.producto_interes, datosRiesgo);
    if (faltantes.length) {
      setError('Completa los campos obligatorios: ' + faltantes.join(', '));
      return;
    }
    if (!sumaAsegurada || Number(sumaAsegurada) <= 0) {
      setError('Indica una suma asegurada valida');
      return;
    }
    setEnviandoEval(true);
    setError('');
    try {
      const resp = await apiPost(`/cotizaciones/${lead.id_cotizacion}/evaluacion`, {
        datos_riesgo: datosRiesgo,
        suma_asegurada: Number(sumaAsegurada),
      });
      setEvaluacion(resp);
      setVista('resumen');
      toast.success('Evaluacion de riesgo registrada');
    } catch (e) {
      setError(e.mensaje || 'No se pudo registrar la evaluacion');
    } finally {
      setEnviandoEval(false);
    }
  };

  const generarPropuesta = async (frecuencia = 'MENSUAL') => {
    setGenerandoProp(true);
    setError('');
    try {
      const resp = await apiPost(`/cotizaciones/${lead.id_cotizacion}/propuesta`, {
        suma_asegurada: evaluacion?.suma_asegurada || Number(sumaAsegurada),
        deducible: 250,
        frecuencia_pago: frecuencia,
        vigencia_meses: 12,
      });
      setPropuesta(resp);
      setVista('propuesta');
      toast.success('Propuesta generada');
    } catch (e) {
      setError(e.mensaje || 'No se pudo generar la propuesta');
    } finally {
      setGenerandoProp(false);
    }
  };

  const tipoStyle = estiloTipo(lead.producto_interes);
  const Icon = tipoStyle.icon;
  const estadoEval = evaluacion?.estado_suscripcion;
  const evalInfo = ESTADO_EVAL[estadoEval];

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${tipoStyle.accentBg}`}>
              <Icon size={18} className={tipoStyle.accentText} />
            </div>
            <div>
              <p className="text-sm font-bold text-text">COT-{String(lead.id_cotizacion).padStart(6, '0')}</p>
              <p className="text-xs text-text-soft">{lead.producto_interes}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>

        <div className="flex border-b border-border shrink-0">
          {['resumen', 'evaluar', 'propuesta'].map((tab) => (
            <button
              key={tab}
              onClick={() => setVista(tab)}
              className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${
                vista === tab ? 'text-primary border-b-2 border-primary' : 'text-text-soft hover:text-text'
              }`}
            >
              {tab === 'resumen' ? 'Resumen' : tab === 'evaluar' ? 'Evaluar riesgo' : 'Propuesta'}
            </button>
          ))}
        </div>

        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {cargando ? (
            <div className="py-12 text-center text-sm text-text-soft">Cargando...</div>
          ) : vista === 'resumen' ? (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-bg-soft rounded-xl p-3 border border-border">
                  <p className="text-xs text-text-soft mb-1">Estado del lead</p>
                  <p className="text-sm font-bold text-text">{ESTADOS[lead.estado_kanban]?.label}</p>
                </div>
                <div className="bg-bg-soft rounded-xl p-3 border border-border">
                  <p className="text-xs text-text-soft mb-1">Prima estimada</p>
                  <p className="text-sm font-bold text-text">{formatearMoneda(lead.prima_estimada)}</p>
                </div>
              </div>

              <div className="bg-bg-soft rounded-xl p-4 border border-border">
                <p className="text-xs font-semibold text-text mb-2">Evaluacion de riesgo</p>
                {evaluacion ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {evalInfo && (
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${evalInfo.badge}`}>
                          <evalInfo.icon size={13} /> {evalInfo.label}
                        </span>
                      )}
                      <span className="text-xs text-text-soft">Factor: x{evaluacion.factor_riesgo}</span>
                    </div>
                    {estadoEval === 'RECHAZADA' && evaluacion.motivo_rechazo && (
                      <div className="bg-rose-50 border border-rose-200 rounded-lg p-2 text-xs text-rose-700">
                        <span className="font-semibold">Motivo: </span>{evaluacion.motivo_rechazo}
                      </div>
                    )}
                    {estadoEval === 'PENDIENTE' && (
                      <p className="text-xs text-amber-600">Esperando aprobacion del area tecnica.</p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-soft">Sin evaluacion registrada</p>
                    <button
                      onClick={() => setVista('evaluar')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-text-inverse text-xs font-medium transition-colors"
                    >
                      <MdAssessment size={13} /> Evaluar
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-bg-soft rounded-xl p-4 border border-border">
                <p className="text-xs font-semibold text-text mb-2">Propuesta</p>
                {propuesta ? (
                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-3 gap-2 text-xs">
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
                    </div>
                    <button
                      onClick={() => setVista('propuesta')}
                      className="flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-1"
                    >
                      <MdDescription size={13} /> Ver detalle completo
                    </button>
                  </div>
                ) : estadoEval === 'ACEPTADA' ? (
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-text-soft">Evaluacion aprobada. Puede generar propuesta.</p>
                    <button
                      onClick={() => setVista('propuesta')}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-text-inverse text-xs font-medium transition-colors"
                    >
                      <MdDescription size={13} /> Generar
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-text-soft">
                    {estadoEval === 'PENDIENTE'
                      ? 'La evaluacion debe ser aprobada antes de generar propuesta.'
                      : 'Primero debe registrarse una evaluacion de riesgo.'}
                  </p>
                )}
              </div>
            </div>
          ) : vista === 'evaluar' ? (
            <div className="flex flex-col gap-4">
              {evaluacion && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                  Ya existe una evaluacion ({ESTADO_EVAL[estadoEval]?.label}). Al enviar una nueva se reemplazara la anterior.
                </div>
              )}
              <FormularioRiesgo tipoSeguro={lead.producto_interes} valores={datosRiesgo} onChange={setDatosRiesgo} />
              <div>
                <label className="text-xs font-medium text-text-soft block mb-1.5">Suma asegurada deseada (S/) *</label>
                <input
                  type="number"
                  min="0"
                  value={sumaAsegurada}
                  onChange={(e) => setSumaAsegurada(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  placeholder="Ej: 50000"
                />
              </div>
              <button
                onClick={enviarEvaluacion}
                disabled={enviandoEval}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                {enviandoEval ? 'Registrando...' : 'Registrar evaluacion de riesgo'} <MdArrowForward size={16} />
              </button>
            </div>
          ) : vista === 'propuesta' ? (
            <div className="flex flex-col gap-4">
              {propuesta ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-bg-soft rounded-xl p-3 border border-border">
                      <p className="text-xs text-text-soft">Prima calculada</p>
                      <p className="text-sm font-bold text-text">{formatearMoneda(propuesta.prima_calculada)}</p>
                    </div>
                    <div className="bg-bg-soft rounded-xl p-3 border border-border">
                      <p className="text-xs text-text-soft">Suma asegurada</p>
                      <p className="text-sm font-bold text-text">{formatearMoneda(propuesta.suma_asegurada)}</p>
                    </div>
                    <div className="bg-bg-soft rounded-xl p-3 border border-border">
                      <p className="text-xs text-text-soft">Deducible</p>
                      <p className="text-sm font-bold text-text">{formatearMoneda(propuesta.deducible)}</p>
                    </div>
                    <div className="bg-bg-soft rounded-xl p-3 border border-border">
                      <p className="text-xs text-text-soft">Frecuencia</p>
                      <p className="text-sm font-bold text-text">{propuesta.frecuencia_pago}</p>
                    </div>
                    <div className="bg-bg-soft rounded-xl p-3 border border-border">
                      <p className="text-xs text-text-soft">Vigencia</p>
                      <p className="text-sm font-bold text-text">{propuesta.vigencia_meses} meses</p>
                    </div>
                    <div className="bg-bg-soft rounded-xl p-3 border border-border">
                      <p className="text-xs text-text-soft">Valida hasta</p>
                      <p className="text-sm font-bold text-text">{formatearFecha(propuesta.valida_hasta)}</p>
                    </div>
                  </div>
                  {propuesta.coberturas?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-text mb-2">Coberturas</p>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className="text-left border-b border-border">
                              <th className="py-2 font-semibold text-text">Cobertura</th>
                              <th className="py-2 font-semibold text-text">Descripcion</th>
                              <th className="py-2 font-semibold text-text text-right">Limite</th>
                            </tr>
                          </thead>
                          <tbody>
                            {propuesta.coberturas.map((c, i) => (
                              <tr key={i} className="border-b border-border/50">
                                <td className="py-2 font-medium text-text">{c.nombre}</td>
                                <td className="py-2 text-text-soft">{c.descripcion}</td>
                                <td className="py-2 text-text text-right">
                                  {c.limite ? formatearMoneda(c.limite) : 'Incluido'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              ) : estadoEval === 'ACEPTADA' ? (
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-text-soft">
                    La evaluacion fue aprobada. Selecciona la frecuencia de pago para generar la propuesta:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {['MENSUAL', 'TRIMESTRAL', 'ANUAL', 'UNICO'].map((f) => (
                      <button
                        key={f}
                        onClick={() => generarPropuesta(f)}
                        disabled={generandoProp}
                        className="px-3 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 text-sm font-semibold text-text transition-colors disabled:opacity-50"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-sm text-text-soft">
                  {estadoEval === 'PENDIENTE'
                    ? 'La evaluacion esta pendiente de aprobacion tecnica. No se puede generar propuesta aun.'
                    : 'Se requiere una evaluacion de riesgo aprobada para generar la propuesta.'}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
