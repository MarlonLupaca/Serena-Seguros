'use client';

import React from 'react';
import TicketFormAsegurado from '@/components/soporte/TicketFormAsegurado';
import MisTickets from '@/components/soporte/MisTickets';

export default function SoporteAseguradoPage() {
  return (
    <div className="pb-8 px-8 mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text leading-tight">Soporte y Ayuda</h1>
        <p className="text-sm text-text-soft mt-1">
          ¿Tienes problemas con la plataforma o tus seguros? Repórtalo aquí.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <TicketFormAsegurado />
        <div className="flex flex-col gap-8">
          <MisTickets />
        </div>
      </div>
    </div>
  );
}
