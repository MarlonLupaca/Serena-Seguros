import { MdCalendarToday, MdDownload } from 'react-icons/md';
import { apiDownloadFile } from '@/lib/api';
import { estiloTabla, extensionDe, formatearFecha, iconoArchivo } from './data';

export default function DocCard({ doc, onSelect }) {
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
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer flex flex-col"
      onClick={() => onSelect(doc)}
    >
      <div className={`h-1 w-full ${tabla.accentBg}`} />
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div
            className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${tabla.accentBg} gap-0.5`}
          >
            <ExtIcon size={18} className={tabla.accentText} />
            <span className="font-bold uppercase tracking-wide" style={{ fontSize: 8 }}>
              {ext || 'doc'}
            </span>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-sm font-bold text-text leading-snug line-clamp-2">{doc.nombre_archivo}</p>
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1.5 ${tabla.accentBg} ${tabla.accentText}`}
          >
            {tabla.label}
            {doc.id_referencia ? ` · #${doc.id_referencia}` : ''}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-text-soft border-t border-border pt-2.5 mt-auto">
          <span className="flex items-center gap-1">
            <MdCalendarToday size={10} /> {formatearFecha(doc.fecha_carga)}
          </span>
        </div>

        <button
          onClick={descargar}
          className="w-full flex items-center justify-center gap-1 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdDownload size={12} /> Descargar
        </button>
      </div>
    </div>
  );
}
