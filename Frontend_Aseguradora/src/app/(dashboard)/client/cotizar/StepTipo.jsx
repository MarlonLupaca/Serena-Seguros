import { TIPOS } from './data';

export default function StepTipo({ data, set }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-soft">¿Qué tipo de seguro deseas cotizar?</p>
      <div className="grid grid-cols-2 gap-3">
        {TIPOS.map((t) => {
          const Icon = t.icon;
          const sel = data.tipo === t.id;
          return (
            <button
              key={t.id}
              onClick={() => set({ tipo: t.id })}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${sel ? 'bg-primary' : 'bg-bg-soft'}`}
              >
                <Icon size={24} className={sel ? 'text-text-inverse' : 'text-text-soft'} />
              </div>
              <span className={`text-sm font-semibold ${sel ? 'text-primary' : 'text-text'}`}>{t.label}</span>
              <span className="text-xs text-text-soft">{t.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
