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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtrados.map((e) => {
            const iniciales = ((e.nombres || '')[0] || '') + ((e.apellidos || '')[0] || '');
            return (
              <div key={e.id_empleado} className="bg-bg rounded-2xl border border-border overflow-hidden">
                <div className="h-1 w-full bg-primary/30" />
                <div className="p-4 flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary uppercase shrink-0">
                    {iniciales || <MdPerson size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-text">{e.nombres} {e.apellidos}</p>
                      <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${AREA_COLORS[e.area] || 'bg-bg-soft text-text-soft'}`}>
                        {e.area}
                      </span>
                    </div>
                    <p className="text-xs text-text-soft mt-0.5">EMP-{String(e.id_empleado).padStart(6, '0')}</p>
                    <div className="flex flex-col gap-1 mt-2 text-xs text-text-soft">
                      <span className="flex items-center gap-1"><MdBusinessCenter size={11} /> {e.cargo}</span>
                      <span className="flex items-center gap-1"><MdBadge size={11} /> DNI {e.documento_identidad}</span>
                      <span className="flex items-center gap-1"><MdEmail size={11} /> {e.email}</span>
                      {e.telefono && <span className="flex items-center gap-1"><MdPhone size={11} /> {e.telefono}</span>}
                      <span className="flex items-center gap-1"><MdAttachMoney size={11} /> {formatearMoneda(e.sueldo_base)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
