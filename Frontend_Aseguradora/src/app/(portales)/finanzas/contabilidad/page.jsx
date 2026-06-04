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
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';

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

      <DataTable
        data={facturas}
        columns={[
          { label: 'Tipo' },
          { label: 'Serie-Número' },
          { label: 'Cliente' },
          { label: 'Fecha' },
          { label: 'Total', align: 'right' },
          { label: 'Estado', align: 'right' },
        ]}
        renderRow={(f) => (
          <TableRow key={f.id_factura}>
            <TableCell>
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${TIPO_FACTURA[f.tipo] || 'bg-bg-soft'}`}>
                {f.tipo}
              </span>
            </TableCell>
            <TableCell>
              <span className="font-semibold text-text">{f.serie}-{f.numero}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium text-text">{f.cliente_nombre || '—'}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm text-text-soft">{formatearFecha(f.fecha_emision)}</span>
            </TableCell>
            <TableCell align="right">
              <span className="text-sm font-bold text-text">{formatearMoneda(f.total)}</span>
            </TableCell>
            <TableCell align="right">
              <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ESTADO_FACTURA[f.estado]}`}>
                {f.estado}
              </span>
            </TableCell>
          </TableRow>
        )}
      />
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
          <DataTable
            data={[...a.movimientos, { _isTotal: true }]}
            columns={[
              { label: 'Código' },
              { label: 'Cuenta' },
              { label: 'Debe', align: 'right' },
              { label: 'Haber', align: 'right' }
            ]}
            renderRow={(m) => m._isTotal ? (
              <TableRow key="total" className="bg-bg-soft">
                <TableCell>
                  <span className="text-sm font-bold text-text-soft">Totales</span>
                </TableCell>
                <TableCell></TableCell>
                <TableCell align="right">
                  <span className="text-sm font-bold text-text">{formatearMoneda(a.total_debe)}</span>
                </TableCell>
                <TableCell align="right">
                  <span className="text-sm font-bold text-text">{formatearMoneda(a.total_haber)}</span>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={m.id_movimiento}>
                <TableCell>
                  <span className="text-text-soft font-mono text-xs">{m.cuenta_codigo}</span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-text">{m.cuenta_nombre}</span>
                </TableCell>
                <TableCell align="right">
                  <span className="text-sm font-medium text-text">{Number(m.debe) > 0 ? formatearMoneda(m.debe) : '—'}</span>
                </TableCell>
                <TableCell align="right">
                  <span className="text-sm font-medium text-text">{Number(m.haber) > 0 ? formatearMoneda(m.haber) : '—'}</span>
                </TableCell>
              </TableRow>
            )}
          />
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
