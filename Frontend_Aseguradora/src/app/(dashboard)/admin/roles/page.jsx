import {
  MdAdminPanelSettings,
  MdCheckCircle, MdEdit,
  MdSecurity,
  MdShield
} from 'react-icons/md';

export default function RolesPage() {
  const roles = [
    { 
      name: 'Administrador Total', 
      desc: 'Acceso completo a todos los módulos y configuraciones críticas del sistema.',
      users: 3, 
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      permissions: ['Gestión de Usuarios', 'Configuración Global', 'Reportes Financieros', 'Auditoría de Logs']
    },
    { 
      name: 'Analista de Operaciones', 
      desc: 'Gestión operativa de pólizas y siniestros. Sin acceso a configuraciones de sistema.',
      users: 12, 
      color: 'text-primary',
      bgColor: 'bg-primary/5',
      permissions: ['Gestión de Pólizas', 'Evaluación de Siniestros', 'Validación de Pagos']
    },
    { 
      name: 'Auditor Externo', 
      desc: 'Acceso limitado a solo lectura para revisión de cumplimiento y reportes operativos.',
      users: 2, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      permissions: ['Visualización de Reportes', 'Consulta de Pólizas', 'Exportación de Datos']
    }
  ];

  return (
    <div className="py-6 fade-up">
      {/* HEADER */}
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-text">Roles y Permisos</h1>
          <p className="text-xs text-text-soft">Gestión de niveles de acceso y seguridad del personal</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-xl shadow-md hover:bg-primary-dark transition-all flex items-center gap-2">
          <MdShield size={16} />
          NUEVO ROL
        </button>
      </header>

      {/* GRID DE ROLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {roles.map((role, i) => (
          <div key={i} className="card p-6 bg-white border border-border/50 flex flex-col h-full hover:shadow-lg transition-shadow">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className={`p-3 rounded-2xl ${role.bgColor} ${role.color}`}>
                  <MdAdminPanelSettings size={28} />
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-text-soft uppercase tracking-wider">Usuarios</span>
                  <span className="text-sm font-bold text-text">{role.users}</span>
                </div>
              </div>

              <h2 className="text-md font-bold text-text mb-2">{role.name}</h2>
              <p className="text-[11px] text-text-soft mb-6 leading-relaxed">
                {role.desc}
              </p>
              
              <div className="space-y-3 mb-6">
                <p className="text-[9px] font-bold text-text-soft uppercase tracking-[0.1em] border-b border-border pb-2">
                  Facultades Habilitadas
                </p>
                {role.permissions.map((perm, j) => (
                  <div key={j} className="flex items-center gap-3 text-[11px] text-text font-medium">
                    <MdCheckCircle className="text-green-500" size={16} />
                    {perm}
                  </div>
                ))}
              </div>
            </div>
            
            <button className="w-full py-2.5 bg-bg-soft hover:bg-primary/10 text-text font-bold text-[11px] rounded-xl transition-colors border border-border flex items-center justify-center gap-2">
              <MdEdit size={14} />
              EDITAR PERMISOS
            </button>
          </div>
        ))}
      </div>

      {/* NOTA TÉCNICA PARA EL INFORME */}
      <div className="mt-10 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
          <MdSecurity size={20} />
        </div>
        <div>
          <p className="text-xs font-bold text-text">Control de Seguridad RBAC</p>
          <p className="text-[10px] text-text-soft">El sistema utiliza Control de Acceso Basado en Roles para garantizar que cada colaborador acceda únicamente a sus funciones correspondientes.</p>
        </div>
      </div>
    </div>
  );
}