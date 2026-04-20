import { useState } from 'react';
import { MdSearch, MdFilterList, MdDescription, MdWarningAmber } from 'react-icons/md';
import { CUOTAS, HISTORIAL } from './data';
import PagosKPIs from './PagosKPIs';
import CuotaCard from './CuotaCard';
import HistorialCard from './HistorialCard';

export default function ListaPagos({ onSelect, onPagar }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [tab, setTab] = useState('cuotas');

  const filtradas = CUOTAS.filter((c) => {
    const matchFiltro = filtro === 'todos' || c.estado === filtro;
    const matchBusq =
      busqueda === '' ||
      c.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.polizaLabel.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.periodo.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusq;
  });

  const totalPendiente = CUOTAS.filter((c) => c.estado === 'pendiente' || c.estado === 'vencido').reduce(
    (acc, c) => acc + c.montoNum,
    0
  );

  const counts = {
    pendiente: CUOTAS.filter((c) => c.estado === 'pendiente').length,
    vencido: CUOTAS.filter((c) => c.estado === 'vencido').length,
    pagado: CUOTAS.filter((c) => c.estado === 'pagado').length,
  };

  const TABS = [
    { id: 'cuotas', label: 'Cuotas' },
    { id: 'historial', label: 'Historial de pagos' },
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
                placeholder="Buscar por póliza, periodo…"
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
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
                <option value="pagado">Pagado</option>
              </select>
            </div>
          </div>

          {filtradas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdDescription size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">No se encontraron cuotas</p>
              <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtradas.map((c) => (
                <CuotaCard key={c.id} c={c} onSelect={onSelect} onPagar={onPagar} />
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'historial' && (
        <div className="flex flex-col gap-3">
          {HISTORIAL.map((h) => (
            <HistorialCard key={h.id} h={h} />
          ))}
        </div>
      )}
    </div>
  );
}
