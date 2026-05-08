'use client';

import { useState } from 'react';
import { MdClose, MdUpload, MdAttachFile, MdDeleteOutline, MdSend } from 'react-icons/md';
import { apiUploadFile } from '@/lib/api';
import { TABLAS } from './data';

export default function ModalSubida({ onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [tabla, setTabla] = useState('general');
  const [idReferencia, setIdReferencia] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const subir = async () => {
    if (!archivo) return;
    setEnviando(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('archivo', archivo);
      fd.append('tabla_referencia', tabla);
      if (idReferencia) fd.append('id_referencia', String(idReferencia));
      await apiUploadFile('/mis-documentos', fd);
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo subir el archivo');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Subir documento</p>
          <button
            onClick={onClose}
            disabled={enviando}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft disabled:opacity-50"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-primary/25 rounded-xl p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <MdUpload size={22} className="text-primary" />
            <p className="text-xs font-medium text-text">{archivo ? 'Cambiar archivo' : 'Seleccionar archivo'}</p>
            <p className="text-xs text-text-soft">PDF, JPG, PNG · Máx. 10 MB</p>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
          </label>

          {archivo && (
            <div className="flex items-center gap-2 text-xs text-text-soft bg-bg-soft rounded-lg px-3 py-2">
              <MdAttachFile size={13} className="text-primary shrink-0" />
              <span className="flex-1 truncate">{archivo.name}</span>
              <button onClick={() => setArchivo(null)}>
                <MdDeleteOutline size={14} className="text-rose-400" />
              </button>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Categoría</label>
            <select
              value={tabla}
              onChange={(e) => setTabla(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
            >
              {TABLAS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {tabla !== 'general' && (
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                ID de {tabla} (opcional)
              </label>
              <input
                type="number"
                min="0"
                value={idReferencia}
                onChange={(e) => setIdReferencia(e.target.value)}
                placeholder={`ID de la ${tabla} a la que pertenece`}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
              />
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={subir}
              disabled={!archivo || enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdSend size={13} /> {enviando ? 'Subiendo...' : 'Subir'}
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
      </div>
    </div>
  );
}
