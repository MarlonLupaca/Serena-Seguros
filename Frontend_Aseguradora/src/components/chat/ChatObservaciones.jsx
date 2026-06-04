import React, { useState, useEffect, useRef } from 'react';
import { MdSend, MdPerson, MdWarning } from 'react-icons/md';
import { apiGet, apiPost } from '../../lib/api';

export default function ChatObservaciones({ tipoReferencia, idReferencia, isAdmin }) {
  const [observaciones, setObservaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [error, setError] = useState(null);

  const mensajesEndRef = useRef(null);

  const endpointBase = isAdmin ? '/admin/observaciones' : '/mis-observaciones';

  const cargarObservaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const data = await apiGet(`${endpointBase}?tipoReferencia=${tipoReferencia}&idReferencia=${idReferencia}`);
      setObservaciones(data);
    } catch (err) {
      setError('No se pudieron cargar las observaciones.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (idReferencia && tipoReferencia) {
      cargarObservaciones();
    }
  }, [idReferencia, tipoReferencia]);

  useEffect(() => {
    if (mensajesEndRef.current) {
      mensajesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [observaciones]);

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim() || enviando) return;

    try {
      setEnviando(true);
      const data = await apiPost(`${endpointBase}?tipoReferencia=${tipoReferencia}&idReferencia=${idReferencia}`, {
        comentario: nuevoMensaje.trim(),
      });
      setObservaciones([...observaciones, data]);
      setNuevoMensaje('');
    } catch (err) {
      alert(err.message || 'Error al enviar observación');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-bg-soft flex items-center justify-between">
        <h3 className="text-xs font-bold text-text uppercase tracking-wider">Historial de Observaciones</h3>
        <span className="text-[10px] text-text-soft">{observaciones.length} msjs</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-[200px] max-h-[400px] bg-bg-soft/30">
        {cargando ? (
          <div className="text-center text-text-soft text-sm py-4">Cargando...</div>
        ) : error ? (
          <div className="text-center text-red-500 text-sm py-4">{error}</div>
        ) : observaciones.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-text-soft opacity-50 py-8">
            <MdWarning size={32} className="mb-2" />
            <p className="text-sm text-center">No hay observaciones registradas aún.</p>
          </div>
        ) : (
          observaciones.map((obs) => {
            const esMio = isAdmin ? obs.autorRol === 'TECNICO' : obs.autorRol === 'CLIENTE';
            return (
              <div key={obs.idObservacion} className={`flex flex-col ${esMio ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  {!esMio && <MdPerson size={12} className="text-text-soft" />}
                  <span className="text-[10px] font-bold text-text-soft">
                    {obs.autorNombre} {obs.autorRol === 'TECNICO' ? '(Core)' : '(Cliente)'}
                  </span>
                  <span className="text-[9px] text-text-soft ml-1">
                    {new Date(obs.fechaCreacion).toLocaleString('es-PE', {
                      hour: '2-digit',
                      minute: '2-digit',
                      day: '2-digit',
                      month: 'short',
                    })}
                  </span>
                </div>
                <div
                  className={`p-3 rounded-2xl max-w-[85%] text-sm ${esMio ? 'bg-primary text-white rounded-tr-sm' : 'bg-white border border-border text-text rounded-tl-sm'}`}
                >
                  {obs.comentario}
                </div>
              </div>
            );
          })
        )}
        <div ref={mensajesEndRef} />
      </div>

      <form onSubmit={enviarMensaje} className="p-3 bg-bg border-t border-border flex items-center gap-2">
        <input
          type="text"
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          placeholder={isAdmin ? 'Escribe una observación al cliente...' : 'Responde a la observación...'}
          className="flex-1 bg-bg-soft border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          disabled={enviando || cargando}
        />
        <button
          type="submit"
          disabled={!nuevoMensaje.trim() || enviando || cargando}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-white transition-colors shrink-0"
        >
          <MdSend size={18} className={enviando ? 'opacity-50' : ''} />
        </button>
      </form>
    </div>
  );
}
