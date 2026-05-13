'use client';

import { useState } from 'react';
import { MdClose, MdCheckCircle, MdSend } from 'react-icons/md';
import { apiPost } from '@/lib/api';
import { estiloTipo, formatearMoneda } from './data';

export default function ModalCotizar({ producto, onClose }) {
  const [primaEstimada, setPrimaEstimada] = useState(String(producto.prima_base ?? ''));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);

  const tipoStyle = estiloTipo(producto.tipo_seguro);
  const Icon = tipoStyle.icon;

  const enviar = async () => {
    setEnviando(true);
    setError('');
    try {
      const data = await apiPost('/mis-cotizaciones', {
        producto_interes: producto.tipo_seguro,
        id_producto: producto.id_producto,
        prima_estimada: primaEstimada ? Number(primaEstimada) : null,
      });
      setResultado(data);
    } catch (e) {
      setError(e.mensaje || 'No se pudo enviar la cotizacion');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Cotizar seguro</p>
          <button
            onClick={onClose}
            disabled={enviando}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft disabled:opacity-50"
          >
            <MdClose size={15} />
          </button>
        </div>

        {!resultado ? (
          <div className="p-5 flex flex-col gap-4">
            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 bg-bg-soft rounded-xl p-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tipoStyle.accentBg}`}>
                <Icon size={20} className={tipoStyle.accentText} />
              </div>
              <div>
                <p className="text-sm font-bold text-text">{producto.nombre}</p>
                <p className="text-xs text-text-soft mt-0.5">{producto.tipo_seguro}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Prima estimada (S/)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={primaEstimada}
                onChange={(e) => setPrimaEstimada(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
              />
              <p className="text-xs text-text-soft mt-1">Sugerencia base: {formatearMoneda(producto.prima_base)}</p>
            </div>

            <p className="text-xs text-text-soft leading-relaxed">
              Tu solicitud será enviada a un agente comercial que se contactará contigo para concretar la cotización.
            </p>

            <div className="flex gap-2">
              <button
                onClick={enviar}
                disabled={enviando}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdSend size={13} /> {enviando ? 'Enviando...' : 'Solicitar cotización'}
              </button>
              <button
                onClick={onClose}
                disabled={enviando}
                className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <MdCheckCircle size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-base font-bold text-text">¡Cotización enviada!</p>
              <p className="text-xs text-text-soft mt-1 leading-relaxed">
                Caso COT-{String(resultado.id_cotizacion).padStart(6, '0')}
              </p>
            </div>
            <div className="bg-bg-soft rounded-xl px-4 py-3 w-full text-left flex flex-col gap-1.5">
              <Linea label="Producto" val={producto.nombre} />
              <Linea label="Tipo" val={resultado.producto_interes} />
              <Linea label="Prima estimada" val={formatearMoneda(resultado.prima_estimada)} />
              <Linea label="Agente asignado" val={resultado.agente_asignado} />
              <Linea label="Estado" val={resultado.estado_kanban} />
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Linea({ label, val }) {
  return (
    <div className="flex justify-between text-xs gap-3">
      <span className="text-text-soft">{label}</span>
      <span className="font-medium text-text text-right">{val}</span>
    </div>
  );
}
