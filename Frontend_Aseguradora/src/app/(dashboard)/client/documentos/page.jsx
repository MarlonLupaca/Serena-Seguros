'use client';
import { useState } from 'react';
import {
  MdArrowForward,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdHome,
  MdSearch,
  MdFilterList,
  MdChevronRight,
  MdDownload,
  MdDescription,
  MdCalendarToday,
  MdArrowBack,
  MdUpload,
  MdDeleteOutline,
  MdAttachFile,
  MdSend,
  MdOpenInNew,
  MdFolderOpen,
  MdPictureAsPdf,
  MdImage,
  MdArticle,
  MdReceiptLong,
  MdVerified,
  MdNewReleases,
  MdClose,
  MdGridView,
  MdViewList,
  MdHourglassEmpty,
  MdCheckCircle,
  MdWarningAmber,
} from 'react-icons/md';

// ── Data mock ──────────────────────────────────────────────────
const DOCUMENTOS = [
  // Pólizas
  {
    id: 'DOC-0001',
    nombre: 'Póliza de Seguro de Auto',
    tipo: 'poliza',
    extension: 'pdf',
    tamaño: '1.2 MB',
    fecha: '01/01/2024',
    fechaTs: 20240101,
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    siniestroId: null,
    importante: true,
    nuevo: false,
    descripcion: 'Contrato completo de póliza. Plan Cobertura Total · Vigencia 2024.',
  },
  {
    id: 'DOC-0002',
    nombre: 'Condiciones generales Auto',
    tipo: 'contrato',
    extension: 'pdf',
    tamaño: '3.8 MB',
    fecha: '01/01/2024',
    fechaTs: 20240101,
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    siniestroId: null,
    importante: false,
    nuevo: false,
    descripcion: 'Términos, exclusiones y condiciones del plan Cobertura Total.',
  },
  {
    id: 'DOC-0003',
    nombre: 'Póliza de Seguro de Salud',
    tipo: 'poliza',
    extension: 'pdf',
    tamaño: '980 KB',
    fecha: '15/06/2023',
    fechaTs: 20230615,
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    siniestroId: null,
    importante: true,
    nuevo: false,
    descripcion: 'Contrato completo de póliza. Plan Familiar Plus · Vigencia 2023–2024.',
  },
  {
    id: 'DOC-0004',
    nombre: 'Póliza de Seguro de Hogar',
    tipo: 'poliza',
    extension: 'pdf',
    tamaño: '870 KB',
    fecha: '10/03/2022',
    fechaTs: 20220310,
    polizaId: 'POL-2022-00345',
    polizaLabel: 'Seguro de Hogar',
    polizaIcon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    siniestroId: null,
    importante: true,
    nuevo: false,
    descripcion: 'Contrato completo de póliza. Plan Estándar · Vigencia 2022–2024.',
  },
  // Comprobantes
  {
    id: 'DOC-0005',
    nombre: 'Comprobante de pago · Marzo 2024',
    tipo: 'comprobante',
    extension: 'pdf',
    tamaño: '210 KB',
    fecha: '18/03/2024',
    fechaTs: 20240318,
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    siniestroId: null,
    importante: false,
    nuevo: true,
    descripcion: 'Comprobante de cuota 3/12. Visa •••• 4821. S/ 890.00.',
  },
  {
    id: 'DOC-0006',
    nombre: 'Comprobante de pago · Feb 2024',
    tipo: 'comprobante',
    extension: 'pdf',
    tamaño: '198 KB',
    fecha: '14/02/2024',
    fechaTs: 20240214,
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    siniestroId: null,
    importante: false,
    nuevo: false,
    descripcion: 'Comprobante de cuota 1/6. Transferencia BCP. S/ 340.00.',
  },
  {
    id: 'DOC-0007',
    nombre: 'Comprobante de pago · Ene 2024',
    tipo: 'comprobante',
    extension: 'pdf',
    tamaño: '201 KB',
    fecha: '28/01/2024',
    fechaTs: 20240128,
    polizaId: 'POL-2022-00345',
    polizaLabel: 'Seguro de Hogar',
    polizaIcon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    siniestroId: null,
    importante: false,
    nuevo: false,
    descripcion: 'Comprobante de cuota 7/12. Yape. S/ 210.00.',
  },
  // Siniestros
  {
    id: 'DOC-0008',
    nombre: 'Parte policial · SIN-2024-10482',
    tipo: 'evidencia',
    extension: 'pdf',
    tamaño: '540 KB',
    fecha: '12/04/2024',
    fechaTs: 20240412,
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    siniestroId: 'SIN-2024-10482',
    importante: false,
    nuevo: true,
    descripcion: 'Parte policial del accidente de tránsito. Av. Javier Prado, 12/04/2024.',
  },
  {
    id: 'DOC-0009',
    nombre: 'Foto frontal · SIN-2024-10482',
    tipo: 'evidencia',
    extension: 'jpg',
    tamaño: '2.1 MB',
    fecha: '12/04/2024',
    fechaTs: 20240412,
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    siniestroId: 'SIN-2024-10482',
    importante: false,
    nuevo: true,
    descripcion: 'Fotografía frontal del vehículo tras la colisión.',
  },
  {
    id: 'DOC-0010',
    nombre: 'Alta médica · SIN-2024-09871',
    tipo: 'evidencia',
    extension: 'pdf',
    tamaño: '320 KB',
    fecha: '05/03/2024',
    fechaTs: 20240305,
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    siniestroId: 'SIN-2024-09871',
    importante: false,
    nuevo: false,
    descripcion: 'Alta médica tras hospitalización. Clínica San Felipe, 05/03/2024.',
  },
  {
    id: 'DOC-0011',
    nombre: 'Informe quirúrgico · SIN-2024-09871',
    tipo: 'evidencia',
    extension: 'pdf',
    tamaño: '415 KB',
    fecha: '04/03/2024',
    fechaTs: 20240304,
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    siniestroId: 'SIN-2024-09871',
    importante: false,
    nuevo: false,
    descripcion: 'Informe de cirugía laparoscópica. Clínica San Felipe.',
  },
  {
    id: 'DOC-0012',
    nombre: 'Informe técnico · SIN-2023-07654',
    tipo: 'evidencia',
    extension: 'pdf',
    tamaño: '760 KB',
    fecha: '22/11/2023',
    fechaTs: 20231122,
    polizaId: 'POL-2022-00345',
    polizaLabel: 'Seguro de Hogar',
    polizaIcon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    siniestroId: 'SIN-2023-07654',
    importante: false,
    nuevo: false,
    descripcion: 'Informe de inspección técnica. Daños por rotura de tubería.',
  },
];

