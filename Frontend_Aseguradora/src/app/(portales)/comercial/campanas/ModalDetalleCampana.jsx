import React from 'react';
import { MdClose, MdEmail, MdCalendarToday, MdSend, MdVisibility, MdTrendingUp } from 'react-icons/md';

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ModalDetalleCampana({ campana, onClose }) {
  if (!campana) return null;

  const apertura = campana.enviados > 0 ? Math.round((campana.abiertos / campana.enviados) * 100) : 0;
  
  let badgeInfo = { label: 'Sin envíos', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' };
  if (campana.enviados > 0) {
    if (apertura >= 40) {
      badgeInfo = { label: 'Excelente', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' };
    } else if (apertura >= 20) {
      badgeInfo = { label: 'Bueno', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' };
    } else {
      badgeInfo = { label: 'Bajo', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' };
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MdEmail size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">CAM-{String(campana.id_campana).padStart(6, '0')}</p>
              <p className="text-xs text-text-soft mt-0.5">{campana.asunto}</p>
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
          {/* Métricas */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-bg-soft rounded-xl p-3 border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600">
                <MdSend size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{campana.enviados || 0}</p>
                <p className="text-[10px] uppercase font-semibold text-text-soft">Enviados</p>
              </div>
            </div>
            <div className="bg-bg-soft rounded-xl p-3 border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <MdVisibility size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{campana.abiertos || 0}</p>
                <p className="text-[10px] uppercase font-semibold text-text-soft">Abiertos</p>
              </div>
            </div>
            <div className="bg-bg-soft rounded-xl p-3 border border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                <MdTrendingUp size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{apertura}%</p>
                <p className="text-[10px] uppercase font-semibold text-text-soft">Tasa Apertura</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-bg rounded-xl border border-border p-4">
            <div className="flex items-center gap-1.5 text-sm text-text-soft">
              <MdCalendarToday size={16} /> 
              <span>Creado el <span className="font-semibold text-text">{formatearFecha(campana.fecha_creacion)}</span></span>
            </div>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${badgeInfo.badge}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${badgeInfo.dot}`} />
              {badgeInfo.label}
            </span>
          </div>

          {/* Plantilla / Descripción */}
          <div className="bg-bg rounded-xl border border-border p-4 flex-1">
            <h3 className="text-xs font-bold text-text mb-3 uppercase tracking-wider">Cuerpo del correo (Plantilla)</h3>
            <div className="bg-bg-soft p-4 rounded-xl border border-border/50 whitespace-pre-wrap text-sm text-text">
              {campana.plantilla || <span className="text-text-soft italic">Sin contenido.</span>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
