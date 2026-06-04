import React from 'react';
import {
  MdClose,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
  MdPerson,
  MdCalendarToday,
  MdWarning,
  MdAttachMoney,
  MdAssignment
} from 'react-icons/md';

const ESTADOS = {
  REGISTRADO: { label: 'Registrado', badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  EN_REVISION: { label: 'En revisión', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  DOCUMENTACION_PENDIENTE: { label: 'Doc. Pendiente', badge: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400' },
  EN_EVALUACION: { label: 'En evaluación', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400' },
  PROVEEDOR_ASIGNADO: { label: 'Proveedor', badge: 'bg-indigo-100 text-indigo-700', dot: 'bg-indigo-400' },
  LIQUIDACION_CALCULADA: { label: 'Liq. Calculada', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-400' },
  APROBADO: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  PENDIENTE_ACEPTACION: { label: 'Pdte. Aceptación', badge: 'bg-fuchsia-100 text-fuchsia-700', dot: 'bg-fuchsia-400' },
  PAGO_PROGRAMADO: { label: 'Pago Prog.', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-400' },
  FINALIZADO: { label: 'Finalizado', badge: 'bg-slate-100 text-slate-700', dot: 'bg-slate-500' },
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

export default function ModalDetalleSiniestro({ siniestro, onClose }) {
  if (!siniestro) return null;

  const est = ESTADOS[siniestro.estado_resolucion] || { label: siniestro.estado_resolucion, badge: 'bg-bg-soft text-text-soft', dot: 'bg-text-soft' };
  const tipoStyle = estiloTipo(siniestro.poliza_tipo);
  const TipoIcon = tipoStyle.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tipoStyle.accentBg}`}>
              <TipoIcon size={20} className={tipoStyle.accentText} />
            </div>
            <div>
              <p className="text-sm font-bold text-text">
                SIN-{String(siniestro.id_siniestro).padStart(6, '0')}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <p className="text-xs text-text-soft">{siniestro.poliza_nombre}</p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${est.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                  {est.label}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
          >
            <MdClose size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex flex-col gap-5">
          {/* Cliente & Poliza */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-soft rounded-xl p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-1 text-text-soft">
                <MdPerson size={14} />
                <p className="text-xs font-medium">Cliente</p>
              </div>
              <p className="text-sm font-bold text-text">{siniestro.cliente_nombre}</p>
              <p className="text-xs text-text-soft mt-0.5">CLI-{String(siniestro.id_cliente).padStart(6, '0')}</p>
            </div>
            <div className="bg-bg-soft rounded-xl p-3 border border-border">
              <div className="flex items-center gap-1.5 mb-1 text-text-soft">
                <MdShield size={14} />
                <p className="text-xs font-medium">Póliza Afectada</p>
              </div>
              <p className="text-sm font-bold text-text">{siniestro.poliza_tipo}</p>
              <p className="text-xs text-text-soft mt-0.5">POL-{String(siniestro.id_poliza).padStart(6, '0')}</p>
            </div>
          </div>

          {/* Siniestro Details */}
          <div className="bg-bg rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-text mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <MdWarning size={14} className="text-rose-500" /> Detalles del Incidente
            </h3>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-xs text-text-soft mb-1">Tipo de Incidente</p>
                <p className="text-sm font-medium text-text">{siniestro.tipo_incidente || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-text-soft mb-1">Fecha de Ocurrencia</p>
                <p className="text-sm font-medium text-text flex items-center gap-1">
                  <MdCalendarToday size={12} className="text-text-soft" />
                  {formatearFecha(siniestro.fecha_ocurrencia)}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-text-soft mb-1">Descripción del Cliente</p>
                <p className="text-sm text-text bg-bg-soft p-3 rounded-lg whitespace-pre-wrap border border-border/50">
                  {siniestro.descripcion || 'Sin descripción detallada.'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-soft mb-1">Monto Reclamado</p>
                <p className="text-sm font-bold text-text flex items-center gap-1">
                  <MdAttachMoney size={14} className="text-emerald-500" />
                  {formatearMoneda(siniestro.monto_reclamado)}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-soft mb-1">Fecha de Reporte</p>
                <p className="text-sm font-medium text-text">
                  {formatearFecha(siniestro.fecha_reporte)}
                </p>
              </div>
            </div>
          </div>

          {/* Resolucion y Peritaje (Si existe) */}
          <div className="bg-bg rounded-xl border border-border p-4">
            <h3 className="text-xs font-bold text-text mb-3 uppercase tracking-wider flex items-center gap-1.5">
              <MdAssignment size={14} className="text-blue-500" /> Resolución Técnica
            </h3>
            
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-xs text-text-soft mb-1">Analista Asignado</p>
                <p className="text-sm font-medium text-text">{siniestro.analista_asignado || 'Aún no asignado'}</p>
              </div>
              <div>
                <p className="text-xs text-text-soft mb-1">Monto Estimado Perito</p>
                <p className="text-sm font-bold text-text">
                  {siniestro.monto_estimado_perito ? formatearMoneda(siniestro.monto_estimado_perito) : 'Pendiente de evaluación'}
                </p>
              </div>
              {siniestro.observaciones_perito && (
                <div className="col-span-2">
                  <p className="text-xs text-text-soft mb-1">Observaciones del Perito</p>
                  <p className="text-sm text-text bg-blue-50/50 p-3 rounded-lg whitespace-pre-wrap border border-blue-100">
                    {siniestro.observaciones_perito}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
