'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdReceiptLong,
  MdSearch,
  MdAdd,
  MdPlayArrow,
  MdGroups,
  MdAttachMoney,
  MdRemoveCircle,
  MdCheckCircle,
  MdClose,
} from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';

function formatearMoneda(v) {
  if (v == null) return 'S/ 0.00';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function periodoActual() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function NominaPage() {
  const [planillas, setPlanillas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalles, setCargandoDetalles] = useState(false);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [modal, setModal] = useState(false);
useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/nomina/planillas');
      setPlanillas(data || []);
      if (data && data[0]) seleccionar(data[0]);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las planillas');
    } finally {
      setCargando(false);
    }
  };

  const seleccionar = async (planilla) => {
    setSeleccionada(planilla);
    setCargandoDetalles(true);
    try {
      const data = await apiGet(`/nomina/planillas/${planilla.id_planilla}/detalles`);
      setDetalles(data || []);
    } catch (e) {
      setDetalles([]);
    } finally {
      setCargandoDetalles(false);
    }
  };
const detallesFiltrados = detalles.filter((d) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      (d.empleado_nombre || '').toLowerCase().includes(t) ||
      (d.area || '').toLowerCase().includes(t) ||
      (d.cargo || '').toLowerCase().includes(t)
    );
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Nómina y planillas</h1>
          <p className="text-xs text-text-soft mt-0.5">
            Procesa la planilla mensual y revisa los conceptos por empleado.
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Procesar planilla
        </button>
      </div>

      {seleccionada && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi label="Período" val={seleccionada.periodo} icon={MdReceiptLong} bg="bg-bg-soft" color="text-text" />
          <Kpi
            label="Total planilla"
            val={formatearMoneda(seleccionada.total_planilla)}
            icon={MdAttachMoney}
            bg="bg-primary/10"
            color="text-primary"
          />
          <Kpi
            label="Descuentos"
            val={formatearMoneda(seleccionada.total_descuentos)}
            icon={MdRemoveCircle}
            bg="bg-rose-100"
            color="text-rose-600"
          />
          <Kpi
            label="Neto a pagar"
            val={formatearMoneda(seleccionada.total_neto)}
            icon={MdCheckCircle}
            bg="bg-emerald-100"
            color="text-emerald-600"
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft px-1">
            Planillas procesadas
          </p>
          {cargando ? (
            <div className="bg-bg rounded-2xl border border-border p-6 text-center text-sm text-text-soft">
              Cargando...
            </div>
          ) : planillas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-6 text-center text-sm text-text-soft">
              Aún no hay planillas procesadas.
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[600px] overflow-y-auto pr-1">
              {planillas.map((p) => {
                const activa = seleccionada?.id_planilla === p.id_planilla;
                return (
                  <button
                    key={p.id_planilla}
                    onClick={() => seleccionar(p)}
                    className={`text-left p-3 rounded-xl border transition-colors ${
                      activa ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <p className="text-sm font-bold text-text">{p.periodo}</p>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.estado === 'PROCESADA'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {p.estado}
                      </span>
                    </div>
                    <p className="text-xs text-text-soft">Neto: {formatearMoneda(p.total_neto)}</p>
                    <p className="text-[11px] text-text-soft mt-1">{formatearFecha(p.fecha_proceso)}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="relative">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar empleado, área o cargo..."
              value={busq}
              onChange={(e) => setBusq(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          {!seleccionada ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Selecciona una planilla para ver el detalle.
            </div>
          ) : cargandoDetalles ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Cargando detalles...
            </div>
          ) : detallesFiltrados.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdGroups size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">Sin detalles</p>
            </div>
          ) : (
            <div className="bg-bg rounded-2xl border border-border overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-soft">
                  <tr className="text-xs text-text-soft">
                    <th className="px-3 py-2 text-left font-medium">Empleado</th>
                    <th className="px-3 py-2 text-left font-medium">Área</th>
                    <th className="px-3 py-2 text-right font-medium">Sueldo</th>
                    <th className="px-3 py-2 text-right font-medium">Bonos</th>
                    <th className="px-3 py-2 text-right font-medium">H. extra</th>
                    <th className="px-3 py-2 text-right font-medium">AFP/ONP</th>
                    <th className="px-3 py-2 text-right font-medium">Renta</th>
                    <th className="px-3 py-2 text-right font-medium">Neto</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesFiltrados.map((d) => (
                    <tr key={d.id_detalle} className="border-t border-border">
                      <td className="px-3 py-2.5">
                        <p className="text-sm font-semibold text-text">{d.empleado_nombre}</p>
                        <p className="text-[11px] text-text-soft">{d.cargo}</p>
                      </td>
                      <td className="px-3 py-2.5 text-text-soft">{d.area}</td>
                      <td className="px-3 py-2.5 text-right text-text">{formatearMoneda(d.sueldo_base)}</td>
                      <td className="px-3 py-2.5 text-right text-text">{formatearMoneda(d.bonos)}</td>
                      <td className="px-3 py-2.5 text-right text-text">{formatearMoneda(d.horas_extra)}</td>
                      <td className="px-3 py-2.5 text-right text-rose-600">-{formatearMoneda(d.afp_onp)}</td>
                      <td className="px-3 py-2.5 text-right text-rose-600">-{formatearMoneda(d.impuesto_renta)}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-emerald-600">
                        {formatearMoneda(d.neto)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ModalProcesar
          onClose={() => setModal(false)}
          onSuccess={(p) => {
            setModal(false);
            toast.success(`Planilla ${p.periodo} procesada`);
            cargar();
          }}
        />
      )}
    </div>
  );
}

function Kpi({ label, val, icon: Icon, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={17} className={color} />
      </div>
      <div>
        <p className={`text-base font-bold leading-tight ${color}`}>{val}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}

function ModalProcesar({ onClose, onSuccess }) {
  const [periodo, setPeriodo] = useState(periodoActual());
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const data = await apiPost('/nomina/planillas', { periodo });
      onSuccess(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudo procesar la planilla');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Procesar planilla</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Período (YYYY-MM)</label>
            <input
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              required
              pattern="\d{4}-\d{2}"
              placeholder="2026-05"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <p className="text-[11px] text-text-soft">
            Se calculará la planilla para todos los empleados activos. AFP/ONP 12.75% y renta 8% son
            referenciales.
          </p>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdPlayArrow size={13} /> {enviando ? 'Procesando...' : 'Procesar'}
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
