import { useState, useEffect, useRef } from 'react';
import { MdSearch, MdFilterList, MdKeyboardArrowDown, MdCheck } from 'react-icons/md';

export default function SiniestrosFilters({ busqueda, setBusqueda, filtro, setFiltro }) {
  const [abierto, setAbierto] = useState(false);
  const ref = useRef(null);

  const opciones = [
    { value: 'todos', label: 'Todos los estados' },
    { value: 'enviado', label: 'Enviado' },
    { value: 'evaluacion', label: 'En evaluación' },
    { value: 'aprobado', label: 'Aprobado' },
    { value: 'rechazado', label: 'Rechazado' },
  ];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por número, tipo o póliza…"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
        />
      </div>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setAbierto((prev) => !prev)}
          className="flex items-center gap-2 pl-3 pr-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary transition-colors outline-none"
        >
          <MdFilterList size={14} className="text-text-soft" />
          <span>{opciones.find((o) => o.value === filtro)?.label}</span>
          <MdKeyboardArrowDown
            size={14}
            className={`text-text-soft transition-transform duration-200 ${abierto ? 'rotate-180' : ''}`}
          />
        </button>

        {abierto && (
          <ul className="absolute z-50 mt-1 w-full min-w-max rounded-xl border border-border bg-bg shadow-lg py-1">
            {opciones.map((opcion) => (
              <li
                key={opcion.value}
                onClick={() => {
                  setFiltro(opcion.value);
                  setAbierto(false);
                }}
                className="flex items-center justify-between gap-4 px-3 py-2 text-sm text-text hover:bg-bg-soft cursor-pointer transition-colors"
              >
                {opcion.label}
                {filtro === opcion.value && <MdCheck size={14} className="text-primary" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
