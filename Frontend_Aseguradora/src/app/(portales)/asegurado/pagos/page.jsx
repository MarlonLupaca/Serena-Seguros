'use client';

import { useState } from 'react';
import ListaPagos from './ListaPagos';
import DetalleCuota from './DetalleCuota';
import ModalPago from './ModalPago';
import { ESTADO_CONFIG } from './data';

export default function ModuloPagos() {
  const [selected, setSelected] = useState(null);
  const [cuotaPagar, setCuotaPagar] = useState(null);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div>
        <div className="px-8 py-5">
          <div className="mx-auto">
            {/* Título */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xl font-bold text-text leading-tight">{selected ? selected.id : 'Mis pagos'}</p>
                  <p className="text-sm text-text-soft mt-0.5">
                    {selected
                      ? `${selected.polizaLabel} · ${selected.periodo}`
                      : 'Gestiona las cuotas y pagos de tus pólizas activas.'}
                  </p>
                </div>
              </div>
              {selected && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${ESTADO_CONFIG[selected.estado].badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_CONFIG[selected.estado].dot}`} />
                  {ESTADO_CONFIG[selected.estado].label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-8 pb-8 overflow-y-auto">
        {selected ? (
          <DetalleCuota cuota={selected} onBack={() => setSelected(null)} onPagar={(c) => setCuotaPagar(c)} />
        ) : (
          <ListaPagos onSelect={setSelected} onPagar={(c) => setCuotaPagar(c)} />
        )}
      </div>

      {/* Modal pago */}
      {cuotaPagar && (
        <ModalPago cuota={cuotaPagar} onClose={() => setCuotaPagar(null)} onSuccess={() => setCuotaPagar(null)} />
      )}
    </div>
  );
}
