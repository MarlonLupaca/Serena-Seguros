'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdEmail,
  MdPhone,
  MdPerson,
  MdPeopleOutline,
  MdEdit,
  MdBadge,
  MdCalendarToday,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';
import ModalDetalleCliente from './ModalDetalleCliente';

const ESTADO_CRM = {
  NUEVO: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  CONTACTADO: { label: 'Contactado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  CLIENTE: { label: 'Cliente', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  INACTIVO: { label: 'Inactivo', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [detalleId, setDetalleId] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/clientes');
      setClientes(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los clientes');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevo) => {
    setActualizandoId(id);
    try {
      const data = await apiPatch(`/clientes/${id}/estado-crm`, { estado_crm: nuevo });
      setClientes((prev) => prev.map((c) => (c.id_cliente === id ? data : c)));
      toast.success('Estado actualizado');
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };
  const filtrados = clientes.filter((c) => {
    const texto = busqueda.toLowerCase();
    const matchBusq =
      texto === '' ||
      `${c.nombres} ${c.apellidos}`.toLowerCase().includes(texto) ||
      (c.email || '').toLowerCase().includes(texto) ||
      (c.documento_identidad || '').includes(texto);
    const matchFiltro = filtro === 'todos' || c.estado_crm === filtro;
    return matchBusq && matchFiltro;
  });

  const counts = Object.keys(ESTADO_CRM).reduce(
    (acc, k) => ({ ...acc, [k]: clientes.filter((c) => c.estado_crm === k).length }),
    { total: clientes.length }
  );

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Cartera de clientes</h1>
        <p className="text-xs text-text-soft mt-0.5">{counts.total} clientes registrados</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-primary/10">
            <MdPeopleOutline size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xl font-bold text-text leading-tight">{counts.total}</p>
            <p className="text-xs text-text-soft">Total</p>
          </div>
        </div>
        {Object.entries(ESTADO_CRM).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFiltro(filtro === k ? 'todos' : k)}
            className={`text-left rounded-xl border p-3 transition-colors ${
              filtro === k ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
              <p className="text-xs text-text-soft">{v.label}</p>
            </div>
            <p className="text-lg font-bold text-text">{counts[k] || 0}</p>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-bg border border-border rounded-xl px-3 py-2">
        <MdSearch size={14} className="text-text-soft shrink-0" />
        <input
          className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
          placeholder="Buscar por nombre, email o documento..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando clientes...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <MdPeopleOutline size={32} className="text-text-soft" />
          <p className="text-sm font-semibold text-text">Sin resultados</p>
          <p className="text-xs text-text-soft">Prueba con otro filtro o búsqueda.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((c) => (
            <ClienteCard
              key={c.id_cliente}
              cliente={c}
              actualizando={actualizandoId === c.id_cliente}
              onCambiarEstado={(estado) => cambiarEstado(c.id_cliente, estado)}
              onVerDetalle={() => setDetalleId(c.id_cliente)}
            />
          ))}
        </div>
      )}

      {detalleId && <ModalDetalleCliente idCliente={detalleId} onClose={() => setDetalleId(null)} />}
    </div>
  );
}

function ClienteCard({ cliente, onCambiarEstado, actualizando, onVerDetalle }) {
  const est = ESTADO_CRM[cliente.estado_crm] || ESTADO_CRM.NUEVO;
  const [menu, setMenu] = useState(false);
  const iniciales = ((cliente.nombres || '')[0] || '') + ((cliente.apellidos || '')[0] || '');

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow ">
      <div className="h-1 w-full bg-primary/30" />
      <div className="p-5 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary uppercase shrink-0">
          {iniciales || <MdPerson size={20} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">
              {cliente.nombres} {cliente.apellidos}
            </p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
              {est.label}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">CLI-{String(cliente.id_cliente).padStart(6, '0')}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
            <span className="flex items-center gap-1">
              <MdBadge size={11} /> DNI {cliente.documento_identidad}
            </span>
            <span className="flex items-center gap-1">
              <MdEmail size={11} /> {cliente.email}
            </span>
            {cliente.telefono && (
              <span className="flex items-center gap-1">
                <MdPhone size={11} /> {cliente.telefono}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MdCalendarToday size={11} /> Desde {formatearFecha(cliente.fecha_registro)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 relative">
          <button
            onClick={onVerDetalle}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Ver detalle
          </button>
          <button
            onClick={() => setMenu((v) => !v)}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
          >
            <MdEdit size={13} /> {actualizando ? 'Actualizando...' : 'Cambiar estado'}
          </button>
          {menu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-bg border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              {Object.entries(ESTADO_CRM)
                .filter(([k]) => k !== cliente.estado_crm)
                .map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMenu(false);
                      onCambiarEstado(key);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-soft hover:bg-bg-soft transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    Marcar como {cfg.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
