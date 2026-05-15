'use client';

import { useEffect, useState } from 'react';
import {
  MdFamilyRestroom,
  MdEdit,
  MdSave,
  MdAdd,
  MdDelete,
  MdWarningAmber,
} from 'react-icons/md';
import { apiGet, apiPut } from '@/lib/api';
import { PARENTESCOS } from './data';

function nuevoVacio() {
  return {
    id_beneficiario: null,
    nombres: '',
    apellidos: '',
    parentesco: '',
    documento_identidad: '',
    porcentaje: 0,
  };
}

export default function SeccionBeneficiarios({ onGuardar }) {
  const [lista, setLista] = useState([]);
  const [borrador, setBorrador] = useState([]);
  const [modo, setModo] = useState('lectura');
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/perfil/beneficiarios');
      setLista(data || []);
      setBorrador(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los beneficiarios');
    } finally {
      setCargando(false);
    }
  };

  const totalPct = borrador.reduce(
    (acc, b) => acc + Number(b.porcentaje || 0),
    0
  );

  const setCampo = (idx, key, val) => {
    setBorrador((bs) => bs.map((b, i) => (i === idx ? { ...b, [key]: val } : b)));
  };

  const agregar = () => {
    setBorrador((bs) => [...bs, nuevoVacio()]);
    setModo('edicion');
  };

  const eliminar = (idx) => {
    setBorrador((bs) => bs.filter((_, i) => i !== idx));
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError('');
    try {
      const payload = borrador.map((b) => ({
        nombres: b.nombres,
        apellidos: b.apellidos,
        parentesco: b.parentesco,
        documento_identidad: b.documento_identidad || null,
        porcentaje: Number(b.porcentaje),
      }));
      const data = await apiPut('/perfil/beneficiarios', payload);
      setLista(data || []);
      setBorrador(data || []);
      setModo('lectura');
      onGuardar('Beneficiarios actualizados correctamente.');
    } catch (e) {
      setError(e.mensaje || 'No se pudo guardar');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-6 text-sm text-text-soft">
        Cargando beneficiarios...
      </div>
    );
  }

  const enEdicion = modo === 'edicion';
  const datos = enEdicion ? borrador : lista;

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
            <p className="text-xs text-text-soft mt-0.5">Personas designadas en tus polizas de vida</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
              enEdicion
                ? totalPct === 100
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
                : 'bg-bg-soft text-text-soft'
            }`}
          >
            {enEdicion ? `${totalPct}% asignado` : `${lista.length} beneficiarios`}
          </div>
          {!enEdicion ? (
            <button
              onClick={() => {
                setBorrador(lista);
                setModo('edicion');
              }}
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
                onClick={() => {
                  setBorrador(lista);
                  setModo('lectura');
                  setError('');
                }}
                disabled={guardando}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {datos.length === 0 && !enEdicion && (
          <p className="text-sm text-text-soft">Aun no has registrado beneficiarios.</p>
        )}

        {datos.map((b, idx) => (
          <div
            key={b.id_beneficiario ?? `nuevo-${idx}`}
            className={`rounded-xl border p-4 ${enEdicion ? 'border-primary/30 bg-primary/5' : 'border-border'}`}
          >
            {!enEdicion ? (
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0 text-sm font-bold text-emerald-700">
                  {(b.nombres + ' ' + b.apellidos)
                    .split(' ')
                    .map((n) => n[0])
                    .filter(Boolean)
                    .join('')
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text">
                    {b.nombres} {b.apellidos}
                  </p>
                  <p className="text-xs text-text-soft mt-0.5">
                    {b.parentesco} {b.documento_identidad ? `· DNI ${b.documento_identidad}` : ''}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-base font-bold text-emerald-600">{b.porcentaje}%</p>
                  <p className="text-xs text-text-soft">del beneficio</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <Campo
                    label="Nombres"
                    valor={b.nombres}
                    onChange={(v) => setCampo(idx, 'nombres', v)}
                  />
                  <Campo
                    label="Apellidos"
                    valor={b.apellidos}
                    onChange={(v) => setCampo(idx, 'apellidos', v)}
                  />
                  <div>
                    <label className="text-xs font-medium text-text-soft block mb-1">Parentesco</label>
                    <select
                      value={b.parentesco}
                      onChange={(e) => setCampo(idx, 'parentesco', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
                    >
                      <option value="">Selecciona...</option>
                      {PARENTESCOS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <Campo
                    label="Documento (opcional)"
                    valor={b.documento_identidad}
                    onChange={(v) => setCampo(idx, 'documento_identidad', v)}
                  />
                  <Campo
                    label="Porcentaje (%)"
                    valor={b.porcentaje}
                    onChange={(v) => setCampo(idx, 'porcentaje', v)}
                    type="number"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => eliminar(idx)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-500 text-xs font-medium transition-colors"
                  >
                    <MdDelete size={13} /> Quitar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {enEdicion && (
          <button
            onClick={agregar}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdAdd size={14} /> Agregar beneficiario
          </button>
        )}

        {enEdicion && totalPct !== 100 && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
            <MdWarningAmber size={14} className="text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">
              El total debe sumar 100% para mantener una distribucion valida. Actualmente: {totalPct}%.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Campo({ label, valor, onChange, type = 'text' }) {
  return (
    <div>
      <label className="text-xs font-medium text-text-soft block mb-1">{label}</label>
      <input
        type={type}
        value={valor ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
      />
    </div>
  );
}
