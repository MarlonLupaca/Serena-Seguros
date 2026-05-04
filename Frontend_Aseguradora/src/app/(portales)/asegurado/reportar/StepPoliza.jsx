import { MdCheck } from 'react-icons/md';
import { POLIZAS } from './data';

export default function StepPoliza({ polizaId, onChange }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5">
      <p className="text-sm font-bold text-text mb-1">¿Qué póliza se vio afectada?</p>
      <p className="text-xs text-text-soft mb-4">Selecciona la póliza relacionada con el incidente.</p>
      <div className="flex flex-col gap-2">
        {POLIZAS.map((p) => {
          const Icon = p.icon;
          const sel = polizaId === p.id;
          return (
            <button
              key={p.id}
              onClick={() => onChange(p.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${sel ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/40 hover:bg-bg-soft'}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${p.accentBg}`}>
                <Icon size={20} className={p.accentText} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{p.label}</p>
                <p className="text-xs text-text-soft mt-0.5">
                  {p.id} · Plan {p.plan}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${sel ? 'border-primary bg-primary' : 'border-border'}`}
              >
                {sel && <MdCheck size={12} className="text-text-inverse" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
