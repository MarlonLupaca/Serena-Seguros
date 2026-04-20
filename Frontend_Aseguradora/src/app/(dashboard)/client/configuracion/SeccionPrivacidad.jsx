import { useState } from 'react';
import { MdPrivacyTip, MdInfo, MdToggleOn, MdToggleOff } from 'react-icons/md';
import { PRIVACIDAD_INICIAL } from './data';

export default function SeccionPrivacidad({ onGuardar }) {
  const [priv, setPriv] = useState(PRIVACIDAD_INICIAL);

  const toggle = (key) => {
    setPriv((p) => {
      const next = { ...p, [key]: !p[key] };
      onGuardar('Configuración de privacidad actualizada.');
      return next;
    });
  };

  const grupos = [
    {
      titulo: 'Visibilidad de perfil',
      icono: MdPrivacyTip,
      color: 'bg-teal-100 text-teal-600',
      accentBar: 'bg-teal-200',
      items: [
        { key: 'perfilPublico', label: 'Perfil público', sub: 'Permite que otros usuarios vean tu información básica' },
        {
          key: 'historialVisible',
          label: 'Historial de actividad',
          sub: 'Muestra tu historial de pólizas y trámites recientes',
        },
      ],
    },
    {
      titulo: 'Datos y analíticas',
      icono: MdInfo,
      color: 'bg-indigo-100 text-indigo-600',
      accentBar: 'bg-indigo-200',
      items: [
        {
          key: 'compartirDatos',
          label: 'Compartir datos con socios',
          sub: 'Datos anonimizados para mejorar productos y servicios',
        },
        { key: 'cookiesAnaliticas', label: 'Cookies analíticas', sub: 'Nos ayudan a entender cómo usas la plataforma' },
        {
          key: 'cookiesMarketing',
          label: 'Cookies de marketing',
          sub: 'Usadas para mostrarte anuncios personalizados',
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      {grupos.map(({ titulo, icono: Icon, color, accentBar, items }) => (
        <div key={titulo} className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className={`h-1 w-full ${accentBar}`} />
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
                  {priv[key] ? (
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
      <div className="flex items-start gap-3 p-3.5 bg-sky-50 border border-sky-200 rounded-xl">
        <MdInfo size={16} className="text-sky-600 shrink-0 mt-0.5" />
        <p className="text-xs text-sky-700 leading-relaxed">
          Tienes derecho a solicitar el acceso, rectificación o eliminación de tus datos personales conforme a la Ley de
          Protección de Datos Personales del Perú.{' '}
          <button className="font-semibold hover:underline">Más información</button>
        </p>
      </div>
    </div>
  );
}
