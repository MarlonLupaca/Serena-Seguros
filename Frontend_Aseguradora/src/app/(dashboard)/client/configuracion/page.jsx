'use client';

import { useState } from 'react';
import {
  MdNotifications,
  MdSecurity,
  MdPrivacyTip,
  MdManageAccounts,
  MdKeyboardArrowDown,
  MdCheck,
} from 'react-icons/md';
import Toast from './Toast';
import SeccionNotificaciones from './SeccionNotificaciones';
import SeccionSeguridad from './SeccionSeguridad';
import SeccionPrivacidad from './SeccionPrivacidad';
import SeccionCuenta from './SeccionCuenta';

const TABS = [
  { id: 'notificaciones', label: 'Notificaciones', icono: MdNotifications },
  { id: 'seguridad', label: 'Seguridad', icono: MdSecurity },
  { id: 'privacidad', label: 'Privacidad', icono: MdPrivacyTip },
  { id: 'cuenta', label: 'Cuenta', icono: MdManageAccounts },
];

export default function ModuloConfiguracion() {
  const [tabActiva, setTabActiva] = useState('notificaciones');
  const [toast, setToast] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const TabActual = {
    notificaciones: <SeccionNotificaciones onGuardar={mostrarToast} />,
    seguridad: <SeccionSeguridad onGuardar={mostrarToast} />,
    privacidad: <SeccionPrivacidad onGuardar={mostrarToast} />,
    cuenta: <SeccionCuenta onGuardar={mostrarToast} />,
  }[tabActiva];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-8 py-5">
        <p className="text-xl font-bold text-text leading-tight">Configuración</p>
        <p className="text-sm text-text-soft mt-0.5">
          Personaliza tu experiencia y gestiona la seguridad de tu cuenta.
        </p>
      </div>

      <div className="flex-1 w-full px-8 pb-10">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-bg rounded-2xl border border-border mb-6">
          {/* Desktop: todos visibles */}
          <div className="hidden sm:flex gap-1 w-full">
            {TABS.map(({ id, label, icono: Icon }) => (
              <button
                key={id}
                onClick={() => setTabActiva(id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                  tabActiva === id
                    ? 'bg-primary text-text-inverse shadow-sm'
                    : 'text-text-soft hover:bg-bg-soft hover:text-text'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* Móvil: 2 tabs visibles + botón "Más" */}
          <div className="flex sm:hidden gap-1 w-full">
            {TABS.slice(0, 2).map(({ id, label, icono: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setTabActiva(id);
                  setDropdownOpen(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex-1 justify-center ${
                  tabActiva === id
                    ? 'bg-primary text-text-inverse shadow-sm'
                    : 'text-text-soft hover:bg-bg-soft hover:text-text'
                }`}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}

            {/* Botón Más */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  TABS.slice(2).some((t) => t.id === tabActiva)
                    ? 'bg-primary text-text-inverse shadow-sm'
                    : 'text-text-soft hover:bg-bg-soft hover:text-text'
                }`}
              >
                {TABS.slice(2).some((t) => t.id === tabActiva) ? TABS.find((t) => t.id === tabActiva)?.label : 'Más'}
                <MdKeyboardArrowDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="absolute top-full mt-2 right-0 bg-bg border border-border rounded-2xl overflow-hidden z-50 shadow-lg min-w-40">
                  {TABS.slice(2).map(({ id, label, icono: Icon }) => (
                    <button
                      key={id}
                      onClick={() => {
                        setTabActiva(id);
                        setDropdownOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-semibold transition-colors border-b border-border last:border-0 ${
                        tabActiva === id ? 'text-primary bg-primary/5' : 'text-text-soft hover:bg-bg-soft'
                      }`}
                    >
                      <Icon size={15} />
                      {label}
                      {tabActiva === id && <MdCheck size={13} className="ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {TabActual}
      </div>

      {toast && <Toast mensaje={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
