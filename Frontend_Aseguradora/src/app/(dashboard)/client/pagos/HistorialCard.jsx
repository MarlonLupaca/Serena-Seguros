import { MdCalendarToday, MdDownload } from 'react-icons/md';

export default function HistorialCard({ h }) {
  const PolIcon = h.polizaIcon;

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`h-1 w-full ${h.accentBg}`} />
      <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${h.accentBg}`}>
          <PolIcon size={20} className={h.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text">{h.polizaLabel}</p>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Pagado
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            {h.id}
            <span className="mx-1.5">·</span>
            <MdCalendarToday size={11} className="inline mr-1" />
            {h.fecha}
            <span className="mx-1.5">·</span>
            {h.metodo}
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <p className="text-base font-bold text-text">{h.monto}</p>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
            <MdDownload size={13} /> Comprobante
          </button>
        </div>
      </div>
    </div>
  );
}
