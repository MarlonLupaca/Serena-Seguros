import { useState } from 'react';
import { MdWarningAmber, MdClose } from 'react-icons/md';

export default function ModalConfirmar({
  titulo,
  descripcion,
  labelConfirm,
  colorConfirm = 'bg-rose-600',
  onClose,
  onConfirmar,
}) {
  const [loading, setLoading] = useState(false);
  const [texto, setTexto] = useState('');
  const requiereTexto = labelConfirm === 'Eliminar cuenta';

  const handleConfirmar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirmar();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MdWarningAmber size={16} className="text-rose-500" />
            <p className="text-sm font-bold text-text">{titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-text-soft leading-relaxed">{descripcion}</p>
          {requiereTexto && (
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Escribe <span className="font-bold text-rose-500">ELIMINAR</span> para confirmar
              </label>
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-rose-400 transition-colors"
                placeholder="ELIMINAR"
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleConfirmar}
              disabled={loading || (requiereTexto && texto !== 'ELIMINAR')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl ${colorConfirm} hover:opacity-90 disabled:opacity-40 text-white text-xs font-semibold transition-all`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                labelConfirm
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
