import { COBERTURAS, DEDUCIBLE_OPTS, EXTRAS, TIPOS } from './data';
import { MdShield, MdCheck, MdRefresh } from 'react-icons/md';

export default function StepCotizacion({ data, onRecalcular }) {
  const opts = COBERTURAS[data.tipo] || [];
  const cob = data.cobertura || {};
  const planObj = opts.find((o) => o.id === cob.plan) || opts[0];
  const dedObj = DEDUCIBLE_OPTS.find((d) => d.val === cob.deducible) || DEDUCIBLE_OPTS[0];
  const extras = (cob.extras || []).map((id) => EXTRAS.find((e) => e.id === id)).filter(Boolean);
  const extraTotal = extras.reduce((s, e) => s + e.precio, 0);
  const basePrecio = planObj?.precio || 0;
  const descDed = dedObj.descuento;
  const descPer = cob.periodo === 'anual' ? 10 : cob.periodo === 'semestral' ? 5 : 0;
  const subtotal = basePrecio + extraTotal;
  const descuento = Math.round((subtotal * (descDed + descPer)) / 100);
  const total = subtotal - descuento;
  const tipoLabel = TIPOS.find((t) => t.id === data.tipo)?.label || '';

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-text-soft">
        Aquí tienes tu cotización personalizada. Puedes ajustar parámetros y recalcular.
      </p>
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Seguro de {tipoLabel}</p>
            <p className="text-2xl font-bold text-text mt-0.5">
              S/ {total}
              <span className="text-sm font-normal text-text-soft">/mes</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <MdShield size={24} className="text-text-inverse" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pt-3 border-t border-primary/20 text-sm">
          <div className="flex justify-between text-text-soft">
            <span>Plan {planObj?.label}</span>
            <span className="font-medium text-text">S/ {basePrecio}</span>
          </div>
          {extras.map((e) => (
            <div key={e.id} className="flex justify-between text-text-soft">
              <span>{e.label}</span>
              <span className="font-medium text-text">+S/ {e.precio}</span>
            </div>
          ))}
          {descuento > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Descuentos aplicados</span>
              <span className="font-medium">-S/ {descuento}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-text pt-1 border-t border-primary/20">
            <span>Total mensual</span>
            <span>S/ {total}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">Coberturas incluidas</p>
        <ul className="flex flex-col gap-1.5">
          {(planObj?.desc || '').split('+').map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-soft">
              <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
              {c.trim()}
            </li>
          ))}
          {extras.map((e) => (
            <li key={e.id} className="flex items-start gap-2 text-sm text-text-soft">
              <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
              {e.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          ['Deducible', dedObj.label],
          ['Pago', cob.periodo === 'anual' ? 'Anual' : cob.periodo === 'semestral' ? 'Semestral' : 'Mensual'],
          ['Vigencia', '12 meses'],
          ['Inicio', 'Al contratar'],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg-soft rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-text-soft">{k}</span>
            <span className="font-semibold text-text">{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onRecalcular}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-text-soft hover:bg-bg-soft hover:text-text transition-colors"
      >
        <MdRefresh size={16} /> Recalcular cotización
      </button>
    </div>
  );
}
