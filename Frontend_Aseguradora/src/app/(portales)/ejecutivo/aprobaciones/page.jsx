'use client';

import { useEffect, useState } from 'react';
import {
  MdAssignmentTurnedIn,
  MdAttachMoney,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdCategory,
  MdAdd,
} from 'react-icons/md';
import { apiGet, apiPost, apiPatch } from '@/lib/api';

const ESTADOS = ['TODOS', 'PENDIENTE', 'APROBADO', 'RECHAZADO'];
const MODULOS = ['SINIESTROS', 'REASEGURO', 'COMPRAS', 'CAMPANAS', 'COMISIONES', 'PRESUPUESTO', 'OTRO'];

const COLORES_ESTADO = {
  PENDIENTE: 'bg-amber-100 text-amber-700 border-amber-200',
  APROBADO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  RECHAZADO: 'bg-rose-100 text-rose-700 border-rose-200',
};

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'short' });
}

export default function AprobacionesPage() {
  const [aprobaciones, setAprobaciones] = useState([]);
  const [filtro, setFiltro] = useState('TODOS');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ modulo_origen: 'SINIESTROS', monto_impacto: '', comentarios_previos: '' });
  const [guardando, setGuardando] = useState(false);

  async function cargar() {
    setCargando(true);
    try {
      const path = filtro === 'TODOS' ? '/aprobaciones' : `/aprobaciones?estado=${filtro}`;
      const data = await apiGet(path);
      setAprobaciones(data || []);
      setError(null);
    } catch (e) {
      setError(e.mensaje || 'Error al cargar');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, [filtro]);

  async function cambiarEstado(id, estado) {
    try {
      await apiPatch(`/aprobaciones/${id}/estado`, { estado_gerencial: estado });
      cargar();
    } catch (e) {
      setError(e.mensaje || 'Error al actualizar');
    }
  }

  async function crear(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      await apiPost('/aprobaciones', {
        modulo_origen: form.modulo_origen,
        monto_impacto: Number(form.monto_impacto),
        comentarios_previos: form.comentarios_previos,
      });
      setModal(false);
      setForm({ modulo_origen: 'SINIESTROS', monto_impacto: '', comentarios_previos: '' });
      cargar();
    } catch (e) {
      setError(e.mensaje || 'Error al crear');
    } finally {
      setGuardando(false);
    }
  }

  const totalPendiente = aprobaciones
    .filter((a) => a.estado_gerencial === 'PENDIENTE')
    .reduce((acc, a) => acc + Number(a.monto_impacto || 0), 0);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xl font-bold text-text">Aprobaciones criticas</p>
          <p className="text-xs text-text-soft">Revisa y autoriza las solicitudes que requieren visto bueno gerencial.</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="bg-primary text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-1.5"
        >
          <MdAdd size={16} /> Nueva solicitud
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <KpiCard label="Total" valor={aprobaciones.length} icon={MdAssignmentTurnedIn} bg="bg-primary/10" color="text-primary" />
        <KpiCard
          label="Pendientes"
          valor={aprobaciones.filter((a) => a.estado_gerencial === 'PENDIENTE').length}
          icon={MdAccessTime}
          bg="bg-amber-100"
          color="text-amber-700"
        />
        <KpiCard label="Monto en cola" valor={formatearMoneda(totalPendiente)} icon={MdAttachMoney} bg="bg-emerald-100" color="text-emerald-700" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {ESTADOS.map((e) => (
          <button
            key={e}
            onClick={() => setFiltro(e)}
            className={`text-xs px-3 py-1.5 rounded-full border ${
              filtro === e ? 'bg-primary text-white border-primary' : 'bg-bg text-text-soft border-border hover:border-primary/40'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg">{error}</div>}

      {cargando ? (
        <div className="bg-bg rounded-xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : aprobaciones.length === 0 ? (
        <div className="bg-bg rounded-xl border border-border p-10 text-center text-sm text-text-soft">No hay aprobaciones en este filtro.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {aprobaciones.map((a) => (
            <div key={a.id_aprobacion} className="bg-bg rounded-xl border border-border p-4 flex flex-col md:flex-row md:items-center gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MdCategory size={18} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-text">{a.modulo_origen}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${COLORES_ESTADO[a.estado_gerencial]}`}>
                      {a.estado_gerencial}
                    </span>
                  </div>
                  <p className="text-xs text-text-soft truncate">{a.comentarios_previos || 'Sin comentarios'}</p>
                  <p className="text-[10px] text-text-mute mt-0.5">{formatearFecha(a.fecha_solicitud)}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="text-base font-bold text-text">{formatearMoneda(a.monto_impacto)}</p>
              </div>

              {a.estado_gerencial === 'PENDIENTE' && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => cambiarEstado(a.id_aprobacion, 'APROBADO')}
                    className="bg-emerald-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 flex items-center gap-1"
                  >
                    <MdCheckCircle size={14} /> Aprobar
                  </button>
                  <button
                    onClick={() => cambiarEstado(a.id_aprobacion, 'RECHAZADO')}
                    className="bg-rose-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-700 flex items-center gap-1"
                  >
                    <MdCancel size={14} /> Rechazar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={crear} className="bg-bg rounded-2xl border border-border p-6 w-full max-w-md flex flex-col gap-3">
            <p className="text-base font-bold text-text">Nueva aprobacion critica</p>

            <label className="text-xs font-semibold text-text">Modulo</label>
            <select
              value={form.modulo_origen}
              onChange={(e) => setForm({ ...form, modulo_origen: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            >
              {MODULOS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <label className="text-xs font-semibold text-text">Monto de impacto</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.monto_impacto}
              onChange={(e) => setForm({ ...form, monto_impacto: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />

            <label className="text-xs font-semibold text-text">Comentarios</label>
            <textarea
              rows={3}
              value={form.comentarios_previos}
              onChange={(e) => setForm({ ...form, comentarios_previos: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />

            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={() => setModal(false)} className="text-xs px-3 py-2 rounded-lg border border-border hover:bg-bg-soft">
                Cancelar
              </button>
              <button type="submit" disabled={guardando} className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark disabled:opacity-60">
                {guardando ? 'Guardando...' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function KpiCard({ label, valor, icon: Icon, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-text-soft uppercase tracking-tight">{label}</p>
        <p className="text-base font-bold text-text">{valor}</p>
      </div>
    </div>
  );
}
