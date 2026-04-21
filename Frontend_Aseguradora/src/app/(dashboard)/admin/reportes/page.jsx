"use client";
import {
  MdArrowDownward,
  MdArrowUpward,
  MdBarChart,
  MdEventNote,
  MdFileDownload,
  MdPieChart,
  MdShowChart,
  MdTrendingUp
} from 'react-icons/md';

export default function ReportesPage() {
  const kpis = [
    { label: 'Ingresos Mensuales', value: 'S/ 45,280', change: '+12.5%', isUp: true, icon: MdTrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pólizas Emitidas', value: '1,240', change: '+5.2%', isUp: true, icon: MdBarChart, color: 'text-primary', bg: 'bg-primary/10' },
    { label: 'Siniestros Reportados', value: '18', change: '-2.4%', isUp: false, icon: MdShowChart, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  // Datos de barras con clases de altura fijas de Tailwind para asegurar visibilidad
  const weeklySales = [
    { day: 'Lun', height: 'h-[40%]', value: '4.2k' },
    { day: 'Mar', height: 'h-[65%]', value: '6.8k' },
    { day: 'Mié', height: 'h-[50%]', value: '5.1k' },
    { day: 'Jue', height: 'h-[90%]', value: '9.4k' },
    { day: 'Vie', height: 'h-[75%]', value: '7.9k' },
    { day: 'Sáb', height: 'h-[30%]', value: '3.1k' },
    { day: 'Dom', height: 'h-[20%]', value: '2.0k' },
  ];

  const distribution = [
    { label: 'Seguros de Salud', percentage: 42, color: 'bg-primary' },
    { label: 'Seguros de Auto', percentage: 28, color: 'bg-purple-500' },
    { label: 'Seguros de Vida', percentage: 15, color: 'bg-amber-500' },
    { label: 'Otros', percentage: 15, color: 'bg-slate-400' },
  ];

  return (
    <div className="py-6 fade-up">
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">Análisis y Métricas</h1>
          <p className="text-xs text-text-soft">Rendimiento estratégico • Abril 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-[11px] font-bold text-text-soft hover:bg-bg-soft shadow-sm">
            <MdEventNote size={16} /> Últimos 30 días
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[11px] font-bold shadow-md hover:bg-primary-hover transition-all">
            <MdFileDownload size={16} /> Exportar PDF
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {kpis.map((kpi, i) => (
          <div key={i} className="card p-5 bg-white border border-border/50 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                <kpi.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold ${kpi.isUp ? 'text-green-600' : 'text-rose-600'}`}>
                {kpi.isUp ? <MdArrowUpward /> : <MdArrowDownward />} {kpi.change}
              </div>
            </div>
            <p className="text-[10px] font-bold text-text-soft uppercase tracking-wider">{kpi.label}</p>
            <h2 className="text-2xl font-bold text-text mt-1">{kpi.value}</h2>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GRÁFICA DE BARRAS CORREGIDA */}
<div className="card p-6 bg-white border border-border/50">
  <h3 className="text-sm font-bold text-text mb-8 flex items-center gap-2">
    <MdBarChart className="text-primary" size={18} /> Ventas Semanales (S/)
  </h3>
  
  {/* Contenedor con altura fija para que los % funcionen */}
  <div className="relative h-64 w-full flex items-end justify-between px-2 pb-2 border-b border-border/50">
    {weeklySales.map((item, i) => (
      <div key={i} className="flex flex-col items-center gap-2 w-full group h-full justify-end">
        
        {/* Tooltip */}
        <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-text text-white text-[9px] py-1 px-2 rounded mb-1 shadow-xl">
          S/ {item.value}
        </span>

        {/* La Barra - Ahora con altura relativa al contenedor h-64 */}
        <div 
          className={`w-8 sm:w-10 bg-primary/20 border-t-2 border-primary rounded-t-md group-hover:bg-primary/40 transition-all cursor-pointer relative shadow-sm ${item.height}`}
        >
          {/* Efecto de degradado interno */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
        </div>

        {/* Etiqueta del día */}
        <span className="text-[10px] font-bold text-text-soft uppercase mt-2">
          {item.day}
        </span>
      </div>
    ))}
  </div>
</div>

        {/* DISTRIBUCIÓN POR RAMO */}
        <div className="card p-6 bg-white border border-border/50">
          <h3 className="text-sm font-bold text-text mb-6 flex items-center gap-2">
            <MdPieChart className="text-purple-500" size={18} /> Distribución de Cartera
          </h3>
          <div className="space-y-5">
            {distribution.map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight">
                  <span className="text-text-soft">{item.label}</span>
                  <span className="text-text">{item.percentage}%</span>
                </div>
                <div className="h-2.5 w-full bg-bg-soft rounded-full overflow-hidden border border-border/10 shadow-inner">
                  <div 
                    className={`h-full ${item.color} shadow-[0_0_8px_rgba(0,0,0,0.05)]`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 bg-gradient-pastel rounded-xl border border-primary/10 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm border border-primary/5">
              <MdTrendingUp size={20} />
            </div>
            <p className="text-[10px] text-text-soft leading-snug">
              Análisis: El sector <span className="font-bold text-text">Salud</span> mantiene la mayor participación, seguido por un repunte en el ramo automotriz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}