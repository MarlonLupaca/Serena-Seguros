"use client";
import { useState } from 'react';
import {
  MdCloudUpload, MdColorLens,
  MdLock,
  MdNotificationsActive,
  MdSecurity,
  MdStorage
} from 'react-icons/md';

export default function ConfigAdminPage() {
  // Estado para manejar los switches de forma individual
  const [settings, setSettings] = useState({
    notifications: true,
    backup: true,
    twoFactor: false,
    maintenance: false,
    darkMode: false,
    autoAudit: true
  });

  const toggleSetting = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: "Seguridad y Acceso",
      items: [
        { id: 'twoFactor', title: 'Autenticación de Dos Factores (2FA)', desc: 'Añade una capa extra de seguridad al login administrativo.', icon: MdSecurity },
        { id: 'autoAudit', title: 'Auditoría Automática de Logs', desc: 'Registra cada acción realizada por los analistas.', icon: MdLock },
      ]
    },
    {
      title: "Sistema y Notificaciones",
      items: [
        { id: 'notifications', title: 'Alertas de Siniestros Críticos', desc: 'Notificar vía Email/Push cuando se registre un siniestro de alta severidad.', icon: MdNotificationsActive },
        { id: 'backup', title: 'Backups Diarios en la Nube', desc: 'Sincronización automática de la base de datos a las 02:00 AM.', icon: MdCloudUpload },
      ]
    },
    {
      title: "Personalización de Plataforma",
      items: [
        { id: 'maintenance', title: 'Modo Mantenimiento', desc: 'Desactiva el acceso al portal de clientes temporalmente.', icon: MdStorage },
        { id: 'darkMode', title: 'Interfaz de Alto Contraste', desc: 'Optimiza la visualización para entornos de poca luz.', icon: MdColorLens },
      ]
    }
  ];

  return (
    <div className="py-6 fade-up max-w-4xl">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-text">Configuración del Sistema</h1>
        <p className="text-xs text-text-soft">Parámetros globales y seguridad de Serena Seguros</p>
      </header>

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-2">
              {section.title}
            </h2>
            
            <div className="grid gap-3">
              {section.items.map((item) => (
                <div 
                  key={item.id} 
                  className="card p-4 bg-white flex items-center justify-between border border-border/50 hover:border-primary/30 transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${settings[item.id] ? 'bg-primary/10 text-primary' : 'bg-bg-soft text-text-soft'}`}>
                      <item.icon size={22} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text">{item.title}</span>
                      <span className="text-[10px] text-text-soft leading-relaxed max-w-xs">{item.desc}</span>
                    </div>
                  </div>

                  {/* Switch Interactivo */}
                  <button 
                    onClick={() => toggleSetting(item.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none shadow-inner
                      ${settings[item.id] ? 'bg-primary' : 'bg-gray-200'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-md
                        ${settings[item.id] ? 'translate-x-6' : 'translate-x-1'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer de acción rápida */}
      <div className="mt-10 pt-6 border-t border-border flex justify-end gap-3">
        <button className="px-5 py-2 text-[11px] font-bold text-text-soft hover:text-text transition-colors">
          Restablecer Valores
        </button>
        <button className="px-6 py-2 bg-primary text-white text-[11px] font-bold rounded-xl shadow-lg hover:bg-primary-dark transition-all">
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}