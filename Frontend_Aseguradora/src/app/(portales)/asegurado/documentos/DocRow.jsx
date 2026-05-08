import { MdCalendarToday, MdDownload, MdChevronRight } from 'react-icons/md';
import { apiDownloadFile } from '@/lib/api';
import { estiloTabla, extensionDe, formatearFecha, iconoArchivo } from './data';

export default function DocRow({ doc, onSelect }) {
  const tabla = estiloTabla(doc.tabla_referencia);
  const ext = extensionDe(doc.nombre_archivo);
  const ExtIcon = iconoArchivo(ext);

  const descargar = async (e) => {
    e.stopPropagation();
    try {
      await apiDownloadFile(`/mis-documentos/${doc.id_documento}/archivo`, doc.nombre_archivo);
    } catch {
      // silencioso
    }
  };

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(doc)}
    >
      <div className={`h-1 w-full ${tabla.accentBg}`} />
      <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
        <div
          className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${tabla.accentBg} gap-0.5`}
        >
          <ExtIcon size={18} className={tabla.accentText} />
          <span className="font-bold uppercase tracking-wide" style={{ fontSize: 8 }}>
            {ext || 'doc'}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text truncate">{doc.nombre_archivo}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${tabla.accentBg} ${tabla.accentText}`}
            >
              {tabla.label}
              {doc.id_referencia ? ` · #${doc.id_referencia}` : ''}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1.5">
            <MdCalendarToday size={10} />
            <span>{formatearFecha(doc.fecha_carga)}</span>
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          <button
            onClick={descargar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdDownload size={13} /> Descargar
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(doc);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Detalle <MdChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
