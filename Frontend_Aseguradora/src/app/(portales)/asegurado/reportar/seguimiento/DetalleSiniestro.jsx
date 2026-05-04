import { useState } from 'react';
import {
  MdArrowBack,
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdNotificationsActive,
  MdCheck,
  MdOpenInNew,
  MdUpload,
  MdAttachFile,
  MdDeleteOutline,
  MdSend,
  MdPhoneInTalk,
  MdEmail,
  MdDescription,
} from 'react-icons/md';
import { ESTADO_CONFIG, HISTORIAL_TIPO } from './data';

export default function DetalleSiniestro({ siniestro, onBack }) {
  const [tab, setTab] = useState('timeline');
  const [newDoc, setNewDoc] = useState(false);
  const [files, setFiles] = useState([]);
  const [nota, setNota] = useState('');

  const est = ESTADO_CONFIG[siniestro.estado];
  const PolIcon = siniestro.polizaIcon;

  const TABS = [
    { id: 'timeline', label: 'Seguimiento' },
    { id: 'historial', label: 'Historial' },
    { id: 'evidencia', label: 'Evidencias' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis casos
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${siniestro.accentBg}`} />

        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${siniestro.accentBg}`}>
                <PolIcon size={20} className={siniestro.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{siniestro.polizaLabel}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  {siniestro.id} · {siniestro.tipo}
                </p>
              </div>
            </div>
            {siniestro.monto !== '—' && (
              <div className="text-right shrink-0">
                <p className="text-xs text-text-soft">Monto del caso</p>
                <p className="text-base font-bold text-text mt-0.5">{siniestro.monto}</p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdCalendarToday, label: 'Fecha', val: siniestro.fecha },
              { icon: MdAccessTime, label: 'Hora', val: siniestro.hora },
              { icon: MdLocationOn, label: 'Lugar', val: siniestro.lugar },
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

        {siniestro.pendiente && (
          <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <MdNotificationsActive size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-700 mb-0.5">Acción requerida</p>
              <p className="text-xs text-amber-700">{siniestro.pendiente}</p>
            </div>
            <button
              onClick={() => setNewDoc(true)}
              className="text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors shrink-0"
            >
              Adjuntar
            </button>
          </div>
        )}

        <div className="flex border-b border-border px-5 gap-1 mt-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'timeline' && (
            <div className="flex flex-col">
              {siniestro.timeline.map((t, i) => {
                const isLast = i === siniestro.timeline.length - 1;
                return (
                  <div key={i} className="flex gap-4 relative">
                    {!isLast && (
                      <div
                        className={`absolute left-3.75 top-8 bottom-0 w-0.5 ${t.completado ? 'bg-primary/30' : 'bg-border'}`}
                      />
                    )}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 border-2 ${
                        t.completado
                          ? 'bg-primary border-primary'
                          : t.activo
                            ? 'bg-bg border-primary'
                            : 'bg-bg-soft border-border'
                      }`}
                    >
                      {t.completado ? (
                        <MdCheck size={14} className="text-text-inverse" />
                      ) : t.activo ? (
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-border" />
                      )}
                    </div>
                    <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p
                          className={`text-sm font-semibold ${t.completado ? 'text-text' : t.activo ? 'text-primary' : 'text-text-soft'}`}
                        >
                          {t.estado}
                          {t.activo && (
                            <span className="ml-2 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                              Etapa actual
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-text-soft">{t.fecha}</p>
                      </div>
                      {t.comentario && <p className="text-xs text-text-soft mt-1 leading-relaxed">{t.comentario}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'historial' && (
            <div className="flex flex-col relative">
              <div className="absolute left-4.5 top-0 bottom-0 w-0.5 bg-border" />
              {siniestro.historial.map((h, i) => {
                const cfg = HISTORIAL_TIPO[h.tipo] || HISTORIAL_TIPO.registro;
                const HIcon = cfg.icon;
                return (
                  <div key={i} className="flex gap-4 pb-5 relative z-10 last:pb-0">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 border-bg ${cfg.bg}`}
                    >
                      <HIcon size={15} className={cfg.text} />
                    </div>
                    <div className="pt-1 flex-1">
                      <p className="text-sm text-text leading-snug">{h.texto}</p>
                      <p className="text-xs text-text-soft mt-1">
                        {h.fecha} · {h.hora} · <span className="font-medium">{h.autor}</span>
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'evidencia' && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-1">
                Archivos cargados ({siniestro.evidencias.length})
              </p>
              {siniestro.evidencias.map((e) => (
                <div
                  key={e}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MdDescription size={15} className="text-primary" />
                  </div>
                  <p className="text-sm text-text flex-1 truncate">{e}</p>
                  <button className="p-1.5 rounded-lg hover:bg-primary/10 text-text-soft hover:text-primary transition-colors">
                    <MdOpenInNew size={15} />
                  </button>
                </div>
              ))}
              {newDoc ? (
                <div className="mt-2 p-4 rounded-xl border border-primary/25 bg-primary/5">
                  <p className="text-xs font-semibold text-primary mb-3">Adjuntar nueva evidencia</p>
                  <label className="flex flex-col items-center gap-2 border-2 border-dashed border-primary/25 rounded-xl p-5 cursor-pointer hover:bg-primary/5 transition-colors">
                    <MdUpload size={20} className="text-primary" />
                    <p className="text-xs font-medium text-text">Seleccionar archivos</p>
                    <p className="text-xs text-text-soft">PDF, JPG, PNG · Máx. 10 MB</p>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) => setFiles((p) => [...p, ...Array.from(e.target.files)])}
                    />
                  </label>
                  {files.length > 0 && (
                    <div className="flex flex-col gap-1.5 mt-3">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-text-soft">
                          <MdAttachFile size={13} className="text-primary" />
                          <span className="flex-1 truncate">{f.name}</span>
                          <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}>
                            <MdDeleteOutline size={14} className="text-rose-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <textarea
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    placeholder="Nota opcional para el ajustador…"
                    rows={2}
                    className="w-full mt-3 px-3 py-2 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors resize-none"
                  />
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
                      <MdSend size={13} /> Enviar
                    </button>
                    <button
                      onClick={() => {
                        setNewDoc(false);
                        setFiles([]);
                        setNota('');
                      }}
                      className="flex-1 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setNewDoc(true)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-medium text-text-soft hover:text-primary transition-all mt-1"
                >
                  <MdUpload size={15} /> Añadir nueva evidencia
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Ajustador */}
      <div className="bg-bg rounded-2xl border border-border p-4 flex items-center gap-4 flex-wrap">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-sm font-bold text-primary">
          {siniestro.ajustador
            .split(' ')
            .map((n) => n[0])
            .join('')}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-text-soft">Ajustador asignado</p>
          <p className="text-sm font-bold text-text mt-0.5">{siniestro.ajustador}</p>
          <p className="text-xs text-text-soft mt-0.5">{siniestro.ajustadorEmail}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href={`tel:${siniestro.ajustadorPhone}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdPhoneInTalk size={14} /> Llamar
          </a>
          <a
            href={`mailto:${siniestro.ajustadorEmail}`}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            <MdEmail size={14} /> Escribir
          </a>
        </div>
      </div>
    </div>
  );
}
