'use client';

import { useEffect, useMemo, useState } from 'react';
import { MdShield } from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { estiloTipo } from './data';
import SeguroCard from './SeguroCard';
import InsuranceTabs from './InsuranceTabs';

export default function VerSeguros() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('todos');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    apiGet('/productos?estado=ACTIVO')
      .then((data) => setProductos(data || []))
      .catch((e) => setError(e.mensaje || 'No se pudieron cargar los seguros'))
      .finally(() => setCargando(false));
  }, []);

  const allTabs = useMemo(() => {
    const tipos = Array.from(new Set(productos.map((p) => p.tipo_seguro)));
    const tabs = tipos.map((t) => {
      const e = estiloTipo(t);
      return {
        id: t,
        tab: e.label,
        imagen: e.imagen,
        accentBg: e.accentBg,
        accentText: e.accentText,
      };
    });
    return [{ id: 'todos', tab: 'Todos', imagen: null, accentBg: null, accentText: null }, ...tabs];
  }, [productos]);

  const filtered = activeTab === 'todos' ? productos : productos.filter((p) => p.tipo_seguro === activeTab);

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      <div className="py-5">
        <p className="text-xl font-bold text-text">Ver seguros</p>
        <p className="text-sm text-balance text-text-soft mt-0.5">
          Explora nuestros planes, compara coberturas y cotiza en minutos.
        </p>
      </div>

      <div className="flex-1 w-full pb-8 flex flex-col gap-8">
        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
            Cargando seguros...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
            {error}
          </div>
        ) : productos.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center">
            <MdShield size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text">No hay seguros disponibles por ahora.</p>
          </div>
        ) : (
          <>
            <InsuranceTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              dropdownOpen={dropdownOpen}
              setDropdownOpen={setDropdownOpen}
              allTabs={allTabs}
            />

            <div
              className={`grid gap-5 ${
                filtered.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3'
              }`}
            >
              {filtered.map((p) => (
                <SeguroCard key={p.id_producto} producto={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
