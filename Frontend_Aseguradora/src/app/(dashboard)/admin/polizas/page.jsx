import { MdDescription, MdFilterList, MdSearch } from 'react-icons/md';

export default function PolizasAdminPage() {
  const polizas = [
    { id: 'POL-2026-9910', ramo: 'Salud', cliente: 'Andrea Silva', inicio: '15/01/2026', fin: '15/01/2027', prima: 1200.00, estado: 'Activa' },
    { id: 'POL-2026-9911', ramo: 'Auto', cliente: 'Roberto Gómez', inicio: '10/02/2026', fin: '10/02/2027', prima: 850.50, estado: 'Activa' },
    { id: 'POL-2026-9912', ramo: 'Empresarial', cliente: 'Logistics SAC', inicio: '01/01/2026', fin: '01/01/2027', prima: 5400.00, estado: 'Por Vencer' },
    { id: 'POL-2026-9914', ramo: 'Vida', cliente: 'Sofía Castro', inicio: '20/03/2026', fin: '20/03/2027', prima: 1100.20, estado: 'Suspendida' },
    { id: 'POL-2026-9915', ramo: 'Mascotas', cliente: 'Miriam Ruiz', inicio: '05/04/2026', fin: '05/04/2027', prima: 350.00, estado: 'Activa' },
  ];

  return (
    <div className="py-6 fade-up">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">Supervisión de Pólizas</h1>
          <p className="text-xs text-text-soft">Control administrativo de la cartera de Serena Seguros</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
            <input type="text" placeholder="Buscar por número o cliente..." className="pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-xs w-64 shadow-sm focus:border-primary outline-none" />
          </div>
          <button className="p-2 bg-white border border-border rounded-xl text-text-soft hover:text-primary transition-all"><MdFilterList size={20} /></button>
        </div>
      </header>

      <div className="card bg-white overflow-hidden shadow-sm border border-border/50">
        <table className="w-full text-left">
          <thead className="bg-bg-soft/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">ID Póliza / Ramo</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Titular</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Vigencia</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase text-right">Prima (S/)</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {polizas.map((p, i) => (
              <tr key={i} className="hover:bg-bg-soft/20 transition-colors group cursor-pointer">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <MdDescription className="text-primary/40 group-hover:text-primary" size={20} />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text">{p.id}</span>
                      <span className="text-[9px] text-primary font-bold uppercase tracking-wider">{p.ramo}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-text-soft">{p.cliente}</td>
                <td className="px-6 py-4 text-[11px] text-text-soft font-medium">
                  {p.inicio} - {p.fin}
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-text">
                  {p.prima.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-[9px] font-bold px-2 py-1 rounded-md border
                    ${p.estado === 'Activa' ? 'bg-green-50 text-green-600 border-green-100' : 
                      p.estado === 'Por Vencer' ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                      'bg-red-50 text-red-600 border-red-100'}`}>
                    ● {p.estado.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}