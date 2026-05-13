import {
  MdArrowBack,
  MdCalendarToday,
  MdAttachMoney,
  MdNotes,
  MdCheck,
} from 'react-icons/md';
import {
  ESTADO_CONFIG,
  ETAPAS,
  estiloTipo,
  formatearFecha,
  formatearMoneda,
} from './data';

export default function DetalleSiniestro({ siniestro, onBack }) {
  const tipoStyle = estiloTipo(siniestro.poliza_tipo);
  const PolIcon = tipoStyle.icon;
  const est = ESTADO_CONFIG[siniestro.estado_resolucion] || ESTADO_CONFIG.REPORTADO;
  const pasoActual = est.paso;
  const rechazado = siniestro.estado_resolucion === 'RECHAZADO';

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis casos
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${tipoStyle.accentBg}`} />

        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
                <PolIcon size={20} className={tipoStyle.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{siniestro.poliza_nombre}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  SIN-{String(siniestro.id_siniestro).padStart(6, '0')} · {siniestro.tipo_incidente}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-text-soft">Monto reclamado</p>
              <p className="text-base font-bold text-text mt-0.5">{formatearMoneda(siniestro.monto_reclamado)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <Item icon={MdCalendarToday} label="Fecha ocurrencia" val={formatearFecha(siniestro.fecha_ocurrencia)} />
            <Item icon={MdCalendarToday} label="Fecha de reporte" val={formatearFecha(siniestro.fecha_reporte)} />
          </div>
        </div>

        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2 flex items-center gap-1.5">
            <MdNotes size={12} /> Descripción
          </p>
          <p className="text-sm text-text whitespace-pre-line leading-relaxed">{siniestro.descripcion}</p>
        </div>

        <div className="p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Avance del caso</p>
          <div className="flex flex-col">
            {ETAPAS.map((etapa, i) => {
              const completado = i + 1 < pasoActual;
              const activo = i + 1 === pasoActual;
              const isLast = i === ETAPAS.length - 1;
              return (
                <div key={etapa} className="flex gap-4 relative">
                  {!isLast && (
                    <div
                      className={`absolute left-3.75 top-8 bottom-0 w-0.5 ${
                        completado ? 'bg-primary/30' : 'bg-border'
                      }`}
                    />
                  )}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                      completado
                        ? 'bg-primary border-primary'
                        : activo
                          ? rechazado
                            ? 'bg-bg border-rose-400'
                            : 'bg-bg border-primary'
                          : 'bg-bg-soft border-border'
                    }`}
                  >
                    {completado ? (
                      <MdCheck size={14} className="text-text-inverse" />
                    ) : activo ? (
                      <span
                        className={`w-2 h-2 rounded-full animate-pulse ${rechazado ? 'bg-rose-400' : 'bg-primary'}`}
                      />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-border" />
                    )}
                  </div>
                  <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                    <p
                      className={`text-sm font-semibold ${
                        completado ? 'text-text' : activo ? (rechazado ? 'text-rose-500' : 'text-primary') : 'text-text-soft'
                      }`}
                    >
                      {etapa}
                      {activo && (
                        <span
                          className={`ml-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                            rechazado ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {rechazado ? 'Rechazado' : 'Etapa actual'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, val }) {
  return (
    <div className="bg-bg-soft rounded-xl p-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={11} className="text-text-soft" />
        <p className="text-xs text-text-soft">{label}</p>
      </div>
      <p className="text-xs font-semibold text-text truncate">{val}</p>
    </div>
  );
}
