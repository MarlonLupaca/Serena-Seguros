'use client';

import { useEffect, useState } from 'react';
import {
  MdPerson,
  MdFamilyRestroom,
  MdPhone,
  MdEmail,
  MdContactPhone,
  MdEdit,
  MdSave,
  MdClose,
} from 'react-icons/md';
import { apiGet, apiPut } from '@/lib/api';
import { RELACIONES } from './data';

const ESTADO_INICIAL = {
  contacto_emergencia_nombre: '',
  contacto_emergencia_relacion: '',
  contacto_emergencia_telefono: '',
  contacto_emergencia_correo: '',
};

export default function SeccionContactoEmergencia({ onGuardar }) {
  const [editando, setEditando] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [datos, setDatos] = useState(ESTADO_INICIAL);
  const [draft, setDraft] = useState(ESTADO_INICIAL);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;
    apiGet('/perfil')
      .then((data) => {
        if (!activo) return;
        setPerfil(data);
        const v = {
          contacto_emergencia_nombre: data.contacto_emergencia_nombre || '',
          contacto_emergencia_relacion: data.contacto_emergencia_relacion || '',
          contacto_emergencia_telefono: data.contacto_emergencia_telefono || '',
          contacto_emergencia_correo: data.contacto_emergencia_correo || '',
        };
        setDatos(v);
        setDraft(v);
      })
      .catch((e) => activo && setError(e.mensaje || 'No se pudo cargar'))
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const handleGuardar = async () => {
    if (!perfil) return;
    setGuardando(true);
    setError('');
    try {
      const data = await apiPut('/perfil', {
        nombres: perfil.nombres,
        apellidos: perfil.apellidos,
        telefono: perfil.telefono,
        email: perfil.email,
        ...draft,
      });
      setPerfil(data);
      const v = {
        contacto_emergencia_nombre: data.contacto_emergencia_nombre || '',
        contacto_emergencia_relacion: data.contacto_emergencia_relacion || '',
        contacto_emergencia_telefono: data.contacto_emergencia_telefono || '',
        contacto_emergencia_correo: data.contacto_emergencia_correo || '',
      };
      setDatos(v);
      setDraft(v);
      setEditando(false);
      onGuardar('Contacto de emergencia actualizado.');
    } catch (e) {
      setError(e.mensaje || 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    setDraft(datos);
    setEditando(false);
    setError('');
  };

  if (cargando) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-6 text-sm text-text-soft">
        Cargando contacto de emergencia...
      </div>
    );
  }

  const sinContacto = !datos.contacto_emergencia_nombre;

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
              disabled={guardando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdSave size={13} /> {guardando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={handleCancelar}
              disabled={guardando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
            >
              <MdClose size={13} /> Cancelar
            </button>
          </div>
        )}
      </div>

      <div className="p-5">
        {error && (
          <div className="p-3 mb-4 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {!editando ? (
          sinContacto ? (
            <p className="text-sm text-text-soft">Aun no has registrado un contacto de emergencia.</p>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 text-sm font-bold text-rose-500">
                {datos.contacto_emergencia_nombre
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                <Lectura label="Nombre" valor={datos.contacto_emergencia_nombre} />
                <Lectura label="Relación" valor={datos.contacto_emergencia_relacion} />
                <Lectura label="Teléfono" valor={datos.contacto_emergencia_telefono} />
                <Lectura label="Correo" valor={datos.contacto_emergencia_correo} />
              </div>
            </div>
          )
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Editor
              icono={MdPerson}
              label="Nombre completo"
              valor={draft.contacto_emergencia_nombre}
              onChange={(v) => setDraft((d) => ({ ...d, contacto_emergencia_nombre: v }))}
            />
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                <MdFamilyRestroom size={11} className="inline mr-1" />
                Relación
              </label>
              <select
                value={draft.contacto_emergencia_relacion}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, contacto_emergencia_relacion: e.target.value }))
                }
                className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="">Selecciona...</option>
                {RELACIONES.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <Editor
              icono={MdPhone}
              label="Teléfono"
              valor={draft.contacto_emergencia_telefono}
              onChange={(v) => setDraft((d) => ({ ...d, contacto_emergencia_telefono: v }))}
            />
            <Editor
              icono={MdEmail}
              label="Correo electrónico"
              valor={draft.contacto_emergencia_correo}
              onChange={(v) => setDraft((d) => ({ ...d, contacto_emergencia_correo: v }))}
              type="email"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function Lectura({ label, valor }) {
  return (
    <div>
      <p className="text-xs text-text-soft">{label}</p>
      <p className="text-sm font-semibold text-text mt-0.5">{valor || '—'}</p>
    </div>
  );
}

function Editor({ label, icono: Icono, valor, onChange, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-medium text-text-soft block mb-1.5">
        <Icono size={11} className="inline mr-1" />
        {label}
      </label>
      <input
        type={type}
        value={valor || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
      />
    </div>
  );
}
