'use client';
import { useState } from 'react';
import {
  MdArrowForward,
  MdShield,
  MdPerson,
  MdEdit,
  MdSave,
  MdClose,
  MdCheck,
  MdCheckCircle,
  MdLock,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdBadge,
  MdPeople,
  MdNotifications,
  MdNotificationsActive,
  MdSecurity,
  MdVisibility,
  MdVisibilityOff,
  MdWarningAmber,
  MdInfo,
  MdCameraAlt,
  MdContactPhone,
  MdFamilyRestroom,
  MdToggleOn,
  MdToggleOff,
  MdChevronRight,
  MdLogout,
  MdVerified,
} from 'react-icons/md';

// ── Data mock ──────────────────────────────────────────────────
const PERFIL_INICIAL = {
  nombre: 'Carlos',
  apellidos: 'Ramírez Torres',
  tipoDoc: 'DNI',
  numDoc: '45678921',
  fechaNacimiento: '14/07/1990',
  correo: 'carlos.ramirez@gmail.com',
  correoVerificado: true,
  telefono: '+51 987 654 321',
  telefonoVerificado: true,
  direccion: 'Av. Javier Prado 1280',
  distrito: 'Miraflores',
  ciudad: 'Lima',
  codigoPostal: '15074',
};

const CONTACTO_EMERGENCIA_INICIAL = {
  nombre: 'María Torres',
  relacion: 'Madre',
  telefono: '+51 976 543 210',
  correo: 'maria.torres@gmail.com',
};

const BENEFICIARIOS_INICIAL = [
  { id: 1, nombre: 'María Torres', relacion: 'Madre', porcentaje: '60', doc: '23456789' },
  { id: 2, nombre: 'Luis Ramírez', relacion: 'Hermano', porcentaje: '40', doc: '34567890' },
];

const PREFERENCIAS_INICIAL = {
  emailMarketing: true,
  emailRecordatorios: true,
  smsRecordatorios: false,
  pushNotificaciones: true,
  whatsapp: true,
};

// ── Toast ──────────────────────────────────────────────────────
function Toast({ mensaje, onClose }) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4 py-3 bg-emerald-600 text-white rounded-2xl shadow-lg text-sm font-medium animate-bounce-once">
      <MdCheckCircle size={18} />
      {mensaje}
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <MdClose size={15} />
      </button>
    </div>
  );
}

