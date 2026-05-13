'use client';

import { useEffect, useState } from 'react';
import { MdDescription, MdTrendingUp, MdDoneAll, MdHourglassEmpty, MdBlock, MdAttachMoney } from 'react-icons/md';
import { apiGet } from '@/lib/api';

const ETIQUETAS_ESTADO = {
  ACTIVA: { label: 'Activas', icon: MdDoneAll, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  PENDIENTE: { label: 'Pendientes', icon: MdHourglassEmpty, color: 'text-amber-600', bg: 'bg-amber-100' },
  VENCIDAS: { label: 'Vencidas', icon: MdTrendingUp, color: 'text-rose-600', bg: 'bg-rose-100' },
  CANCELADAS: { label: 'Canceladas', icon: MdBlock, color: 'text-text-soft', bg: 'bg-bg-soft' },
};

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function ProduccionPage() {
  const [data, setData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiGet('/ejecutivo/produccion')
      .then((d) => {
        setData(d);
        setCargando(false);
      })
      .catch((e) => {
        setError(e.mensaje || 'Error al cargar');
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="p-6 text-sm text-text-soft">Cargando produccion...</div>;
  }
  if (error) {
    return <div className="p-6 text-sm text-rose-600">{error}</div>;
  }

  const items = [
    { key: 'ACTIVA', valor: data.activas },
    { key: 'PENDIENTE', valor: data.pendientes },
    { key: 'VENCIDAS', valor: data.vencidas },
    { key: 'CANCELADAS', valor: data.canceladas },
  ];

  const porProducto = Object.entries(data.por_producto || {});
  const maxProducto = Math.max(1, ...porProducto.map(([, v]) => Number(v)));

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xl font-bold text-text">Produccion de polizas</p>
        <p className="text-xs text-text-soft">Vista global de la cartera de polizas emitidas y su composicion por producto.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Total polizas" valor={data.total_polizas} icon={MdDescription} bg="bg-primary/10" color="text-primary" />
        {items.map((it) => {
          const meta = ETIQUETAS_ESTADO[it.key];
          return <Tile key={it.key} label={meta.label} valor={it.valor} icon={meta.icon} bg={meta.bg} color={meta.color} />;
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <MdAttachMoney size={20} className="text-primary" />
            <p className="text-sm font-bold text-text">Prima de polizas activas</p>
          </div>
          <p className="text-3xl font-bold text-text">{formatearMoneda(data.prima_total_activa)}</p>
          <p className="text-xs text-text-soft">
            Suma de la prima de las {data.activas} polizas vigentes.
          </p>
        </div>

        <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
          <p className="text-sm font-bold text-text">Mix por tipo de producto</p>
          {porProducto.length === 0 ? (
            <p className="text-xs text-text-soft">Sin datos de productos.</p>
          ) : (
            porProducto.map(([tipo, cantidad]) => (
              <div key={tipo}>
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-text">{tipo}</span>
                  <span className="text-text-soft">{cantidad}</span>
                </div>
                <div className="h-1.5 bg-bg-soft rounded-full mt-1 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(Number(cantidad) / maxProducto) * 100}%` }}
                  />
                </div>
              </div>
            ))
          )}
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
