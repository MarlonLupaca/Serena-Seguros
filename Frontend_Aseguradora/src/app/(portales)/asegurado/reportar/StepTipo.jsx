import { TIPOS } from './data';

export default function StepTipo({ tipoId, onChange }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5">
      <p className="text-sm font-bold text-text mb-1">¿Qué tipo de siniestro ocurrió?</p>
      <p className="text-xs text-text-soft mb-4">Esto nos ayuda a asignarte al equipo correcto.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {TIPOS.map((t) => {
          const Icon = t.icon;
          const sel = tipoId === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${sel ? 'border-primary bg-primary/5 ring-1 ring-primary/20' : 'border-border hover:border-primary/40 hover:bg-bg-soft'}`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${t.accentBg}`}>
                <Icon size={18} className={t.accentText} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text leading-tight">{t.label}</p>
                <p className="text-xs text-text-soft mt-0.5">{t.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
