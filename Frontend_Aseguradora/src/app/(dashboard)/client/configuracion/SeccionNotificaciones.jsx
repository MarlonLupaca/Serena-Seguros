import { useState } from 'react';
import { MdEmail, MdSms, MdNotificationsActive, MdPhone, MdToggleOn, MdToggleOff } from 'react-icons/md';
import { NOTIFICACIONES_INICIAL } from './data';

export default function SeccionNotificaciones({ onGuardar }) {
  const [notifs, setNotifs] = useState(NOTIFICACIONES_INICIAL);

  const toggle = (key) => {
    setNotifs((n) => {
      const next = { ...n, [key]: !n[key] };
      onGuardar('Preferencias de notificación actualizadas.');
      return next;
    });
  };

  const grupos = [
    {
      titulo: 'Correo electrónico',
      icono: MdEmail,
      color: 'bg-sky-100 text-sky-600',
      items: [
        {
          key: 'emailVencimiento',
          label: 'Vencimientos y pagos',
          sub: 'Avisos antes del vencimiento de cuotas y pólizas',
        },
        {
          key: 'emailSiniestros',
          label: 'Estado de siniestros',
          sub: 'Actualizaciones sobre tus reclamaciones en curso',
        },
        { key: 'emailResumen', label: 'Resumen mensual', sub: 'Informe de actividad de tu cuenta cada mes' },
        {
          key: 'emailPromociones',
          label: 'Promociones y beneficios',
          sub: 'Ofertas exclusivas y novedades del servicio',
        },
      ],
    },
    {
      titulo: 'Mensajes de texto (SMS)',
      icono: MdSms,
      color: 'bg-emerald-100 text-emerald-600',
      items: [
        { key: 'smsVencimiento', label: 'Recordatorios de pago', sub: 'SMS previo al vencimiento de cuotas' },
        {
          key: 'smsSiniestros',
          label: 'Alertas de siniestros',
          sub: 'Notificación inmediata ante cambios en tu reclamación',
        },
      ],
    },
    {
      titulo: 'Notificaciones push',
      icono: MdNotificationsActive,
      color: 'bg-violet-100 text-violet-600',
      items: [
        { key: 'pushTodo', label: 'Activar todas las push', sub: 'Controla todas las notificaciones push desde aquí' },
        { key: 'pushPagos', label: 'Pagos procesados', sub: 'Confirmación cuando un pago es registrado' },
        { key: 'pushAlertas', label: 'Alertas importantes', sub: 'Notificaciones críticas de tu cuenta y pólizas' },
      ],
    },
    {
      titulo: 'WhatsApp',
      icono: MdPhone,
      color: 'bg-green-100 text-green-600',
      items: [
        {
          key: 'whatsapp',
          label: 'Mensajes por WhatsApp',
          sub: 'Comunicados y alertas via WhatsApp al número registrado',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {grupos.map(({ titulo, icono: Icon, color, items }) => (
        <div key={titulo} className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="h-1 w-full bg-border" />
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={18} />
            </div>
            <p className="text-sm font-bold text-text">{titulo}</p>
          </div>
          <div className="px-5 divide-y divide-border">
            {items.map(({ key, label, sub }) => (
              <div key={key} className="flex items-center gap-4 py-3.5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{label}</p>
                  <p className="text-xs text-text-soft mt-0.5">{sub}</p>
                </div>
                <button onClick={() => toggle(key)} className="shrink-0">
                  {notifs[key] ? (
                    <MdToggleOn size={28} className="text-primary" />
                  ) : (
                    <MdToggleOff size={28} className="text-text-soft opacity-40" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
