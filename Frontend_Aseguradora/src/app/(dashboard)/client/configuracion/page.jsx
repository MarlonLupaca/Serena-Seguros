'use client';
import { useState } from 'react';
import {
  MdArrowForward,
  MdSettings,
  MdNotifications,
  MdNotificationsActive,
  MdSecurity,
  MdLock,
  MdShield,
  MdVisibility,
  MdVisibilityOff,
  MdLanguage,
  MdPalette,
  MdAccessTime,
  MdAttachMoney,
  MdEmail,
  MdPhone,
  MdSms,
  MdClose,
  MdCheck,
  MdCheckCircle,
  MdWarningAmber,
  MdInfo,
  MdToggleOn,
  MdToggleOff,
  MdChevronRight,
  MdLogout,
  MdDeleteForever,
  MdDevices,
  MdFingerprint,
  MdPrivacyTip,
  MdManageAccounts,
  MdSave,
  MdEdit,
  MdVerified,
  MdDarkMode,
  MdLightMode,
  MdKeyboardArrowDown,
} from 'react-icons/md';

const NOTIFICACIONES_INICIAL = {
  emailVencimiento: true,
  emailSiniestros: true,
  emailPromociones: false,
  emailResumen: true,
  smsVencimiento: false,
  smsSiniestros: true,
  pushTodo: true,
  pushPagos: true,
  pushAlertas: true,
  whatsapp: false,
};

const PREFERENCIAS_INICIAL = {
  idioma: 'es',
  moneda: 'PEN',
  zonaHoraria: 'America/Lima',
  formatoFecha: 'DD/MM/YYYY',
  tema: 'claro',
};

const PRIVACIDAD_INICIAL = {
  perfilPublico: false,
  compartirDatos: false,
  cookiesAnaliticas: true,
  cookiesMarketing: false,
  historialVisible: true,
};

const SESIONES_MOCK = [
  { id: 1, dispositivo: 'Chrome · Windows 11', lugar: 'Lima, Perú', activo: true, fecha: 'Ahora' },
  { id: 2, dispositivo: 'Safari · iPhone 14', lugar: 'Lima, Perú', activo: false, fecha: 'Hace 2 días' },
  { id: 3, dispositivo: 'Firefox · MacOS', lugar: 'Miraflores, Perú', activo: false, fecha: 'Hace 1 semana' },
];

function Toast({ mensaje, onClose }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg text-sm font-medium">
      <MdCheckCircle size={18} />
      {mensaje}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <MdClose size={15} />
      </button>
    </div>
  );
}

