'use client';
import { useState } from 'react';
import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdHome,
  MdShield,
  MdWarning,
  MdArrowForward,
  MdArrowBack,
  MdCheckCircle,
  MdCheck,
  MdUpload,
  MdDescription,
  MdDeleteOutline,
  MdContentCopy,
  MdAccessTime,
  MdCalendarToday,
  MdLocationOn,
  MdPeople,
  MdNotes,
  MdLocalHospital,
  MdFireTruck,
  MdCarCrash,
  MdSecurity,
  MdMoreHoriz,
  MdVerified,
  MdSchedule,
} from 'react-icons/md';

const POLIZAS = [
  {
    id: 'POL-2024-00182',
    label: 'Seguro de Auto',
    icon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    plan: 'Full',
    estado: 'activa',
  },
  {
    id: 'POL-2023-00891',
    label: 'Seguro de Salud',
    icon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    plan: 'Familiar',
    estado: 'activa',
  },
  {
    id: 'POL-2024-00510',
    label: 'Seguro de Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    plan: 'Estándar',
    estado: 'en proceso',
  },
];

const TIPOS = [
  {
    id: 'accidente',
    label: 'Accidente de tránsito',
    desc: 'Colisión, volcamiento u otro evento vial',
    icon: MdCarCrash,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
  },
  {
    id: 'robo',
    label: 'Robo o hurto',
    desc: 'Robo total, parcial o intento de robo',
    icon: MdSecurity,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
  },
  {
    id: 'medico',
    label: 'Emergencia médica',
    desc: 'Hospitalización, urgencia o accidente',
    icon: MdLocalHospital,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
  },
  {
    id: 'daños',
    label: 'Daños a propiedad',
    desc: 'Incendio, inundación, daño estructural',
    icon: MdFireTruck,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
  },
  {
    id: 'terceros',
    label: 'Daños a terceros',
    desc: 'Daños causados a bienes de otras personas',
    icon: MdPeople,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
  },
  {
    id: 'otro',
    label: 'Otro',
    desc: 'Otro tipo de incidente no listado',
    icon: MdMoreHoriz,
    accentBg: 'bg-bg-soft',
    accentText: 'text-text-soft',
  },
];

const STEPS = [
  { id: 1, label: 'Póliza' },
  { id: 2, label: 'Siniestro' },
  { id: 3, label: 'Detalle' },
  { id: 4, label: 'Evidencia' },
  { id: 5, label: 'Confirmar' },
];

function generateTicket() {
  return 'SIN-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000);
}

