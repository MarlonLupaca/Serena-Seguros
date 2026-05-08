'use client';

import { useState } from 'react';
import { MdFolderOpen, MdSearch, MdUpload, MdViewList, MdGridView } from 'react-icons/md';
import { TABLAS } from './data';
import DocCard from './DocCard';
import DocRow from './DocRow';

const FILTROS = [{ value: 'todas', label: 'Todos' }, ...TABLAS.map((t) => ({ value: t.value, label: t.label }))];

export default function ListaDocumentos({ documentos, onSelect, onSubir }) {
  const [busqueda, setBusqueda] = useState('');
  const [tabla, setTabla] = useState('todas');
  const [vista, setVista] = useState('lista');

  const filtrados = documentos.filter((d) => {
    const matchTabla = tabla === 'todas' || d.tabla_referencia === tabla;
    const texto = busqueda.toLowerCase();
    const matchBusq =
      texto === '' ||
      (d.nombre_archivo || '').toLowerCase().includes(texto) ||
      (d.tabla_referencia || '').toLowerCase().includes(texto);
    return matchTabla && matchBusq;
  });

  const counts = TABLAS.reduce(
    (acc, t) => ({ ...acc, [t.value]: documentos.filter((d) => d.tabla_referencia === t.value).length }),
    { total: documentos.length }
  );

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
            <MdFolderOpen size={17} className="text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold leading-tight text-text">{counts.total}</p>
            <p className="text-xs text-text-soft">Total</p>
          </div>
        </div>
        {TABLAS.map((t) => {
          const Icon = t.icon;
          return (
            <div
              key={t.value}
              className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${t.accentBg}`}>
                <Icon size={17} className={t.accentText} />
              </div>
              <div>
                <p className="text-xl font-bold leading-tight text-text">{counts[t.value] || 0}</p>
                <p className="text-xs text-text-soft">{t.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Búsqueda + subir */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar por nombre del archivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
          />
        </div>
        <button
          onClick={onSubir}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors shrink-0"
        >
          <MdUpload size={14} /> Subir documento
        </button>
      </div>

      {/* Filtros + vista */}
      <div className="flex gap-3 flex-wrap items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setTabla(f.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                tabla === f.value
                  ? 'bg-primary/10 text-primary border-primary/30 font-medium'
                  : 'border-border text-text-soft hover:text-text bg-bg'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setVista('lista')}
            className={`px-2.5 py-1.5 transition-colors ${
              vista === 'lista' ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft'
            }`}
          >
            <MdViewList size={15} />
          </button>
          <button
            onClick={() => setVista('grid')}
            className={`px-2.5 py-1.5 transition-colors ${
              vista === 'grid' ? 'bg-primary/10 text-primary' : 'text-text-soft hover:bg-bg-soft'
            }`}
          >
            <MdGridView size={15} />
          </button>
        </div>
      </div>

      {/* Resultados */}
      {filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdFolderOpen size={36} className="text-text-soft mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-text">No tienes documentos</p>
          <p className="text-xs text-text-soft mt-1">
            {documentos.length === 0
              ? 'Sube tu primer documento para empezar.'
              : 'Prueba cambiando los filtros.'}
          </p>
        </div>
      ) : vista === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtrados.map((d) => (
            <DocCard key={d.id_documento} doc={d} onSelect={onSelect} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtrados.map((d) => (
            <DocRow key={d.id_documento} doc={d} onSelect={onSelect} />
          ))}
        </div>
      )}
    </div>
  );
}
