"use client";
import React, { useState } from 'react';
import { 
  MdWarning, MdSearch, MdFilterList, MdDirectionsCar, 
  MdHealthAndSafety, MdHomeWork, MdChevronRight,
  MdCheckCircle, MdAssignment, MdAccessTime, MdPerson
} from 'react-icons/md';

export default function SiniestrosPage() {
  const [activeTab, setActiveTab] = useState('Todos');

  const stats = [
    { label: 'Abiertos', value: '18', icon: MdWarning, color: 'text-red-500', bg: 'bg-red-500/10' },
    { label: 'En Evaluación', value: '45', icon: MdAccessTime, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Cerrados (Mes)', value: '112', icon: MdCheckCircle, color: 'text-green-600', bg: 'bg-green-500/10' },
  ];

  const siniestros = [
    { id: 'SIN-2026-001', poliza: 'POL-9911', cliente: 'Roberto Gómez', tipo: 'Vehicular', fecha: '19/04/2026', estado: 'Abierto', severidad: 'Alta', ajustador: 'Sin asignar', icon: MdDirectionsCar },
    { id: 'SIN-2026-002', poliza: 'POL-9910', cliente: 'Andrea Silva', tipo: 'Salud', fecha: '18/04/2026', estado: 'En Evaluación', severidad: 'Media', ajustador: 'Dr. Mendoza', icon: MdHealthAndSafety },
    { id: 'SIN-2026-003', poliza: 'POL-9912', cliente: 'Constructora Beta', tipo: 'Empresarial', fecha: '15/04/2026', estado: 'Cerrado', severidad: 'Baja', ajustador: 'Ing. Castro', icon: MdHomeWork },
    { id: 'SIN-2026-004', poliza: 'POL-9915', cliente: 'Luis Torres', tipo: 'Vehicular', fecha: '20/04/2026', estado: 'Abierto', severidad: 'Alta', ajustador: 'A. Romero', icon: MdDirectionsCar },
    { id: 'SIN-2026-005', poliza: 'POL-9916', cliente: 'Farmacia Sol', tipo: 'Empresarial', fecha: '12/04/2026', estado: 'En Evaluación', severidad: 'Alta', ajustador: 'Ing. Castro', icon: MdHomeWork },
  ];

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Abierto': return 'bg-red-500/10 text-red-600';
      case 'En Evaluación': return 'bg-orange-500/10 text-orange-600';
      case 'Cerrado': return 'bg-green-500/10 text-green-600';
      default: return 'bg-bg-soft text-text-soft';
    }
  };

  const getSeverityColor = (severidad) => {
    switch (severidad) {
      case 'Alta': return 'bg-red-500';
      case 'Media': return 'bg-orange-500';
      case 'Baja': return 'bg-blue-500';
      default: return 'bg-border';
    }
  };

  const filteredSiniestros = siniestros.filter(s => {
    if (activeTab === 'Todos') return true;
    return s.estado === activeTab;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Registro de Siniestros</h1>
          <p className="text-[11px] text-text-soft">Seguimiento y asignación de ajustadores.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={16} />
            <input type="text" placeholder="N° Siniestro o Póliza..." className="pl-9 pr-3 py-1.5 bg-bg border border-border rounded-lg text-xs focus:outline-none focus:border-primary transition-colors w-full md:w-64 shadow-sm" />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-colors shadow-sm">
            <MdAssignment size={16} />
            Nuevo Reporte
          </button>
        </div>
      </div>

      {/* MÉTRICAS DE ESTADO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-bg border border-border rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon size={20} className={stat.color} />
                </div>
                <h3 className="text-xl font-bold text-text leading-tight">{stat.value}</h3>
              </div>
              <p className="text-[11px] text-text-soft font-medium uppercase tracking-wide text-right">{stat.label}</p>
            </div>
          )
        })}
      </div>

      {/* TABLA / LISTA DE SEGUIMIENTO */}
      <div className="bg-bg border border-border rounded-xl shadow-sm flex flex-col">
        {/* PESTAÑAS Y FILTROS */}
        <div className="p-3 border-b border-border bg-bg-soft/50 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex bg-bg border border-border rounded-lg p-0.5">
            {['Todos', 'Abierto', 'En Evaluación', 'Cerrado'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1 text-[11px] font-semibold rounded-md transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-text-soft hover:text-text'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-bg border border-border rounded-lg text-xs font-semibold text-text-soft hover:bg-bg-soft hover:text-text transition-colors shadow-sm">
            <MdFilterList size={16} />
            Filtros
          </button>
        </div>

        {/* LISTA COMPACTA */}
        <div className="flex flex-col divide-y divide-border/50">
          {filteredSiniestros.length === 0 ? (
            <div className="p-8 text-center text-sm text-text-soft">No hay siniestros que coincidan con este filtro.</div>
          ) : (
            filteredSiniestros.map((siniestro) => {
              const Icon = siniestro.icon;
              return (
                <div key={siniestro.id} className="p-4 hover:bg-bg-soft/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer">
                  
                  {/* Info Principal */}
                  <div className="flex items-center gap-4 md:w-1/3">
                    <div className="w-10 h-10 rounded-xl bg-bg-soft flex items-center justify-center text-text-soft shrink-0">
                      <Icon size={20} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-text truncate">{siniestro.id}</h3>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${getStatusBadge(siniestro.estado)}`}>
                          {siniestro.estado}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-text-soft border-r border-border pr-2">{siniestro.poliza}</span>
                        <span className="text-[11px] text-text-soft truncate">{siniestro.cliente}</span>
                      </div>
                    </div>
                  </div>

                  {/* Severidad y Asignación */}
                  <div className="flex flex-col gap-1 md:w-1/4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getSeverityColor(siniestro.severidad)}`}></div>
                      <span className="text-[11px] font-medium text-text">Severidad: {siniestro.severidad}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-text-soft">
                      <MdPerson size={14} className={siniestro.ajustador === 'Sin asignar' ? 'text-orange-500' : 'text-text-soft'}/>
                      <span className={siniestro.ajustador === 'Sin asignar' ? 'text-orange-500 font-semibold' : ''}>
                        {siniestro.ajustador}
                      </span>
                    </div>
                  </div>

                  {/* Fecha y Acción */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-1/5">
                    <span className="text-[11px] text-text-soft">Ingresado: {siniestro.fecha}</span>
                  </div>

                  <div className="hidden md:flex text-text-soft group-hover:text-primary transition-colors pl-2">
                    <MdChevronRight size={24} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
