'use client';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdEmail,
  MdPhone,
  MdPerson,
  MdPeopleOutline,
  MdBadge,
  MdCalendarToday,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';

const ESTADO_CRM = {
  NUEVO: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  CONTACTADO: { label: 'Contactado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  CLIENTE: { label: 'Cliente', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  INACTIVO: { label: 'Inactivo', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ClientesCorePage() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    apiGet('/clientes')
      .then((data) => setClientes(data || []))
      .catch((e) => setError(e.mensaje || 'No se pudieron cargar'))
      .finally(() => setCargando(false));
  }, []);

  const filtrados = clientes.filter((c) => {
    const t = busq.toLowerCase();
    const matchBusq =
      t === '' ||
      `${c.nombres} ${c.apellidos}`.toLowerCase().includes(t) ||
      (c.email || '').toLowerCase().includes(t) ||
      (c.documento_identidad || '').includes(t);
    const matchFiltro = filtro === 'todos' || c.estado_crm === filtro;
    return matchBusq && matchFiltro;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Clientes</h1>
        <p className="text-xs text-text-soft mt-0.5">{clientes.length} clientes registrados</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar por nombre, email o documento..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
          />
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
        >
          <option value="todos">Todos</option>
          {Object.entries(ESTADO_CRM).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
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
        <div className="flex flex-col gap-3">
          {filtrados.map((c) => {
            const est = ESTADO_CRM[c.estado_crm] || ESTADO_CRM.NUEVO;
            const iniciales = ((c.nombres || '')[0] || '') + ((c.apellidos || '')[0] || '');
            return (
              <div key={c.id_cliente} className="bg-bg rounded-2xl border border-border overflow-hidden">
                <div className="h-1 w-full bg-primary/30" />
                <div className="p-5 flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary uppercase shrink-0">
                    {iniciales || <MdPerson size={20} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-text">{c.nombres} {c.apellidos}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                        {est.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-soft mt-0.5">CLI-{String(c.id_cliente).padStart(6, '0')}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
                      <span className="flex items-center gap-1"><MdBadge size={11} /> DNI {c.documento_identidad}</span>
                      <span className="flex items-center gap-1"><MdEmail size={11} /> {c.email}</span>
                      {c.telefono && <span className="flex items-center gap-1"><MdPhone size={11} /> {c.telefono}</span>}
                      <span className="flex items-center gap-1"><MdCalendarToday size={11} /> Desde {formatearFecha(c.fecha_registro)}</span>
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
