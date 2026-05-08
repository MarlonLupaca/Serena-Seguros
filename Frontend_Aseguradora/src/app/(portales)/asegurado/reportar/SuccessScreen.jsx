'use client';

import { useState } from 'react';
import { MdCheckCircle, MdContentCopy, MdSchedule } from 'react-icons/md';

export default function SuccessScreen({ siniestro, onReset }) {
  const [copied, setCopied] = useState(false);
  const ticket = `SIN-${String(siniestro.id_siniestro).padStart(6, '0')}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(ticket);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const steps = [
    'Tu reporte fue registrado y un analista será asignado en las próximas 48 horas.',
    'Podrás hacer seguimiento del caso desde la sección de seguimiento más abajo.',
    'Si tienes documentos de respaldo, súbelos en la pestaña Documentos.',
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
        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          {siniestro.estado_resolucion}
        </span>
        <span className="text-xs text-text-soft">· {siniestro.poliza_nombre}</span>
        <span className="inline-flex items-center gap-1 text-xs text-text-soft">
          <MdSchedule size={13} /> Procesando...
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
        Reportar otro siniestro
      </button>
    </div>
  );
}
