'use client';

import { useState } from 'react';
import { MdWarning } from 'react-icons/md';
import SiniestrosKPIs from './SiniestrosKPIs';
import SiniestrosFilters from './SiniestrosFilters';
import SiniestroCard from './SiniestroCard';

export default function ListaSiniestros({ siniestros, onSelect }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');

  const filtrados = siniestros.filter((s) => {
    const matchFiltro = filtro === 'todos' || s.estado_resolucion === filtro;
    const texto = busqueda.toLowerCase();
    const matchBusq =
      texto === '' ||
      String(s.id_siniestro).includes(texto) ||
      (s.tipo_incidente || '').toLowerCase().includes(texto) ||
      (s.poliza_nombre || '').toLowerCase().includes(texto);
    return matchFiltro && matchBusq;
  });

  const enCurso = ['REPORTADO', 'EN_REVISION', 'INSPECCION'];
  const counts = {
    total: siniestros.length,
    activos: siniestros.filter((s) => enCurso.includes(s.estado_resolucion)).length,
    aprobados: siniestros.filter((s) => s.estado_resolucion === 'APROBADO' || s.estado_resolucion === 'LIQUIDADO').length,
    rechazados: siniestros.filter((s) => s.estado_resolucion === 'RECHAZADO').length,
  };

  return (
    <div className="flex flex-col gap-5">
      <SiniestrosKPIs counts={counts} />
      <SiniestrosFilters busqueda={busqueda} setBusqueda={setBusqueda} filtro={filtro} setFiltro={setFiltro} />

      {filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdWarning size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No se encontraron casos</p>
          <p className="text-xs text-text-soft mt-1">
            {siniestros.length === 0 ? 'Aún no has reportado siniestros.' : 'Prueba cambiando los filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filtrados.map((s) => (
            <SiniestroCard key={s.id_siniestro} s={s} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
