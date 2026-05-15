'use client';

import { useEffect, useState } from 'react';
import {
  MdEmail,
  MdPhone,
  MdNotificationsActive,
  MdNotifications,
  MdToggleOn,
  MdToggleOff,
} from 'react-icons/md';
import { apiGet, apiPut } from '@/lib/api';

const ITEMS = [
  {
    key: 'notif_email',
    label: 'Notificaciones por correo',
    sub: 'Recordatorios y avisos importantes por email',
    icon: MdEmail,
  },
  {
    key: 'notif_sms',
    label: 'Notificaciones por SMS',
    sub: 'Mensajes de texto para alertas urgentes',
    icon: MdPhone,
  },
  {
    key: 'notif_push',
    label: 'Notificaciones push',
    sub: 'Avisos en tiempo real desde el portal',
    icon: MdNotificationsActive,
  },
];

export default function SeccionPreferencias({ onGuardar }) {
  const [prefs, setPrefs] = useState({ notif_email: true, notif_sms: false, notif_push: true });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    apiGet('/perfil/preferencias')
      .then((data) => activo && data && setPrefs(data))
      .catch((e) => activo && setError(e.mensaje || 'No se pudieron cargar las preferencias'))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const toggle = async (key) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    setGuardando(true);
    setError('');
    try {
      const data = await apiPut('/perfil/preferencias', next);
      setPrefs(data);
      onGuardar('Preferencias actualizadas.');
    } catch (e) {
      setPrefs(prefs);
      setError(e.mensaje || 'No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-6 text-sm text-text-soft">
        Cargando preferencias...
      </div>
    );
  }

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-sky-200" />
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <MdNotifications size={18} className="text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Preferencias de notificacion</p>
            <p className="text-xs text-text-soft mt-0.5">Controla como y cuando te contactamos</p>
          </div>
        </div>
      </div>
      <div className="p-5">
        {error && (
          <div className="p-3 mb-4 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}
        <div className="divide-y divide-border">
          {ITEMS.map(({ key, label, sub, icon: Icon }) => (
            <div key={key} className="flex items-center gap-4 py-3.5">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  prefs[key] ? 'bg-primary/10' : 'bg-bg-soft'
                }`}
              >
                <Icon size={15} className={prefs[key] ? 'text-primary' : 'text-text-soft'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text">{label}</p>
                <p className="text-xs text-text-soft mt-0.5">{sub}</p>
              </div>
              <button
                onClick={() => toggle(key)}
                disabled={guardando}
                className="shrink-0 disabled:opacity-50"
              >
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
    </div>
  );
}
