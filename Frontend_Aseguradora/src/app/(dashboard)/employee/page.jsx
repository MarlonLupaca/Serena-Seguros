"use client";

import React, { useState } from 'react';
import { 
  MdRequestQuote, MdWarning, MdDescription, MdFolder, 
  MdAccessTime, MdAddCircle, MdPeople, MdMoreVert,
  MdDateRange, MdPieChartOutline, MdShowChart,
  MdAttachMoney, MdPersonAdd, MdOutlineAssignment,
  MdHistory, MdDirectionsCar, MdHealthAndSafety, MdHomeWork
} from 'react-icons/md';
import Link from 'next/link';

export default function EmployeeDashboard() {
  const [taskTab, setTaskTab] = useState('Todas');

  const metrics = [
    { label: 'Solicitudes', value: '24', icon: MdRequestQuote, color: 'text-blue-600', bg: 'bg-blue-500/10', trend: '+12%' },
    { label: 'Siniestros', value: '7', icon: MdWarning, color: 'text-orange-500', bg: 'bg-orange-500/10', trend: '-2' },
    { label: 'Pólizas', value: '1.2k', icon: MdDescription, color: 'text-primary', bg: 'bg-primary/10', trend: '+5%' },
    { label: 'Documentos', value: '12', icon: MdFolder, color: 'text-purple-600', bg: 'bg-purple-500/10', trend: '+3' },
    { label: 'Nuevos Clientes', value: '15', icon: MdPersonAdd, color: 'text-green-600', bg: 'bg-green-500/10', trend: '+8%' },
    { label: 'Pagos Pend.', value: '4', icon: MdAttachMoney, color: 'text-red-500', bg: 'bg-red-500/10', trend: '-1' },
  ];

  const pendingTasks = [
    { id: 1, type: 'Cotización', title: 'Vehicular Premium', client: 'J. Pérez', time: '10 min', status: 'Urgente' },
    { id: 2, type: 'Siniestro', title: 'Choque Av. Javier P.', client: 'M. López', time: '1h', status: 'Pendiente' },
    { id: 3, type: 'Documento', title: 'DNI y Propiedad', client: 'C. Sánchez', time: '2h', status: 'Revisión' },
    { id: 4, type: 'Cotización', title: 'Salud Familiar', client: 'A. Gomez', time: '3h', status: 'Normal' },
    { id: 5, type: 'Renovación', title: 'Empresarial Oro', client: 'Constructora Beta', time: 'Hoy 16:00', status: 'Urgente' },
  ];

  const filteredTasks = pendingTasks.filter(task => {
    if (taskTab === 'Todas') return true;
    if (taskTab === 'Urgentes') return task.status === 'Urgente';
    if (taskTab === 'Hoy') return task.time.includes('min') || task.time.includes('h') || task.time.includes('Hoy');
    return true;
  });

  const recentActivity = [
    { id: 1, action: 'Póliza Vehicular Aprobada', user: 'Ana M.', time: 'Hace 5 min', type: 'success' },
    { id: 2, action: 'Documento Rechazado (DNI Ilegible)', user: 'Carlos T.', time: 'Hace 15 min', type: 'error' },
    { id: 3, action: 'Nuevo Siniestro Reportado', user: 'Sistema', time: 'Hace 30 min', type: 'warning' },
    { id: 4, action: 'Cotización Enviada', user: 'Luis G.', time: 'Hace 1h', type: 'info' },
  ];

  const policyDistribution = [
    { label: 'Vehicular', value: 55, color: 'bg-blue-500', icon: MdDirectionsCar },
    { label: 'Salud', value: 30, color: 'bg-green-500', icon: MdHealthAndSafety },
    { label: 'Empresarial', value: 15, color: 'bg-purple-500', icon: MdHomeWork },
  ];

  return (
    <div className="py-2 flex flex-col gap-4 pb-8">
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Panel de Control</h1>
          <p className="text-[11px] text-text-soft">Resumen operativo y tareas de hoy.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1.5 bg-bg border border-border rounded-lg text-xs font-semibold text-text hover:bg-bg-soft transition-all flex items-center gap-1 shadow-sm">
            <MdDateRange size={16} /> Hoy
          </button>
          <Link href="/employee/solicitudes" className="px-3 py-1.5 bg-bg border border-border rounded-lg text-xs font-semibold text-text hover:bg-bg-soft transition-all flex items-center gap-1 shadow-sm">
            <MdRequestQuote size={16} /> Cotizar
          </Link>
          <button className="px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-semibold hover:bg-primary-hover transition-all flex items-center gap-1 shadow-sm">
            <MdAddCircle size={16} /> Nuevo Siniestro
          </button>
        </div>
      </div>

      {/* MÉTRICAS (6 ITEMS, MUY COMPACTO) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-bg border border-border rounded-xl p-3 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${metric.bg}`}>
                  <Icon className={`text-lg ${metric.color}`} />
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${metric.trend.includes('-') ? 'bg-red-500/10 text-red-600' : 'bg-green-500/10 text-green-600'}`}>
                  {metric.trend}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-text leading-none">{metric.value}</h3>
                <p className="text-[10px] text-text-soft font-medium mt-1 truncate">{metric.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* SECCIÓN PRINCIPAL: 2 COLUMNAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* TAREAS (COLUMNA IZQUIERDA - 2/3) */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          
          {/* PANEL DE TAREAS CON PESTAÑAS */}
          <div className="bg-bg border border-border rounded-xl shadow-sm flex flex-col h-full">
            <div className="p-3 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-bg-soft/50 rounded-t-xl">
              <h2 className="text-sm font-bold text-text flex items-center gap-2"><MdOutlineAssignment className="text-primary"/> Tareas Operativas</h2>
              <div className="flex bg-bg border border-border rounded-lg p-0.5">
                {['Todas', 'Urgentes', 'Hoy'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setTaskTab(tab)}
                    className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${taskTab === tab ? 'bg-primary text-white shadow-sm' : 'text-text-soft hover:text-text'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col flex-1 overflow-y-auto max-h-[300px]">
              {filteredTasks.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-soft">No hay tareas para esta vista.</div>
              ) : (
                filteredTasks.map((task, i) => (
                  <div key={task.id} className={`flex items-center justify-between px-4 py-2 hover:bg-bg-soft transition-colors text-sm ${i !== filteredTasks.length -1 ? 'border-b border-border/50' : ''}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'Urgente' ? 'bg-red-500' : task.status === 'Pendiente' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-text truncate text-xs">{task.title}</span>
                        <span className="text-[10px] text-text-soft flex items-center gap-1 mt-0.5 truncate"><MdPeople size={12}/> {task.client} • {task.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] text-text-soft">{task.time}</span>
                      <button className="text-text-soft hover:text-primary"><MdMoreVert size={16}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* FLUJO FINANCIERO COMPACTO */}
          <div className="bg-bg border border-border rounded-xl shadow-sm">
             <div className="p-3 border-b border-border flex justify-between items-center bg-bg-soft/50 rounded-t-xl">
                <h2 className="text-sm font-bold text-text flex items-center gap-2"><MdPieChartOutline className="text-primary"/> Flujo Diario</h2>
                <span className="text-[10px] text-green-600 bg-green-500/10 px-2 py-0.5 rounded font-bold">+15% vs Ayer</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-border p-3 text-center">
                 <div>
                    <p className="text-[10px] text-text-soft font-bold uppercase mb-0.5">Ingresos</p>
                    <p className="text-lg font-bold text-green-600">$12.4k</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-text-soft font-bold uppercase mb-0.5">Pendiente</p>
                    <p className="text-lg font-bold text-orange-500">$3.2k</p>
                 </div>
                 <div>
                    <p className="text-[10px] text-text-soft font-bold uppercase mb-0.5">Reembolsos</p>
                    <p className="text-lg font-bold text-blue-600">$850</p>
                 </div>
              </div>
          </div>

        </div>

        {/* REPORTES (COLUMNA DERECHA - 1/3) */}
        <div className="flex flex-col gap-4">
          
          {/* DISTRIBUCIÓN DE PÓLIZAS */}
          <div className="bg-bg border border-border rounded-xl shadow-sm p-4">
            <h2 className="text-sm font-bold text-text flex items-center gap-2 mb-4"><MdShowChart className="text-primary"/> Portafolio Activo</h2>
            <div className="flex flex-col gap-3">
              {policyDistribution.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded bg-bg-soft flex items-center justify-center text-text-soft`}>
                      <Icon size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="font-semibold text-text">{item.label}</span>
                        <span className="font-bold text-text">{item.value}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* ACTIVIDAD RECIENTE (TIMELINE) */}
          <div className="bg-bg border border-border rounded-xl shadow-sm flex flex-col flex-1">
             <div className="p-3 border-b border-border bg-bg-soft/50 rounded-t-xl">
               <h2 className="text-sm font-bold text-text flex items-center gap-2"><MdHistory className="text-primary"/> Actividad Reciente</h2>
             </div>
             <div className="p-4 flex flex-col gap-4 flex-1">
                {recentActivity.map((act, i) => (
                  <div key={act.id} className="flex gap-3 relative">
                    {/* Linea conectora */}
                    {i !== recentActivity.length - 1 && (
                      <div className="absolute left-[11px] top-6 bottom-[-16px] w-[2px] bg-border"></div>
                    )}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 border-2 border-bg
                      ${act.type === 'success' ? 'bg-green-500' : 
                        act.type === 'error' ? 'bg-red-500' : 
                        act.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-text leading-tight">{act.action}</span>
                      <span className="text-[10px] text-text-soft mt-0.5">{act.user} • {act.time}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
