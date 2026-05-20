'use client';

import { useCallback, useEffect } from 'react';

export default function ModalConfirm({ abierto, titulo, mensaje, textoConfirmar = 'Confirmar', textoCancelar = 'Cancelar', onConfirmar, onCancelar, variante = 'danger' }) {
  const cerrar = useCallback(() => onCancelar?.(), [onCancelar]);

  useEffect(() => {
    if (!abierto) return;
    const handler = (e) => e.key === 'Escape' && cerrar();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [abierto, cerrar]);

  if (!abierto) return null;

  const btnClass = variante === 'danger'
    ? 'bg-danger text-white hover:opacity-90'
    : 'bg-primary text-white hover:opacity-90';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40" onClick={cerrar}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-gray-800 mb-2">{titulo || 'Confirmar accion'}</h3>
        <p className="text-sm text-gray-500 mb-6">{mensaje}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={cerrar} className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 cursor-pointer">
            {textoCancelar}
          </button>
          <button onClick={() => { onConfirmar?.(); cerrar(); }} className={`px-4 py-2 text-sm rounded-xl cursor-pointer ${btnClass}`}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  );
}
