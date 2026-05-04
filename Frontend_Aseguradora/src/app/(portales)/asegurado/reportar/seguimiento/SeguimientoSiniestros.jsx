'use client';

import { useState } from 'react';
import ListaSiniestros from './ListaSiniestros';
import DetalleSiniestro from './DetalleSiniestro';
import { ESTADO_CONFIG } from './data';

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

      <div className="flex-1 w-full pb-8 ">
        {selected ? (
          <DetalleSiniestro siniestro={selected} onBack={() => setSelected(null)} />
        ) : (
          <ListaSiniestros onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
