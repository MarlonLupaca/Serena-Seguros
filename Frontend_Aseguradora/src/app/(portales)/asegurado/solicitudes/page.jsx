'use client';
import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdRefresh,
  MdClose,
  MdArrowForward,
} from 'react-icons/md';
import {
  RiShieldCheckLine,
  RiFileEditLine,
  RiAlertLine,
  RiListCheck3,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiTimeLine,
  RiEyeLine,
} from 'react-icons/ri';
import { apiGet, apiPost } from '@/lib/api';
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';

// ─── Estilos por Tipo (Pasteles suaves) ──────────────────────────────────────
const TIPO_STYLES = {
  'NUEVA POLIZA': {
    icon: RiShieldCheckLine,
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    border: 'border-teal-200',
    // Tab activo
    tabBg: 'bg-teal-100',
    tabText: 'text-teal-700',
    tabBorder: 'border-teal-300',
    label: 'Nueva Póliza',
  },
  'ENDOSO': {
    icon: RiFileEditLine,
    bg: 'bg-indigo-50',
    text: 'text-indigo-500',
    border: 'border-indigo-200',
    tabBg: 'bg-indigo-100',
    tabText: 'text-indigo-700',
    tabBorder: 'border-indigo-300',
    label: 'Endoso',
  },
  'SINIESTRO': {
    icon: RiAlertLine,
    bg: 'bg-orange-50',
    text: 'text-orange-500',
    border: 'border-orange-200',
    tabBg: 'bg-orange-100',
    tabText: 'text-orange-700',
    tabBorder: 'border-orange-300',
    label: 'Siniestro',
  },
};

const FALLBACK_TIPO = {
  icon: RiShieldCheckLine,
  bg: 'bg-bg-soft',
  text: 'text-text-soft',
  border: 'border-border',
  tabBg: 'bg-bg-soft',
  tabText: 'text-text',
  tabBorder: 'border-border',
  label: 'Otro',
};

function estiloTipo(tipo) {
  if (!tipo) return FALLBACK_TIPO;
  return TIPO_STYLES[tipo] || FALLBACK_TIPO;
}

