'use client';

import { useEffect, useState } from 'react';
import {
  MdPerson,
  MdBadge,
  MdEmail,
  MdPhone,
  MdEdit,
  MdSave,
  MdClose,
  MdShield,
} from 'react-icons/md';
import { apiGet, apiPut } from '@/lib/api';

const ESTADO_INICIAL = {
  username: '',
  portal_acceso: '',
  estado: '',
  nombres: '',
  apellidos: '',
  documento_identidad: '',
  telefono: '',
  email: '',
};

export default function SeccionDatosPersonales({ onGuardar }) {
  const [editando, setEditando] = useState(false);
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
        setDatos(data);
        setDraft(data);
      })
      .catch((e) => {
        if (!activo) return;
        setError(e.mensaje || 'No se pudo cargar el perfil');
      })
      .finally(() => activo && setCargando(false));
    return () => {
      activo = false;
    };
  }, []);

  const setCampo = (key, valor) => {
    setDraft((d) => ({ ...d, [key]: valor }));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError('');
    try {
      const data = await apiPut('/perfil', {
        nombres: draft.nombres,
        apellidos: draft.apellidos,
        telefono: draft.telefono,
        email: draft.email,
      });
      setDatos(data);
      setDraft(data);
      setEditando(false);
      onGuardar('Datos personales actualizados correctamente.');
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

  const iniciales =
    (datos.nombres?.[0] || '') + (datos.apellidos?.[0] || '');

  if (cargando) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-6 text-sm text-text-soft">
        Cargando datos personales...
      </div>
    );
  }

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

      <div className="p-5 flex flex-col gap-5">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Avatar + portal */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary uppercase">
            {iniciales || '·'}
          </div>
          <div>
            <p className="text-base font-bold text-text">
              {datos.nombres} {datos.apellidos}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              <span className="font-semibold">@{datos.username}</span> · DNI {datos.documento_identidad}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-1.5">
              <MdShield size={11} /> Portal {datos.portal_acceso}
            </span>
          </div>
        </div>

        {/* Identidad (solo lectura) */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Identidad</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Campo
              label="Nombres"
              icono={MdPerson}
              valor={editando ? draft.nombres : datos.nombres}
              onChange={editando ? (v) => setCampo('nombres', v) : null}
            />
            <Campo
              label="Apellidos"
              icono={MdPerson}
              valor={editando ? draft.apellidos : datos.apellidos}
              onChange={editando ? (v) => setCampo('apellidos', v) : null}
            />
            <Campo
              label="Documento de identidad"
              icono={MdBadge}
              valor={datos.documento_identidad}
              onChange={null}
            />
            <Campo
              label="Usuario"
              icono={MdBadge}
              valor={datos.username}
              onChange={null}
            />
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* Contacto (editable) */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Contacto</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <Campo
              label="Correo electrónico"
              icono={MdEmail}
              valor={editando ? draft.email : datos.email}
              onChange={editando ? (v) => setCampo('email', v) : null}
              colSpan={2}
              type="email"
            />
            <Campo
              label="Teléfono"
              icono={MdPhone}
              valor={editando ? draft.telefono : datos.telefono}
              onChange={editando ? (v) => setCampo('telefono', v) : null}
              type="tel"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Campo({ label, icono: Icono, valor, onChange, colSpan = 1, type = 'text' }) {
  if (!onChange) {
    return (
      <div className={colSpan === 2 ? 'col-span-2' : ''}>
        <label className="text-xs text-text-soft flex items-center gap-1 mb-1">
          <Icono size={11} /> {label}
        </label>
        <p className="text-sm font-semibold text-text">{valor || '—'}</p>
      </div>
    );
  }
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
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
