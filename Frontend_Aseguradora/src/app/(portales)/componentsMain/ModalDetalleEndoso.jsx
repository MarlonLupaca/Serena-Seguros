'use client';

import { MdClose, MdCalendarToday, MdEditNote, MdDownload } from 'react-icons/md';

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function ModalDetalleEndoso({ abierto, onClose, endoso, onDescargar, extraInfo, acciones }) {
  if (!abierto || !endoso) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div 
        className="bg-bg w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-border animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border bg-bg-soft">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <MdEditNote size={22} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text">Detalle de Endoso</h2>
              <p className="text-xs text-text-soft">END-{String(endoso.id_endoso).padStart(6, '0')} · POL-{String(endoso.id_poliza).padStart(6, '0')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full text-text-soft transition-colors">
            <MdClose size={24} />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-6 overflow-y-auto max-h-[70vh]">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-soft uppercase tracking-wider">Tipo de cambio</span>
              <span className="text-sm font-semibold text-text">{endoso.tipo_cambio}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-soft uppercase tracking-wider">Estado Actual</span>
              <span className="text-sm font-bold px-3 py-1 rounded-lg w-fit bg-bg-soft border border-border tracking-wide">
                {endoso.estado_aprobacion?.replace(/_/g, ' ')}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-text-soft uppercase tracking-wider">Fecha de Solicitud</span>
              <span className="text-sm text-text flex items-center gap-1.5">
                <MdCalendarToday size={14} className="text-text-soft" />
                {formatearFecha(endoso.fecha_solicitud)}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-bold text-text-soft uppercase tracking-wider">Descripción del requerimiento</span>
            <div className="bg-bg-soft p-4 rounded-xl border border-border text-sm text-text whitespace-pre-wrap leading-relaxed">
              {endoso.descripcion_cambio}
            </div>
          </div>

          {endoso.archivo_url && (
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-bold text-text-soft uppercase tracking-wider">Documento de Sustento</span>
              <button 
                onClick={onDescargar}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors w-fit text-sm font-semibold text-primary"
              >
                <MdDownload size={18} />
                Descargar Documento Adjunto
              </button>
            </div>
          )}

          {extraInfo && (
            <div className="mt-2 pt-4 border-t border-border">
              {extraInfo}
            </div>
          )}
        </div>

        {acciones && (
          <div className="p-5 border-t border-border bg-bg-soft flex items-center justify-end gap-3 flex-wrap">
            {acciones}
          </div>
        )}
      </div>
    </div>
  );
}
