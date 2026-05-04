import { MdNewReleases, MdVerified, MdCalendarToday, MdOpenInNew, MdDownload, MdDescription } from 'react-icons/md';
import { TIPO_CONFIG, EXT_ICON } from './data';

export default function DocCard({ doc, onSelect }) {
  const tipo = TIPO_CONFIG[doc.tipo];
  const ExtIcon = EXT_ICON[doc.extension] || MdDescription;

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer flex flex-col"
      onClick={() => onSelect(doc)}
    >
      <div className={`h-1 w-full ${doc.accentBg}`} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Ícono + badges */}
        <div className="flex items-start justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${tipo.iconBg} gap-0.5`}
          >
            <ExtIcon size={18} className={tipo.iconColor} />
            <span className="font-bold uppercase tracking-wide" style={{ fontSize: 8 }}>
              {doc.extension}
            </span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {doc.nuevo && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                <MdNewReleases size={10} /> Nuevo
              </span>
            )}
            {doc.importante && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                <MdVerified size={10} /> Importante
              </span>
            )}
          </div>
        </div>

        {/* Nombre */}
        <div className="flex-1">
          <p className="text-sm font-bold text-text leading-snug line-clamp-2">{doc.nombre}</p>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1.5 ${tipo.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
            {tipo.label}
          </span>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-text-soft border-t border-border pt-2.5 mt-auto">
          <span className="flex items-center gap-1">
            <MdCalendarToday size={10} /> {doc.fecha}
          </span>
          <span>{doc.tamaño}</span>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            <MdOpenInNew size={12} /> Ver
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdDownload size={12} /> Descargar
          </button>
        </div>
      </div>
    </div>
  );
}
