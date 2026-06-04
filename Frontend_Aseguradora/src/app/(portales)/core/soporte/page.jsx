'use client';

import React from 'react';
import TicketFormEmpleado from '@/components/soporte/TicketFormEmpleado';
import MisTickets from '@/components/soporte/MisTickets';

export default function SoporteCorePage() {
  return (
    <div className="pb-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text leading-tight">Mesa de Servicios (TI)</h1>
        <p className="text-sm text-text-soft mt-1">
          Solicitud de accesos, información técnica y reporte de incidencias operativas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <TicketFormEmpleado />
        <div className="flex flex-col gap-8">
          <MisTickets />
        </div>
      </div>
    </div>
  );
}
