'use client';

import { useEffect, useState } from 'react';
import { MdAdd, MdEditNote, MdFlag, MdTrendingUp, MdDeleteOutline } from 'react-icons/md';
import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api';

const ESTADOS = ['EN_PROGRESO', 'EN_RIESGO', 'RETRASADO', 'CUMPLIDO'];

const COLORES_ESTADO = {
  EN_PROGRESO: 'bg-blue-100 text-blue-700 border-blue-200',
  EN_RIESGO: 'bg-amber-100 text-amber-700 border-amber-200',
  RETRASADO: 'bg-rose-100 text-rose-700 border-rose-200',
  CUMPLIDO: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const COLORES_BARRA = {
  EN_PROGRESO: 'bg-primary',
  EN_RIESGO: 'bg-amber-500',
  RETRASADO: 'bg-rose-500',
  CUMPLIDO: 'bg-emerald-500',
};

function formatearMonto(v) {
  return Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export default function ObjetivosPage() {
  const [objetivos, setObjetivos] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(false);
  const [edicion, setEdicion] = useState(null);
  const [form, setForm] = useState({ id_empleado_responsable: '', descripcion: '', meta_cuantitativa: '', avance_actual: '', estado: 'EN_PROGRESO' });

  async function cargar() {
    setCargando(true);
    try {
      const [objs, emps] = await Promise.all([
        apiGet('/objetivos'),
        apiGet('/empleados').catch(() => []),
      ]);
      setObjetivos(objs || []);
      setEmpleados(emps || []);
      setError(null);
    } catch (e) {
      setError(e.mensaje || 'Error al cargar');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function crear(e) {
    e.preventDefault();
    try {
      await apiPost('/objetivos', {
        id_empleado_responsable: Number(form.id_empleado_responsable),
        descripcion: form.descripcion,
        meta_cuantitativa: Number(form.meta_cuantitativa),
        avance_actual: Number(form.avance_actual || 0),
        estado: form.estado,
      });
      cerrarModal();
      cargar();
    } catch (err) {
      setError(err.mensaje || 'Error al guardar');
    }
  }

  async function actualizarAvance(e) {
    e.preventDefault();
    try {
      await apiPatch(`/objetivos/${edicion.id_objetivo}/avance`, {
        avance_actual: Number(form.avance_actual),
        estado: form.estado,
      });
      cerrarModal();
      cargar();
    } catch (err) {
      setError(err.mensaje || 'Error al actualizar');
    }
  }

  async function eliminar(id) {
    if (!confirm('Eliminar este objetivo?')) return;
    try {
      await apiDelete(`/objetivos/${id}`);
      cargar();
    } catch (err) {
      setError(err.mensaje || 'Error al eliminar');
    }
  }

  function abrirNuevo() {
    setEdicion(null);
    setForm({
      id_empleado_responsable: empleados[0]?.id_empleado || '',
      descripcion: '',
      meta_cuantitativa: '',
      avance_actual: '',
      estado: 'EN_PROGRESO',
    });
    setModal(true);
  }

  function abrirAvance(o) {
    setEdicion(o);
    setForm({
      id_empleado_responsable: o.id_empleado_responsable || '',
      descripcion: o.descripcion,
      meta_cuantitativa: o.meta_cuantitativa,
      avance_actual: o.avance_actual,
      estado: o.estado,
    });
    setModal(true);
  }

  function cerrarModal() {
    setModal(false);
    setEdicion(null);
  }

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xl font-bold text-text">Objetivos corporativos</p>
          <p className="text-xs text-text-soft">Sigue el avance de las metas estrategicas asignadas a cada responsable.</p>
        </div>
        <button
          onClick={abrirNuevo}
          className="bg-primary text-white text-xs font-semibold px-3.5 py-2 rounded-lg hover:bg-primary-dark flex items-center gap-1.5"
        >
          <MdAdd size={16} /> Nuevo objetivo
        </button>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg">{error}</div>}

      {cargando ? (
        <div className="bg-bg rounded-xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : objetivos.length === 0 ? (
        <div className="bg-bg rounded-xl border border-border p-10 text-center text-sm text-text-soft">Aun no hay objetivos cargados.</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {objetivos.map((o) => (
            <div key={o.id_objetivo} className="bg-bg rounded-xl border border-border p-4 flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <MdFlag size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text">{o.descripcion}</p>
                  <p className="text-[11px] text-text-soft">Responsable: {o.empleado_responsable}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 ${COLORES_ESTADO[o.estado]}`}>
                  {o.estado.replace('_', ' ')}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-soft">Avance: {formatearMonto(o.avance_actual)} / {formatearMonto(o.meta_cuantitativa)}</span>
                  <span className="text-text font-semibold">{Number(o.porcentaje_avance || 0)}%</span>
                </div>
                <div className="h-2 bg-bg-soft rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${COLORES_BARRA[o.estado]}`}
                    style={{ width: `${Math.min(100, Number(o.porcentaje_avance || 0))}%` }}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => abrirAvance(o)}
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <MdTrendingUp size={14} /> Registrar avance
                </button>
                <button
                  onClick={() => eliminar(o.id_objetivo)}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <MdDeleteOutline size={14} /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <form onSubmit={edicion ? actualizarAvance : crear} className="bg-bg rounded-2xl border border-border p-6 w-full max-w-md flex flex-col gap-3">
            <div className="flex items-center gap-2">
              {edicion ? <MdEditNote size={20} className="text-primary" /> : <MdFlag size={20} className="text-primary" />}
              <p className="text-base font-bold text-text">{edicion ? 'Registrar avance' : 'Nuevo objetivo'}</p>
            </div>

            {!edicion && (
              <>
                <label className="text-xs font-semibold text-text">Responsable</label>
                <select
                  required
                  value={form.id_empleado_responsable}
                  onChange={(e) => setForm({ ...form, id_empleado_responsable: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Selecciona...</option>
                  {empleados.map((emp) => (
                    <option key={emp.id_empleado} value={emp.id_empleado}>
                      {emp.nombres} {emp.apellidos} - {emp.area}
                    </option>
                  ))}
                </select>

                <label className="text-xs font-semibold text-text">Descripcion</label>
                <input
                  required
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                />

                <label className="text-xs font-semibold text-text">Meta cuantitativa</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.meta_cuantitativa}
                  onChange={(e) => setForm({ ...form, meta_cuantitativa: e.target.value })}
                  className="border border-border rounded-lg px-3 py-2 text-sm"
                />
              </>
            )}

            <label className="text-xs font-semibold text-text">Avance actual</label>
            <input
              type="number"
              step="0.01"
              required
              value={form.avance_actual}
              onChange={(e) => setForm({ ...form, avance_actual: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            />

            <label className="text-xs font-semibold text-text">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
              className="border border-border rounded-lg px-3 py-2 text-sm"
            >
              {ESTADOS.map((est) => <option key={est} value={est}>{est.replace('_', ' ')}</option>)}
            </select>

            <div className="flex justify-end gap-2 mt-2">
              <button type="button" onClick={cerrarModal} className="text-xs px-3 py-2 rounded-lg border border-border hover:bg-bg-soft">
                Cancelar
              </button>
              <button type="submit" className="bg-primary text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-primary-dark">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
