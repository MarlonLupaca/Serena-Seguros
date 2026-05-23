'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { MdAdd, MdAccountBalanceWallet, MdArrowDownward, MdArrowUpward, MdCalendarToday, MdClose, MdEdit, MdSearch } from 'react-icons/md';
import { apiGet, apiPatch, apiPost } from '@/lib/api';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../componentsMain/DataTable';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  APROBADO: { label: 'Aprobado', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  EJECUTADO: { label: 'Ejecutado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function TesoreriaPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [busq, setBusq] = useState('');
  const [modal, setModal] = useState(false);
  const [detalle, setDetalle] = useState(null);
  const [actualizandoId, setActualizandoId] = useState(null);
useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [m, r] = await Promise.all([apiGet('/tesoreria'), apiGet('/tesoreria/resumen')]);
      setMovimientos(m || []);
      setResumen(r);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
const cambiarEstado = async (id, estado) => {
    setActualizandoId(id);
    try {
      await apiPatch(`/tesoreria/${id}/estado`, { estado_aprobacion: estado });
      toast.success('Estado actualizado');
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtrados = movimientos.filter((m) => {
    const matchFiltro = filtro === 'todos' || m.estado_aprobacion === filtro;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (m.concepto || '').toLowerCase().includes(t);
    return matchFiltro && matchBusq;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Tesorería</h1>
          <p className="text-xs text-text-soft mt-0.5">{movimientos.length} movimientos</p>
        </div>
        <button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
          <MdAdd size={15} /> Nuevo movimiento
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Kpi label="Ingresos" val={formatearMoneda(resumen.ingresos)} icon={MdArrowUpward} bg="bg-emerald-100" color="text-emerald-600" />
          <Kpi label="Egresos" val={formatearMoneda(resumen.egresos)} icon={MdArrowDownward} bg="bg-rose-100" color="text-rose-500" />
          <Kpi label="Balance" val={formatearMoneda(resumen.balance)} icon={MdAccountBalanceWallet} bg={Number(resumen.balance) >= 0 ? 'bg-emerald-100' : 'bg-rose-100'} color={Number(resumen.balance) >= 0 ? 'text-emerald-600' : 'text-rose-500'} />
          <Kpi label="Movimientos" val={resumen.total_movimientos} icon={MdCalendarToday} bg="bg-primary/10" color="text-primary" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input placeholder="Buscar por concepto..." value={busq} onChange={(e) => setBusq(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary" />
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
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Sin movimientos</div>
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Movimiento</TableHead>
            <TableHead>Tipo / Fecha</TableHead>
            <TableHead align="right">Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead align="right">Acciones</TableHead>
          </TableHeader>
          <TableBody>
            {filtrados.map((m) => {
              const est = ESTADOS[m.estado_aprobacion] || ESTADOS.PENDIENTE;
              const esIngreso = m.tipo_flujo === 'INGRESO';
              const Icon = esIngreso ? MdArrowUpward : MdArrowDownward;
              const color = esIngreso ? 'text-emerald-600' : 'text-rose-500';
              const bg = esIngreso ? 'bg-emerald-100' : 'bg-rose-100';
              
              return (
                <TableRow key={m.id_movimiento}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
                        <Icon size={18} className={color} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-text truncate max-w-[250px]">{m.concepto}</p>
                        <p className="text-[11px] text-text-soft">MOV-{String(m.id_movimiento).padStart(6, '0')}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-semibold text-text">{m.tipo_flujo}</p>
                    <p className="text-[11px] text-text-soft flex items-center gap-1 mt-0.5"><MdCalendarToday size={11} /> {formatearFecha(m.fecha_programada)}</p>
                  </TableCell>
                  <TableCell align="right">
                    <span className={`text-sm font-bold ${color}`}>{esIngreso ? '+' : '-'}{formatearMoneda(m.monto)}</span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${est.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                      {est.label}
                    </span>
                  </TableCell>
                  <TableCell align="right">
                    <button
                      onClick={() => setDetalle(m)}
                      className="px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-semibold transition-colors"
                    >
                      Ver detalle
                    </button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {modal && <ModalMovimiento onClose={() => setModal(false)} onSuccess={() => { setModal(false); toast.success('Movimiento creado'); cargar(); }} />}

      {detalle && (
        <ModalDetalleMovimiento
          m={detalle}
          onClose={() => setDetalle(null)}
          onCambiarEstado={(id, estado) => { setDetalle(null); cambiarEstado(id, estado); }}
          actualizandoId={actualizandoId}
        />
      )}
    </div>
  );
}

function ModalDetalleMovimiento({ m, onClose, onCambiarEstado, actualizandoId }) {
  const est = ESTADOS[m.estado_aprobacion] || ESTADOS.PENDIENTE;
  const esIngreso = m.tipo_flujo === 'INGRESO';
  const Icon = esIngreso ? MdArrowUpward : MdArrowDownward;
  const color = esIngreso ? 'text-emerald-600' : 'text-rose-500';
  const bg = esIngreso ? 'bg-emerald-100' : 'bg-rose-100';

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Detalle del movimiento</p>
          <button onClick={onClose} className="text-text-soft hover:text-text"><MdClose size={18} /></button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bg}`}>
              <Icon size={24} className={color} />
            </div>
            <div>
              <p className="text-xs text-text-soft">{m.tipo_flujo}</p>
              <p className={`text-2xl font-bold ${color}`}>{esIngreso ? '+' : '-'}{formatearMoneda(m.monto)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Info label="Código" val={`MOV-${String(m.id_movimiento).padStart(6, '0')}`} />
            <Info label="Estado" val={est.label} badge={est.badge} />
            <Info label="Fecha programada" val={formatearFecha(m.fecha_programada)} />
            <Info label="Tipo" val={m.tipo_flujo} />
          </div>

          <div>
            <p className="text-xs font-medium text-text-soft mb-1">Concepto</p>
            <p className="text-sm text-text bg-bg-soft rounded-xl p-3">{m.concepto || '—'}</p>
          </div>

          {m.estado_aprobacion !== 'EJECUTADO' && (
            <div className="flex gap-2 pt-2 border-t border-border">
              {m.estado_aprobacion === 'PENDIENTE' && (
                <button onClick={() => onCambiarEstado(m.id_movimiento, 'APROBADO')} disabled={actualizandoId === m.id_movimiento} className="flex-1 py-2.5 rounded-xl bg-info hover:bg-info/80 text-white text-xs font-semibold transition-colors disabled:opacity-50">Aprobar</button>
              )}
              {m.estado_aprobacion === 'APROBADO' && (
                <button onClick={() => onCambiarEstado(m.id_movimiento, 'EJECUTADO')} disabled={actualizandoId === m.id_movimiento} className="flex-1 py-2.5 rounded-xl bg-success hover:bg-success/80 text-white text-xs font-semibold transition-colors disabled:opacity-50">Ejecutar</button>
              )}
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Info({ label, val, badge }) {
  return (
    <div className="bg-bg-soft rounded-xl p-2.5">
      <p className="text-xs text-text-soft mb-0.5">{label}</p>
      {badge ? (
        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${badge}`}>{val}</span>
      ) : (
        <p className="text-xs font-semibold text-text">{val}</p>
      )}
    </div>
  );
}

function Kpi({ label, val, icon: Icon, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}><Icon size={17} className={color} /></div>
      <div><p className={`text-xl font-bold leading-tight ${color}`}>{val}</p><p className="text-xs text-text-soft">{label}</p></div>
    </div>
  );
}

function ModalMovimiento({ onClose, onSuccess }) {
  const [form, setForm] = useState({ tipo_flujo: 'INGRESO', concepto: '', monto: '', fecha_programada: new Date().toISOString().slice(0, 10) });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/tesoreria', { ...form, monto: Number(form.monto) });
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
          <p className="text-sm font-bold text-text">Nuevo movimiento</p>
          <button onClick={onClose} className="text-text-soft hover:text-text"><MdClose size={18} /></button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo</label>
            <select value={form.tipo_flujo} onChange={(e) => setForm({ ...form, tipo_flujo: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary">
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Concepto</label>
            <input value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} required maxLength={150} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Monto (S/)</label>
              <input type="number" step="0.01" min="0" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Fecha programada</label>
              <input type="date" value={form.fecha_programada} onChange={(e) => setForm({ ...form, fecha_programada: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={enviando} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors">{enviando ? 'Guardando...' : 'Crear'}</button>
            <button type="button" onClick={onClose} disabled={enviando} className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
