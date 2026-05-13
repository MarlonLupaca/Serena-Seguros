'use client';

import { useEffect, useState } from 'react';
import { MdShield } from 'react-icons/md';
import { apiGet } from '@/lib/api';
import PolizaKPIs from './PolizaKPIs';
import PolizaFilters from './PolizaFilters';
import PolizaCard from './PolizaCard';
import DetalleModal from './DetalleModal';

export default function Polizas() {
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [detalleId, setDetalleId] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-polizas');
      setPolizas(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las polizas');
    } finally {
      setCargando(false);
    }
  };

  const filtradas = polizas.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado_poliza === filtroEstado;
    const matchTipo = filtroTipo === 'todos' || p.producto?.tipo_seguro === filtroTipo;
    const texto = busqueda.toLowerCase();
    const matchBusq =
      texto === '' ||
      String(p.id_poliza).includes(texto) ||
      (p.producto?.nombre || '').toLowerCase().includes(texto);
    return matchEstado && matchTipo && matchBusq;
  });

  const counts = {
    total: polizas.length,
    activas: polizas.filter((p) => p.estado_poliza === 'ACTIVA').length,
    vencidas: polizas.filter((p) => p.estado_poliza === 'VENCIDA').length,
    pendientes: polizas.filter((p) => p.estado_poliza === 'PENDIENTE').length,
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      <div className="py-5">
        <p className="text-xl font-bold text-text">Mis pólizas</p>
        <p className="text-sm text-text-soft mt-0.5">Gestiona y consulta todas tus pólizas contratadas.</p>
      </div>

      <div className="flex-1 w-full flex flex-col gap-6 pb-8">
        <PolizaKPIs counts={counts} />

        <PolizaFilters
          busqueda={busqueda}
          setBusqueda={setBusqueda}
          filtroEstado={filtroEstado}
          setFiltroEstado={setFiltroEstado}
          filtroTipo={filtroTipo}
          setFiltroTipo={setFiltroTipo}
        />

        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center">
            <p className="text-sm text-text-soft">Cargando pólizas...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : filtradas.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center">
            <MdShield size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text">No tienes pólizas que coincidan</p>
            <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtradas.map((p) => (
              <PolizaCard key={p.id_poliza} p={p} onVerDetalle={() => setDetalleId(p.id_poliza)} />
            ))}
          </div>
        )}
      </div>

      {detalleId && (
        <DetalleModal
          idPoliza={detalleId}
          onClose={() => setDetalleId(null)}
          onEndosoCreado={cargar}
        />
      )}
    </div>
  );
}
