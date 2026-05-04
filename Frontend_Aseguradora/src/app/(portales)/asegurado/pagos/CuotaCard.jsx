import {
  MdWarningAmber,
  MdAccessTime,
  MdCalendarToday,
  MdDownload,
  MdCreditCard,
  MdChevronRight,
} from 'react-icons/md';
import { ESTADO_CONFIG } from './data';

export default function CuotaCard({ c, onSelect, onPagar }) {
  const est = ESTADO_CONFIG[c.estado];
  const PolIcon = c.polizaIcon;
  const progreso = Math.round(((c.numeroCuota - 1) / c.totalCuotas) * 100);

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(c)}
    >
      <div className={`h-1 w-full ${c.accentBg}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.accentBg}`}>
            <PolIcon size={22} className={c.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{c.polizaLabel}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
              {c.estado === 'vencido' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                  <MdWarningAmber size={11} /> {Math.abs(c.diasRestantes)}d vencida
                </span>
              )}
              {c.estado === 'pendiente' && c.diasRestantes <= 5 && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                  <MdAccessTime size={11} /> Vence en {c.diasRestantes}d
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {c.id} · {c.descripcion}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <MdCalendarToday size={11} className="inline mr-1" />
              Vence: {c.vencimiento}
              <span className="mx-1.5">·</span>
              Cuota {c.numeroCuota}/{c.totalCuotas}
            </p>

            <div className="flex items-center gap-2 mt-3">
              <div className="flex-1 h-1 bg-bg-soft rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    c.estado === 'vencido' ? 'bg-rose-400' : c.estado === 'pagado' ? 'bg-emerald-500' : 'bg-primary'
                  }`}
                  style={{ width: `${progreso}%` }}
                />
              </div>
              <span className="text-xs text-text-soft tabular-nums">
                {c.numeroCuota - 1}/{c.totalCuotas}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <p className="text-base font-bold text-text">{c.monto}</p>
            <div className="flex gap-2">
              {c.estado === 'pagado' ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                >
                  <MdDownload size={13} /> Comprobante
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPagar(c);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                >
                  <MdCreditCard size={13} /> Pagar
                </button>
              )}
              <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors">
                Ver detalle <MdChevronRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
