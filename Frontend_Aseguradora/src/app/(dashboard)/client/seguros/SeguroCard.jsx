import { MdCheck, MdArrowForward } from 'react-icons/md';

export default function SeguroCard({ seguro }) {
  const Icon = seguro.icon;
  return (
    <div className="bg-bg rounded-2xl border border-border flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-1.5 w-full ${seguro.accentBg}`} />
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${seguro.accentBg}`}>
              <Icon size={22} className={seguro.accentText} />
            </div>
            <div>
              <h3 className="text-base font-bold text-text leading-tight">{seguro.nombre}</h3>
              <p className={`text-xs font-medium ${seguro.accentText}`}>{seguro.tagline}</p>
            </div>
          </div>
          {seguro.badge && (
            <span className="shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary text-text-inverse">
              {seguro.badge}
            </span>
          )}
        </div>
        <p className="text-sm text-text-soft leading-relaxed">{seguro.descripcion}</p>
        <ul className="flex flex-col gap-2">
          {seguro.beneficios.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm text-text-soft">
              <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
        <div className="flex gap-1.5 flex-wrap">
          {seguro.planes.map((p) => (
            <span
              key={p}
              className="text-xs px-2.5 py-1 rounded-full bg-bg-soft border border-border text-text-soft font-medium"
            >
              {p}
            </span>
          ))}
        </div>
        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-text-soft block">Desde</span>
            <span className="text-xl font-bold text-text">
              {seguro.desde}
              <span className="text-xs font-normal text-text-soft">/mes</span>
            </span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors">
            Cotizar
            <MdArrowForward size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
