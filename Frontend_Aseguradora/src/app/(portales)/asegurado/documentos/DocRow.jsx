import {
  MdNewReleases,
  MdVerified,
  MdWarningAmber,
  MdCalendarToday,
  MdDownload,
  MdOpenInNew,
  MdDescription,
} from 'react-icons/md';
import { TIPO_CONFIG, EXT_ICON } from './data';

export default function DocRow({ doc, onSelect }) {
  const tipo = TIPO_CONFIG[doc.tipo];
  const ExtIcon = EXT_ICON[doc.extension] || MdDescription;
  const PolIcon = doc.polizaIcon;

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(doc)}
    >
      <div className={`h-1 w-full ${doc.accentBg}`} />
      <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        {/* Ext icon */}
        <div
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${tipo.iconBg} gap-0.5`}
        >
          <ExtIcon size={18} className={tipo.iconColor} />
          <span className="font-bold uppercase tracking-wide" style={{ fontSize: 8 }}>
            {doc.extension}
          </span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text truncate">{doc.nombre}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tipo.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
              {tipo.label}
            </span>
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
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1.5 flex-wrap">
            <PolIcon size={11} className={doc.accentText} />
            <span>{doc.polizaLabel}</span>
            {doc.siniestroId && (
              <>
                <span className="opacity-40">·</span>
                <MdWarningAmber size={11} className="text-amber-500" />
                <span>{doc.siniestroId}</span>
              </>
            )}
            <span className="opacity-40">·</span>
            <MdCalendarToday size={10} />
            <span>{doc.fecha}</span>
            <span className="opacity-40">·</span>
            <span>{doc.tamaño}</span>
          </p>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdDownload size={13} /> Descargar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            <MdOpenInNew size={13} /> Ver
          </button>
        </div>
      </div>
    </div>
  );
}
