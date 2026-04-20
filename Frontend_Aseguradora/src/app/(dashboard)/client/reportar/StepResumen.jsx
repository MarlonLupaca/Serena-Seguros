import { MdWarning } from 'react-icons/md';
import { POLIZAS, TIPOS } from './data';

export default function StepResumen({ data }) {
  const pol = POLIZAS.find((p) => p.id === data.poliza);
  const tip = TIPOS.find((t) => t.id === data.tipo);
  const PolIcon = pol?.icon;
  const TipIcon = tip?.icon;
  const rows = [
    { label: 'Póliza', value: pol?.label },
    { label: 'Número', value: pol?.id, small: true },
    { label: 'Fecha y hora', value: `${data.fecha} · ${data.hora}` },
    { label: 'Lugar', value: data.lugar },
    { label: 'Descripción', value: data.desc.length > 80 ? data.desc.slice(0, 80) + '…' : data.desc, muted: true },
    ...(data.personas ? [{ label: 'Involucrados', value: data.personas }] : []),
    {
      label: 'Archivos adjuntos',
      value: data.files.length ? `${data.files.length} archivo${data.files.length > 1 ? 's' : ''}` : 'Ninguno',
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          {pol && PolIcon && (
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${pol.accentBg}`}>
              <PolIcon size={20} className={pol.accentText} />
            </div>
          )}
          <div className="flex-1">
            <p className="text-sm font-bold text-text">{pol?.label}</p>
            <p className="text-xs text-text-soft">{pol?.id}</p>
          </div>
          {tip && TipIcon && (
            <span
              className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${tip.accentBg} ${tip.accentText}`}
            >
              <TipIcon size={13} /> {tip.label}
            </span>
          )}
        </div>
        <div className="divide-y divide-border">
          {rows.map(({ label, value, small, muted }) => (
            <div key={label} className="flex items-start justify-between px-4 py-3 gap-4">
              <p className="text-xs text-text-soft shrink-0">{label}</p>
              <p
                className={`text-right ${small ? 'text-xs' : 'text-sm'} ${muted ? 'text-text-soft' : 'font-medium text-text'}`}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/15">
        <MdWarning size={16} className="text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-primary mb-0.5">¿Todo correcto?</p>
          <p className="text-xs text-primary/80">
            Una vez enviado, se generará tu número de caso. Podrás adjuntar más documentos luego desde la sección Mis
            pólizas.
          </p>
        </div>
      </div>
    </div>
  );
}
