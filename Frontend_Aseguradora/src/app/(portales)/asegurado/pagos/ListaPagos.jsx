'use client';

import { useState } from 'react';
import { MdSearch, MdFilterList, MdDescription, MdWarningAmber } from 'react-icons/md';
import PagosKPIs from './PagosKPIs';
import CuotaCard from './CuotaCard';
import HistorialCard from './HistorialCard';
import { clasificarEstado } from './data';

export default function ListaPagos({ cuotas, onSelect, onPagar }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [tab, setTab] = useState('cuotas');

  const cuotasPorPagar = cuotas.filter((c) => clasificarEstado(c) !== 'PAGADO');
  const cuotasPagadas = cuotas.filter((c) => clasificarEstado(c) === 'PAGADO');

  const filtradas = cuotasPorPagar.filter((c) => {
    const cls = clasificarEstado(c);
    const matchFiltro = filtro === 'todos' || cls === filtro;
    const texto = busqueda.toLowerCase();
    const matchBusq =
      texto === '' ||
      String(c.id_cuota).includes(texto) ||
      (c.poliza_nombre || '').toLowerCase().includes(texto);
    return matchFiltro && matchBusq;
  });

  const totalPendiente = cuotasPorPagar.reduce((acc, c) => acc + Number(c.monto || 0), 0);

  const counts = {
    pendiente: cuotasPorPagar.filter((c) => clasificarEstado(c) === 'PENDIENTE').length,
    vencido: cuotasPorPagar.filter((c) => clasificarEstado(c) === 'VENCIDO').length,
    pagado: cuotasPagadas.length,
  };

  const TABS = [
    { id: 'cuotas', label: `Por pagar (${cuotasPorPagar.length})` },
    { id: 'historial', label: `Historial (${cuotasPagadas.length})` },
  ];

  return (
    <div className="flex flex-col gap-5">
      <PagosKPIs totalPendiente={totalPendiente} counts={counts} />

      {counts.vencido > 0 && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
          <MdWarningAmber size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-rose-700 mb-0.5">
              Tienes {counts.vencido} cuota{counts.vencido > 1 ? 's' : ''} vencida{counts.vencido > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-rose-600">Regulariza tus pagos para evitar la suspensión de coberturas.</p>
          </div>
        </div>
      )}

      <div className="flex border-b border-border gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'cuotas' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <input
                placeholder="Buscar por póliza o número..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
              />
            </div>
            <div className="relative">
              <MdFilterList size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-8 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="todos">Todos los estados</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="VENCIDO">Vencido</option>
              </select>
            </div>
          </div>

          {filtradas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdDescription size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">No tienes cuotas por pagar</p>
              <p className="text-xs text-text-soft mt-1">Estás al día con tus pólizas.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtradas.map((c) => (
                <CuotaCard key={c.id_cuota} c={c} onSelect={onSelect} onPagar={onPagar} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'historial' && (
        <div className="flex flex-col gap-3">
          {cuotasPagadas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <p className="text-sm text-text-soft">Sin cuotas pagadas todavía.</p>
            </div>
          ) : (
            cuotasPagadas.map((c) => <HistorialCard key={c.id_cuota} c={c} />)
          )}
        </div>
      )}
    </div>
  );
}
