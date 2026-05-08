'use client';

import { useEffect, useState } from 'react';
import { MdReportProblem, MdAttachMoney, MdAssignmentLate, MdInsights } from 'react-icons/md';
import { apiGet } from '@/lib/api';

const ESTADO_LABEL = {
  REPORTADO: 'Reportado',
  EN_REVISION: 'En revision',
  APROBADO: 'Aprobado',
  RECHAZADO: 'Rechazado',
  LIQUIDADO: 'Liquidado',
};

const ESTADO_COLOR = {
  REPORTADO: 'bg-blue-500',
  EN_REVISION: 'bg-amber-500',
  APROBADO: 'bg-emerald-500',
  RECHAZADO: 'bg-rose-500',
  LIQUIDADO: 'bg-primary',
};

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function SiniestralidadPage() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet('/ejecutivo/siniestralidad')
      .then((d) => {
        setData(d);
        setCargando(false);
      })
      .catch((e) => {
        setError(e.mensaje || 'Error al cargar');
        setCargando(false);
      });
  }, []);

  if (cargando) return <div className="p-6 text-sm text-text-soft">Cargando siniestralidad...</div>;
  if (error) return <div className="p-6 text-sm text-rose-600">{error}</div>;

  const porEstado = Object.entries(data.por_estado || {});
  const maxEstado = Math.max(1, ...porEstado.map(([, v]) => Number(v)));

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xl font-bold text-text">Indice de siniestralidad</p>
        <p className="text-xs text-text-soft">Volumen de siniestros, monto reclamado y carga sobre las polizas activas.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Siniestros totales" valor={data.total_siniestros} icon={MdReportProblem} bg="bg-rose-100" color="text-rose-600" />
        <Tile label="Indice (%)" valor={`${data.indice_siniestralidad}%`} icon={MdInsights} bg="bg-primary/10" color="text-primary" />
        <Tile label="Reclamado" valor={formatearMoneda(data.monto_reclamado)} icon={MdAttachMoney} bg="bg-amber-100" color="text-amber-600" />
        <Tile label="Liquidado" valor={formatearMoneda(data.monto_liquidado)} icon={MdAssignmentLate} bg="bg-emerald-100" color="text-emerald-600" />
      </div>

      <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
        <p className="text-sm font-bold text-text">Distribucion por estado</p>
        {porEstado.length === 0 ? (
          <p className="text-xs text-text-soft">Sin siniestros registrados.</p>
        ) : (
          porEstado.map(([estado, cantidad]) => (
            <div key={estado}>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-text">{ESTADO_LABEL[estado] || estado}</span>
                <span className="text-text-soft">{cantidad}</span>
              </div>
              <div className="h-1.5 bg-bg-soft rounded-full mt-1 overflow-hidden">
                <div
                  className={`h-full rounded-full ${ESTADO_COLOR[estado] || 'bg-primary'}`}
                  style={{ width: `${(Number(cantidad) / maxEstado) * 100}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Tile({ label, valor, icon: Icon, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className={`text-xl font-bold leading-tight ${color}`}>{valor}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}
