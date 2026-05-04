import { useState } from 'react';
import { MdClose, MdUpload, MdAttachFile, MdDeleteOutline, MdSend } from 'react-icons/md';

export default function ModalSubida({ onClose }) {
  const [files, setFiles] = useState([]);
  const [tipo, setTipo] = useState('');
  const [poliza, setPoliza] = useState('');
  const [nota, setNota] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Subir documento</p>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {/* Drop zone */}
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-primary/25 rounded-xl p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <MdUpload size={22} className="text-primary" />
            <p className="text-xs font-medium text-text">Seleccionar archivos</p>
            <p className="text-xs text-text-soft">PDF, JPG, PNG · Máx. 10 MB</p>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={(e) => setFiles((p) => [...p, ...Array.from(e.target.files)])}
            />
          </label>

          {files.length > 0 && (
            <div className="flex flex-col gap-1.5">
              {files.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-text-soft bg-bg-soft rounded-lg px-3 py-2">
                  <MdAttachFile size={13} className="text-primary shrink-0" />
                  <span className="flex-1 truncate">{f.name}</span>
                  <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))}>
                    <MdDeleteOutline size={14} className="text-rose-400" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Tipo */}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo de documento</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
            >
              <option value="">Seleccionar tipo…</option>
              <option value="poliza">Póliza</option>
              <option value="contrato">Contrato</option>
              <option value="comprobante">Comprobante</option>
              <option value="evidencia">Evidencia</option>
            </select>
          </div>

          {/* Póliza */}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Póliza asociada</label>
            <select
              value={poliza}
              onChange={(e) => setPoliza(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
            >
              <option value="">Seleccionar póliza…</option>
              <option value="POL-2024-00182">POL-2024-00182 · Seguro de Auto</option>
              <option value="POL-2023-00891">POL-2023-00891 · Seguro de Salud</option>
              <option value="POL-2022-00345">POL-2022-00345 · Seguro de Hogar</option>
            </select>
          </div>

          <textarea
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            placeholder="Nota opcional…"
            rows={2}
            className="w-full px-3 py-2 rounded-xl text-xs border border-border outline-none bg-bg text-text focus:border-primary transition-colors resize-none"
          />

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
              <MdSend size={13} /> Subir
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
