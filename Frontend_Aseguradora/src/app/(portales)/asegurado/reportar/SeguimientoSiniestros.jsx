'use client';

import { useEffect, useState } from 'react';
import { MdTimeline, MdChatBubbleOutline, MdClose, MdSend } from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';
import { formatearFecha, mockDetalleSiniestro } from './data';

export default function SeguimientoSiniestros() {
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [siniestroSeleccionado, setSiniestroSeleccionado] = useState(null);

  useEffect(() => {
    apiGet('/mis-siniestros')
      .then((data) => setSiniestros(data || []))
      .catch(() => setSiniestros([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <div className="p-4 text-sm text-text-soft text-center">Cargando tus casos...</div>;
  if (siniestros.length === 0) return null; // Si no hay, no mostramos la sección

  return (
    <div className="mt-8 pt-8 border-t border-border">
      <h3 className="text-lg font-bold text-text mb-4">Seguimiento de mis casos</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {siniestros.map((sin) => (
          <div
            key={sin.id_siniestro}
            className="bg-bg rounded-2xl border border-border p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-bg-soft px-2 py-1 rounded-md text-text-soft">
                  CASO #{String(sin.id_siniestro).padStart(6, '0')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    sin.estado_resolucion === 'OBSERVADO'
                      ? 'bg-amber-100 text-amber-700'
                      : sin.estado_resolucion === 'LIQUIDADO'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-sky-100 text-sky-700'
                  }`}
                >
                  {sin.estado_resolucion}
                </span>
              </div>
              <p className="text-sm font-bold text-text">{sin.poliza_nombre}</p>
              <p className="text-xs text-text-soft mt-1">{sin.tipo_incidente}</p>
              <p className="text-xs text-text-soft mt-2">Reportado: {formatearFecha(sin.fecha_reporte)}</p>
            </div>

            <button
              onClick={() => setSiniestroSeleccionado(sin.id_siniestro)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
            >
              <MdTimeline size={16} /> Ver Línea de Tiempo
            </button>
          </div>
        ))}
      </div>

      {/* Modal de Línea de Tiempo y Observaciones */}
      {siniestroSeleccionado && (
        <ModalLineaTiempo id={siniestroSeleccionado} onClose={() => setSiniestroSeleccionado(null)} />
      )}
    </div>
  );
}

function ModalLineaTiempo({ id, onClose }) {
  const [detalle, setDetalle] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Simulación del endpoint de línea de tiempo
    setTimeout(() => {
      setDetalle(mockDetalleSiniestro);
    }, 500);
  }, [id]);

  const enviarRespuesta = async () => {
    if (!respuesta.trim()) return;
    setEnviando(true);
    // Simulación de envío de respuesta a observación
    setTimeout(() => {
      alert('Respuesta enviada al analista.');
      setEnviando(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <p className="font-bold text-text text-sm">Línea de Tiempo - Caso #{String(id).padStart(6, '0')}</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {!detalle ? (
            <p className="text-center text-xs text-text-soft">Cargando historial...</p>
          ) : (
            <div className="relative border-l-2 border-border ml-3 flex flex-col gap-6">
              {detalle.linea_tiempo.map((hito, idx) => (
                <div key={idx} className="relative pl-6">
                  <span
                    className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-bg ${
                      idx === detalle.linea_tiempo.length - 1 ? 'bg-primary' : 'bg-text-soft'
                    }`}
                  />
                  <p className="text-xs font-bold text-text">{hito.estado}</p>
                  <p className="text-[10px] text-text-soft mb-1">{formatearFecha(hito.fecha)}</p>
                  <p className="text-xs text-text-soft leading-relaxed">{hito.detalle}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {detalle?.requiere_respuesta && (
          <div className="p-4 border-t border-border bg-amber-50">
            <label className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-2">
              <MdChatBubbleOutline size={14} /> Responder a la observación
            </label>
            <textarea
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              rows={2}
              placeholder="Escribe tu respuesta o aclaración aquí..."
              className="w-full px-3 py-2 rounded-xl text-xs border border-amber-200 outline-none focus:border-amber-400 resize-none mb-2"
            />
            <button
              onClick={enviarRespuesta}
              disabled={enviando || !respuesta.trim()}
              className="w-full flex justify-center items-center gap-2 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors"
            >
              {enviando ? (
                'Enviando...'
              ) : (
                <>
                  <MdSend size={14} /> Enviar respuesta
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