// ── Modal Cambiar Contraseña ───────────────────────────────────
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
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
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
              toggleShow: () => setShowActual((v) => !v),
            },
            {
              label: 'Nueva contraseña',
              val: nueva,
              set: setNueva,
              show: showNueva,
              toggleShow: () => setShowNueva((v) => !v),
            },
            {
              label: 'Confirmar nueva contraseña',
              val: confirmar,
              set: setConfirmar,
              show: showConfirmar,
              toggleShow: () => setShowConfirmar((v) => !v),
            },
          ].map(({ label, val, set, show, toggleShow }) => (
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
                  onClick={toggleShow}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text transition-colors"
                >
                  {show ? <MdVisibilityOff size={16} /> : <MdVisibility size={16} />}
                </button>
              </div>
            </div>
          ))}

          {/* Reglas */}
          {nueva.length > 0 && (
            <div className="flex flex-col gap-1.5 bg-bg-soft rounded-xl p-3">
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

// ── Sección: Datos personales ──────────────────────────────────
function SeccionDatosPersonales({ onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState(PERFIL_INICIAL);
  const [draft, setDraft] = useState(PERFIL_INICIAL);

  const campos = [
    { key: 'nombre', label: 'Nombre(s)', icono: MdPerson, grid: 'col-span-1' },
    { key: 'apellidos', label: 'Apellidos', icono: MdPerson, grid: 'col-span-1' },
    {
      key: 'tipoDoc',
      label: 'Tipo de documento',
      icono: MdBadge,
      tipo: 'select',
      opciones: ['DNI', 'CE', 'Pasaporte'],
      grid: 'col-span-1',
    },
    { key: 'numDoc', label: 'N° de documento', icono: MdBadge, grid: 'col-span-1' },
    { key: 'fechaNacimiento', label: 'Fecha de nacimiento', icono: MdPerson, grid: 'col-span-1' },
  ];

  const camposContacto = [
    {
      key: 'correo',
      label: 'Correo electrónico',
      icono: MdEmail,
      verificado: datos.correoVerificado,
      grid: 'col-span-2',
    },
    { key: 'telefono', label: 'Teléfono', icono: MdPhone, verificado: datos.telefonoVerificado, grid: 'col-span-1' },
  ];

  const camposDireccion = [
    { key: 'direccion', label: 'Dirección', icono: MdLocationOn, grid: 'col-span-2' },
    { key: 'distrito', label: 'Distrito', icono: MdLocationOn, grid: 'col-span-1' },
    { key: 'ciudad', label: 'Ciudad', icono: MdLocationOn, grid: 'col-span-1' },
    { key: 'codigoPostal', label: 'Código postal', icono: MdLocationOn, grid: 'col-span-1' },
  ];

  const handleGuardar = () => {
    setDatos(draft);
    setEditando(false);
    onGuardar('Datos personales actualizados correctamente.');
  };

  const handleCancelar = () => {
    setDraft(datos);
    setEditando(false);
  };

  const renderCampo = (campo) => {
    const val = editando ? draft[campo.key] : datos[campo.key];
    if (!editando) {
      return (
        <div key={campo.key} className={`${campo.grid}`}>
          <label className="text-xs text-text-soft flex items-center gap-1 mb-1">
            <campo.icono size={11} /> {campo.label}
          </label>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-text">{val}</p>
            {campo.verificado !== undefined &&
              (campo.verificado ? (
                <MdVerified size={14} className="text-emerald-500" />
              ) : (
                <MdWarningAmber size={14} className="text-amber-500" />
              ))}
          </div>
        </div>
      );
    }
    return (
      <div key={campo.key} className={`${campo.grid}`}>
        <label className="text-xs font-medium text-text-soft block mb-1.5">
          <campo.icono size={11} className="inline mr-1" />
          {campo.label}
        </label>
        {campo.tipo === 'select' ? (
          <select
            value={val}
            onChange={(e) => setDraft((d) => ({ ...d, [campo.key]: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
          >
            {campo.opciones.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            value={val}
            onChange={(e) => setDraft((d) => ({ ...d, [campo.key]: e.target.value }))}
            className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
          />
        )}
      </div>
    );
  };

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-primary/20" />
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MdPerson size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Datos personales</p>
            <p className="text-xs text-text-soft mt-0.5">Información básica de tu cuenta</p>
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
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              CR
            </div>
            {editando && (
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-bg">
                <MdCameraAlt size={12} className="text-white" />
              </button>
            )}
          </div>
          <div>
            <p className="text-base font-bold text-text">
              {datos.nombre} {datos.apellidos}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              {datos.tipoDoc} {datos.numDoc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-1.5">
              <MdVerified size={11} /> Cuenta verificada
            </span>
          </div>
        </div>

        {/* Campos identidad */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Identidad</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">{campos.map(renderCampo)}</div>
        </div>

        <div className="h-px bg-border" />

        {/* Campos contacto */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Contacto</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">{camposContacto.map(renderCampo)}</div>
          {!datos.telefonoVerificado && !editando && (
            <div className="flex items-center gap-2 mt-3 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
              <MdWarningAmber size={14} className="text-amber-600 shrink-0" />
              <p className="text-xs text-amber-700 flex-1">Teléfono sin verificar.</p>
              <button className="text-xs font-semibold text-amber-700 hover:underline">Verificar</button>
            </div>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Campos dirección */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Dirección</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">{camposDireccion.map(renderCampo)}</div>
        </div>
      </div>
    </div>
  );
}

// ── Sección: Contacto de emergencia ───────────────────────────
function SeccionContactoEmergencia({ onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [datos, setDatos] = useState(CONTACTO_EMERGENCIA_INICIAL);
  const [draft, setDraft] = useState(CONTACTO_EMERGENCIA_INICIAL);

  const campos = [
    { key: 'nombre', label: 'Nombre completo', icono: MdPerson },
    {
      key: 'relacion',
      label: 'Relación',
      icono: MdFamilyRestroom,
      tipo: 'select',
      opciones: ['Madre', 'Padre', 'Hijo/a', 'Cónyuge', 'Hermano/a', 'Otro'],
    },
    { key: 'telefono', label: 'Teléfono', icono: MdPhone },
    { key: 'correo', label: 'Correo electrónico', icono: MdEmail },
  ];

  const handleGuardar = () => {
    setDatos(draft);
    setEditando(false);
    onGuardar('Contacto de emergencia actualizado.');
  };

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-rose-200" />
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
            <MdContactPhone size={18} className="text-rose-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Contacto de emergencia</p>
            <p className="text-xs text-text-soft mt-0.5">Persona a contactar en caso de emergencia</p>
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
              onClick={() => {
                setDraft(datos);
                setEditando(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdClose size={13} /> Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {!editando ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-sm font-bold text-rose-500">
              {datos.nombre
                .split(' ')
                .map((n) => n[0])
                .join('')
                .slice(0, 2)}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
              {[
                { label: 'Nombre', val: datos.nombre },
                { label: 'Relación', val: datos.relacion },
                { label: 'Teléfono', val: datos.telefono },
                { label: 'Correo', val: datos.correo },
              ].map(({ label, val }) => (
                <div key={label}>
                  <p className="text-xs text-text-soft">{label}</p>
                  <p className="text-sm font-semibold text-text mt-0.5">{val}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {campos.map((campo) => (
              <div key={campo.key}>
                <label className="text-xs font-medium text-text-soft block mb-1.5">
                  <campo.icono size={11} className="inline mr-1" />
                  {campo.label}
                </label>
                {campo.tipo === 'select' ? (
                  <select
                    value={draft[campo.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [campo.key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
                  >
                    {campo.opciones.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={draft[campo.key]}
                    onChange={(e) => setDraft((d) => ({ ...d, [campo.key]: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sección: Beneficiarios ─────────────────────────────────────
function SeccionBeneficiarios({ onGuardar }) {
  const [beneficiarios, setBeneficiarios] = useState(BENEFICIARIOS_INICIAL);
  const [editandoId, setEditandoId] = useState(null);
  const [drafts, setDrafts] = useState({});

  const totalPct = beneficiarios.reduce((acc, b) => acc + parseInt(b.porcentaje || 0), 0);

  const handleEditarBen = (b) => {
    setEditandoId(b.id);
    setDrafts((d) => ({ ...d, [b.id]: { ...b } }));
  };

  const handleGuardarBen = (id) => {
    setBeneficiarios((bs) => bs.map((b) => (b.id === id ? drafts[id] : b)));
    setEditandoId(null);
    onGuardar('Beneficiarios actualizados correctamente.');
  };

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-emerald-200" />
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <MdFamilyRestroom size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Beneficiarios</p>
            <p className="text-xs text-text-soft mt-0.5">Personas designadas en tus pólizas de vida</p>
          </div>
        </div>
        <div
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${totalPct === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
        >
          {totalPct}% asignado
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {beneficiarios.map((b) => {
          const esDraft = editandoId === b.id;
          const val = esDraft ? drafts[b.id] : b;
          return (
            <div
              key={b.id}
              className={`rounded-xl border transition-all ${esDraft ? 'border-primary/30 bg-primary/5' : 'border-border'} p-4`}
            >
              {!esDraft ? (
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700">
                    {b.nombre
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text">{b.nombre}</p>
                    <p className="text-xs text-text-soft mt-0.5">
                      {b.relacion} · DNI {b.doc}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-emerald-600">{b.porcentaje}%</p>
                    <p className="text-xs text-text-soft">del beneficio</p>
                  </div>
                  <button
                    onClick={() => handleEditarBen(b)}
                    className="p-2 rounded-lg border border-border hover:bg-bg-soft text-text-soft transition-colors shrink-0"
                  >
                    <MdEdit size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'nombre', label: 'Nombre' },
                      { key: 'relacion', label: 'Relación' },
                      { key: 'doc', label: 'N° documento' },
                      { key: 'porcentaje', label: 'Porcentaje (%)' },
                    ].map(({ key, label }) => (
                      <div key={key}>
                        <label className="text-xs font-medium text-text-soft block mb-1">{label}</label>
                        <input
                          value={val[key]}
                          onChange={(e) => setDrafts((d) => ({ ...d, [b.id]: { ...d[b.id], [key]: e.target.value } }))}
                          className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGuardarBen(b.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                    >
                      <MdSave size={13} /> Guardar
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="flex-1 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {totalPct !== 100 && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <MdWarningAmber size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">El total de porcentajes debe sumar 100%. Actualmente: {totalPct}%.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sección: Preferencias ──────────────────────────────────────
function SeccionPreferencias({ onGuardar }) {
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

// ── Sección: Seguridad ─────────────────────────────────────────
function SeccionSeguridad({ onAbrirContrasena }) {
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
          {
            icon: MdShield,
            label: 'Autenticación en dos pasos',
            sub: 'Añade una capa extra de seguridad',
            accion: 'Activar',
            onClick: () => {},
            color: 'text-emerald-600',
          },
          {
            icon: MdInfo,
            label: 'Sesiones activas',
            sub: '1 sesión activa en este dispositivo',
            accion: 'Ver',
            onClick: () => {},
            color: 'text-sky-600',
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

// ── Main ──────────────────────────────────────────────────────
export default function ModuloPerfil() {
  const [toast, setToast] = useState(null);
  const [modalContrasena, setModalContrasena] = useState(false);

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen pb-10 flex flex-col">
      {/* Header */}
      <div className="">
        <div className="px-8 py-5">
          <div>
            {/* Título */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-text leading-tight">Mi perfil</h1>
                  <p className="text-sm text-text-soft mt-0.5">
                    Gestiona tu información personal y preferencias de cuenta.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-8">
        <div className="flex flex-col gap-5">
          <SeccionDatosPersonales onGuardar={mostrarToast} />
          <SeccionContactoEmergencia onGuardar={mostrarToast} />
          <SeccionBeneficiarios onGuardar={mostrarToast} />
          <SeccionPreferencias onGuardar={mostrarToast} />
          <SeccionSeguridad onAbrirContrasena={() => setModalContrasena(true)} />
        </div>
      </div>

      {/* Modal contraseña */}
      {modalContrasena && (
        <ModalContrasena
          onClose={() => setModalContrasena(false)}
          onGuardar={() => {
            setModalContrasena(false);
            mostrarToast('Contraseña actualizada correctamente.');
          }}
        />
      )}

      {/* Toast */}
      {toast && <Toast mensaje={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
