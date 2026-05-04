import { useState } from 'react';
import { MdEmail, MdPhone, MdNotificationsActive, MdNotifications, MdToggleOn, MdToggleOff } from 'react-icons/md';
import { PREFERENCIAS_INICIAL } from './data';

export default function SeccionPreferencias({ onGuardar }) {
  const [prefs, setPrefs] = useState(PREFERENCIAS_INICIAL);

  const toggle = (key) => {
    setPrefs((p) => {
      const next = { ...p, [key]: !p[key] };
      onGuardar('Preferencias de contacto actualizadas.');
      return next;
    });
  };

  const items = [
    {
      key: 'emailRecordatorios',
      label: 'Recordatorios de vencimiento',
      sub: 'Avisos de cuotas próximas a vencer por correo',
      icon: MdEmail,
    },
    {
      key: 'smsRecordatorios',
      label: 'SMS de recordatorios',
      sub: 'Notificaciones por mensaje de texto',
      icon: MdPhone,
    },
    {
      key: 'pushNotificaciones',
      label: 'Notificaciones push',
      sub: 'Avisos en tiempo real desde la app',
      icon: MdNotificationsActive,
    },
    { key: 'whatsapp', label: 'Mensajes por WhatsApp', sub: 'Comunicaciones y alertas vía WhatsApp', icon: MdPhone },
    {
      key: 'emailMarketing',
      label: 'Correos promocionales',
      sub: 'Ofertas, novedades y beneficios exclusivos',
      icon: MdEmail,
    },
  ];

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-sky-200" />
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <MdNotifications size={18} className="text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Preferencias de contacto</p>
            <p className="text-xs text-text-soft mt-0.5">Controla cómo y cuándo te contactamos</p>
          </div>
        </div>
      </div>
      <div className="p-5 flex flex-col gap-0 divide-y divide-border">
        {items.map(({ key, label, sub, icon: Icon }) => (
          <div key={key} className="flex items-center gap-4 py-3.5">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${prefs[key] ? 'bg-primary/10' : 'bg-bg-soft'}`}
            >
              <Icon size={15} className={prefs[key] ? 'text-primary' : 'text-text-soft'} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">{label}</p>
              <p className="text-xs text-text-soft mt-0.5">{sub}</p>
            </div>
            <button onClick={() => toggle(key)} className="shrink-0">
              {prefs[key] ? (
                <MdToggleOn size={28} className="text-primary" />
              ) : (
                <MdToggleOff size={28} className="text-text-soft opacity-40" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
