import { MdUpload, MdDescription, MdDeleteOutline } from 'react-icons/md';

export default function StepEvidencia({ files, onAdd, onRemove }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-text mb-1">Adjunta evidencias</p>
        <p className="text-xs text-text-soft">
          Fotos, videos o documentos que respalden tu reporte. No es obligatorio pero agiliza la revisión.
        </p>
      </div>
      <label
        className="flex flex-col items-center gap-2 border-2 border-dashed border-border hover:border-primary/40 rounded-xl p-8 cursor-pointer transition-colors hover:bg-primary/5"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onAdd(Array.from(e.dataTransfer.files).filter((f) => f.size < 10 * 1024 * 1024));
        }}
      >
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <MdUpload size={22} className="text-primary" />
        </div>
        <p className="text-sm font-semibold text-text">Arrastra archivos aquí o haz clic</p>
        <p className="text-xs text-text-soft">Fotos, videos, PDF · Máx. 10 MB por archivo</p>
        <input
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => onAdd(Array.from(e.target.files).filter((f) => f.size < 10 * 1024 * 1024))}
        />
      </label>
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MdDescription size={16} className="text-primary" />
              </div>
              <p className="text-sm text-text flex-1 truncate">{f.name}</p>
              <p className="text-xs text-text-soft shrink-0">{(f.size / 1024).toFixed(0)} KB</p>
              <button
                onClick={() => onRemove(i)}
                className="p-1.5 rounded-lg hover:bg-rose-100 text-text-soft hover:text-rose-500 transition-colors"
              >
                <MdDeleteOutline size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-start gap-1.5 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
        <MdDescription size={13} className="text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-primary">
          Para siniestros de auto: adjunta fotos del vehículo y parte policial si existe. Para salud: adjunta el alta
          médica o exámenes.
        </p>
      </div>
    </div>
  );
}