// ─── Estilos por Estado ───────────────────────────────────────────────────────
function estiloEstado(estado) {
  if (!estado) return { bg: 'bg-bg-soft border-border', text: 'text-text-soft', icon: RiTimeLine };
  const e = estado.toUpperCase();
  if (['APROBADO', 'GANADO', 'ACEPTADA', 'FINALIZADO'].includes(e))
    return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-600', icon: RiCheckboxCircleLine };
  if (['RECHAZADO', 'RECHAZADA', 'PERDIDO'].includes(e))
    return { bg: 'bg-red-50 border-red-200', text: 'text-red-500', icon: RiCloseCircleLine };
  if (['PENDIENTE', 'NUEVO', 'REPORTADO', 'REGISTRADO', 'PENDIENTE_PAGO', 'DOCUMENTACION_PENDIENTE', 'PENDIENTE_ACEPTACION'].includes(e))
    return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-500', icon: RiTimeLine };
  if (e.includes('REVISION') || e.includes('EVALUACION') || e === 'OBSERVADO' || e === 'CONTACTADO' || e === 'NEGOCIACION' || e === 'EN_PROPUESTA' || e === 'PROVEEDOR_ASIGNADO' || e === 'LIQUIDACION_CALCULADA' || e === 'PAGO_PROGRAMADO')
    return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', icon: RiTimeLine };
  return { bg: 'bg-bg-soft border-border', text: 'text-text-soft', icon: RiTimeLine };
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── Filtros disponibles ──────────────────────────────────────────────────────
const TIPOS_FILTRO = [
  { key: 'TODOS',       label: 'Todos',        icon: RiListCheck3 },
  { key: 'NUEVA POLIZA',label: 'Nueva Póliza', icon: RiShieldCheckLine },
  { key: 'ENDOSO',      label: 'Endoso',       icon: RiFileEditLine },
  { key: 'SINIESTRO',  label: 'Siniestro',    icon: RiAlertLine },
];

// ─── Página Principal ─────────────────────────────────────────────────────────
export default function MisSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-solicitudes');
      setSolicitudes(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las solicitudes');
    } finally {
      setCargando(false);
    }
  };

  const filtradas = solicitudes.filter((s) => {
    const tipo = s.tipoSolicitud || s.tipo_solicitud || '';
    const id   = s.idReferencia  || s.id_referencia  || '';
    if (tipoFiltro !== 'TODOS' && tipo !== tipoFiltro) return false;
    if (!busqueda) return true;
    const q = busqueda.toLowerCase();
    return (
      id.toLowerCase().includes(q) ||
      tipo.toLowerCase().includes(q) ||
      (s.descripcion || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="px-8 py-4 flex flex-col gap-5 pb-8">

      {/* Encabezado */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-text">Mis Trámites y Solicitudes</h1>
          <p className="text-xs text-text-soft mt-0.5">
            Seguimiento centralizado de cotizaciones, endosos y siniestros.
          </p>
        </div>
        <button
          onClick={cargar}
          disabled={cargando}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
        >
          <MdRefresh size={16} className={cargando ? 'animate-spin' : ''} /> Actualizar
        </button>
      </div>

      {/* Buscador */}
      <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-4 py-3 shadow-sm">
        <MdSearch size={18} className="text-text-soft shrink-0" />
        <input
          className="flex-1 text-sm text-text placeholder:text-text-soft outline-none bg-transparent"
          placeholder="Buscar por código, tipo o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        {busqueda && (
          <button onClick={() => setBusqueda('')} className="text-text-soft hover:text-text transition-colors">
            <MdClose size={16} />
          </button>
        )}
      </div>

      {/* Tabs de Filtro */}
      <div className="flex items-center gap-2 flex-wrap">
        {TIPOS_FILTRO.map(({ key, label, icon: Icon }) => {
          const isActive = tipoFiltro === key;
          const count = key === 'TODOS'
            ? solicitudes.length
            : solicitudes.filter(s => (s.tipoSolicitud || s.tipo_solicitud) === key).length;
          const ts = key === 'TODOS' ? null : estiloTipo(key);

          return (
            <button
              key={key}
              onClick={() => setTipoFiltro(key)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-semibold transition-all ${
                isActive
                  ? ts
                    ? `${ts.tabBg} ${ts.tabText} ${ts.tabBorder} shadow-sm`
                    : 'bg-bg-soft text-text border-border shadow-sm'
                  : 'bg-bg border-border text-text-soft hover:text-text hover:bg-bg-soft'
              }`}
            >
              <Icon size={15} />
              {label}
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                isActive
                  ? ts ? 'bg-white/60 text-inherit' : 'bg-border text-text-soft'
                  : 'bg-bg-soft text-text-soft'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
        {tipoFiltro !== 'TODOS' && (
          <button
            onClick={() => setTipoFiltro('TODOS')}
            className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-border text-[10px] font-bold text-text-soft hover:text-rose-500 hover:border-rose-200 transition-all"
          >
            <MdClose size={12} /> Limpiar
          </button>
        )}
      </div>

      {/* Contenido */}
      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft shadow-sm">
          Cargando centro de solicitudes...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-500 text-center shadow-sm">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center bg-bg rounded-2xl border border-border shadow-sm">
          <div className="w-16 h-16 rounded-full bg-bg-soft border border-border flex items-center justify-center">
            <RiShieldCheckLine size={28} className="text-text-soft" />
          </div>
          <p className="text-base font-bold text-text">Sin resultados</p>
          <p className="text-sm text-text-soft max-w-sm">
            {tipoFiltro !== 'TODOS'
              ? `No hay solicitudes de tipo "${estiloTipo(tipoFiltro).label}" que coincidan.`
              : 'Tus solicitudes aparecerán aquí una vez que las realices.'}
          </p>
        </div>
      ) : (
        <div className="bg-bg rounded-2xl border border-border shadow-sm overflow-hidden">
          <DataTable
            data={filtradas}
            columns={[
              { label: 'Código' },
              { label: 'Tipo de Trámite' },
              { label: 'Fecha' },
              { label: 'Descripción' },
              { label: 'Estado', align: 'right' },
              { label: '', align: 'right' },
            ]}
            renderRow={(s) => {
              const tipoStr   = s.tipoSolicitud || s.tipo_solicitud;
              const idRef     = s.idReferencia  || s.id_referencia;
              const ts        = estiloTipo(tipoStr);
              const es        = estiloEstado(s.estado);
              const TipoIcon  = ts.icon;
              const EstIcon   = es.icon;

              return (
                <TableRow key={idRef}>
                  {/* Código */}
                  <TableCell>
                    <span className="text-xs font-bold text-text tracking-wide">{idRef}</span>
                  </TableCell>

                  {/* Tipo — pastilla con icono */}
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold ${ts.bg} ${ts.text} ${ts.border}`}>
                      <TipoIcon size={14} />
                      {ts.label}
                    </span>
                  </TableCell>

                  {/* Fecha */}
                  <TableCell>
                    <span className="text-xs text-text-soft">{formatearFecha(s.fecha)}</span>
                  </TableCell>

                  {/* Descripción */}
                  <TableCell>
                    <span className="text-sm text-text font-medium block truncate max-w-xs">{s.descripcion}</span>
                  </TableCell>

                  {/* Estado — pastilla con icono */}
                  <TableCell align="right">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${es.bg} ${es.text} uppercase tracking-wide`}>
                      <EstIcon size={12} />
                      {s.estado}
                    </span>
                  </TableCell>

                  {/* Acción */}
                  <TableCell align="right">
                    <button
                      onClick={() => setDetalle(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-bg-soft text-text-soft hover:text-primary text-xs font-semibold transition-all"
                    >
                      <RiEyeLine size={14} /> Ver
                    </button>
                  </TableCell>
                </TableRow>
              );
            }}
          />
        </div>
      )}

      {detalle && (
        <ModalDetalleSolicitud s={detalle} onClose={() => setDetalle(null)} onSuccess={() => { setDetalle(null); cargar(); }} />
      )}
    </div>
  );
}

// ─── Modal de Detalle ─────────────────────────────────────────────────────────
function ModalDetalleSolicitud({ s, onClose, onSuccess }) {
  const tipoStr  = s.tipoSolicitud || s.tipo_solicitud;
  const idRef    = s.idReferencia  || s.id_referencia;
  const ts       = estiloTipo(tipoStr);
  const es       = estiloEstado(s.estado);
  const TipoIcon = ts.icon;
  const EstIcon  = es.icon;

  const [propuesta, setPropuesta] = useState(null);
  const [cargandoPropuesta, setCargandoPropuesta] = useState(false);
  const [errorPropuesta, setErrorPropuesta] = useState('');
  const [terminos, setTerminos] = useState(false);
  const [declaracion, setDeclaracion] = useState(false);
  const [aceptando, setAceptando] = useState(false);

  const numericId = String(idRef).replace(/\D/g, '');

  useEffect(() => {
    if (tipoStr === 'NUEVA POLIZA' && s.estado === 'EN_PROPUESTA') {
      setCargandoPropuesta(true);
      apiGet(`/mis-cotizaciones/${numericId}/propuesta`)
        .then(setPropuesta)
        .catch(e => setErrorPropuesta(e.mensaje || 'Error al cargar propuesta'))
        .finally(() => setCargandoPropuesta(false));
    }
  }, [tipoStr, s.estado, numericId]);

  const aceptarPropuesta = async () => {
    if (!terminos || !declaracion) return;
    setAceptando(true);
    setErrorPropuesta('');
    try {
      await apiPost(`/mis-cotizaciones/${numericId}/aceptar`, {
        acepta_terminos: terminos,
        declaracion_veraz: declaracion,
      });
      if (onSuccess) onSuccess();
    } catch (e) {
      setErrorPropuesta(e.mensaje || 'Error al aceptar propuesta');
      setAceptando(false);
    }
  };

  const mostrarPropuesta = tipoStr === 'NUEVA POLIZA' && s.estado === 'EN_PROPUESTA';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className={`bg-bg w-full ${mostrarPropuesta ? 'max-w-4xl' : 'max-w-lg'} rounded-3xl border border-border shadow-2xl flex flex-col max-h-[90vh]`} onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className={`px-6 py-5 border-b border-border flex items-center justify-between shrink-0 ${ts.bg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${ts.border} bg-white/80 shadow-sm`}>
              <TipoIcon size={22} className={ts.text} />
            </div>
            <div>
              <p className="text-sm font-extrabold text-text">Detalle de Solicitud</p>
              <p className={`text-[11px] font-bold uppercase tracking-widest ${ts.text}`}>{ts.label}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/80 border border-border text-text-soft hover:text-text transition-colors shadow-sm">
            <MdClose size={16} />
          </button>
        </div>

        {/* Body */}
        <div className={`p-6 overflow-y-auto ${mostrarPropuesta ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'flex flex-col gap-5'}`}>
          
          {/* Lado Izquierdo o Contenido Único */}
          <div className="flex flex-col gap-5">
            {/* Código centrado */}
            <div className={`flex flex-col items-center justify-center py-5 rounded-2xl border border-dashed ${ts.border} ${ts.bg}`}>
              <p className="text-[9px] uppercase font-bold tracking-widest text-text-soft mb-1.5">Código de Referencia</p>
              <div className="flex items-center gap-2">
                <TipoIcon size={22} className={ts.text} />
                <p className={`text-2xl font-black tracking-tight ${ts.text}`}>{idRef}</p>
              </div>
            </div>

            {/* Grid fecha + estado */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-bg-soft rounded-xl p-3 border border-border">
                <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1">Fecha de Registro</p>
                <p className="text-sm font-bold text-text">{formatearFecha(s.fecha)}</p>
              </div>
              <div className="bg-bg-soft rounded-xl p-3 border border-border">
                <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1.5">Estado Actual</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border ${es.bg} ${es.text} uppercase tracking-wide`}>
                  <EstIcon size={12} />
                  {s.estado}
                </span>
              </div>
            </div>

            {/* Descripción */}
            <div>
              <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1.5">Descripción del Trámite</p>
              <div className="bg-bg-soft rounded-xl p-4 border border-border">
                <p className="text-sm font-medium text-text leading-relaxed">{s.descripcion}</p>
              </div>
            </div>

            {!mostrarPropuesta && (
              <button onClick={onClose} className="w-full py-2.5 rounded-xl border border-border text-xs font-bold text-text hover:bg-bg-soft transition-colors mt-2">
                Cerrar detalle
              </button>
            )}
          </div>

          {/* Lado Derecho: Propuesta Comercial si aplica */}
          {mostrarPropuesta && (
            <div className="flex flex-col gap-5 md:pl-8 md:border-l border-border">
              <div>
                <p className="text-sm font-bold text-text">Propuesta Comercial</p>
                <p className="text-[11px] text-text-soft mt-0.5">Revisa y acepta la propuesta de tu póliza.</p>
              </div>
              
              {cargandoPropuesta ? (
                <div className="text-center text-sm text-text-soft py-12">Cargando propuesta...</div>
              ) : errorPropuesta ? (
                <div className="text-center text-sm text-red-500 bg-red-50 p-4 rounded-xl border border-red-200">{errorPropuesta}</div>
              ) : propuesta ? (
                <div className="flex flex-col gap-5 flex-1 justify-between">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-bg-soft rounded-xl p-3 border border-border">
                        <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1">Prima Calculada</p>
                        <p className="text-sm font-bold text-emerald-600">{formatearMoneda(propuesta.prima_calculada)}</p>
                      </div>
                      <div className="bg-bg-soft rounded-xl p-3 border border-border">
                        <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1">Suma Asegurada</p>
                        <p className="text-sm font-bold text-text">{formatearMoneda(propuesta.suma_asegurada)}</p>
                      </div>
                      <div className="bg-bg-soft rounded-xl p-3 border border-border">
                        <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1">Pagos</p>
                        <p className="text-sm font-bold text-text">{propuesta.numero_cuotas} cuotas {propuesta.frecuencia_pago.toLowerCase()}</p>
                      </div>
                      <div className="bg-bg-soft rounded-xl p-3 border border-border">
                        <p className="text-[10px] text-text-soft font-semibold uppercase tracking-wider mb-1">Deducible</p>
                        <p className="text-sm font-bold text-text">{formatearMoneda(propuesta.deducible)}</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-2 bg-bg-soft p-4 rounded-xl border border-border">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={declaracion}
                          onChange={(e) => setDeclaracion(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <p className="text-xs text-text-soft leading-relaxed">
                          Declaro que toda la información entregada es veraz (principio de buena fe).
                        </p>
                      </label>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={terminos}
                          onChange={(e) => setTerminos(e.target.checked)}
                          className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                        />
                        <p className="text-xs text-text-soft leading-relaxed">
                          Acepto los términos, condiciones y exclusiones de la propuesta.
                        </p>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={aceptarPropuesta}
                    disabled={aceptando || !terminos || !declaracion}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors mt-2"
                  >
                    {aceptando ? 'Aceptando propuesta...' : 'Aceptar Propuesta Comercial'} <MdArrowForward size={16} />
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
