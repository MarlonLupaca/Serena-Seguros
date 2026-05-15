'use client';

import { useEffect, useState } from 'react';
import {
  MdAccountBalance,
  MdReceipt,
  MdMenuBook,
  MdAssessment,
  MdTrendingUp,
  MdTrendingDown,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';

const TIPO_FACTURA = {
  FACTURA: 'bg-primary/10 text-primary',
  BOLETA: 'bg-sky-100 text-sky-700',
  NOTA_CREDITO: 'bg-amber-100 text-amber-700',
};

const ESTADO_FACTURA = {
  EMITIDA: 'bg-sky-100 text-sky-700',
  PAGADA: 'bg-emerald-100 text-emerald-700',
  ANULADA: 'bg-rose-100 text-rose-600',
};

function formatearMoneda(v) {
  if (v == null) return 'S/ 0.00';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

const TABS = [
  { id: 'facturas', label: 'Facturación', icon: MdReceipt },
  { id: 'diario', label: 'Libro diario', icon: MdMenuBook },
  { id: 'balance', label: 'Balance general', icon: MdAccountBalance },
  { id: 'resultados', label: 'Estado resultados', icon: MdAssessment },
];

export default function ContabilidadPage() {
  const [tab, setTab] = useState('facturas');
  const [facturas, setFacturas] = useState([]);
  const [asientos, setAsientos] = useState([]);
  const [balance, setBalance] = useState(null);
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [f, a, b, r] = await Promise.all([
        apiGet('/contabilidad/facturas').catch(() => []),
        apiGet('/contabilidad/asientos').catch(() => []),
        apiGet('/contabilidad/balance').catch(() => null),
        apiGet('/contabilidad/estado-resultados').catch(() => null),
      ]);
      setFacturas(f || []);
      setAsientos(a || []);
      setBalance(b);
      setResultados(r);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Contabilidad general</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Facturación, libro diario, balance y estado de resultados.
        </p>
      </div>

      <div className="flex border-b border-border gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
              }`}
            >
              <Icon size={14} /> {t.label}
            </button>
          );
        })}
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : tab === 'facturas' ? (
        <TabFacturas facturas={facturas} />
      ) : tab === 'diario' ? (
        <TabDiario asientos={asientos} />
      ) : tab === 'balance' ? (
        <TabBalance balance={balance} />
      ) : (
        <TabResultados resultados={resultados} />
      )}
    </div>
  );
}

function TabFacturas({ facturas }) {
  if (facturas.length === 0)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        No hay comprobantes emitidos.
      </div>
    );

  const totalEmitido = facturas.reduce((acc, f) => acc + Number(f.total || 0), 0);
  const pagadas = facturas.filter((f) => f.estado === 'PAGADA');
  const totalPagado = pagadas.reduce((acc, f) => acc + Number(f.total || 0), 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Comprobantes" val={facturas.length} />
        <Kpi label="Total emitido" val={formatearMoneda(totalEmitido)} />
        <Kpi label="Pagados" val={pagadas.length} />
        <Kpi label="Total cobrado" val={formatearMoneda(totalPagado)} accent="emerald" />
      </div>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-bg-soft">
            <tr className="text-xs text-text-soft">
              <th className="px-3 py-2 text-left font-medium">Tipo</th>
              <th className="px-3 py-2 text-left font-medium">Serie-Número</th>
              <th className="px-3 py-2 text-left font-medium">Cliente</th>
              <th className="px-3 py-2 text-left font-medium">Fecha</th>
              <th className="px-3 py-2 text-right font-medium">Total</th>
              <th className="px-3 py-2 text-right font-medium">Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((f) => (
              <tr key={f.id_factura} className="border-t border-border">
                <td className="px-3 py-2.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIPO_FACTURA[f.tipo] || 'bg-bg-soft'}`}>
                    {f.tipo}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-semibold text-text">
                  {f.serie}-{f.numero}
                </td>
                <td className="px-3 py-2.5 text-text-soft">{f.cliente_nombre || '—'}</td>
                <td className="px-3 py-2.5 text-text-soft">{formatearFecha(f.fecha_emision)}</td>
                <td className="px-3 py-2.5 text-right font-bold text-text">{formatearMoneda(f.total)}</td>
                <td className="px-3 py-2.5 text-right">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ESTADO_FACTURA[f.estado]}`}>
                    {f.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabDiario({ asientos }) {
  if (asientos.length === 0)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        Aún no hay asientos registrados.
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      {asientos.map((a) => (
        <div key={a.id_asiento} className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="bg-bg-soft px-4 py-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <p className="text-sm font-bold text-text">{a.descripcion}</p>
              <p className="text-xs text-text-soft mt-0.5">
                ASC-{String(a.id_asiento).padStart(6, '0')} · {formatearFecha(a.fecha)}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                a.estado === 'CERRADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
              }`}
            >
              {a.estado}
            </span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-text-soft">
                <th className="px-3 py-2 text-left font-medium">Código</th>
                <th className="px-3 py-2 text-left font-medium">Cuenta</th>
                <th className="px-3 py-2 text-right font-medium">Debe</th>
                <th className="px-3 py-2 text-right font-medium">Haber</th>
              </tr>
            </thead>
            <tbody>
              {a.movimientos.map((m) => (
                <tr key={m.id_movimiento} className="border-t border-border">
                  <td className="px-3 py-2 text-text-soft font-mono text-xs">{m.cuenta_codigo}</td>
                  <td className="px-3 py-2 text-text">{m.cuenta_nombre}</td>
                  <td className="px-3 py-2 text-right text-text">
                    {Number(m.debe) > 0 ? formatearMoneda(m.debe) : '—'}
                  </td>
                  <td className="px-3 py-2 text-right text-text">
                    {Number(m.haber) > 0 ? formatearMoneda(m.haber) : '—'}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-border bg-bg-soft font-bold">
                <td colSpan={2} className="px-3 py-2 text-text-soft">
                  Totales
                </td>
                <td className="px-3 py-2 text-right text-text">{formatearMoneda(a.total_debe)}</td>
                <td className="px-3 py-2 text-right text-text">{formatearMoneda(a.total_haber)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function TabBalance({ balance }) {
  if (!balance)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        Sin información de balance.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ColumnaBalance titulo="Activos" total={balance.total_activos} lineas={balance.activos} accent="primary" />
      <ColumnaBalance titulo="Pasivos" total={balance.total_pasivos} lineas={balance.pasivos} accent="rose" />
      <ColumnaBalance
        titulo="Patrimonio"
        total={balance.total_patrimonio}
        lineas={balance.patrimonio}
        accent="emerald"
      />
    </div>
  );
}

function ColumnaBalance({ titulo, total, lineas, accent }) {
  const accentBg =
    accent === 'primary' ? 'bg-primary/10' : accent === 'rose' ? 'bg-rose-100' : 'bg-emerald-100';
  const accentText =
    accent === 'primary' ? 'text-primary' : accent === 'rose' ? 'text-rose-600' : 'text-emerald-600';
  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`px-4 py-3 ${accentBg}`}>
        <p className={`text-xs font-bold uppercase tracking-wide ${accentText}`}>{titulo}</p>
        <p className={`text-xl font-bold mt-0.5 ${accentText}`}>{formatearMoneda(total)}</p>
      </div>
      <div className="divide-y divide-border">
        {(lineas || []).length === 0 ? (
          <p className="p-4 text-xs text-text-soft text-center">Sin movimientos.</p>
        ) : (
          lineas.map((l) => (
            <div key={l.codigo} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-[11px] text-text-soft font-mono">{l.codigo}</p>
                <p className="text-sm text-text truncate">{l.nombre}</p>
              </div>
              <p className="text-sm font-semibold text-text">{formatearMoneda(l.saldo)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function TabResultados({ resultados }) {
  if (!resultados)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        Sin información de resultados.
      </div>
    );

  const utilidadColor = Number(resultados.utilidad_neta) >= 0 ? 'text-emerald-600' : 'text-rose-600';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <ColumnaResultados
        titulo="Ingresos"
        total={resultados.total_ingresos}
        lineas={resultados.ingresos}
        icon={MdTrendingUp}
        accent="emerald"
      />
      <ColumnaResultados
        titulo="Gastos"
        total={resultados.total_gastos}
        lineas={resultados.gastos}
        icon={MdTrendingDown}
        accent="rose"
      />
      <div className="md:col-span-2 bg-bg rounded-2xl border border-border p-5 flex items-center justify-between">
        <p className="text-sm font-bold text-text">Utilidad neta del período</p>
        <p className={`text-2xl font-bold ${utilidadColor}`}>{formatearMoneda(resultados.utilidad_neta)}</p>
      </div>
    </div>
  );
}

function ColumnaResultados({ titulo, total, lineas, icon: Icon, accent }) {
  const accentBg = accent === 'emerald' ? 'bg-emerald-100' : 'bg-rose-100';
  const accentText = accent === 'emerald' ? 'text-emerald-600' : 'text-rose-600';
  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`px-4 py-3 ${accentBg} flex items-center gap-3`}>
        <Icon size={20} className={accentText} />
        <div>
          <p className={`text-xs font-bold uppercase tracking-wide ${accentText}`}>{titulo}</p>
          <p className={`text-xl font-bold ${accentText}`}>{formatearMoneda(total)}</p>
        </div>
      </div>
      <div className="divide-y divide-border">
        {(lineas || []).length === 0 ? (
          <p className="p-4 text-xs text-text-soft text-center">Sin movimientos.</p>
        ) : (
          lineas.map((l) => (
            <div key={l.codigo} className="flex items-center justify-between px-4 py-2.5">
              <div className="min-w-0">
                <p className="text-[11px] text-text-soft font-mono">{l.codigo}</p>
                <p className="text-sm text-text truncate">{l.nombre}</p>
              </div>
              <p className="text-sm font-semibold text-text">{formatearMoneda(l.saldo)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Kpi({ label, val, accent }) {
  const color = accent === 'emerald' ? 'text-emerald-600' : 'text-text';
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3">
      <p className="text-xs text-text-soft">{label}</p>
      <p className={`text-base font-bold mt-0.5 ${color}`}>{val}</p>
    </div>
  );
}
