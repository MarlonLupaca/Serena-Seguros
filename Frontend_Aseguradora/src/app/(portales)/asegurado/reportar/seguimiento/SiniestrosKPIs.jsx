import { MdWarning } from 'react-icons/md';

export default function SiniestrosKPIs({ counts }) {
  const kpis = [
    { label: 'Total casos', val: counts.total, color: 'text-text' },
    { label: 'En curso', val: counts.activos, color: 'text-amber-600' },
    { label: 'Aprobados', val: counts.aprobados, color: 'text-emerald-600' },
    { label: 'Rechazados', val: counts.rechazados, color: 'text-rose-500' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {kpis.map((k) => (
        <div key={k.label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MdWarning size={17} className="text-primary" />
          </div>
          <div>
            <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.val}</p>
            <p className="text-xs text-text-soft">{k.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
