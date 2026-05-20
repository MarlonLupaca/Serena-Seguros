'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import { MdAdd, MdCalculate, MdClose, MdEdit, MdWarning } from 'react-icons/md';
import { apiGet, apiPost, apiPut } from '@/lib/api';

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADO_VACIO = { area: '', presupuesto_asignado: '', monto_ejecutado: '0', alertas_sobreconsumo: false };

export default function PresupuestoPage() {
  const [presupuestos, setPresupuestos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(null);
useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/presupuestos');
      setPresupuestos(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
const totalAsignado = presupuestos.reduce((acc, p) => acc + Number(p.presupuesto_asignado || 0), 0);
  const totalEjecutado = presupuestos.reduce((acc, p) => acc + Number(p.monto_ejecutado || 0), 0);
  const totalDisponible = totalAsignado - totalEjecutado;
  const sobreconsumo = presupuestos.filter((p) => p.porcentaje_uso >= 90);

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Presupuesto por área</h1>
          <p className="text-xs text-text-soft mt-0.5">{presupuestos.length} áreas configuradas</p>
        </div>
        <button onClick={() => setModal({ modo: 'crear', data: { ...ESTADO_VACIO } })} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
          <MdAdd size={15} /> Nuevo presupuesto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-bg rounded-xl border border-border p-4">
          <p className="text-xs text-text-soft">Asignado total</p>
          <p className="text-2xl font-bold text-text mt-1">{formatearMoneda(totalAsignado)}</p>
        </div>
        <div className="bg-bg rounded-xl border border-border p-4">
          <p className="text-xs text-text-soft">Ejecutado</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{formatearMoneda(totalEjecutado)}</p>
        </div>
        <div className="bg-bg rounded-xl border border-border p-4">
          <p className="text-xs text-text-soft">Disponible</p>
          <p className={`text-2xl font-bold mt-1 ${totalDisponible >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>{formatearMoneda(totalDisponible)}</p>
        </div>
      </div>

      {sobreconsumo.length > 0 && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
          <MdWarning size={16} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-700">{sobreconsumo.length} área(s) por encima del 90% del presupuesto</p>
            <p className="text-xs text-amber-700">{sobreconsumo.map((p) => p.area).join(', ')}</p>
          </div>
        </div>
      )}

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : presupuestos.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Sin presupuestos</div>
      ) : (
        <div className="flex flex-col gap-3">
          {presupuestos.map((p) => {
            const colorBarra = p.porcentaje_uso >= 100 ? 'bg-rose-500' : p.porcentaje_uso >= 80 ? 'bg-amber-500' : 'bg-primary';
            return (
              <div key={p.id_presupuesto} className="bg-bg rounded-2xl border border-border p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MdCalculate size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-text">{p.area}</p>
                      <p className="text-xs text-text-soft">{formatearMoneda(p.monto_ejecutado)} de {formatearMoneda(p.presupuesto_asignado)}</p>
                    </div>
                  </div>
                  <button onClick={() => setModal({ modo: 'editar', data: { id_presupuesto: p.id_presupuesto, area: p.area, presupuesto_asignado: String(p.presupuesto_asignado), monto_ejecutado: String(p.monto_ejecutado), alertas_sobreconsumo: p.alertas_sobreconsumo } })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors">
                    <MdEdit size={12} /> Editar
                  </button>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-text-soft mb-1">
                    <span>Uso del presupuesto</span>
                    <span className="font-semibold">{p.porcentaje_uso}%</span>
                  </div>
                  <div className="h-2 bg-bg-soft rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colorBarra}`} style={{ width: `${Math.min(100, p.porcentaje_uso)}%` }} />
                  </div>
                  <p className={`text-xs mt-2 ${Number(p.disponible) >= 0 ? 'text-emerald-600' : 'text-rose-500'} font-medium`}>
                    Disponible: {formatearMoneda(p.disponible)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modal && <ModalPresupuesto modo={modal.modo} dataInicial={modal.data} onClose={() => setModal(null)} onSuccess={() => { setModal(null); toast.success(modal.modo === 'crear' ? 'Creado' : 'Actualizado'); cargar(); }} />}
    </div>
  );
}

function ModalPresupuesto({ modo, dataInicial, onClose, onSuccess }) {
  const [form, setForm] = useState(dataInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const payload = {
        area: form.area,
        presupuesto_asignado: Number(form.presupuesto_asignado),
        monto_ejecutado: Number(form.monto_ejecutado || 0),
        alertas_sobreconsumo: !!form.alertas_sobreconsumo,
      };
      if (modo === 'crear') await apiPost('/presupuestos', payload);
      else await apiPut(`/presupuestos/${form.id_presupuesto}`, payload);
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
          <p className="text-sm font-bold text-text">{modo === 'crear' ? 'Nuevo' : 'Editar'} presupuesto</p>
          <button onClick={onClose} className="text-text-soft hover:text-text"><MdClose size={18} /></button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Área</label>
            <input value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required maxLength={100} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Asignado (S/)</label>
              <input type="number" step="0.01" min="0" value={form.presupuesto_asignado} onChange={(e) => setForm({ ...form, presupuesto_asignado: e.target.value })} required className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Ejecutado (S/)</label>
              <input type="number" step="0.01" min="0" value={form.monto_ejecutado} onChange={(e) => setForm({ ...form, monto_ejecutado: e.target.value })} className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-text-soft cursor-pointer">
            <input type="checkbox" checked={!!form.alertas_sobreconsumo} onChange={(e) => setForm({ ...form, alertas_sobreconsumo: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
            Activar alertas de sobreconsumo
          </label>
          <div className="flex gap-2 mt-2">
            <button type="submit" disabled={enviando} className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors">{enviando ? 'Guardando...' : 'Guardar'}</button>
            <button type="button" onClick={onClose} disabled={enviando} className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
