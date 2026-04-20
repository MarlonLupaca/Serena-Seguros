import React from 'react';
import { 
  MdAdd, MdSearch, MdMoreVert, MdHealthAndSafety, 
  MdDirectionsCar, MdHomeWork, MdCheckCircle, MdWarning,
  MdAutorenew, MdCancel, MdFilterList
} from 'react-icons/md';

export default function GestionPolizasPage() {
  const kpis = [
    { label: 'Total Activas', value: '1,245', icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
    { label: 'Próximas a Vencer', value: '34', icon: MdWarning, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Nuevas este Mes', value: '128', icon: MdAdd, color: 'text-blue-600', bg: 'bg-blue-500/10' },
  ];

  const polizas = [
    { id: 'POL-9910', cliente: 'Andrea Silva', tipo: 'Salud', vencimiento: '10/12/2026', estado: 'Activa', prima: '$1,200', icon: MdHealthAndSafety },
    { id: 'POL-9911', cliente: 'Roberto Gómez', tipo: 'Vehicular', vencimiento: '05/08/2026', estado: 'Activa', prima: '$850', icon: MdDirectionsCar },
    { id: 'POL-9912', cliente: 'Constructora Beta', tipo: 'Empresarial', vencimiento: '19/04/2026', estado: 'Por Vencer', prima: '$5,400', icon: MdHomeWork },
    { id: 'POL-9913', cliente: 'Luis Mendoza', tipo: 'Vehicular', vencimiento: '22/05/2026', estado: 'Activa', prima: '$900', icon: MdDirectionsCar },
    { id: 'POL-9914', cliente: 'Sofía Castro', tipo: 'Salud', vencimiento: '01/03/2026', estado: 'Suspendida', prima: '$1,100', icon: MdHealthAndSafety },
  ];

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Gestión de Pólizas</h1>
          <p className="text-[11px] text-text-soft">Administración integral del portafolio.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={16} />
            <input type="text" placeholder="Buscar por DNI o N° Póliza..." className="pl-9 pr-3 py-1.5 bg-bg-soft border border-border rounded-lg text-xs focus:outline-none focus:border-primary transition-colors w-full md:w-64" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-bg border border-border rounded-lg text-xs font-semibold hover:bg-bg-soft transition-colors shadow-sm">
            <MdFilterList size={16} />
            Filtrar
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm">
            <MdAdd size={16} />
            Nueva Póliza
          </button>
        </div>
      </div>

      {/* KPIs SUPERIORES */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className="bg-bg border border-border rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${kpi.bg}`}>
                <Icon size={20} className={kpi.color} />
              </div>
              <div>
                <p className="text-[11px] text-text-soft font-medium uppercase tracking-wide">{kpi.label}</p>
                <h3 className="text-xl font-bold text-text leading-tight">{kpi.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* TABLA DENSA DE PÓLIZAS */}
      <div className="bg-bg border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-soft/50 border-b border-border text-[11px] text-text-soft uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">N° Póliza</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Cliente</th>
                <th className="px-4 py-3 font-semibold">Prima</th>
                <th className="px-4 py-3 font-semibold">Vencimiento</th>
                <th className="px-4 py-3 font-semibold">Estado</th>
                <th className="px-4 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-sm">
              {polizas.map((poliza) => {
                const Icon = poliza.icon;
                return (
                  <tr key={poliza.id} className="hover:bg-bg-soft/30 transition-colors">
                    <td className="px-4 py-3 font-bold text-text">{poliza.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="text-primary text-lg" />
                        <span className="text-xs font-medium">{poliza.tipo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-text">{poliza.cliente}</td>
                    <td className="px-4 py-3 text-text-soft text-xs">{poliza.prima}/año</td>
                    <td className="px-4 py-3 text-text-soft text-xs">{poliza.vencimiento}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
                        ${poliza.estado === 'Activa' ? 'bg-green-500/10 text-green-600' : 
                          poliza.estado === 'Por Vencer' ? 'bg-orange-500/10 text-orange-600' : 
                          'bg-red-500/10 text-red-600'}`}>
                        {poliza.estado}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-1">
                       <button className="p-1.5 text-text-soft hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Renovar">
                         <MdAutorenew size={16} />
                       </button>
                       <button className="p-1.5 text-text-soft hover:text-red-500 hover:bg-red-500/10 rounded transition-colors" title="Suspender">
                         <MdCancel size={16} />
                       </button>
                       <button className="p-1.5 text-text-soft hover:text-text hover:bg-border rounded transition-colors" title="Más opciones">
                         <MdMoreVert size={16} />
                       </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border flex justify-between items-center text-xs text-text-soft bg-bg-soft/30">
           <span>Mostrando 5 de 1,245 pólizas</span>
           <div className="flex gap-1">
             <button className="px-2 py-1 rounded border border-border hover:bg-bg transition-colors disabled:opacity-50" disabled>Anterior</button>
             <button className="px-2 py-1 rounded border border-border hover:bg-bg transition-colors">Siguiente</button>
           </div>
        </div>
      </div>
    </div>
  );
}
