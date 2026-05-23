'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { MdAdd, MdClose, MdDomain, MdEdit, MdSearch, MdBlock } from 'react-icons/md';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../componentsMain/DataTable';

const ESTADOS = {
  OPERATIVO: { label: 'Operativo', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  MANTENIMIENTO: { label: 'Mantenimiento', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  BAJA: { label: 'Baja', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
};

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADO_VACIO = { tipo: '', marca: '', valor_depreciacion: '0', estado: 'OPERATIVO', id_empleado_asignado: '' };

export default function ActivosPage() {
  const [activos, setActivos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modal, setModal] = useState(null);
useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [a, e] = await Promise.all([apiGet('/activos'), apiGet('/empleados')]);
      setActivos(a || []);
      setEmpleados(e || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
const baja = async (id) => {
    try {
      await apiDelete(`/activos/${id}`);
      toast.success('Activo dado de baja');
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo dar de baja');
    }
  };

  const filtrados = activos.filter((a) => {
    const matchEstado = filtro === 'todos' || a.estado === filtro;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (a.tipo || '').toLowerCase().includes(t) || (a.marca || '').toLowerCase().includes(t);
    return matchEstado && matchBusq;
  });

  const totalDepreciacion = activos.reduce((acc, a) => acc + Number(a.valor_depreciacion || 0), 0);

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Activos internos</h1>
          <p className="text-xs text-text-soft mt-0.5">{activos.length} activos · {formatearMoneda(totalDepreciacion)} en depreciación</p>
        </div>
        <button onClick={() => setModal({ modo: 'crear', data: { ...ESTADO_VACIO } })} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
          <MdAdd size={15} /> Nuevo activo
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input placeholder="Buscar..." value={busq} onChange={(e) => setBusq(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary" />
        </div>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none">
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center"><MdDomain size={32} className="text-text-soft mx-auto mb-3 opacity-40" /><p className="text-sm font-medium text-text">Sin activos</p></div>
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Activo</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead align="right">Depreciación</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead align="right">Acciones</TableHead>
          </TableHeader>
          <TableBody>
            {filtrados.map((a) => (
              <ActivoTableRow
                key={a.id_activo}
                a={a}
                onEditar={() => setModal({ modo: 'editar', data: { id_activo: a.id_activo, tipo: a.tipo, marca: a.marca, valor_depreciacion: String(a.valor_depreciacion ?? '0'), estado: a.estado, id_empleado_asignado: a.id_empleado_asignado ? String(a.id_empleado_asignado) : '' } })}
                onBaja={() => baja(a.id_activo)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {modal && (
        <ModalActivo modo={modal.modo} dataInicial={modal.data} empleados={empleados} onClose={() => setModal(null)} onSuccess={() => { setModal(null); toast.success(modal.modo === 'crear' ? 'Activo creado' : 'Activo actualizado'); cargar(); }} />
      )}
    </div>
  );
}

function ActivoTableRow({ a, onEditar, onBaja }) {
  const est = ESTADOS[a.estado] || ESTADOS.OPERATIVO;
  const inactivo = a.estado === 'BAJA';

  return (
    <TableRow className={inactivo ? 'opacity-60' : ''}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MdDomain size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-text truncate max-w-[200px]">{a.tipo} · {a.marca}</p>
            <p className="text-[11px] text-text-soft">ACT-{String(a.id_activo).padStart(6, '0')}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm font-semibold text-text">{a.empleado_asignado || 'Sin asignar'}</span>
      </TableCell>
      <TableCell align="right">
        <span className="text-sm font-bold text-emerald-600">{formatearMoneda(a.valor_depreciacion)}</span>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${est.badge}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
          {est.label}
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
              onClick={onBaja}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
              title="Dar de baja"
            >
              <MdBlock size={14} />
            </button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

function ModalActivo({ modo, dataInicial, empleados, onClose, onSuccess }) {
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
        tipo: form.tipo,
        marca: form.marca,
        valor_depreciacion: Number(form.valor_depreciacion),
        estado: form.estado,
        id_empleado_asignado: form.id_empleado_asignado ? Number(form.id_empleado_asignado) : null,
      };
      if (modo === 'crear') await apiPost('/activos', payload);
      else await apiPut(`/activos/${form.id_activo}`, payload);
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
          <p className="text-sm font-bold text-text">{modo === 'crear' ? 'Nuevo' : 'Editar'} activo</p>
          <button onClick={onClose} className="text-text-soft hover:text-text"><MdClose size={18} /></button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo</label>
              <input value={form.tipo} onChange={(e) => set('tipo', e.target.value)} required className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Marca</label>
              <input value={form.marca} onChange={(e) => set('marca', e.target.value)} required className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Valor depreciación (S/)</label>
              <input type="number" step="0.01" min="0" value={form.valor_depreciacion} onChange={(e) => set('valor_depreciacion', e.target.value)} required className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Estado</label>
              <select value={form.estado} onChange={(e) => set('estado', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary">
                {Object.entries(ESTADOS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Asignar a (opcional)</label>
            <select value={form.id_empleado_asignado} onChange={(e) => set('id_empleado_asignado', e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary">
              <option value="">Sin asignar</option>
              {empleados.map((e) => <option key={e.id_empleado} value={e.id_empleado}>{e.nombres} {e.apellidos} ({e.cargo})</option>)}
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={enviando} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors">{enviando ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" onClick={onClose} disabled={enviando} className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
