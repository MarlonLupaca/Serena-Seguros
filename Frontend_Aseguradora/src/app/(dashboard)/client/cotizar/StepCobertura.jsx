import { COBERTURAS, EXTRAS, DEDUCIBLE_OPTS } from './data';
import { Tooltip } from './FormHelpers';
import { MdCheck } from 'react-icons/md';

export default function StepCobertura({ data, set }) {
  const opts = COBERTURAS[data.tipo] || [];
  const u = (k, v) => set({ cobertura: { ...(data.cobertura || {}), [k]: v } });
  const cob = data.cobertura || {};
  const toggleExtra = (id) => {
    const curr = cob.extras || [];
    u('extras', curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]);
  };
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-text-soft">Elige el nivel de cobertura que mejor se adapte a ti.</p>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft">Plan</span>
        {opts.map((o) => {
          const sel = cob.plan === o.id;
          return (
            <button
              key={o.id}
              onClick={() => u('plan', o.id)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sel ? 'border-primary' : 'border-border'}`}
                >
                  {sel && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${sel ? 'text-primary' : 'text-text'}`}>{o.label}</p>
                  <p className="text-xs text-text-soft">{o.desc}</p>
                </div>
              </div>
              <span className={`text-base font-bold ${sel ? 'text-primary' : 'text-text'}`}>
                S/ {o.precio}
                <span className="text-xs font-normal text-text-soft">/mes</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft flex items-center">
          Deducible{' '}
          <Tooltip text="Monto que pagas tú antes de que el seguro cubra el siniestro. A mayor deducible, menor prima." />
        </span>
        <div className="grid grid-cols-2 gap-2">
          {DEDUCIBLE_OPTS.map((d) => {
            const sel = cob.deducible === d.val;
            return (
              <button
                key={d.val}
                onClick={() => u('deducible', d.val)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
              >
                <p className={`text-sm font-semibold ${sel ? 'text-primary' : 'text-text'}`}>{d.label}</p>
                {d.descuento > 0 && <p className="text-xs text-emerald-600">-{d.descuento}% en prima</p>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft">Coberturas adicionales</span>
        {EXTRAS.map((e) => {
          const sel = (cob.extras || []).includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggleExtra(e.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${sel ? 'bg-primary border-primary' : 'border-border'}`}
                >
                  {sel && <MdCheck size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${sel ? 'text-primary font-medium' : 'text-text-soft'}`}>{e.label}</span>
              </div>
              <span className="text-xs font-semibold text-text-soft">+S/ {e.precio}/mes</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft">Frecuencia de pago</span>
        <div className="flex gap-2">
          {[
            ['mensual', 'Mensual', 0],
            ['semestral', 'Semestral', 5],
            ['anual', 'Anual', 10],
          ].map(([v, l, desc]) => {
            const sel = (cob.periodo || 'mensual') === v;
            return (
              <button
                key={v}
                onClick={() => u('periodo', v)}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${sel ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-soft hover:bg-bg-soft'}`}
              >
                {l}
                {desc > 0 && <span className="block text-xs text-emerald-600">-{desc}%</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
