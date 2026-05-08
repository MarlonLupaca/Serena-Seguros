'use client';

import { useEffect, useState } from 'react';
import { MdGroups, MdLocalAtm, MdTrendingUp, MdEmojiEvents, MdPersonOff } from 'react-icons/md';
import { apiGet } from '@/lib/api';

const ESTADO_LABEL = {
  NUEVO: 'Nuevos',
  CONTACTADO: 'Contactados',
  EN_PROPUESTA: 'En propuesta',
  NEGOCIACION: 'Negociacion',
  GANADO: 'Ganados',
  PERDIDO: 'Perdidos',
};

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function ComercialEjecutivoPage() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet('/ejecutivo/comercial')
      .then((d) => {
        setData(d);
        setCargando(false);
      })
      .catch((e) => {
        setError(e.mensaje || 'Error al cargar');
        setCargando(false);
      });
  }, []);

  if (cargando) return <div className="p-6 text-sm text-text-soft">Cargando datos comerciales...</div>;
  if (error) return <div className="p-6 text-sm text-rose-600">{error}</div>;

  const porEstado = Object.entries(data.por_estado || {});
  const maxEstado = Math.max(1, ...porEstado.map(([, v]) => Number(v)));

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xl font-bold text-text">Performance comercial</p>
        <p className="text-xs text-text-soft">Embudo de cotizaciones, conversion y comisiones generadas.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Leads totales" valor={data.leads_total} icon={MdGroups} bg="bg-primary/10" color="text-primary" />
        <Tile label="Ganados" valor={data.leads_ganados} icon={MdEmojiEvents} bg="bg-emerald-100" color="text-emerald-600" />
        <Tile label="Perdidos" valor={data.leads_perdidos} icon={MdPersonOff} bg="bg-rose-100" color="text-rose-600" />
        <Tile label="Tasa conversion" valor={`${data.tasa_conversion}%`} icon={MdTrendingUp} bg="bg-amber-100" color="text-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
          <p className="text-sm font-bold text-text">Embudo por estado</p>
          {porEstado.length === 0 ? (
            <p className="text-xs text-text-soft">Sin cotizaciones registradas.</p>
          ) : (
            porEstado.map(([estado, cantidad]) => (
              <div key={estado}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text">{ESTADO_LABEL[estado] || estado}</span>
                  <span className="text-text-soft">{cantidad}</span>
                </div>
                <div className="h-1.5 bg-bg-soft rounded-full mt-1 overflow-hidden">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(Number(cantidad) / maxEstado) * 100}%` }} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MdLocalAtm size={20} className="text-primary" />
            <p className="text-sm font-bold text-text">Comisiones generadas</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[10px] text-text-soft uppercase font-bold">Total</p>
              <p className="text-base font-bold text-text">{formatearMoneda(data.comisiones_total)}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-soft uppercase font-bold">Pagadas</p>
              <p className="text-base font-bold text-emerald-600">{formatearMoneda(data.comisiones_pagadas)}</p>
            </div>
            <div>
              <p className="text-[10px] text-text-soft uppercase font-bold">Pendientes</p>
              <p className="text-base font-bold text-amber-600">{formatearMoneda(data.comisiones_pendientes)}</p>
            </div>
          </div>
          <p className="text-xs text-text-soft">Cartera total: {data.clientes_totales} clientes activos.</p>
        </div>
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