function ModalConfirmar({ titulo, descripcion, labelConfirm, colorConfirm = 'bg-rose-600', onClose, onConfirmar }) {
  const [loading, setLoading] = useState(false);
  const [texto, setTexto] = useState('');
  const requiereTexto = labelConfirm === 'Eliminar cuenta';

  const handleConfirmar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onConfirmar();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MdWarningAmber size={16} className="text-rose-500" />
            <p className="text-sm font-bold text-text">{titulo}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <p className="text-sm text-text-soft leading-relaxed">{descripcion}</p>
          {requiereTexto && (
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Escribe <span className="font-bold text-rose-500">ELIMINAR</span> para confirmar
              </label>
              <input
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-rose-400 transition-colors"
                placeholder="ELIMINAR"
              />
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleConfirmar}
              disabled={loading || (requiereTexto && texto !== 'ELIMINAR')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl ${colorConfirm} hover:opacity-90 disabled:opacity-40 text-white text-xs font-semibold transition-all`}
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                labelConfirm
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalContrasena({ onClose, onGuardar }) {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [showActual, setShowActual] = useState(false);
  const [showNueva, setShowNueva] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [loading, setLoading] = useState(false);

  const reglas = [
    { label: 'Mínimo 8 caracteres', ok: nueva.length >= 8 },
    { label: 'Al menos una mayúscula', ok: /[A-Z]/.test(nueva) },
    { label: 'Al menos un número', ok: /[0-9]/.test(nueva) },
    { label: 'Las contraseñas coinciden', ok: nueva && nueva === confirmar },
  ];
  const valida = reglas.every((r) => r.ok) && actual.length > 0;
  const fortaleza = reglas.filter((r) => r.ok).length;

  const handleGuardar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onGuardar();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <MdLock size={16} className="text-primary" />
            <p className="text-sm font-bold text-text">Cambiar contraseña</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft text-text-soft"
          >
            <MdClose size={15} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          {[
            {
              label: 'Contraseña actual',
              val: actual,
              set: setActual,
              show: showActual,
              toggle: () => setShowActual((v) => !v),
            },
            {
              label: 'Nueva contraseña',
              val: nueva,
              set: setNueva,
              show: showNueva,
              toggle: () => setShowNueva((v) => !v),
            },
            {
              label: 'Confirmar nueva contraseña',
              val: confirmar,
              set: setConfirmar,
              show: showConfirmar,
              toggle: () => setShowConfirmar((v) => !v),
            },
          ].map(({ label, val, set, show, toggle }) => (
            <div key={label}>
              <label className="text-xs font-medium text-text-soft block mb-1.5">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={val}
                  onChange={(e) => set(e.target.value)}
                  className="w-full pl-3 pr-9 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                  placeholder="••••••••"
                />
                <button
                  onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text"
                >
                  {show ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                </button>
              </div>
            </div>
          ))}

          {nueva.length > 0 && (
            <div className="flex flex-col gap-2 bg-bg-soft rounded-xl p-3">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={`flex-1 h-1 rounded-full transition-colors ${i <= fortaleza ? (fortaleza <= 1 ? 'bg-rose-400' : fortaleza <= 2 ? 'bg-amber-400' : fortaleza <= 3 ? 'bg-yellow-400' : 'bg-emerald-500') : 'bg-border'}`}
                  />
                ))}
              </div>
              {reglas.map((r) => (
                <div
                  key={r.label}
                  className={`flex items-center gap-2 text-xs ${r.ok ? 'text-emerald-600' : 'text-text-soft'}`}
                >
                  {r.ok ? <MdCheckCircle size={13} /> : <div className="w-3 h-3 rounded-full border border-border" />}
                  {r.label}
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 mt-1">
            <button
              onClick={handleGuardar}
              disabled={!valida || loading}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-xs font-semibold transition-colors"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MdLock size={13} /> Guardar contraseña
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SeccionNotificaciones({ onGuardar }) {
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

function SeccionSeguridad({ onGuardar }) {
  const [modalContrasena, setModalContrasena] = useState(false);
  const [modalSesion, setModalSesion] = useState(false);
  const [sesiones, setSesiones] = useState(SESIONES_MOCK);
  const [dos2fa, setDos2fa] = useState(false);

  const cerrarSesion = (id) => {
    setSesiones((ss) => ss.filter((s) => s.id === 1 || s.id !== id));
    onGuardar('Sesión cerrada correctamente.');
  };

  const cerrarTodasSesiones = () => {
    setSesiones((ss) => ss.filter((s) => s.activo));
    setModalSesion(false);
    onGuardar('Se cerraron todas las sesiones externas.');
  };

  return (
    <>
      <div className="bg-bg rounded-2xl border border-border overflow-hidden mb-4">
        <div className="h-1 w-full bg-amber-200" />
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <MdLock size={18} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Contraseña</p>
            <p className="text-xs text-text-soft mt-0.5">Última actualización hace 3 meses</p>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-bg-soft">
            <div>
              <p className="text-sm font-medium text-text">Cambiar contraseña</p>
              <p className="text-xs text-text-soft mt-0.5">Usa una contraseña segura y única</p>
            </div>
            <button
              onClick={() => setModalContrasena(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors shrink-0"
            >
              <MdEdit size={13} /> Cambiar
            </button>
          </div>
        </div>
      </div>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden mb-4">
        <div className="h-1 w-full bg-violet-200" />
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
            <MdFingerprint size={18} className="text-violet-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Autenticación en dos pasos</p>
            <p className="text-xs text-text-soft mt-0.5">Añade una capa extra de protección</p>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {[
            {
              key: 'sms',
              label: 'Verificación por SMS',
              sub: 'Código enviado al número +51 987 *** ***',
              activo: dos2fa,
            },
            { key: 'email', label: 'Verificación por correo', sub: 'Código enviado a c***@gmail.com', activo: false },
            { key: 'app', label: 'App de autenticación', sub: 'Usa Google Authenticator o similar', activo: false },
          ].map(({ key, label, sub, activo }) => (
            <div
              key={key}
              className={`flex items-center gap-4 p-3.5 rounded-xl border ${activo ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activo ? 'bg-primary/10' : 'bg-bg-soft'}`}
              >
                <MdShield size={15} className={activo ? 'text-primary' : 'text-text-soft'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text">{label}</p>
                  {activo && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      <MdVerified size={10} /> Activo
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-soft mt-0.5">{sub}</p>
              </div>
              <button
                onClick={() => {
                  if (key === 'sms') {
                    setDos2fa((v) => !v);
                    onGuardar(dos2fa ? '2FA desactivado.' : '2FA activado correctamente.');
                  }
                }}
                className={`text-xs font-semibold shrink-0 flex items-center gap-1 ${activo ? 'text-rose-500 hover:underline' : 'text-primary hover:underline'}`}
              >
                {activo ? 'Desactivar' : 'Activar'} <MdChevronRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-sky-200" />
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
              <MdDevices size={18} className="text-sky-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Sesiones activas</p>
              <p className="text-xs text-text-soft mt-0.5">{sesiones.length} dispositivo(s) conectado(s)</p>
            </div>
          </div>
          {sesiones.length > 1 && (
            <button
              onClick={() => setModalSesion(true)}
              className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1 shrink-0"
            >
              Cerrar todas <MdChevronRight size={14} />
            </button>
          )}
        </div>
        <div className="p-5 flex flex-col gap-2">
          {sesiones.map((s) => (
            <div
              key={s.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.activo ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.activo ? 'bg-primary/10' : 'bg-bg-soft'}`}
              >
                <MdDevices size={16} className={s.activo ? 'text-primary' : 'text-text-soft'} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-text truncate">{s.dispositivo}</p>
                  {s.activo && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En línea
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  {s.lugar} · {s.fecha}
                </p>
              </div>
              {!s.activo && (
                <button
                  onClick={() => cerrarSesion(s.id)}
                  className="p-2 rounded-lg border border-border hover:bg-rose-50 hover:border-rose-200 text-text-soft hover:text-rose-500 transition-colors shrink-0"
                >
                  <MdClose size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalContrasena && (
        <ModalContrasena
          onClose={() => setModalContrasena(false)}
          onGuardar={() => {
            setModalContrasena(false);
            onGuardar('Contraseña actualizada correctamente.');
          }}
        />
      )}
      {modalSesion && (
        <ModalConfirmar
          titulo="Cerrar sesiones externas"
          descripcion="Se cerrará la sesión en todos los dispositivos excepto en el que estás usando ahora mismo."
          labelConfirm="Cerrar sesiones"
          colorConfirm="bg-rose-600"
          onClose={() => setModalSesion(false)}
          onConfirmar={cerrarTodasSesiones}
        />
      )}
    </>
  );
}

function SeccionPrivacidad({ onGuardar }) {
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

function SeccionCuenta({ onGuardar }) {
  const [prefs, setPrefs] = useState(PREFERENCIAS_INICIAL);
  const [editando, setEditando] = useState(false);
  const [draft, setDraft] = useState(PREFERENCIAS_INICIAL);
  const [modalEliminar, setModalEliminar] = useState(false);
  const [modalDesactivar, setModalDesactivar] = useState(false);

  const handleGuardar = () => {
    setPrefs(draft);
    setEditando(false);
    onGuardar('Preferencias de cuenta actualizadas.');
  };
  const handleCancelar = () => {
    setDraft(prefs);
    setEditando(false);
  };

  const campos = [
    {
      key: 'idioma',
      label: 'Idioma',
      icono: MdLanguage,
      tipo: 'select',
      opciones: [
        { val: 'es', label: 'Español' },
        { val: 'en', label: 'English' },
        { val: 'pt', label: 'Português' },
      ],
    },
    {
      key: 'moneda',
      label: 'Moneda',
      icono: MdAttachMoney,
      tipo: 'select',
      opciones: [
        { val: 'PEN', label: 'Sol peruano (S/)' },
        { val: 'USD', label: 'Dólar (US$)' },
      ],
    },
    {
      key: 'zonaHoraria',
      label: 'Zona horaria',
      icono: MdAccessTime,
      tipo: 'select',
      opciones: [
        { val: 'America/Lima', label: 'Lima (UTC-5)' },
        { val: 'America/Bogota', label: 'Bogotá (UTC-5)' },
        { val: 'America/Santiago', label: 'Santiago (UTC-3)' },
      ],
    },
    {
      key: 'formatoFecha',
      label: 'Formato de fecha',
      icono: MdAccessTime,
      tipo: 'select',
      opciones: [
        { val: 'DD/MM/YYYY', label: 'DD/MM/AAAA' },
        { val: 'MM/DD/YYYY', label: 'MM/DD/AAAA' },
        { val: 'YYYY-MM-DD', label: 'AAAA-MM-DD' },
      ],
    },
  ];

  const temas = [
    { val: 'claro', label: 'Claro', icono: MdLightMode },
    { val: 'oscuro', label: 'Oscuro', icono: MdDarkMode },
    { val: 'sistema', label: 'Sistema', icono: MdSettings },
  ];

  const labelMap = {
    es: 'Español',
    en: 'English',
    pt: 'Português',
    PEN: 'Sol peruano (S/)',
    USD: 'Dólar (US$)',
    'America/Lima': 'Lima (UTC-5)',
    'America/Bogota': 'Bogotá (UTC-5)',
    'America/Santiago': 'Santiago (UTC-3)',
    'DD/MM/YYYY': 'DD/MM/AAAA',
    'MM/DD/YYYY': 'MM/DD/AAAA',
    'YYYY-MM-DD': 'AAAA-MM-DD',
  };

  return (
    <>
      <div className="bg-bg rounded-2xl border border-border overflow-hidden mb-4">
        <div className="h-1 w-full bg-primary/20" />
        <div className="p-5 border-b border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <MdManageAccounts size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Preferencias generales</p>
              <p className="text-xs text-text-soft mt-0.5">Idioma, moneda, zona horaria y formato</p>
            </div>
          </div>
          {!editando ? (
            <button
              onClick={() => setEditando(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdEdit size={13} /> Editar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleGuardar}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdSave size={13} /> Guardar
              </button>
              <button
                onClick={handleCancelar}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
              >
                <MdClose size={13} /> Cancelar
              </button>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Apariencia</p>
            <div className="flex gap-2">
              {temas.map(({ val, label, icono: Icon }) => {
                const sel = (editando ? draft : prefs).tema === val;
                return (
                  <button
                    key={val}
                    disabled={!editando}
                    onClick={() => setDraft((d) => ({ ...d, tema: val }))}
                    className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all ${sel ? 'border-primary/60 bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                  >
                    <Icon size={18} className={sel ? 'text-primary' : 'text-text-soft'} />
                    <span className={`text-xs font-medium ${sel ? 'text-primary' : 'text-text-soft'}`}>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="h-px bg-border" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Región y formato</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {campos.map(({ key, label, icono: Icon, opciones }) => {
                const val = editando ? draft[key] : prefs[key];
                return (
                  <div key={key}>
                    <label className="text-xs text-text-soft flex items-center gap-1 mb-1.5">
                      <Icon size={11} /> {label}
                    </label>
                    {!editando ? (
                      <p className="text-sm font-semibold text-text">{labelMap[val] || val}</p>
                    ) : (
                      <select
                        value={val}
                        onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
                      >
                        {opciones.map((o) => (
                          <option key={o.val} value={o.val}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-bg rounded-2xl border border-rose-200 overflow-hidden">
        <div className="h-1 w-full bg-rose-200" />
        <div className="p-5 border-b border-rose-100 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <MdWarningAmber size={18} className="text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Zona de riesgo</p>
            <p className="text-xs text-text-soft mt-0.5">Acciones irreversibles sobre tu cuenta</p>
          </div>
        </div>
        <div className="p-5 flex flex-col gap-2">
          {[
            {
              icono: MdLogout,
              label: 'Cerrar sesión en todos los dispositivos',
              sub: 'Finaliza todas las sesiones activas simultáneamente',
              accion: 'Cerrar todas',
              color: 'text-amber-600',
              onClick: () => setModalDesactivar(true),
            },
            {
              icono: MdDeleteForever,
              label: 'Eliminar cuenta',
              sub: 'Elimina permanentemente tu cuenta y todos tus datos',
              accion: 'Eliminar cuenta',
              color: 'text-rose-600',
              onClick: () => setModalEliminar(true),
            },
          ].map(({ icono: Icon, label, sub, accion, color, onClick }) => (
            <div key={label} className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-bg-soft transition-colors">
              <div className="w-9 h-9 rounded-xl bg-bg-soft flex items-center justify-center shrink-0">
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

      {modalDesactivar && (
        <ModalConfirmar
          titulo="Cerrar todas las sesiones"
          descripcion="Se cerrará la sesión en todos los dispositivos incluyendo este. Tendrás que volver a iniciar sesión."
          labelConfirm="Cerrar sesiones"
          colorConfirm="bg-amber-600"
          onClose={() => setModalDesactivar(false)}
          onConfirmar={() => {
            setModalDesactivar(false);
            onGuardar('Sesiones cerradas correctamente.');
          }}
        />
      )}
      {modalEliminar && (
        <ModalConfirmar
          titulo="Eliminar cuenta"
          descripcion="Esta acción es permanente e irreversible. Se eliminarán todos tus datos, pólizas y documentos. No podrás recuperar tu cuenta."
          labelConfirm="Eliminar cuenta"
          colorConfirm="bg-rose-600"
          onClose={() => setModalEliminar(false)}
          onConfirmar={() => {
            setModalEliminar(false);
            onGuardar('Solicitud de eliminación enviada.');
          }}
        />
      )}
    </>
  );
}

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
