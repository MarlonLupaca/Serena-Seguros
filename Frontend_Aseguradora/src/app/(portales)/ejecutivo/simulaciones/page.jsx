'use client';

import { useEffect, useState } from 'react';
import { MdScience, MdTrendingUp, MdTrendingDown } from 'react-icons/md';
import { apiGet } from '@/lib/api';

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SimulacionesPage() {
  const [resumen, setResumen] = useState(null);
  const [produccion, setProduccion] = useState(null);
  const [comercial, setComercial] = useState(null);
  const [siniestralidad, setSiniestralidad] = useState(null);
  const [variables, setVariables] = useState({ crecimiento: 10, descuento: 0, siniestralidad: 0 });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/ejecutivo/resumen').catch(() => null),
      apiGet('/ejecutivo/produccion').catch(() => null),
      apiGet('/ejecutivo/comercial').catch(() => null),
      apiGet('/ejecutivo/siniestralidad').catch(() => null),
    ]).then(([r, p, c, s]) => {
      setResumen(r);
      setProduccion(p);
      setComercial(c);
      setSiniestralidad(s);
      setCargando(false);
    });
  }, []);

  if (cargando) return <div className="p-6 text-sm text-text-soft">Cargando simulador...</div>;

  const primaActual = Number(produccion?.prima_total_activa || 0);
  const factorPolizas = 1 + Number(variables.crecimiento) / 100;
  const factorDescuento = 1 - Number(variables.descuento) / 100;
  const polizasProyectadas = Math.round((produccion?.activas || 0) * factorPolizas);
  const primaProyectada = primaActual * factorPolizas * factorDescuento;
  const indiceProyectado = Number(siniestralidad?.indice_siniestralidad || 0) + Number(variables.siniestralidad);
  const comisionesProyectadas = Number(comercial?.comisiones_total || 0) * factorPolizas;
  const utilidadEstimada = primaProyectada - comisionesProyectadas - (primaProyectada * indiceProyectado / 100);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-center gap-2">
        <MdScience size={20} className="text-primary" />
        <div>
          <p className="text-xl font-bold text-text">Simulador de escenarios</p>
          <p className="text-xs text-text-soft">Mueve las palancas para ver el efecto sobre la prima, comisiones y utilidad esperada.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Slider
          label="Crecimiento polizas (%)"
          min={-30}
          max={50}
          step={1}
          value={variables.crecimiento}
          onChange={(v) => setVariables({ ...variables, crecimiento: v })}
        />
        <Slider
          label="Descuento aplicado (%)"
          min={0}
          max={40}
          step={1}
          value={variables.descuento}
          onChange={(v) => setVariables({ ...variables, descuento: v })}
        />
        <Slider
          label="Cambio en siniestralidad (pp)"
          min={-10}
          max={15}
          step={1}
          value={variables.siniestralidad}
          onChange={(v) => setVariables({ ...variables, siniestralidad: v })}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Polizas proyectadas" valor={polizasProyectadas} icon={MdTrendingUp} bg="bg-primary/10" color="text-primary" />
        <Tile label="Prima proyectada" valor={formatearMoneda(primaProyectada)} icon={MdTrendingUp} bg="bg-emerald-100" color="text-emerald-600" />
        <Tile label="Indice proyectado" valor={`${indiceProyectado.toFixed(2)}%`} icon={MdTrendingDown} bg="bg-rose-100" color="text-rose-600" />
        <Tile label="Utilidad estimada" valor={formatearMoneda(utilidadEstimada)} icon={MdTrendingUp} bg="bg-amber-100" color="text-amber-600" />
      </div>

      <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-2">
        <p className="text-sm font-bold text-text">Bases del modelo</p>
        <p className="text-xs text-text-soft">
          Polizas activas actuales: {produccion?.activas ?? '-'} | Prima activa: {formatearMoneda(primaActual)} | Indice base: {siniestralidad?.indice_siniestralidad ?? 0}%
        </p>
        <p className="text-xs text-text-soft">
          La utilidad se aproxima como prima proyectada menos comisiones proyectadas menos el costo esperado por siniestralidad.
          Es una estimacion gerencial, no contable.
        </p>
      </div>
    </div>
  );
}

function Slider({ label, min, max, step, value, onChange }) {
  return (
    <div className="bg-bg rounded-xl border border-border p-4 flex flex-col gap-2">
      <p className="text-xs font-semibold text-text">{label}</p>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1"
        />
        <span className="text-sm font-bold text-text w-12 text-right">{value}</span>
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
        <p className={`text-base font-bold leading-tight ${color}`}>{valor}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}
