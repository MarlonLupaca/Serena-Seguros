import { MdWarningAmber, MdAccessTime, MdCalendarToday, MdCreditCard, MdChevronRight } from 'react-icons/md';
import { ESTADO_CONFIG, estiloTipo, formatearFecha, formatearMoneda, diasHasta, clasificarEstado } from './data';

export default function CuotaCard({ c, onSelect, onPagar }) {
  const tipoStyle = estiloTipo(c.poliza_tipo);
  const clase = clasificarEstado(c);
  const est = ESTADO_CONFIG[clase];
  const dr = diasHasta(c.fecha_vencimiento);

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(c)}
    >
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{c.poliza_nombre}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
              {clase === 'VENCIDO' && dr != null && dr < 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  <MdWarningAmber size={11} /> {Math.abs(dr)}d vencida
                </span>
              )}
              {clase === 'PENDIENTE' && dr != null && dr <= 5 && dr >= 0 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <MdAccessTime size={11} /> Vence en {dr}d
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              CUO-{String(c.id_cuota).padStart(6, '0')} · Cuota {c.numero_cuota}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <MdCalendarToday size={11} className="inline mr-1" />
              Vence: {formatearFecha(c.fecha_vencimiento)}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-base font-bold text-text">{formatearMoneda(c.monto)}</p>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPagar(c);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdCreditCard size={13} /> Pagar
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(c);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
              >
                Detalle <MdChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
