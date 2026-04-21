import {
  MdBarChart,
  MdDescription,
  MdHistory,
  MdPayments,
  MdPendingActions,
  MdPeople,
  MdStar,
  MdTimer,
  MdWarning
} from 'react-icons/md';

export default function AdminDashboard() {
  const stats = [
    { label: 'Pólizas Activas', value: '1,245', icon: MdDescription, color: 'text-primary' },
    { label: 'Siniestros Pendientes', value: '45', icon: MdWarning, color: 'text-orange-500' },
    { label: 'Usuarios Totales', value: '4,521', icon: MdPeople, color: 'text-accent' },
    { label: 'Recaudación Mes', value: 'S/ 45,800', icon: MdPayments, color: 'text-green-600' },
  ];

  const extraKPIs = [
    { label: 'Tiempo Prom. Atención', value: '1.2 días', icon: MdTimer, color: 'text-blue-500' },
    { label: 'Satisfacción Cliente', value: '4.8/5', icon: MdStar, color: 'text-yellow-500' },
  ];

  const pendingRequests = [
    { id: 'SOL-882', user: 'Luis Alatta', type: 'Seguro de Auto', date: 'Hace 10 min', status: 'Pendiente' },
    { id: 'SOL-745', user: 'Marlon Lupaca', type: 'Seguro de Salud', date: 'Hace 1 hora', status: 'En Revisión' },
    { id: 'SOL-332', user: 'Liz Canchari', type: 'Seguro de Vida', date: 'Ayer', status: 'Pendiente' },
    { id: 'SOL-102', user: 'Christian Torres', type: 'Seguro de Hogar', date: 'Ayer', status: 'Pendiente' },
    { id: 'SOL-554', user: 'Andrea Rojas', type: 'Seguro de Viaje', date: 'Hace 2 días', status: 'En Revisión' },
    { id: 'SOL-219', user: 'Miriam Ruiz', type: 'Seguro para Mascotas', date: 'Hace 3 días', status: 'Pendiente' },
    { id: 'SOL-991', user: 'Milagros Paz', type: 'Seguro Empresarial', date: 'Hace 4 días', status: 'Pendiente' },
    { id: 'SOL-404', user: 'Ricardo Diaz', type: 'Seguro de Auto', date: 'Hace 5 días', status: 'En Revisión' },
  ];

  const barData = [
    { month: 'Ene', value: 40, height: 'h-24' },
    { month: 'Feb', value: 65, height: 'h-36' },
    { month: 'Mar', value: 50, height: 'h-28' },
    { month: 'Abr', value: 85, height: 'h-48' },
  ];

  return (
    <div className="py-6 fade-up">
      {/* HEADER */}
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold text-text">Resumen del Sistema</h1>
          <p className="text-xs text-text-soft">Control operativo global - Serena Seguros</p>
        </div>
        <div className="flex gap-4">
          {extraKPIs.map((kpi, i) => (
            <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm">
              <kpi.icon size={16} className={kpi.color} />
              <div className="leading-none">
                <p className="text-[9px] font-bold text-text-soft uppercase">{kpi.label}</p>
                <p className="text-xs font-bold text-text">{kpi.value}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* TARJETAS PRINCIPALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="card p-4 flex items-center gap-3 bg-white">
            <div className={`p-2 rounded-lg bg-bg-soft ${stat.color}`}>
              <stat.icon size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-soft uppercase tracking-tight">{stat.label}</p>
              <p className="text-lg font-bold text-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO DE PRODUCCIÓN */}
        <div className="lg:col-span-2 card p-5 bg-white flex flex-col justify-between">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <MdBarChart size={22} className="text-primary" />
              <h2 className="text-sm font-bold text-text">Producción de Pólizas (Mensual)</h2>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[9px] text-text-soft font-bold uppercase">Tasa de Conversión</p>
                <p className="text-sm font-bold text-primary">12.5% <span className="text-[10px] text-green-500">+2.1%</span></p>
              </div>
              <div className="text-right">
                <p className="text-[9px] text-text-soft font-bold uppercase">Siniestralidad</p>
                <p className="text-sm font-bold text-text">3.8% <span className="text-[10px] text-orange-500">-0.5%</span></p>
              </div>
            </div>
          </div>
          
          <div className="h-64 w-full flex items-end justify-around px-4 border-b border-border relative">
            {barData.map((data, i) => (
              <div key={i} className="flex flex-col items-center gap-2 w-full group">
                <span className="text-[10px] font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  {data.value}k
                </span>
                <div className={`${data.height} w-12 bg-primary/20 border-t-2 border-primary rounded-t-sm group-hover:bg-primary/40 transition-all cursor-pointer relative`}>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent"></div>
                </div>
                <span className="text-[10px] font-bold text-text-soft mt-2">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SOLICITUDES CRÍTICAS CON SCROLL */}
        <div className="card p-5 bg-white flex flex-col h-[420px]">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MdPendingActions size={20} className="text-primary" />
              <h2 className="text-sm font-bold text-text">Solicitudes Críticas</h2>
            </div>
            <span className="text-[9px] bg-primary/10 text-primary px-2 py-1 rounded-full font-bold cursor-pointer hover:bg-primary hover:text-white transition-colors">VER TODO</span>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar">
            {pendingRequests.map((req) => (
              <div key={req.id} className="p-3 rounded-xl bg-bg-soft/50 border border-border/50 hover:border-primary/30 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-text">{req.user}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${req.status === 'En Revisión' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                    {req.status}
                  </span>
                </div>
                <p className="text-[10px] text-text-soft mb-2">{req.type} • {req.id}</p>
                <div className="flex items-center gap-1 text-[9px] text-text-mute font-medium">
                  <MdHistory size={12} />
                  {req.date}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ESTADO DE SERVICIOS */}
        <div className="lg:col-span-3 card p-4 bg-white">
          <div className="flex items-center gap-4 text-[11px] font-medium text-text-soft">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span> Servidores Activos</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500"></span> Base de Datos: 12ms</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary"></span> Backup: Sincronizado</span>
          </div>
        </div>

      </div>
    </div>
  );
}