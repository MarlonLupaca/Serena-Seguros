import { MdCalendarToday } from 'react-icons/md';
import { estiloTipo, formatearFecha, formatearMoneda } from './data';

export default function HistorialCard({ c }) {
  const tipoStyle = estiloTipo(c.poliza_tipo);

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text">{c.poliza_nombre}</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pagado
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            CUO-{String(c.id_cuota).padStart(6, '0')} · Cuota {c.numero_cuota}
            <span className="mx-1.5">·</span>
            <MdCalendarToday size={11} className="inline mr-1" />
            {formatearFecha(c.fecha_vencimiento)}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-base font-bold text-text">{formatearMoneda(c.monto)}</p>
        </div>
      </div>
    </div>
  );
}
