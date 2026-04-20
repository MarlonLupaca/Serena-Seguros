import { MdPayment, MdWarning, MdRefresh, MdChevronRight } from 'react-icons/md';
import { ESTADO_STYLES } from './data';

export default function PolizaCard({ p, onVerDetalle }) {
  const Icon = p.icon;
  const est = ESTADO_STYLES[p.estado];

  return (
    <div className=" bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${p.accentBg}`} />
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-4 flex-1 w-full">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${p.accentBg}`}>
            <Icon size={22} className={p.accentText} />
          </div>
          <div className="flex-1 min-w-0 ">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-bold text-text">{p.label}</span>
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {p.id} · Plan {p.plan}
            </p>
            {p.bien && <p className="text-xs text-text-soft mt-0.5 truncate">{p.bien}</p>}
          </div>
        </div>

        <div className="flex gap-4 text-xs text-text-soft shrink-0 flex-wrap sm:flex-nowrap justify-between">
          <div className="text-center">
            <p className="text-text-soft">Vencimiento</p>
            <p className="font-semibold text-text mt-0.5">{p.fin}</p>
          </div>
          <div className="text-center">
            <p className="text-text-soft">Monto</p>
            <p className="font-semibold text-text mt-0.5">{p.monto}</p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 justify-between">
          {p.estado === 'activa' && (
            <>
              <button
                title="Pagar"
                className="p-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft hover:text-primary transition-colors"
              >
                <MdPayment size={16} />
              </button>
              <button
                title="Reportar siniestro"
                className="p-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft hover:text-rose-500 transition-colors"
              >
                <MdWarning size={16} />
              </button>
            </>
          )}
          {p.estado === 'vencida' && (
            <button
              title="Renovar"
              className="p-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft hover:text-primary transition-colors"
            >
              <MdRefresh size={16} />
            </button>
          )}
          <button
            onClick={() => onVerDetalle(p)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Ver detalle <MdChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
