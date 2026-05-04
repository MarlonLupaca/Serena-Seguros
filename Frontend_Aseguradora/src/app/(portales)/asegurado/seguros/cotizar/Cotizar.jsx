'use client';

import { useState } from 'react';
import { MdCheck, MdArrowBack, MdArrowForward, MdSave } from 'react-icons/md';
import { STEPS } from './data';
import StepTipo from './StepTipo';
import StepDatos from './StepDatos';
import StepCobertura from './StepCobertura';
import StepCotizacion from './StepCotizacion';
import StepContratacion from './StepContratacion';

export default function Cotizar() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    tipo: null,
    datos: {},
    cobertura: { periodo: 'mensual', deducible: 0, extras: [] },
  });

  const set = (patch) => setData((prev) => ({ ...prev, ...patch }));

  const canNext = () => {
    if (step === 0) return !!data.tipo;
    if (step === 1) return !!(data.datos?.nombre && data.datos?.edad);
    if (step === 2) return !!data.cobertura?.plan;
    return true;
  };

  const STEP_COMPONENTS = [
    <StepTipo key="tipo" data={data} set={set} />,
    <StepDatos key="datos" data={data} set={set} />,
    <StepCobertura key="cobertura" data={data} set={set} />,
    <StepCotizacion key="cotizacion" data={data} onRecalcular={() => setStep(2)} />,
    <StepContratacion key="contratacion" data={data} />,
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5">
        <p className="text-xl font-bold text-text">Cotizar</p>
        <p className="text-sm text-text-soft mt-0.5">Obtén tu precio personalizado en minutos.</p>
      </div>

      {/* Stepper */}
      <div className="bg-bg border border-border rounded-2xl px-6 py-4 mb-6">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < step
                      ? 'bg-primary text-text-inverse'
                      : i === step
                        ? 'bg-primary text-text-inverse ring-4 ring-primary/20'
                        : 'bg-bg-soft border border-border text-text-soft'
                  }`}
                >
                  {i < step ? <MdCheck size={14} /> : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block whitespace-nowrap ${i === step ? 'text-primary font-semibold' : 'text-text-soft'}`}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="bg-bg rounded-2xl border border-border p-6">{STEP_COMPONENTS[step]}</div>

        {/* Navegación */}
        {step < 4 && (
          <div className="flex items-center justify-between pb-8">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-soft hover:bg-bg hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdArrowBack size={16} /> Anterior
            </button>
            <div className="flex items-center gap-2">
              {step === 3 && (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-soft hover:bg-bg transition-colors">
                  <MdSave size={16} /> Guardar
                </button>
              )}
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 3 ? 'Contratar' : 'Continuar'} <MdArrowForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