const TIPO_CONFIG = {
  poliza: {
    label: 'Póliza',
    badge: 'bg-primary/10 text-primary',
    dot: 'bg-primary',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    icon: MdVerified,
  },
  contrato: {
    label: 'Contrato',
    badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-400',
    iconBg: 'bg-sky-100',
    iconColor: 'text-sky-600',
    icon: MdArticle,
  },
  comprobante: {
    label: 'Comprobante',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    icon: MdReceiptLong,
  },
  evidencia: {
    label: 'Evidencia',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    icon: MdDescription,
  },
};

const EXT_ICON = {
  pdf: MdPictureAsPdf,
  jpg: MdImage,
  png: MdImage,
};

const CATEGORIAS = [
  { id: 'todas', label: 'Todos' },
  { id: 'poliza', label: 'Pólizas' },
  { id: 'contrato', label: 'Contratos' },
  { id: 'comprobante', label: 'Comprobantes' },
  { id: 'evidencia', label: 'Evidencias' },
];

// ── Modal Subida ───────────────────────────────────────────────
function ModalSubida({ onClose }) {
  const [files, setFiles] = useState([]);
  const [tipo, setTipo] = useState('');
  const [poliza, setPoliza] = useState('');
  const [nota, setNota] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Subir documento</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {/* Drop zone */}
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-primary/25 rounded-xl p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <MdUpload size={22} className="text-primary" />
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
            <div className="flex flex-col gap-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-soft bg-bg-soft rounded-lg px-3 py-2">
                  <MdAttachFile size={13} className="text-primary shrink-0" />
                  <span className="flex-1 truncate">{f.name}</span>
                  <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}>
                    <MdDeleteOutline size={14} className="text-rose-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tipo */}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo de documento</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
            >
              <option value="">Seleccionar tipo…</option>
              <option value="poliza">Póliza</option>
              <option value="contrato">Contrato</option>
              <option value="comprobante">Comprobante</option>
              <option value="evidencia">Evidencia</option>
            </select>
          </div>

          {/* Póliza */}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Póliza asociada</label>
            <select
              value={poliza}
              onChange={(e) => setPoliza(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
            >
              <option value="">Seleccionar póliza…</option>
              <option value="POL-2024-00182">POL-2024-00182 · Seguro de Auto</option>
              <option value="POL-2023-00891">POL-2023-00891 · Seguro de Salud</option>
              <option value="POL-2022-00345">POL-2022-00345 · Seguro de Hogar</option>
            </select>
          </div>

          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Nota opcional…"
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors resize-none"
          />

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
              <MdSend size={13} /> Subir
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Detail view ────────────────────────────────────────────────
function DetalleDocumento({ doc, onBack }) {
  const tipo = TIPO_CONFIG[doc.tipo];
  const TipoIcon = tipo.icon;
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

// ── Card de documento (grid) ───────────────────────────────────
function DocCard({ doc, onSelect }) {
  const tipo = TIPO_CONFIG[doc.tipo];
  const TipoIcon = tipo.icon;
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

// ── Row de documento (lista) ───────────────────────────────────
function DocRow({ doc, onSelect }) {
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

// ── List view ──────────────────────────────────────────────────
function ListaDocumentos({ onSelect, onSubir }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [polizaFiltro, setPolizaFiltro] = useState('todas');
  const [orden, setOrden] = useState('reciente');
  const [vista, setVista] = useState('lista');

  const filtrados = DOCUMENTOS.filter((d) => {
    const matchCat = categoria === 'todas' || d.tipo === categoria;
    const matchPol = polizaFiltro === 'todas' || d.polizaId === polizaFiltro;
    const matchBusq =
      busqueda === '' ||
      d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.polizaLabel.toLowerCase().includes(busqueda.toLowerCase()) ||
      (d.siniestroId && d.siniestroId.toLowerCase().includes(busqueda.toLowerCase()));
    return matchCat && matchPol && matchBusq;
  }).sort((a, b) => (orden === 'reciente' ? b.fechaTs - a.fechaTs : a.nombre.localeCompare(b.nombre)));

  // Agrupados por tipo para vista lista
  const grupos = CATEGORIAS.filter((c) => c.id !== 'todas')
    .map((c) => ({
      ...c,
      docs: filtrados.filter((d) => d.tipo === c.id),
    }))
    .filter((g) => g.docs.length > 0);

  const counts = {
    total: DOCUMENTOS.length,
    nuevos: DOCUMENTOS.filter((d) => d.nuevo).length,
    importantes: DOCUMENTOS.filter((d) => d.importante).length,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Total documentos',
            val: counts.total,
            icon: MdFolderOpen,
            bg: 'bg-primary/10',
            iconColor: 'text-primary',
            color: 'text-text',
          },
          {
            label: 'Nuevos',
            val: counts.nuevos,
            icon: MdNewReleases,
            bg: 'bg-primary/10',
            iconColor: 'text-primary',
            color: 'text-primary',
          },
          {
            label: 'Importantes',
            val: counts.importantes,
            icon: MdVerified,
            bg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            color: 'text-amber-600',
          },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${k.bg}`}>
                <Icon size={17} className={k.iconColor} />
              </div>
              <div>
                <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.val}</p>
                <p className="text-xs text-text-soft">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros y controles */}
      <div className="flex flex-col gap-3">
        {/* Búsqueda + subir */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar documentos, póliza, siniestro…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={onSubir}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-primary/40 hover:bg-primary/5 text-xs font-medium text-primary transition-colors shrink-0"
          >
            <MdUpload size={14} /> Subir
          </button>
        </div>

        {/* Filtros secundarios */}
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  categoria === c.id
                    ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                    : 'border-border text-text-soft hover:text-text bg-bg'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            {/* Vista */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setVista('lista')}
                className={`px-2.5 py-1.5 transition-colors ${vista === 'lista' ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft'}`}
              >
                <MdViewList size={15} />
              </button>
              <button
                onClick={() => setVista('grid')}
                className={`px-2.5 py-1.5 transition-colors ${vista === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft'}`}
              >
                <MdGridView size={15} />
              </button>
            </div>

            {/* Orden */}
            <div className="relative">
              <MdFilterList size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-soft" />
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="reciente">Más reciente</option>
                <option value="nombre">Nombre A–Z</option>
              </select>
            </div>

            {/* Póliza */}
            <div className="relative">
              <select
                value={polizaFiltro}
                onChange={(e) => setPolizaFiltro(e.target.value)}
                className="pl-3 pr-3 py-1.5 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="todas">Todas las pólizas</option>
                <option value="POL-2024-00182">Auto</option>
                <option value="POL-2023-00891">Salud</option>
                <option value="POL-2022-00345">Hogar</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdFolderOpen size={36} className="text-text-soft mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-text">No se encontraron documentos</p>
          <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros o el buscador</p>
        </div>
      ) : vista === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtrados.map((d) => (
            <DocCard key={d.id} doc={d} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        // Vista lista agrupada por categoría
        <div className="flex flex-col gap-6">
          {grupos.map((g) => {
            const GIcon = TIPO_CONFIG[g.id]?.icon || MdDescription;
            return (
              <div key={g.id} className="flex flex-col gap-3">
                {/* Encabezado de grupo */}
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${TIPO_CONFIG[g.id]?.iconBg}`}>
                    <GIcon size={13} className={TIPO_CONFIG[g.id]?.iconColor} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">{g.label}</p>
                  <span className="text-xs text-text-soft bg-bg-soft px-2 py-0.5 rounded-full border border-border">
                    {g.docs.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {g.docs.map((d) => (
                    <DocRow key={d.id} doc={d} onSelect={onSelect} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function ModuloDocumentos() {
  const [selected, setSelected] = useState(null);
  const [modalSubida, setModalSubida] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div>
        <div className="px-8 py-5">
          <div className="">
            {/* Título */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-text leading-tight">
                    {selected ? selected.nombre : 'Mis documentos'}
                  </h1>
                  <p className="text-sm text-text-soft mt-0.5">
                    {selected
                      ? `${selected.polizaLabel}${selected.siniestroId ? ` · ${selected.siniestroId}` : ''}`
                      : 'Consulta y descarga todos los archivos de tus seguros.'}
                  </p>
                </div>
              </div>
              {selected && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${TIPO_CONFIG[selected.tipo].badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${TIPO_CONFIG[selected.tipo].dot}`} />
                  {TIPO_CONFIG[selected.tipo].label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1  w-full px-8 ">
        {selected ? (
          <DetalleDocumento doc={selected} onBack={() => setSelected(null)} />
        ) : (
          <ListaDocumentos onSelect={setSelected} onSubir={() => setModalSubida(true)} />
        )}
      </div>

      {/* Modal subida */}
      {modalSubida && <ModalSubida onClose={() => setModalSubida(false)} />}
    </div>
  );
}
