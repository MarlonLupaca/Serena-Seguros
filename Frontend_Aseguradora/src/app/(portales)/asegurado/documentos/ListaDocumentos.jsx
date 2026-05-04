import { useState } from 'react';
import {
  MdFolderOpen,
  MdNewReleases,
  MdVerified,
  MdSearch,
  MdUpload,
  MdViewList,
  MdGridView,
  MdFilterList,
  MdDescription,
} from 'react-icons/md';
import { DOCUMENTOS, CATEGORIAS, TIPO_CONFIG } from './data';
import DocCard from './DocCard';
import DocRow from './DocRow';

export default function ListaDocumentos({ onSelect, onSubir }) {
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('todas');
  const [polizaFiltro, setPolizaFiltro] = useState('todas');
  const [orden, setOrden] = useState('reciente');
  const [vista, setVista] = useState('lista');

  const filtrados = DOCUMENTOS.filter((d) => {
    const matchCat = categoria === 'todas' || d.tipo === categoria;
    const matchPol = polizaFiltro === 'todas' || d.polizaId === polizaFiltro;
    const matchBusq =
      busqueda === '' ||
      d.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      d.polizaLabel.toLowerCase().includes(busqueda.toLowerCase()) ||
      (d.siniestroId && d.siniestroId.toLowerCase().includes(busqueda.toLowerCase()));
    return matchCat && matchPol && matchBusq;
  }).sort((a, b) => (orden === 'reciente' ? b.fechaTs - a.fechaTs : a.nombre.localeCompare(b.nombre)));

  // Agrupados por tipo para vista lista
  const grupos = CATEGORIAS.filter((c) => c.id !== 'todas')
    .map((c) => ({
      ...c,
      docs: filtrados.filter((d) => d.tipo === c.id),
    }))
    .filter((g) => g.docs.length > 0);

  const counts = {
    total: DOCUMENTOS.length,
    nuevos: DOCUMENTOS.filter((d) => d.nuevo).length,
    importantes: DOCUMENTOS.filter((d) => d.importante).length,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: 'Total documentos',
            val: counts.total,
            icon: MdFolderOpen,
            bg: 'bg-primary/10',
            iconColor: 'text-primary',
            color: 'text-text',
          },
          {
            label: 'Nuevos',
            val: counts.nuevos,
            icon: MdNewReleases,
            bg: 'bg-primary/10',
            iconColor: 'text-primary',
            color: 'text-primary',
          },
          {
            label: 'Importantes',
            val: counts.importantes,
            icon: MdVerified,
            bg: 'bg-amber-100',
            iconColor: 'text-amber-600',
            color: 'text-amber-600',
          },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${k.bg}`}>
                <Icon size={17} className={k.iconColor} />
              </div>
              <div>
                <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.val}</p>
                <p className="text-xs text-text-soft">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filtros y controles */}
      <div className="flex flex-col gap-3">
        {/* Búsqueda + subir */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar documentos, póliza, siniestro…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
            />
          </div>
          <button
            onClick={onSubir}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-dashed border-primary/40 hover:bg-primary/5 text-xs font-medium text-primary transition-colors shrink-0"
          >
            <MdUpload size={14} /> Subir
          </button>
        </div>

        {/* Filtros secundarios */}
        <div className="flex gap-3 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {CATEGORIAS.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategoria(c.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  categoria === c.id
                    ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                    : 'border-border text-text-soft hover:text-text bg-bg'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 items-center">
            {/* Vista */}
            <div className="flex rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setVista('lista')}
                className={`px-2.5 py-1.5 transition-colors ${vista === 'lista' ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft'}`}
              >
                <MdViewList size={15} />
              </button>
              <button
                onClick={() => setVista('grid')}
                className={`px-2.5 py-1.5 transition-colors ${vista === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft'}`}
              >
                <MdGridView size={15} />
              </button>
            </div>

            {/* Orden */}
            <div className="relative">
              <MdFilterList size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-text-soft" />
              <select
                value={orden}
                onChange={(e) => setOrden(e.target.value)}
                className="pl-7 pr-3 py-1.5 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="reciente">Más reciente</option>
                <option value="nombre">Nombre A–Z</option>
              </select>
            </div>

            {/* Póliza */}
            <div className="relative">
              <select
                value={polizaFiltro}
                onChange={(e) => setPolizaFiltro(e.target.value)}
                className="pl-3 pr-3 py-1.5 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="todas">Todas las pólizas</option>
                <option value="POL-2024-00182">Auto</option>
                <option value="POL-2023-00891">Salud</option>
                <option value="POL-2022-00345">Hogar</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdFolderOpen size={36} className="text-text-soft mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-text">No se encontraron documentos</p>
          <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros o el buscador</p>
        </div>
      ) : vista === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtrados.map((d) => (
            <DocCard key={d.id} doc={d} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {grupos.map((g) => {
            const GIcon = TIPO_CONFIG[g.id]?.icon || MdDescription;
            return (
              <div key={g.id} className="flex flex-col gap-3">
                {/* Encabezado de grupo */}
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${TIPO_CONFIG[g.id]?.iconBg}`}>
                    <GIcon size={13} className={TIPO_CONFIG[g.id]?.iconColor} />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">{g.label}</p>
                  <span className="text-xs text-text-soft bg-bg-soft px-2 py-0.5 rounded-full border border-border">
                    {g.docs.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  {g.docs.map((d) => (
                    <DocRow key={d.id} doc={d} onSelect={onSelect} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
