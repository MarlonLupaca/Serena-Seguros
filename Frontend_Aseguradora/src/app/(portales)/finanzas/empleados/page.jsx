'use client';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdEmail,
  MdPhone,
  MdPerson,
  MdBadge,
  MdBusinessCenter,
  MdAttachMoney,
  MdPeopleOutline,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';

const AREA_COLORS = {
  COMERCIAL: 'bg-primary/10 text-primary',
  TECNICO: 'bg-emerald-100 text-emerald-700',
  OPERATIVO: 'bg-amber-100 text-amber-700',
  EJECUTIVO: 'bg-violet-100 text-violet-700',
};

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    apiGet('/empleados')
      .then((data) => setEmpleados(data || []))
      .catch((e) => setError(e.mensaje || 'No se pudo cargar'))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = empleados.filter((e) => {
    const t = busq.toLowerCase();
    const matchBusq =
      t === '' ||
      `${e.nombres} ${e.apellidos}`.toLowerCase().includes(t) ||
      (e.email || '').toLowerCase().includes(t) ||
      (e.cargo || '').toLowerCase().includes(t);
    const matchFiltro = filtro === 'todos' || e.area === filtro;
    return matchBusq && matchFiltro;
  });

  const sueldoTotal = empleados.reduce((acc, e) => acc + Number(e.sueldo_base || 0), 0);
  const counts = ['COMERCIAL', 'TECNICO', 'OPERATIVO', 'EJECUTIVO'].reduce(
    (acc, k) => ({ ...acc, [k]: empleados.filter((e) => e.area === k).length }),
    { total: empleados.length }
  );

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Empleados</h1>
        <p className="text-xs text-text-soft mt-0.5">{counts.total} empleados · planilla {formatearMoneda(sueldoTotal)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <MdPeopleOutline size={17} className="text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-text leading-tight">{counts.total}</p>
            <p className="text-xs text-text-soft">Total</p>
          </div>
        </div>
        {['COMERCIAL', 'TECNICO', 'OPERATIVO', 'EJECUTIVO'].map((a) => (
          <button
            key={a}
            onClick={() => setFiltro(filtro === a ? 'todos' : a)}
            className={`text-left rounded-xl border px-4 py-3 transition-colors ${
              filtro === a ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
            }`}
          >
            <p className="text-xl font-bold text-text leading-tight">{counts[a] || 0}</p>
            <p className="text-xs text-text-soft">{a}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por nombre, cargo o email..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdPeopleOutline size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin resultados</p>
        </div>
      ) : (
        <DataTable
          data={filtrados}
          columns={[
            { label: 'Empleado' },
            { label: 'Área / Cargo' },
            { label: 'DNI' },
            { label: 'Contacto' },
            { label: 'Sueldo Base', align: 'right' },
          ]}
          renderRow={(e) => (
            <EmpleadoTableRow key={e.id_empleado} e={e} />
          )}
        />
      )}
    </div>
  );
}

function EmpleadoTableRow({ e }) {
  const iniciales = ((e.nombres || '')[0] || '') + ((e.apellidos || '')[0] || '');
  
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary uppercase shrink-0">
            {iniciales || <MdPerson size={16} />}
          </div>
          <div>
            <p className="text-sm font-bold text-text truncate max-w-[200px]">{e.nombres} {e.apellidos}</p>
            <p className="text-[11px] text-text-soft">EMP-{String(e.id_empleado).padStart(6, '0')}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-sm font-semibold text-text">{e.cargo}</p>
        <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 uppercase ${AREA_COLORS[e.area] || 'bg-bg-soft text-text-soft'}`}>
          {e.area}
        </span>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1 text-sm font-medium text-text">
          <MdBadge size={14} className="text-text-soft" /> {e.documento_identidad}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1.5 text-xs text-text-soft truncate max-w-[200px]">
            <MdEmail size={12} /> {e.email}
          </span>
          {e.telefono && (
            <span className="flex items-center gap-1.5 text-xs text-text-soft">
              <MdPhone size={12} /> {e.telefono}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell align="right">
        <span className="text-sm font-bold text-emerald-600">{formatearMoneda(e.sueldo_base)}</span>
      </TableCell>
    </TableRow>
  );
}
