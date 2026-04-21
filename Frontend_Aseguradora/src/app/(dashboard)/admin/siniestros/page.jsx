import { MdCheckCircleOutline, MdGavel, MdOutlineAccessTime, MdWarning } from 'react-icons/md';

export default function SiniestrosAdminPage() {
  const siniestros = [
    { id: 'SIN-001', type: 'Seguro de Auto', client: 'Roberto Gómez', date: 'Ayer, 14:30', severity: 'Alta', status: 'Abierto' },
    { id: 'SIN-002', type: 'Seguro de Salud', client: 'Andrea Silva', date: 'Hace 3 días', severity: 'Media', status: 'Evaluación' },
    { id: 'SIN-003', type: 'Seguro de Hogar', client: 'Constructora Beta', date: 'Hace 1 semana', severity: 'Baja', status: 'Cerrado' },
  ];

  return (
    <div className="py-6 fade-up">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-text">Registro de Siniestros</h1>
        <p className="text-xs text-text-soft">Gestión de incidentes y asignación de ajustadores</p>
      </header>

      <div className="grid grid-cols-1 gap-4">
        {siniestros.map((s, i) => (
          <div key={i} className="card p-5 bg-white border border-border/50 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${s.status === 'Abierto' ? 'bg-red-50 text-red-600' : 'bg-bg-soft text-text-soft'}`}>
                <MdWarning size={28} className={s.severity === 'Alta' ? 'animate-pulse' : ''} />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-bold text-text">{s.id} — {s.type}</h3>
                <p className="text-[11px] text-text-soft font-medium">{s.client} • Reportado: {s.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="text-center">
                <p className="text-[9px] font-bold text-text-soft uppercase tracking-widest mb-1">Severidad</p>
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border
                  ${s.severity === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                  {s.severity.toUpperCase()}
                </span>
              </div>

              <div className="text-center">
                <p className="text-[9px] font-bold text-text-soft uppercase tracking-widest mb-1">Estado Actual</p>
                <div className="flex items-center gap-1.5 text-xs font-bold text-text">
                   {s.status === 'Cerrado' ? <MdCheckCircleOutline className="text-green-500" /> : <MdOutlineAccessTime className="text-primary" />}
                   {s.status}
                </div>
              </div>

              <button className="px-4 py-2 bg-bg-soft hover:bg-primary/10 text-primary font-bold text-[11px] rounded-xl border border-border transition-all flex items-center gap-2">
                <MdGavel size={16} /> GESTIONAR
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}