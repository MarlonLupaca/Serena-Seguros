'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import ListaPagos from './ListaPagos';
import DetalleCuota from './DetalleCuota';
import ModalPago from './ModalPago';
import { ESTADO_CONFIG, clasificarEstado } from './data';

export default function ModuloPagos() {
  const [cuotas, setCuotas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [seleccionada, setSeleccionada] = useState(null);
  const [cuotaPagar, setCuotaPagar] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-cuotas');
      setCuotas(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las cuotas');
    } finally {
      setCargando(false);
    }
  };

  const onPagoExitoso = async () => {
    setCuotaPagar(null);
    setSeleccionada(null);
    await cargar();
  };

  const estadoSel = seleccionada ? clasificarEstado(seleccionada) : null;

  return (
    <div className="flex flex-col">
      <div className="px-8 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xl font-bold text-text leading-tight">
              {seleccionada ? `Cuota ${seleccionada.numero_cuota}` : 'Mis pagos'}
            </p>
            <p className="text-sm text-text-soft mt-0.5">
              {seleccionada ? `${seleccionada.poliza_nombre}` : 'Gestiona las cuotas y pagos de tus pólizas activas.'}
            </p>
          </div>
          {seleccionada && estadoSel && (
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${ESTADO_CONFIG[estadoSel].badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_CONFIG[estadoSel].dot}`} />
              {ESTADO_CONFIG[estadoSel].label}
            </span>
          )}
        </div>
      </div>

      <div className="w-full px-8 pb-8">
        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
            Cargando cuotas...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
            {error}
          </div>
        ) : seleccionada ? (
          <DetalleCuota cuota={seleccionada} onBack={() => setSeleccionada(null)} onPagar={(c) => setCuotaPagar(c)} />
        ) : (
          <ListaPagos cuotas={cuotas} onSelect={setSeleccionada} onPagar={(c) => setCuotaPagar(c)} />
        )}
      </div>

      {cuotaPagar && <ModalPago cuota={cuotaPagar} onClose={() => setCuotaPagar(null)} onSuccess={onPagoExitoso} />}
    </div>
  );
}
