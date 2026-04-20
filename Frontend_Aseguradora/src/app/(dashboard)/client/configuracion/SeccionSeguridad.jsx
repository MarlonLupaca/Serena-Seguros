import { useState } from 'react';
import {
  MdLock,
  MdEdit,
  MdFingerprint,
  MdShield,
  MdVerified,
  MdChevronRight,
  MdDevices,
  MdClose,
} from 'react-icons/md';
import ModalContrasena from './ModalContrasena';
import ModalConfirmar from './ModalConfirmar';
import { SESIONES_MOCK } from './data';

export default function SeccionSeguridad({ onGuardar }) {
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
          colorConfirm="bg-amber-600"
          onClose={() => setModalSesion(false)}
          onConfirmar={cerrarTodasSesiones}
        />
      )}
    </>
  );
}
