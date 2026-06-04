'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdAdd,
  MdHandshake,
  MdSearch,
  MdEdit,
  MdBlock,
  MdClose,
  MdLocationCity,
  MdStar,
  MdLocalHospital,
  MdBuild,
  MdLocalShipping,
  MdGavel,
  MdMoreHoriz,
} from 'react-icons/md';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';

const RUBROS = [
  { value: 'CLINICA', label: 'Clínica', icon: MdLocalHospital, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  { value: 'TALLER', label: 'Taller', icon: MdBuild, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  { value: 'GRUA', label: 'Grúa', icon: MdLocalShipping, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  { value: 'ABOGADO', label: 'Abogado', icon: MdGavel, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
  { value: 'OTROS', label: 'Otros', icon: MdMoreHoriz, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' },
];

function rubroStyle(rubro) {
  return RUBROS.find((r) => r.value === rubro) || { icon: MdHandshake, accentBg: 'bg-bg-soft', accentText: 'text-text-soft', label: rubro };
}

const ESTADO_VACIO = { rubro: 'CLINICA', nombre: '', ciudad: '', rating_interno: '4.00' };

export default function ProveedoresCorePage() {
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroRubro, setFiltroRubro] = useState('todos');
  const [modal, setModal] = useState(null);
useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/proveedores');
      setProveedores(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
const suspender = async (id) => {
    try {
      await apiDelete(`/proveedores/${id}`);
      toast.success('Proveedor suspendido');
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo suspender');
    }
  };

  const filtrados = proveedores.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    const matchRubro = filtroRubro === 'todos' || p.rubro === filtroRubro;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (p.nombre || '').toLowerCase().includes(t) || (p.ciudad || '').toLowerCase().includes(t);
    return matchEstado && matchRubro && matchBusq;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Proveedores de red</h1>
          <p className="text-xs text-text-soft mt-0.5">{proveedores.length} proveedores</p>
        </div>
        <button
          onClick={() => setModal({ modo: 'crear', data: { ...ESTADO_VACIO } })}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Nuevo proveedor
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="SUSPENDIDO">Suspendido</option>
        </select>
        <select
          value={filtroRubro}
          onChange={(e) => setFiltroRubro(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
        >
          <option value="todos">Todos los rubros</option>
          {RUBROS.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdHandshake size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin resultados</p>
        </div>
      ) : (
        <DataTable
          data={filtrados}
          columns={[
            { label: 'Proveedor' },
            { label: 'Ciudad' },
            { label: 'Rating' },
            { label: 'Estado' },
            { label: 'Acciones', align: 'right' }
          ]}
          renderRow={(p) => (
            <ProveedorTableRow
              key={p.id_proveedor}
              p={p}
              onEditar={() =>
                setModal({
                  modo: 'editar',
                  data: {
                    id_proveedor: p.id_proveedor,
                    rubro: p.rubro,
                    nombre: p.nombre,
                    ciudad: p.ciudad,
                    rating_interno: String(p.rating_interno ?? '4.00'),
                  },
                })
              }
              onSuspender={() => suspender(p.id_proveedor)}
            />
          )}
        />
      )}

      {modal && (
        <ModalProveedor
          modo={modal.modo}
          dataInicial={modal.data}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            toast.success(modal.modo === 'crear' ? 'Proveedor creado' : 'Proveedor actualizado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function ProveedorTableRow({ p, onEditar, onSuspender }) {
  const r = rubroStyle(p.rubro);
  const Icon = r.icon;
  const inactivo = p.estado === 'SUSPENDIDO';

  return (
    <TableRow className={inactivo ? 'opacity-60' : ''}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.accentBg}`}>
            <Icon size={18} className={r.accentText} />
          </div>
          <div>
            <p className="text-sm font-bold text-text truncate max-w-[200px]">{p.nombre}</p>
            <p className="text-xs text-text-soft">{r.label}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1 text-sm font-medium text-text">
          <MdLocationCity size={14} className="text-text-soft" /> {p.ciudad}
        </span>
      </TableCell>
      <TableCell>
        {p.rating_interno != null ? (
          <span className="flex items-center gap-1 text-sm font-bold text-text">
            <MdStar size={14} className="text-amber-500" />
            {Number(p.rating_interno).toFixed(2)}
          </span>
        ) : (
          <span className="text-text-soft text-xs">—</span>
        )}
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            inactivo ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {p.estado}
        </span>
      </TableCell>
      <TableCell align="right">
        <div className="flex gap-2 justify-end shrink-0">
          <button
            onClick={onEditar}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-bg-soft text-text-soft transition-colors"
            title="Editar"
          >
            <MdEdit size={14} />
          </button>
          {!inactivo && (
            <button
              onClick={onSuspender}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
              title="Suspender"
            >
              <MdBlock size={14} />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function ModalProveedor({ modo, dataInicial, onClose, onSuccess }) {
  const [form, setForm] = useState(dataInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const payload = {
        rubro: form.rubro,
        nombre: form.nombre,
        ciudad: form.ciudad,
        rating_interno: Number(form.rating_interno || 0),
      };
      if (modo === 'crear') {
        await apiPost('/proveedores', payload);
      } else {
        await apiPut(`/proveedores/${form.id_proveedor}`, payload);
      }
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo guardar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">{modo === 'crear' ? 'Nuevo' : 'Editar'} proveedor</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Rubro</label>
            <select
              value={form.rubro}
              onChange={(e) => set('rubro', e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              {RUBROS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              required
              maxLength={150}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Ciudad</label>
              <input
                value={form.ciudad}
                onChange={(e) => set('ciudad', e.target.value)}
                required
                maxLength={100}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Rating (0–5)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="5"
                value={form.rating_interno}
                onChange={(e) => set('rating_interno', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
