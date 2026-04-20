'use client';

import { useState } from 'react';
import { MdCheck, MdArrowForward, MdArrowBack, MdVerified } from 'react-icons/md';
import { STEPS, generateTicket } from './data';
import StepPoliza from './StepPoliza';
import StepTipo from './StepTipo';
import StepDetalle from './StepDetalle';
import StepEvidencia from './StepEvidencia';
import StepResumen from './StepResumen';
import SuccessScreen from './SuccessScreen';

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
