import {
  MdArrowBack,
  MdNewReleases,
  MdVerified,
  MdCalendarToday,
  MdAttachFile,
  MdFolderOpen,
  MdChevronRight,
  MdWarningAmber,
  MdOpenInNew,
  MdDownload,
  MdDescription,
} from 'react-icons/md';
import { DOCUMENTOS, TIPO_CONFIG, EXT_ICON } from './data';

export default function DetalleDocumento({ doc, onBack }) {
  const tipo = TIPO_CONFIG[doc.tipo];
  const PolIcon = doc.polizaIcon;
  const ExtIcon = EXT_ICON[doc.extension] || MdDescription;

  const relacionados = DOCUMENTOS.filter(
    (d) =>
      d.id !== doc.id &&
      (d.polizaId === doc.polizaId || d.siniestroId === doc.siniestroId) &&
      d.siniestroId === doc.siniestroId
  ).slice(0, 3);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis documentos
      </button>

      {/* Card principal */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${doc.accentBg}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start gap-4">
            {/* Ícono grande */}
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${tipo.iconBg} gap-0.5`}
            >
              <ExtIcon size={22} className={tipo.iconColor} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ fontSize: 9 }}>
                {doc.extension}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-text leading-tight">{doc.nombre}</p>
                {doc.nuevo && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    <MdNewReleases size={11} /> Nuevo
                  </span>
                )}
                {doc.importante && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                    <MdVerified size={11} /> Importante
                  </span>
                )}
              </div>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1.5 ${tipo.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${tipo.dot}`} />
                {tipo.label}
              </span>
              <p className="text-xs text-text-soft mt-2 leading-relaxed">{doc.descripcion}</p>
            </div>
          </div>

          {/* Metadatos */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdCalendarToday, label: 'Fecha', val: doc.fecha },
              { icon: MdAttachFile, label: 'Tamaño', val: doc.tamaño },
              { icon: MdFolderOpen, label: 'Formato', val: doc.extension.toUpperCase() },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon size={11} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-xs font-semibold text-text truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Póliza y siniestro asociado */}
        <div className="p-5 border-b border-border flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Asociado a</p>
          <div
            className={`flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors`}
          >
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${doc.accentBg}`}>
              <PolIcon size={17} className={doc.accentText} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-text">{doc.polizaLabel}</p>
              <p className="text-xs text-text-soft mt-0.5">{doc.polizaId}</p>
            </div>
            <MdChevronRight size={16} className="text-text-soft shrink-0" />
          </div>
          {doc.siniestroId && (
            <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-100">
                <MdWarningAmber size={17} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text">Siniestro</p>
                <p className="text-xs text-text-soft mt-0.5">{doc.siniestroId}</p>
              </div>
              <MdChevronRight size={16} className="text-text-soft shrink-0" />
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="p-5 flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
            <MdOpenInNew size={14} /> Ver documento
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
            <MdDownload size={14} /> Descargar
          </button>
        </div>
      </div>

      {/* Documentos relacionados */}
      {relacionados.length > 0 && (
        <div className="bg-bg rounded-2xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">
            Otros documentos del mismo caso
          </p>
          <div className="flex flex-col gap-2">
            {relacionados.map((r) => {
              const rTipo = TIPO_CONFIG[r.tipo];
              const RExtIcon = EXT_ICON[r.extension] || MdDescription;
              return (
                <div
                  key={r.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${rTipo.iconBg}`}>
                    <RExtIcon size={15} className={rTipo.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{r.nombre}</p>
                    <p className="text-xs text-text-soft mt-0.5">
                      {r.fecha} · {r.tamaño}
                    </p>
                  </div>
                  <button className="p-1.5 rounded-lg hover:bg-primary/10 text-text-soft hover:text-primary transition-colors shrink-0">
                    <MdDownload size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
