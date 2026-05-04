import { MdNotificationsActive, MdCalendarToday, MdLocationOn, MdChevronRight } from 'react-icons/md';
import { ESTADO_CONFIG } from './data';

export default function SiniestroCard({ s, onSelect }) {
  const est = ESTADO_CONFIG[s.estado];
  const PolIcon = s.polizaIcon;
  const completados = s.timeline.filter((t) => t.completado).length;
  const total = s.timeline.length;
  const pct = Math.round((completados / total) * 100);

  return (
    <div
      onClick={() => onSelect(s)}
      className="bg-bg rounded-2xl border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer w-full"
    >
      <div className={`h-1 w-full ${s.accentBg}`} />
      <div className="p-5">
        <div className=" flex flex-col sm:flex-row justify-center items-start gap-3">
          <div className=" flex flex-col gap-2 w-full">
            <div className="flex gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.accentBg}`}>
                <PolIcon size={22} className={s.accentText} />
              </div>
              <div>
                <p className="text-xs text-text-soft mt-0.5">{s.id}</p>
                <p className="text-sm font-bold text-text">{s.polizaLabel}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 w-full">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col items-start gap-2 flex-wrap">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                      {est.label}
                    </span>
                    {s.pendiente && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                        <MdNotificationsActive size={11} /> Acción requerida
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-xs text-text-soft mt-0.5">
                    <MdCalendarToday size={11} className="inline mr-1" />
                    {s.fecha}
                  </p>
                  <p className="text-xs text-text-soft mt-0.5">
                    <MdLocationOn size={11} className="inline mr-1" />
                    {s.lugar}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1 bg-bg-soft rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${s.estado === 'rechazado' ? 'bg-rose-400' : s.estado === 'aprobado' ? 'bg-emerald-500' : 'bg-primary'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-soft tabular-nums">
                    {completados}/{total} etapas
                  </span>
                </div>
              </div>
            </div>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors shrink-0">
            Ver detalle <MdChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
