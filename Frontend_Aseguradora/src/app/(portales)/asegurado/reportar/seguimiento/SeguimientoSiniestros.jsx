'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import ListaSiniestros from './ListaSiniestros';
import DetalleSiniestro from './DetalleSiniestro';
import { ESTADO_CONFIG } from './data';

export default function SeguimientoSiniestros() {
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-siniestros');
      setSiniestros(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar tus siniestros');
    } finally {
      setCargando(false);
    }
  };

  const est = selected ? ESTADO_CONFIG[selected.estado_resolucion] : null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      <div className="py-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xl font-bold text-text leading-tight">
            {selected ? `SIN-${String(selected.id_siniestro).padStart(6, '0')}` : 'Seguimiento de siniestros'}
          </p>
          <p className="text-sm text-text-soft mt-0.5">
            {selected
              ? `${selected.tipo_incidente} · ${selected.poliza_nombre}`
              : 'Consulta el estado y avance de tus casos reportados.'}
          </p>
        </div>
        {selected && est && (
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full shrink-0 mt-1 ${est.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
            {est.label}
          </span>
        )}
      </div>

      <div className="flex-1 w-full pb-8">
        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-8 text-center text-sm text-text-soft">
            Cargando casos...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">{error}</div>
        ) : selected ? (
          <DetalleSiniestro siniestro={selected} onBack={() => setSelected(null)} />
        ) : (
          <ListaSiniestros siniestros={siniestros} onSelect={setSelected} />
        )}
      </div>
    </div>
  );
}