function StepPoliza({ polizaId, onChange }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5">
      <p className="text-sm font-bold text-text mb-1">¿Qué póliza se vio afectada?</p>
      <p className="text-xs text-text-soft mb-4">Selecciona la póliza relacionada con el incidente.</p>
      <div className="flex flex-col gap-2">
        {POLIZAS.map((p) => {
          const Icon = p.icon;
          const sel = polizaId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${sel ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/40 hover:bg-bg-soft'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.accentBg}`}>
                <Icon size={20} className={p.accentText} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{p.label}</p>
                <p className="text-xs text-text-soft mt-0.5">
                  {p.id} · Plan {p.plan}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${sel ? 'border-primary bg-primary' : 'border-border'}`}
              >
                {sel && <MdCheck size={12} className="text-text-inverse" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepTipo({ tipoId, onChange }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5">
      <p className="text-sm font-bold text-text mb-1">¿Qué tipo de siniestro ocurrió?</p>
      <p className="text-xs text-text-soft mb-4">Esto nos ayuda a asignarte al equipo correcto.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TIPOS.map((t) => {
          const Icon = t.icon;
          const sel = tipoId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${sel ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/40 hover:bg-bg-soft'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${t.accentBg}`}>
                <Icon size={18} className={t.accentText} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text leading-tight">{t.label}</p>
                <p className="text-xs text-text-soft mt-0.5">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDetalle({ form, onChange, errors }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-text mb-1">Cuéntanos qué pasó</p>
        <p className="text-xs text-text-soft">Completa los datos del evento para agilizar tu caso.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
            <MdCalendarToday size={13} /> Fecha del evento *
          </label>
          <input
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={form.fecha}
            onChange={(e) => onChange('fecha', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors ${errors.fecha ? 'border-rose-400' : 'border-border focus:border-primary'}`}
          />
          {errors.fecha && <p className="text-xs text-rose-500 mt-1">{errors.fecha}</p>}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
            <MdAccessTime size={13} /> Hora aproximada *
          </label>
          <input
            type="time"
            value={form.hora}
            onChange={(e) => onChange('hora', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors ${errors.hora ? 'border-rose-400' : 'border-border focus:border-primary'}`}
          />
          {errors.hora && <p className="text-xs text-rose-500 mt-1">{errors.hora}</p>}
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
          <MdLocationOn size={13} /> Lugar del incidente *
        </label>
        <input
          type="text"
          value={form.lugar}
          onChange={(e) => onChange('lugar', e.target.value)}
          placeholder="Ej. Av. Javier Prado 1280, Miraflores"
          className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors ${errors.lugar ? 'border-rose-400' : 'border-border focus:border-primary'}`}
        />
        {errors.lugar && <p className="text-xs text-rose-500 mt-1">{errors.lugar}</p>}
        <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
          <MdLocationOn size={13} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary">
            Ingresa la dirección lo más precisa posible: calle, número, distrito y ciudad.
          </p>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
          <MdNotes size={13} /> Descripción de lo ocurrido *
          <span className="text-text-soft/60 font-normal">(mín. 30 caracteres)</span>
        </label>
        <textarea
          value={form.desc}
          onChange={(e) => onChange('desc', e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Describe brevemente cómo ocurrió el siniestro, qué bienes fueron afectados y si hubo lesionados…"
          className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors resize-none ${errors.desc ? 'border-rose-400' : 'border-border focus:border-primary'}`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.desc ? <p className="text-xs text-rose-500">{errors.desc}</p> : <span />}
          <p className={`text-xs ml-auto ${form.desc.length > 450 ? 'text-amber-600' : 'text-text-soft'}`}>
            {form.desc.length}/500
          </p>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
          <MdPeople size={13} /> Personas involucradas
          <span className="text-text-soft/60 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={form.personas}
          onChange={(e) => onChange('personas', e.target.value)}
          placeholder="Nombres, relación o número de personas"
          className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
        />
        <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
          <MdPeople size={13} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary">
            Si hay terceros involucrados, incluye sus datos básicos para facilitar el proceso.
          </p>
        </div>
      </div>
    </div>
  );
}

function StepEvidencia({ files, onAdd, onRemove }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-text mb-1">Adjunta evidencias</p>
        <p className="text-xs text-text-soft">
          Fotos, videos o documentos que respalden tu reporte. No es obligatorio pero agiliza la revisión.
        </p>
      </div>
      <label
        className="flex flex-col items-center gap-2 border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-8 cursor-pointer transition-colors hover:bg-primary/5"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onAdd(Array.from(e.dataTransfer.files).filter((f) => f.size < 10 * 1024 * 1024));
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <MdUpload size={22} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-text">Arrastra archivos aquí o haz clic</p>
        <p className="text-xs text-text-soft">Fotos, videos, PDF · Máx. 10 MB por archivo</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => onAdd(Array.from(e.target.files).filter((f) => f.size < 10 * 1024 * 1024))}
        />
      </label>
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MdDescription size={16} className="text-primary" />
              </div>
              <p className="text-sm text-text flex-1 truncate">{f.name}</p>
              <p className="text-xs text-text-soft shrink-0">{(f.size / 1024).toFixed(0)} KB</p>
              <button
                onClick={() => onRemove(i)}
                className="p-1.5 rounded-lg hover:bg-rose-100 text-text-soft hover:text-rose-500 transition-colors"
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
        <MdDescription size={13} className="text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-primary">
          Para siniestros de auto: adjunta fotos del vehículo y parte policial si existe. Para salud: adjunta el alta
          médica o exámenes.
        </p>
      </div>
    </div>
  );
}

function StepResumen({ data }) {
  const pol = POLIZAS.find((p) => p.id === data.poliza);
  const tip = TIPOS.find((t) => t.id === data.tipo);
  const PolIcon = pol?.icon;
  const TipIcon = tip?.icon;
  const rows = [
    { label: 'Póliza', value: pol?.label },
    { label: 'Número', value: pol?.id, small: true },
    { label: 'Fecha y hora', value: `${data.fecha} · ${data.hora}` },
    { label: 'Lugar', value: data.lugar },
    { label: 'Descripción', value: data.desc.length > 80 ? data.desc.slice(0, 80) + '…' : data.desc, muted: true },
    ...(data.personas ? [{ label: 'Involucrados', value: data.personas }] : []),
    {
      label: 'Archivos adjuntos',
      value: data.files.length ? `${data.files.length} archivo${data.files.length > 1 ? 's' : ''}` : 'Ninguno',
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          {pol && PolIcon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pol.accentBg}`}>
              <PolIcon size={20} className={pol.accentText} />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-bold text-text">{pol?.label}</p>
            <p className="text-xs text-text-soft">{pol?.id}</p>
          </div>
          {tip && TipIcon && (
            <span
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${tip.accentBg} ${tip.accentText}`}
            >
              <TipIcon size={13} /> {tip.label}
            </span>
          )}
        </div>
        <div className="divide-y divide-border">
          {rows.map(({ label, value, small, muted }) => (
            <div key={label} className="flex items-start justify-between px-4 py-3 gap-4">
              <p className="text-xs text-text-soft shrink-0">{label}</p>
              <p
                className={`text-right ${small ? 'text-xs' : 'text-sm'} ${muted ? 'text-text-soft' : 'font-medium text-text'}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <MdWarning size={16} className="text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-primary mb-0.5">¿Todo correcto?</p>
          <p className="text-xs text-primary/80">
            Una vez enviado, se generará tu número de caso. Podrás adjuntar más documentos luego desde la sección Mis
            pólizas.
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessScreen({ data, ticket, onReset }) {
  const [copied, setCopied] = useState(false);
  const pol = POLIZAS.find((p) => p.id === data.poliza);
  const handleCopy = () => {
    navigator.clipboard?.writeText(ticket);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const steps = [
    'Recibirás un correo con los detalles de tu caso en los próximos minutos.',
    'Un ajustador se contactará contigo en 24–48 horas hábiles.',
    'Podrás hacer seguimiento desde la sección Mis pólizas.',
    'Si tienes más documentos, puedes adjuntarlos usando tu número de caso.',
  ];
  return (
    <div className="flex flex-col items-center gap-5 py-4">
      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
        <MdCheckCircle size={36} className="text-emerald-600" />
      </div>
      <div className="text-center">
        <p className="text-lg font-bold text-text mb-1">Reporte enviado con éxito</p>
        <p className="text-sm text-text-soft max-w-xs">
          Tu caso fue registrado correctamente. Guarda tu número de seguimiento.
        </p>
      </div>
      <div className="w-full bg-bg rounded-2xl border-2 border-dashed border-primary/30 p-5 flex flex-col items-center gap-2">
        <p className="text-xs text-text-soft">Número de caso</p>
        <p className="text-2xl font-bold text-primary tracking-widest">{ticket}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium text-primary px-3 py-1.5 rounded-lg border border-primary/25 hover:bg-primary/10 transition-colors"
        >
          <MdContentCopy size={13} />
          {copied ? '¡Copiado!' : 'Copiar número'}
        </button>
      </div>
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          En revisión
        </span>
        {pol && <span className="text-xs text-text-soft">· {pol.label}</span>}
        <span className="inline-flex items-center gap-1 text-xs text-text-soft">
          <MdSchedule size={13} /> Procesando…
        </span>
      </div>
      <div className="w-full bg-bg rounded-2xl border border-border p-4">
        <p className="text-xs font-bold text-text-soft uppercase tracking-wide mb-3">Próximos pasos</p>
        <div className="flex flex-col gap-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-xs font-bold text-primary">
                {i + 1}
              </div>
              <p className="text-sm text-text-soft leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl border border-border hover:bg-bg-soft text-sm font-medium text-text-soft transition-colors"
      >
        Volver a Mis pólizas
      </button>
    </div>
  );
}

export default function ReportarSiniestro({ onClose }) {
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [ticket] = useState(generateTicket);
  const [poliza, setPoliza] = useState(null);
  const [tipo, setTipo] = useState(null);
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({ fecha: '', hora: '', lugar: '', desc: '', personas: '' });
  const [errors, setErrors] = useState({});

  const pct = Math.round((step / STEPS.length) * 100);

  const updateForm = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  };

  const validateStep3 = () => {
    const errs = {};
    if (!form.fecha) errs.fecha = 'Selecciona la fecha del evento.';
    if (!form.hora) errs.hora = 'Ingresa la hora aproximada.';
    if (!form.lugar.trim()) errs.lugar = 'El lugar del incidente es requerido.';
    if (form.desc.trim().length < 30) errs.desc = 'Describe el evento con al menos 30 caracteres.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 3 && !validateStep3()) return;
    if (step < STEPS.length) setStep((s) => s + 1);
    else setDone(true);
  };

  const canNext = (step === 1 && poliza) || (step === 2 && tipo) || step === 3 || step === 4 || step === 5;
  const nextLabel =
    step === 4
      ? files.length > 0
        ? `Continuar con ${files.length} archivo${files.length > 1 ? 's' : ''}`
        : 'Continuar sin archivos'
      : step === 5
        ? 'Enviar reporte'
        : 'Continuar';

  if (done) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col px-8">
        <div className="py-5 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
            <MdVerified size={18} className="text-emerald-600" />
          </div>
          <p className="text-sm font-bold text-text">Reporte enviado</p>
        </div>
        <div className="flex-1 w-full py-4">
          <SuccessScreen
            data={{ poliza, tipo, ...form, files }}
            ticket={ticket}
            onReset={() => {
              setStep(1);
              setDone(false);
              setPoliza(null);
              setTipo(null);
              setFiles([]);
              setForm({ fecha: '', hora: '', lugar: '', desc: '', personas: '' });
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-bold text-text leading-tight">Reportar siniestro</p>
          <p className="text-sm text-text-soft mt-0.5">
            Completa el formulario y recibirás un número de caso al instante.
          </p>
        </div>
      </div>

      {/* Stepper card */}
      <div className="bg-bg border border-border rounded-2xl px-6 py-4 mb-6 flex flex-col gap-3">
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-1.5 bg-bg-soft rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs font-semibold text-primary tabular-nums w-8 text-right">{pct}%</span>
        </div>
        {/* Step track */}
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    s.id < step
                      ? 'bg-primary text-text-inverse'
                      : s.id === step
                        ? 'bg-primary text-text-inverse ring-2 ring-primary/25'
                        : 'bg-bg-soft border border-border text-text-soft'
                  }`}
                >
                  {s.id < step ? <MdCheck size={13} /> : s.id}
                </div>
                <span
                  className={`text-xs hidden sm:block ${s.id === step ? 'font-semibold text-primary' : 'text-text-soft'}`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 transition-colors ${s.id < step ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col gap-4 pb-8">
        {step === 1 && <StepPoliza polizaId={poliza} onChange={setPoliza} />}
        {step === 2 && <StepTipo tipoId={tipo} onChange={setTipo} />}
        {step === 3 && <StepDetalle form={form} onChange={updateForm} errors={errors} />}
        {step === 4 && (
          <StepEvidencia
            files={files}
            onAdd={(f) => setFiles((prev) => [...prev, ...f])}
            onRemove={(i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))}
          />
        )}
        {step === 5 && <StepResumen data={{ poliza, tipo, ...form, files }} />}

        {/* Botones */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleNext}
            disabled={!canNext}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {nextLabel}
            {step < 5 && <MdArrowForward size={16} />}
          </button>
          {step > 1 && (
            <button
              onClick={() => {
                setErrors({});
                setStep((s) => s - 1);
              }}
              className="flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl border border-border hover:bg-bg-soft text-sm font-medium text-text-soft transition-colors"
            >
              <MdArrowBack size={15} /> Volver
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
