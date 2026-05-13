'use client';

import { useEffect, useState } from 'react';
import { MdAccountBalanceWallet, MdTrendingUp, MdTrendingDown, MdAssignmentLate } from 'react-icons/md';
import { apiGet } from '@/lib/api';

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(d) {
  if (!d) return '';
  return new Date(d).toLocaleDateString('es-PE');
}

export default function FinancieroPage() {
  const [resumen, setResumen] = useState(null);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      apiGet('/tesoreria/resumen').catch(() => null),
      apiGet('/tesoreria').catch(() => []),
    ]).then(([r, m]) => {
      setResumen(r);
      setMovimientos(m || []);
      setCargando(false);
    }).catch((e) => {
      setError(e.mensaje || 'Error al cargar');
      setCargando(false);
    });
  }, []);

  if (cargando) return <div className="p-6 text-sm text-text-soft">Cargando flujo financiero...</div>;
  if (error) return <div className="p-6 text-sm text-rose-600">{error}</div>;

  const ultimos = movimientos.slice(0, 8);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div>
        <p className="text-xl font-bold text-text">Flujo financiero</p>
        <p className="text-xs text-text-soft">Vista ejecutiva del flujo de caja consolidado por la mesa de tesoreria.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Tile label="Ingresos" valor={formatearMoneda(resumen?.ingresos)} icon={MdTrendingUp} bg="bg-emerald-100" color="text-emerald-600" />
        <Tile label="Egresos" valor={formatearMoneda(resumen?.egresos)} icon={MdTrendingDown} bg="bg-rose-100" color="text-rose-600" />
        <Tile
          label="Balance"
          valor={formatearMoneda(resumen?.balance)}
          icon={MdAccountBalanceWallet}
          bg={Number(resumen?.balance ?? 0) >= 0 ? 'bg-primary/10' : 'bg-rose-100'}
          color={Number(resumen?.balance ?? 0) >= 0 ? 'text-primary' : 'text-rose-600'}
        />
        <Tile label="Movimientos" valor={resumen?.total_movimientos ?? 0} icon={MdAssignmentLate} bg="bg-amber-100" color="text-amber-600" />
      </div>

      <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
        <p className="text-sm font-bold text-text">Ultimos movimientos</p>
        {ultimos.length === 0 ? (
          <p className="text-xs text-text-soft">Sin movimientos registrados.</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {ultimos.map((m) => (
              <div key={m.id_movimiento} className="py-2 flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${m.tipo_flujo === 'INGRESO' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{m.concepto}</p>
                  <p className="text-[11px] text-text-soft">{formatearFecha(m.fecha_programada)} - {m.estado_aprobacion}</p>
                </div>
                <p className={`text-sm font-bold ${m.tipo_flujo === 'INGRESO' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {m.tipo_flujo === 'INGRESO' ? '+' : '-'}{formatearMoneda(m.monto)}
                </p>
              </div>
            ))}
          </div>
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
        <p className={`text-base font-bold leading-tight ${color}`}>{valor}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}
