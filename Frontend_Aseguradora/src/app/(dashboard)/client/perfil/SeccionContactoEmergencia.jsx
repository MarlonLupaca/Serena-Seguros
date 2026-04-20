import { useState } from 'react';
import { MdPerson, MdFamilyRestroom, MdPhone, MdEmail, MdContactPhone, MdEdit, MdSave, MdClose } from 'react-icons/md';
import { CONTACTO_EMERGENCIA_INICIAL } from './data';

export default function SeccionContactoEmergencia({ onGuardar }) {
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
