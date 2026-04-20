import { useState } from 'react';
import {
  MdManageAccounts,
  MdEdit,
  MdSave,
  MdClose,
  MdLanguage,
  MdAttachMoney,
  MdAccessTime,
  MdLightMode,
  MdDarkMode,
  MdSettings,
  MdWarningAmber,
  MdLogout,
  MdDeleteForever,
  MdChevronRight,
} from 'react-icons/md';
import { PREFERENCIAS_INICIAL } from './data';
import ModalConfirmar from './ModalConfirmar';

export default function SeccionCuenta({ onGuardar }) {
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
