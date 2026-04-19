'use client';
import { useState } from 'react';
import {
  MdWarning,
  MdArrowForward,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdHome,
  MdCheck,
  MdSearch,
  MdFilterList,
  MdChevronRight,
  MdUpload,
  MdDescription,
  MdDeleteOutline,
  MdAccessTime,
  MdCalendarToday,
  MdLocationOn,
  MdPeople,
  MdCheckCircle,
  MdHourglassEmpty,
  MdThumbUp,
  MdThumbDown,
  MdNotificationsActive,
  MdAttachFile,
  MdSend,
  MdArrowBack,
  MdOpenInNew,
  MdPhoneInTalk,
  MdEmail,
} from 'react-icons/md';

const SINIESTROS = [
  {
    id: 'SIN-2024-10482',
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    tipo: 'Accidente de tránsito',
    fecha: '12/04/2024',
    hora: '14:35',
    lugar: 'Av. Javier Prado 1280, Miraflores',
    desc: 'Colisión por alcance en semáforo. Daños en paragolpes trasero y luz izquierda. Sin lesionados.',
    estado: 'evaluacion',
    stepActual: 2,
    ajustador: 'Carlos Mendoza',
    ajustadorEmail: 'c.mendoza@segurosplus.pe',
    ajustadorPhone: '+51 987 654 321',
    monto: 'S/ 4,200',
    evidencias: ['Foto frontal.jpg', 'Foto lateral.jpg', 'Parte policial.pdf'],
    pendiente: 'Adjunta el presupuesto del taller autorizado para continuar con la evaluación.',
    timeline: [
      {
        estado: 'Enviado',
        fecha: '12/04/2024 14:50',
        completado: true,
        comentario: 'Reporte recibido y registrado en el sistema.',
      },
      {
        estado: 'En evaluación',
        fecha: '13/04/2024 09:00',
        completado: true,
        comentario: 'Caso asignado al ajustador Carlos Mendoza.',
      },
      {
        estado: 'Documentación',
        fecha: '14/04/2024 11:30',
        completado: false,
        activo: true,
        comentario: 'Se requiere presupuesto del taller autorizado.',
      },
      { estado: 'Aprobación', fecha: '—', completado: false, comentario: '' },
      { estado: 'Resolución', fecha: '—', completado: false, comentario: '' },
    ],
    historial: [
      {
        fecha: '14/04/2024',
        hora: '11:30',
        tipo: 'solicitud',
        texto: 'Se solicita adjuntar presupuesto del taller autorizado.',
        autor: 'Carlos Mendoza',
      },
      {
        fecha: '13/04/2024',
        hora: '09:00',
        tipo: 'asignacion',
        texto: 'Caso asignado al ajustador Carlos Mendoza para evaluación en campo.',
        autor: 'Sistema',
      },
      {
        fecha: '12/04/2024',
        hora: '14:50',
        tipo: 'registro',
        texto: 'Siniestro registrado correctamente en el sistema.',
        autor: 'Sistema',
      },
    ],
  },
  {
    id: 'SIN-2024-09871',
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    tipo: 'Emergencia médica',
    fecha: '02/03/2024',
    hora: '08:10',
    lugar: 'Clínica San Felipe, Jesús María',
    desc: 'Hospitalización de 3 días por apendicitis aguda. Cirugía laparoscópica realizada el 03/03/2024.',
    estado: 'aprobado',
    stepActual: 4,
    ajustador: 'Ana Torres',
    ajustadorEmail: 'a.torres@segurosplus.pe',
    ajustadorPhone: '+51 976 543 210',
    monto: 'S/ 12,800',
    evidencias: ['Alta médica.pdf', 'Facturas clínica.pdf', 'Informe quirúrgico.pdf'],
    pendiente: null,
    timeline: [
      {
        estado: 'Enviado',
        fecha: '02/03/2024 08:20',
        completado: true,
        comentario: 'Reporte de emergencia médica recibido.',
      },
      {
        estado: 'En evaluación',
        fecha: '02/03/2024 10:00',
        completado: true,
        comentario: 'Revisión de cobertura iniciada por Ana Torres.',
      },
      {
        estado: 'Documentación',
        fecha: '04/03/2024 09:00',
        completado: true,
        comentario: 'Documentación completa recibida y verificada.',
      },
      {
        estado: 'Aprobación',
        fecha: '06/03/2024 15:00',
        completado: true,
        comentario: 'Reembolso aprobado por S/ 12,800.',
      },
      { estado: 'Resolución', fecha: '—', completado: false, comentario: '' },
    ],
    historial: [
      {
        fecha: '06/03/2024',
        hora: '15:00',
        tipo: 'aprobacion',
        texto: 'Reembolso aprobado por S/ 12,800. Se procesará en 3-5 días hábiles.',
        autor: 'Ana Torres',
      },
      {
        fecha: '04/03/2024',
        hora: '09:00',
        tipo: 'documento',
        texto: 'Documentación completa recibida: alta médica, facturas y informe quirúrgico.',
        autor: 'Sistema',
      },
      {
        fecha: '02/03/2024',
        hora: '10:00',
        tipo: 'asignacion',
        texto: 'Caso asignado a Ana Torres, especialista en siniestros de salud.',
        autor: 'Sistema',
      },
      {
        fecha: '02/03/2024',
        hora: '08:20',
        tipo: 'registro',
        texto: 'Emergencia médica registrada. Prioridad alta.',
        autor: 'Sistema',
      },
    ],
  },
  {
    id: 'SIN-2023-07654',
    polizaId: 'POL-2022-00345',
    polizaLabel: 'Seguro de Hogar',
    polizaIcon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    tipo: 'Daños a propiedad',
    fecha: '18/11/2023',
    hora: '21:00',
    lugar: 'Av. Javier Prado 1280, Miraflores',
    desc: 'Inundación por rotura de tubería en el baño principal. Daños en piso, paredes y muebles del dormitorio.',
    estado: 'rechazado',
    stepActual: 4,
    ajustador: 'Luis Vargas',
    ajustadorEmail: 'l.vargas@segurosplus.pe',
    ajustadorPhone: '+51 965 432 109',
    monto: '—',
    evidencias: ['Fotos daños.jpg', 'Informe técnico.pdf'],
    pendiente: null,
    timeline: [
      { estado: 'Enviado', fecha: '18/11/2023 22:00', completado: true, comentario: 'Reporte de daños recibido.' },
      {
        estado: 'En evaluación',
        fecha: '20/11/2023 09:00',
        completado: true,
        comentario: 'Inspección en domicilio programada.',
      },
      {
        estado: 'Documentación',
        fecha: '22/11/2023 14:00',
        completado: true,
        comentario: 'Inspección realizada. Informe técnico generado.',
      },
      {
        estado: 'Aprobación',
        fecha: '28/11/2023 10:00',
        completado: true,
        comentario: 'Caso rechazado por exclusión de cobertura.',
      },
      { estado: 'Resolución', fecha: '—', completado: false, comentario: '' },
    ],
    historial: [
      {
        fecha: '28/11/2023',
        hora: '10:00',
        tipo: 'rechazo',
        texto: 'Caso rechazado. La rotura de tuberías por desgaste crónico está excluida de la póliza Estándar.',
        autor: 'Luis Vargas',
      },
      {
        fecha: '22/11/2023',
        hora: '14:00',
        tipo: 'documento',
        texto: 'Inspección en domicilio completada. Daños confirmados por desgaste de tubería.',
        autor: 'Luis Vargas',
      },
      {
        fecha: '18/11/2023',
        hora: '22:00',
        tipo: 'registro',
        texto: 'Siniestro registrado. Inspección programada para el 20/11/2023.',
        autor: 'Sistema',
      },
    ],
  },
];

