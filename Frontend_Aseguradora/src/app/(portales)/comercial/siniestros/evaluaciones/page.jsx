import React from 'react';
import { MdAssignment, MdCheckCircle, MdCancel, MdWarning, MdArrowForward } from 'react-icons/md';

export default function EvaluacionesPage() {
  const evaluaciones = [
    { id: 'EVAL-001', siniestro: 'SIN-2026-001', cliente: 'Roberto Gómez', tipo: 'Daño Vehicular', prioridad: 'Alta' },
    { id: 'EVAL-002', siniestro: 'SIN-2026-002', cliente: 'Andrea Silva', tipo: 'Reembolso Médico', prioridad: 'Media' },
  ];

  return (
    <div className="py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Evaluaciones de Siniestros</h1>
        <p className="text-sm text-text-soft mt-1">Revisa la documentación y determina la cobertura de los siniestros.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {evaluaciones.map((evaluacion) => (
          <div key={evaluacion.id} className="bg-bg border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <MdAssignment size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-text">{evaluacion.id}</h3>
                  <p className="text-xs text-text-soft">Siniestro: {evaluacion.siniestro}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${evaluacion.prioridad === 'Alta' ? 'bg-red-500/10 text-red-600' : 'bg-orange-500/10 text-orange-600'}`}>
                Prioridad {evaluacion.prioridad}
              </span>
            </div>

            <div className="bg-bg-soft rounded-xl p-4 flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-soft">Cliente:</span>
                <span className="font-semibold text-text">{evaluacion.cliente}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-soft">Tipo de Cobertura:</span>
                <span className="font-semibold text-text">{evaluacion.tipo}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button className="flex-1 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-colors flex justify-center items-center gap-2">
                <MdCheckCircle size={18} /> Aprobar
              </button>
              <button className="flex-1 py-2 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors flex justify-center items-center gap-2">
                <MdCancel size={18} /> Rechazar
              </button>
              <button className="px-4 py-2 bg-bg border border-border text-text-soft rounded-xl hover:bg-bg-soft transition-colors" title="Solicitar más información">
                <MdWarning size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Empty state placeholder for when there are no more evaluations */}
        <div className="bg-bg-soft border border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center text-center min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center text-text-soft mb-3">
            <MdCheckCircle size={24} />
          </div>
          <h3 className="text-base font-bold text-text">Estás al día</h3>
          <p className="text-sm text-text-soft max-w-xs mt-1">No hay más evaluaciones de siniestros pendientes de revisión en este momento.</p>
        </div>
      </div>
    </div>
  );
}
