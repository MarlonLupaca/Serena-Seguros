import { useState } from 'react';
import { MdFamilyRestroom, MdEdit, MdSave, MdClose, MdWarningAmber } from 'react-icons/md';
import { BENEFICIARIOS_INICIAL } from './data';

export default function SeccionBeneficiarios({ onGuardar }) {
  const [beneficiarios, setBeneficiarios] = useState(BENEFICIARIOS_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [drafts, setDrafts] = useState({});

  const totalPct = beneficiarios.reduce((acc, b) => acc + parseInt(b.porcentaje || 0), 0);

  const handleEditarBen = (b) => {
    setEditandoId(b.id);
    setDrafts((d) => ({ ...d, [b.id]: { ...b } }));
  };

  const handleGuardarBen = (id) => {
    setBeneficiarios((bs) => bs.map((b) => (b.id === id ? drafts[id] : b)));
    setEditandoId(null);
    onGuardar('Beneficiarios actualizados correctamente.');
  };

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-emerald-200" />
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <MdFamilyRestroom size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Beneficiarios</p>
            <p className="text-xs text-text-soft mt-0.5">Personas designadas en tus pólizas de vida</p>
          </div>
        </div>
        <div
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${totalPct === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
        >
          {totalPct}% asignado
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {beneficiarios.map((b) => {
          const esDraft = editandoId === b.id;
          const val = esDraft ? drafts[b.id] : b;
          return (
            <div
              key={b.id}
              className={`rounded-xl border transition-all ${esDraft ? 'border-primary/30 bg-primary/5' : 'border-border'} p-4`}
            >
              {!esDraft ? (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700">
                    {b.nombre
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text">{b.nombre}</p>
                    <p className="text-xs text-text-soft mt-0.5">
                      {b.relacion} · DNI {b.doc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-emerald-600">{b.porcentaje}%</p>
                    <p className="text-xs text-text-soft">del beneficio</p>
                  </div>
                  <button
                    onClick={() => handleEditarBen(b)}
                    className="p-2 rounded-lg border border-border hover:bg-bg-soft text-text-soft transition-colors shrink-0"
                  >
                    <MdEdit size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'nombre', label: 'Nombre' },
                      { key: 'relacion', label: 'Relación' },
                      { key: 'doc', label: 'N° documento' },
                      { key: 'porcentaje', label: 'Porcentaje (%)' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs font-medium text-text-soft block mb-1">{label}</label>
                        <input
                          value={val[key]}
                          onChange={(e) => setDrafts((d) => ({ ...d, [b.id]: { ...d[b.id], [key]: e.target.value } }))}
                          className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGuardarBen(b.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                    >
                      <MdSave size={13} /> Guardar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="flex-1 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {totalPct !== 100 && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <MdWarningAmber size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">El total de porcentajes debe sumar 100%. Actualmente: {totalPct}%.</p>
          </div>
        )}
      </div>
    </div>
  );
}
