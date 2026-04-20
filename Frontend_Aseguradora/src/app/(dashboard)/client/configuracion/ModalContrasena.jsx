import { useState } from 'react';
import { MdLock, MdClose, MdVisibility, MdVisibilityOff, MdCheckCircle } from 'react-icons/md';

export default function ModalContrasena({ onClose, onGuardar }) {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  const reglas = [
    { label: 'Mínimo 8 caracteres', ok: nueva.length >= 8 },
    { label: 'Al menos una mayúscula', ok: /[A-Z]/.test(nueva) },
    { label: 'Al menos un número', ok: /[0-9]/.test(nueva) },
    { label: 'Las contraseñas coinciden', ok: nueva && nueva === confirmar },
  ];
  const valida = reglas.every((r) => r.ok) && actual.length > 0;
  const fortaleza = reglas.filter((r) => r.ok).length;

  const handleGuardar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGuardar();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MdLock size={16} className="text-primary" />
            <p className="text-sm font-bold text-text">Cambiar contraseña</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {[
            {
              label: 'Contraseña actual',
              val: actual,
              set: setActual,
              show: showActual,
              toggle: () => setShowActual((v) => !v),
            },
            {
              label: 'Nueva contraseña',
              val: nueva,
              set: setNueva,
              show: showNueva,
              toggle: () => setShowNueva((v) => !v),
            },
            {
              label: 'Confirmar nueva contraseña',
              val: confirmar,
              set: setConfirmar,
              show: showConfirmar,
              toggle: () => setShowConfirmar((v) => !v),
            },
          ].map(({ label, val, set, show, toggle }) => (
            <div key={label}>
              <label className="text-xs font-medium text-text-soft block mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text"
                >
                  {show ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                </button>
              </div>
            </div>
          ))}

          {nueva.length > 0 && (
            <div className="flex flex-col gap-2 bg-bg-soft rounded-xl p-3">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-colors ${i <= fortaleza ? (fortaleza <= 1 ? 'bg-rose-400' : fortaleza <= 2 ? 'bg-amber-400' : fortaleza <= 3 ? 'bg-yellow-400' : 'bg-emerald-500') : 'bg-border'}`}
                  />
                ))}
              </div>
              {reglas.map((r) => (
                <div
                  key={r.label}
                  className={`flex items-center gap-2 text-xs ${r.ok ? 'text-emerald-600' : 'text-text-soft'}`}
                >
                  {r.ok ? <MdCheckCircle size={13} /> : <div className="w-3 h-3 rounded-full border border-border" />}
                  {r.label}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button
              onClick={handleGuardar}
              disabled={!valida || loading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-xs font-semibold transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MdLock size={13} /> Guardar contraseña
                </>
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
