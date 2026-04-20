import { useState } from 'react';
import { MdWarning } from 'react-icons/md';
import { SINIESTROS } from './data';
import SiniestrosKPIs from './SiniestrosKPIs';
import SiniestrosFilters from './SiniestrosFilters';
import SiniestroCard from './SiniestroCard';

export default function ListaSiniestros({ onSelect }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const filtrados = SINIESTROS.filter((s) => {
    const matchFiltro = filtro === 'todos' || s.estado === filtro;
    const matchBusq =
      busqueda === '' ||
      s.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.tipo.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.polizaLabel.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusq;
  });

  const counts = {
    total: SINIESTROS.length,
    activos: SINIESTROS.filter((s) => s.estado === 'evaluacion' || s.estado === 'enviado').length,
    aprobados: SINIESTROS.filter((s) => s.estado === 'aprobado').length,
    rechazados: SINIESTROS.filter((s) => s.estado === 'rechazado').length,
  };

  return (
    <div className="flex flex-col gap-5">
      <SiniestrosKPIs counts={counts} />

      <SiniestrosFilters busqueda={busqueda} setBusqueda={setBusqueda} filtro={filtro} setFiltro={setFiltro} />

      {filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center ">
          <MdWarning size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No se encontraron casos</p>
          <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtrados.map((s) => (
            <SiniestroCard key={s.id} s={s} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
