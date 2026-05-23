'use client';

import SeguimientoSiniestros from '../reportar/SeguimientoSiniestros';

export default function HistorialSiniestrosPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <p className="text-xl font-bold text-text leading-tight">Historial de Siniestros</p>
        <p className="text-sm text-text-soft mt-0.5">
          Consulta el estado y avance de todos los casos reportados.
        </p>
      </div>
      <SeguimientoSiniestros isStandalone={true} />
    </div>
  );
}
