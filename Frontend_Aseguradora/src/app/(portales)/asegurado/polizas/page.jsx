'use client';

import { useState } from 'react';
import { MdShield } from 'react-icons/md';
import { POLIZAS } from './data';
import PolizaKPIs from './PolizaKPIs';
import PolizaFilters from './PolizaFilters';
import PolizaCard from './PolizaCard';
import DetalleModal from './DetalleModal';

export default function Polizas() {
  const [detalle, setDetalle] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const filtradas = POLIZAS.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    const matchBusq =
      busqueda === '' ||
      p.label.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchTipo && matchBusq;
  });

  const counts = {
    total: POLIZAS.length,
    activas: POLIZAS.filter((p) => p.estado === 'activa').length,
    vencidas: POLIZAS.filter((p) => p.estado === 'vencida').length,
    proceso: POLIZAS.filter((p) => p.estado === 'en proceso').length,
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5">
        <p className="text-xl font-bold text-text">Mis pólizas</p>
        <p className="text-sm text-text-soft mt-0.5">Gestiona y consulta todas tus pólizas contratadas.</p>
      </div>

      <div className="flex-1 w-full flex flex-col gap-6 pb-8">
        {/* KPIs */}
        <PolizaKPIs counts={counts} />

        {/* Filtros */}
        <PolizaFilters
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
        />

        {/* Lista de Pólizas */}
        {filtradas.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center">
            <MdShield size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text">No se encontraron pólizas</p>
            <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtradas.map((p) => (
              <PolizaCard key={p.id} p={p} onVerDetalle={setDetalle} />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {detalle && <DetalleModal poliza={detalle} onClose={() => setDetalle(null)} />}
    </div>
  );
}