const ESTADO_CONFIG = {
  enviado: { label: 'Enviado', badge: 'bg-primary/10 text-primary', dot: 'bg-primary', icon: MdArrowForward },
  evaluacion: {
    label: 'En evaluación',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    icon: MdHourglassEmpty,
  },
  docs: { label: 'Documentación', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400', icon: MdDescription },
  aprobado: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: MdThumbUp },
  rechazado: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400', icon: MdThumbDown },
};

const HISTORIAL_TIPO = {
  registro: { bg: 'bg-primary/10', text: 'text-primary', icon: MdCheckCircle },
  asignacion: { bg: 'bg-amber-100', text: 'text-amber-600', icon: MdPeople },
  solicitud: { bg: 'bg-rose-100', text: 'text-rose-500', icon: MdNotificationsActive },
  documento: { bg: 'bg-sky-100', text: 'text-sky-600', icon: MdDescription },
  aprobacion: { bg: 'bg-emerald-100', text: 'text-emerald-600', icon: MdThumbUp },
  rechazo: { bg: 'bg-rose-100', text: 'text-rose-500', icon: MdThumbDown },
};

function DetalleSiniestro({ siniestro, onBack }) {
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
                        className={`absolute left-[15px] top-8 bottom-0 w-0.5 ${t.completado ? 'bg-primary/30' : 'bg-border'}`}
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
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border" />
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

function ListaSiniestros({ onSelect }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const filtrados = SINIESTROS.filter((s) => {
    const matchFiltro = filtro === 'todos' || s.estado === filtro;
    const matchBusq =
      busqueda === '' ||
      s.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.polizaLabel.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusq;
  });

  const counts = {
    total: SINIESTROS.length,
    activos: SINIESTROS.filter((s) => s.estado === 'evaluacion' || s.estado === 'enviado').length,
    aprobados: SINIESTROS.filter((s) => s.estado === 'aprobado').length,
    rechazados: SINIESTROS.filter((s) => s.estado === 'rechazado').length,
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total casos', val: counts.total, color: 'text-text' },
          { label: 'En curso', val: counts.activos, color: 'text-amber-600' },
          { label: 'Aprobados', val: counts.aprobados, color: 'text-emerald-600' },
          { label: 'Rechazados', val: counts.rechazados, color: 'text-rose-500' },
        ].map((k) => (
          <div key={k.label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <MdWarning size={17} className="text-primary" />
            </div>
            <div>
              <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.val}</p>
              <p className="text-xs text-text-soft">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar por número, tipo o póliza…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
          />
        </div>
        <div className="relative">
          <MdFilterList size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <select
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="pl-8 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="enviado">Enviado</option>
            <option value="evaluacion">En evaluación</option>
            <option value="aprobado">Aprobado</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
      </div>

      {filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdWarning size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No se encontraron casos</p>
          <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((s) => {
            const est = ESTADO_CONFIG[s.estado];
            const PolIcon = s.polizaIcon;
            const completados = s.timeline.filter((t) => t.completado).length;
            const total = s.timeline.length;
            const pct = Math.round((completados / total) * 100);
            return (
              <div
                key={s.id}
                onClick={() => onSelect(s)}
                className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
              >
                <div className={`h-1 w-full ${s.accentBg}`} />
                <div className="p-5">
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${s.accentBg}`}>
                      <PolIcon size={22} className={s.accentText} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-text">{s.polizaLabel}</p>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                          {est.label}
                        </span>
                        {s.pendiente && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                            <MdNotificationsActive size={11} /> Acción requerida
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-text-soft mt-0.5">
                        {s.id} · {s.tipo}
                      </p>
                      <p className="text-xs text-text-soft mt-0.5">
                        <MdCalendarToday size={11} className="inline mr-1" />
                        {s.fecha}
                        <span className="mx-1.5">·</span>
                        <MdLocationOn size={11} className="inline mr-1" />
                        {s.lugar}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <div className="flex-1 h-1 bg-bg-soft rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${s.estado === 'rechazado' ? 'bg-rose-400' : s.estado === 'aprobado' ? 'bg-emerald-500' : 'bg-primary'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-text-soft tabular-nums">
                          {completados}/{total} etapas
                        </span>
                      </div>
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors shrink-0">
                      Ver detalle <MdChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function SeguimientoSiniestros() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xl font-bold text-text leading-tight">
              {selected ? selected.id : 'Seguimiento de siniestros'}
            </p>
            <p className="text-sm text-text-soft mt-0.5">
              {selected
                ? `${selected.tipo} · ${selected.polizaLabel}`
                : 'Consulta el estado y avance de tus casos reportados.'}
            </p>
          </div>
        </div>
        {selected && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full shrink-0 mt-1 ${ESTADO_CONFIG[selected.estado].badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_CONFIG[selected.estado].dot}`} />
            {ESTADO_CONFIG[selected.estado].label}
          </span>
        )}
      </div>

      <div className="flex-1 w-full pb-8">
        {selected ? (
          <DetalleSiniestro siniestro={selected} onBack={() => setSelected(null)} />
        ) : (
          <ListaSiniestros onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
