import { MdSecurity, MdLock, MdShield, MdInfo, MdChevronRight } from 'react-icons/md';

export default function SeccionSeguridad({ onAbrirContrasena }) {
  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-amber-200" />
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <MdSecurity size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Seguridad</p>
            <p className="text-xs text-text-soft mt-0.5">Gestiona el acceso y la seguridad de tu cuenta</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-2">
        {[
          {
            icon: MdLock,
            label: 'Cambiar contraseña',
            sub: 'Última actualización: hace 3 meses',
            accion: 'Cambiar',
            onClick: onAbrirContrasena,
            color: 'text-primary',
          },
        ].map(({ icon: Icon, label, sub, accion, onClick, color }) => (
          <div key={label} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-bg-soft transition-colors">
            <div className="w-9 h-9 rounded-lg bg-bg-soft flex items-center justify-center shrink-0">
              <Icon size={17} className="text-text-soft" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">{label}</p>
              <p className="text-xs text-text-soft mt-0.5">{sub}</p>
            </div>
            <button
              onClick={onClick}
              className={`text-xs font-semibold ${color} hover:underline shrink-0 flex items-center gap-1`}
            >
              {accion} <MdChevronRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
