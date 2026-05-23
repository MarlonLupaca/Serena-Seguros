'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MdSearch, MdFilterList, MdDescription, MdWarningAmber, MdClose } from 'react-icons/md';
import PagosKPIs from './PagosKPIs';
import CuotaCard from './CuotaCard';
import HistorialCard from './HistorialCard';
import { clasificarEstado } from './data';
import { estiloTipo } from '@/lib/tipoSeguroConfig';

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
      texto === '' || String(c.id_cuota).includes(texto) || (c.poliza_nombre || '').toLowerCase().includes(texto);
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
            <GruposCuotas cuotas={filtradas} onSelect={onSelect} onPagar={onPagar} />
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
            <GruposCuotas cuotas={cuotasPagadas} onSelect={onSelect} onPagar={onPagar} historial />
          )}
        </div>
      )}
    </div>
  );
}

function agruparPorPoliza(cuotas) {
  const grupos = {};
  cuotas.forEach((c) => {
    const key = c.id_poliza || 0;
    if (!grupos[key])
      grupos[key] = { nombre: c.poliza_nombre || 'Sin póliza', tipo: c.poliza_tipo, id: key, items: [] };
    grupos[key].items.push(c);
  });
  return Object.values(grupos).sort((a, b) => b.id - a.id);
}

function GruposCuotas({ cuotas, onSelect, onPagar, historial }) {
  const [grupoActivo, setGrupoActivo] = useState(null);
  const grupos = agruparPorPoliza(cuotas);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {grupos.map((g) => (
          <GrupoPolizaCard key={g.id} grupo={g} onClick={() => setGrupoActivo(g)} />
        ))}
      </div>
      {grupoActivo && (
        <ModalCuotasGrupo
          grupo={grupoActivo}
          onClose={() => setGrupoActivo(null)}
          onSelect={onSelect}
          onPagar={onPagar}
          historial={historial}
        />
      )}
    </>
  );
}

function GrupoPolizaCard({ grupo, onClick }) {
  const tipoStyle = estiloTipo(grupo.tipo);
  const totalMonto = grupo.items.reduce((acc, c) => acc + Number(c.monto || 0), 0);

  return (
    <button
      onClick={onClick}
      className="bg-bg rounded-2xl border border-border overflow-hidden hover:border-primary/50 hover:shadow-md transition-all text-left flex flex-col"
    >
      <div className={`h-1.5 w-full ${tipoStyle.accentBg}`} />
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-center gap-3">
          <Image src={tipoStyle.imagen} width={36} height={36} alt="" className="object-contain w-11 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text truncate leading-tight">{grupo.nombre}</p>
            <p className="text-xs text-text-soft truncate mt-0.5">{grupo.tipo}</p>
          </div>
        </div>
        <div className="mt-auto bg-bg-soft rounded-xl p-3 flex justify-between items-center border border-border">
          <div>
            <p className="text-[10px] text-text-soft font-bold uppercase tracking-wider">Cuotas</p>
            <p className="text-sm font-semibold text-text">{grupo.items.length}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-text-soft font-bold uppercase tracking-wider">Total a pagar</p>
            <p className="text-sm font-bold text-primary">
              S/ {totalMonto.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function ModalCuotasGrupo({ grupo, onClose, onSelect, onPagar, historial }) {
  const tipoStyle = estiloTipo(grupo.tipo);
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg rounded-3xl border border-border shadow-2xl w-full max-w-xl flex flex-col max-h-[90vh] overflow-hidden">
        <div className={`h-2 w-full ${tipoStyle.accentBg}`} />
        <div className="flex items-center justify-between p-5 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <Image src={tipoStyle.imagen} width={24} height={24} alt="" className="object-contain w-8" />
            <div>
              <p className="text-sm font-bold text-text">{grupo.nombre}</p>
              <p className="text-[11px] text-text-soft">
                {grupo.items.length} cuota{grupo.items.length > 1 ? 's' : ''} enlistada
                {grupo.items.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-border hover:bg-bg-soft text-text-soft transition-colors"
          >
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto space-y-3 bg-bg-soft/30">
          {grupo.items.map((c) =>
            historial ? (
              <HistorialCard key={c.id_cuota} c={c} />
            ) : (
              <CuotaCard
                key={c.id_cuota}
                c={c}
                onSelect={(cuota) => {
                  onSelect(cuota);
                  onClose();
                }}
                onPagar={(cuota) => {
                  onPagar(cuota);
                  onClose();
                }}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
