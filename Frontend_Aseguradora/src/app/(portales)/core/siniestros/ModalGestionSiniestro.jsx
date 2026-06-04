import React, { useState } from 'react';
import {
  MdClose,
  MdWarning,
  MdPerson,
  MdCalendarToday,
  MdAttachMoney,
  MdAssignmentInd,
  MdHandyman,
  MdEngineering,
  MdPaid,
} from 'react-icons/md';

import ChatObservaciones from '@/components/chat/ChatObservaciones';

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

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFechaHora(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ModalGestionSiniestro({
  siniestro,
  onClose,
  onAsignar,
  onProveedores,
  onPerito,
  onIndemnizar,
  onCambiarEstado,
  actualizando,
}) {
  if (!siniestro) return null;

  const est = ESTADOS[siniestro.estado_resolucion] || ESTADOS.REGISTRADO;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MdWarning size={20} className="text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-text">SIN-{String(siniestro.id_siniestro).padStart(6, '0')}</p>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${est.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                  {est.label}
                </span>
              </div>
              <p className="text-xs text-text-soft mt-0.5">{siniestro.tipo_incidente}</p>
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
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Grid Principal */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-bg-soft rounded-xl p-3 border border-border">
              <p className="text-[10px] uppercase font-bold text-text-soft mb-1">Cliente</p>
              <div className="flex items-center gap-2 text-sm font-bold text-text">
                <MdPerson size={16} className="text-primary" />
                <span className="truncate">{siniestro.cliente_nombre}</span>
              </div>
            </div>
            <div className="bg-bg-soft rounded-xl p-3 border border-border">
              <p className="text-[10px] uppercase font-bold text-text-soft mb-1">Póliza</p>
              <div className="text-sm font-bold text-text truncate">
                POL-{String(siniestro.id_poliza).padStart(6, '0')}
              </div>
              <div className="text-[10px] text-text-soft truncate">{siniestro.poliza_nombre}</div>
            </div>
            <div className="bg-bg-soft rounded-xl p-3 border border-border">
              <p className="text-[10px] uppercase font-bold text-text-soft mb-1">Monto Reclamado</p>
              <div className="flex items-center gap-2 text-sm font-bold text-text">
                <MdAttachMoney size={16} className="text-emerald-500" />
                <span>{formatearMoneda(siniestro.monto_reclamado)}</span>
              </div>
            </div>
            <div className="bg-bg-soft rounded-xl p-3 border border-border">
              <p className="text-[10px] uppercase font-bold text-text-soft mb-1">Analista asignado</p>
              <div className="flex items-center gap-2 text-sm font-bold text-text">
                <MdAssignmentInd size={16} className="text-indigo-500" />
                <span className="truncate">{siniestro.analista_asignado || 'Sin asignar'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 bg-bg rounded-xl border border-border p-4">
              <MdCalendarToday size={18} className="text-text-soft" />
              <div>
                <p className="text-[10px] uppercase font-bold text-text-soft">Fecha Ocurrencia</p>
                <p className="text-sm font-semibold text-text">
                  {siniestro.fecha_ocurrencia ? siniestro.fecha_ocurrencia : '—'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-bg rounded-xl border border-border p-4">
              <MdCalendarToday size={18} className="text-text-soft" />
              <div>
                <p className="text-[10px] uppercase font-bold text-text-soft">Fecha Reporte</p>
                <p className="text-sm font-semibold text-text">{formatearFechaHora(siniestro.fecha_reporte)}</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-bg rounded-xl border border-border p-4 flex-1">
            <h3 className="text-[10px] font-bold text-text-soft mb-3 uppercase tracking-wider">
              Descripción del Incidente
            </h3>
            <div className="bg-bg-soft p-4 rounded-xl border border-border/50 whitespace-pre-wrap text-sm text-text">
              {siniestro.descripcion || <span className="text-text-soft italic">Sin detalles registrados.</span>}
            </div>
          </div>

          {/* Detalles Perito (Si existen) */}
          {(siniestro.monto_estimado_perito != null || siniestro.observaciones_perito || siniestro.informe_tecnico) && (
            <div className="bg-violet-50/50 rounded-xl border border-violet-100 p-4">
              <h3 className="text-[10px] font-bold text-violet-700 mb-3 uppercase tracking-wider flex items-center gap-1.5">
                <MdEngineering size={14} /> Informe del Perito
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-[10px] text-violet-500 uppercase font-semibold">Monto Estimado</p>
                  <p className="text-sm font-bold text-violet-900">
                    {formatearMoneda(siniestro.monto_estimado_perito)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-violet-500 uppercase font-semibold">Ref. Documento</p>
                  <p className="text-sm font-semibold text-violet-900 truncate">{siniestro.informe_tecnico || '—'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-violet-500 uppercase font-semibold mb-1">Observaciones</p>
                <p className="text-sm text-violet-800 bg-white/60 p-3 rounded-xl border border-violet-100 whitespace-pre-wrap">
                  {siniestro.observaciones_perito || 'Sin observaciones.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-bg-soft flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onAsignar}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdAssignmentInd size={14} /> {siniestro.id_empleado_analista ? 'Reasignar' : 'Asignar Analista'}
            </button>
            <button
              onClick={onProveedores}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-bg hover:bg-bg-soft text-text text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdHandyman size={14} className="text-text-soft" /> Proveedores
            </button>
            <button
              onClick={onPerito}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-bg hover:bg-bg-soft text-text text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdEngineering size={14} className="text-text-soft" /> Perito
            </button>
            {['EN_EVALUACION', 'PROVEEDOR_ASIGNADO', 'LIQUIDACION_CALCULADA'].includes(siniestro.estado_resolucion) && (
              <>
                <button
                  onClick={() => onCambiarEstado('APROBADO')}
                  disabled={actualizando}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Aprobar
                </button>
                <button
                  onClick={() => onCambiarEstado('RECHAZADO')}
                  disabled={actualizando}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  Rechazar
                </button>
              </>
            )}
            {(siniestro.estado_resolucion === 'APROBADO' || siniestro.estado_resolucion === 'PENDIENTE_ACEPTACION' || siniestro.estado_resolucion === 'PAGO_PROGRAMADO' || siniestro.estado_resolucion === 'FINALIZADO') && (
              <button
                onClick={onIndemnizar}
                disabled={actualizando}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-500 hover:bg-violet-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <MdPaid size={14} /> Propuesta / Liquidar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Side Panel para ChatObservaciones */}
      <div className="w-80 ml-4 hidden md:flex flex-col">
        <ChatObservaciones 
          tipoReferencia="SINIESTRO"
          idReferencia={siniestro.id_siniestro}
          isAdmin={true}
        />
      </div>
    </div>
  );
}
