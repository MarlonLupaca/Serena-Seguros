import { useState } from 'react';
import {
  MdPerson,
  MdBadge,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdVerified,
  MdWarningAmber,
  MdEdit,
  MdSave,
  MdClose,
  MdCameraAlt,
} from 'react-icons/md';
import { PERFIL_INICIAL } from './data';

export default function SeccionDatosPersonales({ onGuardar }) {
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
