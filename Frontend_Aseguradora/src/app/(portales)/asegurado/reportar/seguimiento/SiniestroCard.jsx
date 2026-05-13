import { MdCalendarToday, MdAttachMoney, MdChevronRight } from 'react-icons/md';
import { ESTADO_CONFIG, ETAPAS, estiloTipo, formatearFecha, formatearMoneda } from './data';

export default function SiniestroCard({ s, onSelect }) {
  const tipoStyle = estiloTipo(s.poliza_tipo);
  const PolIcon = tipoStyle.icon;
  const est = ESTADO_CONFIG[s.estado_resolucion] || ESTADO_CONFIG.REPORTADO;
  const completados = est.paso;
  const total = ETAPAS.length;
  const pct = Math.round((completados / total) * 100);

  return (
    <div
      onClick={() => onSelect(s)}
      className="bg-bg rounded-2xl border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer w-full"
    >
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-5">
        <div className="flex flex-col sm:flex-row justify-center items-start gap-3">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
                <PolIcon size={22} className={tipoStyle.accentText} />
              </div>
              <div>
                <p className="text-xs text-text-soft mt-0.5">SIN-{String(s.id_siniestro).padStart(6, '0')}</p>
                <p className="text-sm font-bold text-text">{s.poliza_nombre}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 w-full">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                  <p className="text-xs text-text-soft mt-0.5">
                    <MdCalendarToday size={11} className="inline mr-1" />
                    Ocurrió: {formatearFecha(s.fecha_ocurrencia)}
                  </p>
                  <p className="text-xs text-text-soft mt-0.5">
                    <MdAttachMoney size={11} className="inline mr-1" />
                    Reclamo: {formatearMoneda(s.monto_reclamado)}
                  </p>
                  <p className="text-xs text-text-soft mt-0.5">{s.tipo_incidente}</p>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <div className="flex-1 h-1 bg-bg-soft rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.estado_resolucion === 'RECHAZADO'
                          ? 'bg-rose-400'
                          : s.estado_resolucion === 'APROBADO' || s.estado_resolucion === 'LIQUIDADO'
                            ? 'bg-emerald-500'
                            : 'bg-primary'
                      }`}
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
