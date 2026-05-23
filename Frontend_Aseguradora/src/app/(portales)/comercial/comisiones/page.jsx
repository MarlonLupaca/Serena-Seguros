'use client';

import { useEffect, useState } from 'react';
import {
  MdCalendarToday,
  MdAttachMoney,
  MdSearch,
  MdCheckCircle,
  MdHourglassEmpty,
  MdFileDownload,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import Image from 'next/image';
import { apiGet } from '@/lib/api';
import { estiloTipo } from '@/lib/tipoSeguroConfig';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../componentsMain/DataTable';

const ESTADO_CONFIG = {
  PAGADA: {
    label: 'Pagada',
    badge: 'bg-success-soft text-success-text',
    dot: 'bg-success',
    icon: MdCheckCircle,
  },
  PENDIENTE: {
    label: 'Pendiente',
    badge: 'bg-warning-soft text-warning-text',
    dot: 'bg-warning',
    icon: MdHourglassEmpty,
  },
};

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function descargarReporte(comisiones) {
  if (!comisiones || comisiones.length === 0) return;
  const headers = ['id_comision', 'id_poliza', 'poliza', 'tipo', 'porcentaje', 'monto_generado', 'estado'];
  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const filas = comisiones.map((c) =>
    [c.id_comision, c.id_poliza, c.poliza_nombre, c.poliza_tipo, c.porcentaje, c.monto_generado, c.estado_pago]
      .map(escape)
      .join(',')
  );
  const csv = [headers.map(escape).join(','), ...filas].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const fecha = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `mis-comisiones-${fecha}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ComisionesPage() {
  const [comisiones, setComisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [busq, setBusq] = useState('');

  useEffect(() => {
    apiGet('/mis-comisiones')
      .then((data) => setComisiones(data || []))
      .catch((e) => setError(e.mensaje || 'No se pudieron cargar las comisiones'))
      .finally(() => setCargando(false));
  }, []);

  const filtradas = comisiones.filter((c) => {
    const matchFiltro = filtro === 'todos' || c.estado_pago === filtro;
    const t = busq.toLowerCase();
    const matchBusq =
      t === '' ||
      String(c.id_comision).includes(t) ||
      (c.poliza_nombre || '').toLowerCase().includes(t) ||
      (c.poliza_tipo || '').toLowerCase().includes(t);
    return matchFiltro && matchBusq;
  });

  const totalPendiente = comisiones
    .filter((c) => c.estado_pago === 'PENDIENTE')
    .reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);
  const totalPagado = comisiones
    .filter((c) => c.estado_pago === 'PAGADA')
    .reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);

  const counts = {
    total: comisiones.length,
    pagadas: comisiones.filter((c) => c.estado_pago === 'PAGADA').length,
    pendientes: comisiones.filter((c) => c.estado_pago === 'PENDIENTE').length,
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Mis comisiones</h1>
          <p className="text-xs text-text-soft mt-0.5">{counts.total} comisiones registradas</p>
        </div>
        <button
          onClick={() => descargarReporte(filtradas)}
          disabled={filtradas.length === 0}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-semibold text-text-soft transition-colors disabled:opacity-50"
        >
          <MdFileDownload size={14} /> Descargar reporte
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          label="Total ganado"
          val={formatearMoneda(totalPagado + totalPendiente)}
          icon={MdAttachMoney}
          bg="bg-primary/10"
          color="text-primary"
        />
        <KpiCard
          label="Pagado"
          val={formatearMoneda(totalPagado)}
          icon={MdCheckCircle}
          bg="bg-emerald-100"
          color="text-emerald-600"
        />
        <KpiCard
          label="Por cobrar"
          val={formatearMoneda(totalPendiente)}
          icon={MdHourglassEmpty}
          bg="bg-amber-100"
          color="text-amber-600"
        />
        <KpiCard
          label="Comisiones"
          val={`${counts.pagadas} / ${counts.total}`}
          icon={MdCalendarToday}
          bg="bg-bg-soft"
          color="text-text"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar por póliza o tipo..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="PAGADA">Pagadas</option>
          <option value="PENDIENTE">Pendientes</option>
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando comisiones...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdAttachMoney size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay comisiones</p>
          <p className="text-xs text-text-soft mt-1">
            {comisiones.length === 0
              ? 'Cuando se generen pólizas asociadas a ti, aparecerán aquí.'
              : 'Prueba cambiando los filtros.'}
          </p>
        </div>
      ) : (
        <TablaComisiones comisiones={filtradas} />
      )}
    </div>
  );
}

function KpiCard({ label, val, icon: Icon, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={17} className={color} />
      </div>
      <div>
        <p className={`text-xl font-bold leading-tight ${color}`}>{val}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}

function TablaComisiones({ comisiones }) {
  return (
    <Table>
      <TableHeader>
        <TableHead>ID Comisión</TableHead>
        <TableHead>Póliza</TableHead>
        <TableHead>Porcentaje</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead align="right">Monto</TableHead>
      </TableHeader>
      <TableBody>
        {comisiones.map((c) => {
          const est = ESTADO_CONFIG[c.estado_pago] || ESTADO_CONFIG.PENDIENTE;
          const tipoStyle = estiloTipo(c.poliza_tipo);
          return (
            <TableRow key={c.id_comision}>
              <TableCell className="text-sm font-medium text-text">
                COM-{String(c.id_comision).padStart(6, '0')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  {tipoStyle?.imagen && (
                    <Image
                      src={tipoStyle.imagen}
                      width={24}
                      height={24}
                      alt=""
                      className="object-contain w-6 h-6 opacity-80"
                    />
                  )}
                  <div>
                    <p className="text-sm font-semibold text-text">{c.poliza_nombre || 'Sin póliza'}</p>
                    <p className="text-xs text-text-soft mt-0.5">POL-{String(c.id_poliza).padStart(6, '0')}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm text-text-soft">{c.porcentaje}%</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${est.badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                  {est.label}
                </span>
              </TableCell>
              <TableCell align="right" className="text-sm font-bold text-text">
                {formatearMoneda(c.monto_generado)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
