'use client';

import { getCampos } from '@/lib/riesgo/camposPorTipo';

export default function FormularioRiesgo({ tipoSeguro, valores, onChange }) {
  const campos = getCampos(tipoSeguro);
  if (!campos.length) {
    return (
      <p className="text-xs text-text-soft">
        No hay datos de riesgo configurados para este tipo de seguro.
      </p>
    );
  }

  const setValor = (name, value) => onChange({ ...valores, [name]: value });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {campos.map((campo) => (
        <div
          key={campo.name}
          className={campo.type === 'textarea' ? 'md:col-span-2' : ''}
        >
          <label className="text-xs font-medium text-text-soft block mb-1.5">
            {campo.label}
            {campo.required ? ' *' : ''}
          </label>
          {campo.type === 'select' ? (
            <select
              value={valores[campo.name] ?? ''}
              onChange={(e) => setValor(campo.name, e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
            >
              <option value="">Selecciona...</option>
              {campo.options.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : campo.type === 'boolean' ? (
            <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-border bg-bg text-sm text-text cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(valores[campo.name])}
                onChange={(e) => setValor(campo.name, e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
              />
              {campo.label}
            </label>
          ) : campo.type === 'textarea' ? (
            <textarea
              value={valores[campo.name] ?? ''}
              onChange={(e) => setValor(campo.name, e.target.value)}
              placeholder={campo.placeholder}
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none resize-y"
            />
          ) : (
            <input
              type={campo.type === 'number' ? 'number' : 'text'}
              value={valores[campo.name] ?? ''}
              onChange={(e) =>
                setValor(
                  campo.name,
                  campo.type === 'number' ? (e.target.value === '' ? '' : Number(e.target.value)) : e.target.value
                )
              }
              placeholder={campo.placeholder}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}
