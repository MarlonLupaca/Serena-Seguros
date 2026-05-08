'use client';

import { useEffect, useState } from 'react';
import { MdAdd, MdAssuredWorkload, MdClose, MdDelete, MdEdit, MdSearch } from 'react-icons/md';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADO_VACIO = { id_poliza: '', riesgo_retenido: '', riesgo_cedido: '', reaseguradora_asociada: '' };

export default function ReaseguroPage() {
  const [reaseguros, setReaseguros] = useState([]);
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [r, p] = await Promise.all([apiGet('/reaseguros'), apiGet('/polizas')]);
      setReaseguros(r || []);
      setPolizas(p || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const eliminar = async (id) => {
    try {
      await apiDelete(`/reaseguros/${id}`);
      mostrarToast('Reaseguro eliminado');
      cargar();
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo eliminar');
    }
  };

  const filtrados = reaseguros.filter((r) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      String(r.id_reaseguro).includes(t) ||
      (r.reaseguradora_asociada || '').toLowerCase().includes(t) ||
      (r.poliza_nombre || '').toLowerCase().includes(t)
    );
  });

  const totales = {
    cantidad: reaseguros.length,
    retenido: reaseguros.reduce((acc, r) => acc + Number(r.riesgo_retenido || 0), 0),
    cedido: reaseguros.reduce((acc, r) => acc + Number(r.riesgo_cedido || 0), 0),
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Reaseguro</h1>
          <p className="text-xs text-text-soft mt-0.5">{totales.cantidad} contratos de reaseguro</p>
        </div>
        <button
          onClick={() => setModal({ modo: 'crear', data: { ...ESTADO_VACIO } })}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Nuevo reaseguro
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Kpi label="Contratos" val={totales.cantidad} bg="bg-primary/10" color="text-primary" />
        <Kpi label="Riesgo retenido" val={formatearMoneda(totales.retenido)} bg="bg-emerald-100" color="text-emerald-600" />
        <Kpi label="Riesgo cedido" val={formatearMoneda(totales.cedido)} bg="bg-amber-100" color="text-amber-600" />
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por ID, póliza o reaseguradora..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdAssuredWorkload size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin contratos</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((r) => (
            <div key={r.id_reaseguro} className="bg-bg rounded-2xl border border-border overflow-hidden">
              <div className="h-1 w-full bg-primary/30" />
              <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MdAssuredWorkload size={20} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-text">RSG-{String(r.id_reaseguro).padStart(6, '0')}</p>
                  <p className="text-xs text-text-soft mt-0.5">
                    POL-{String(r.id_poliza).padStart(6, '0')} · {r.poliza_nombre}
                  </p>
                  <p className="text-sm text-text mt-1">{r.reaseguradora_asociada}</p>
                  <div className="flex gap-3 mt-2 text-xs text-text-soft flex-wrap">
                    <span>Retenido: <strong>{formatearMoneda(r.riesgo_retenido)}</strong></span>
                    <span>Cedido: <strong>{formatearMoneda(r.riesgo_cedido)}</strong></span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() =>
                      setModal({
                        modo: 'editar',
                        data: {
                          id_reaseguro: r.id_reaseguro,
                          id_poliza: String(r.id_poliza),
                          riesgo_retenido: String(r.riesgo_retenido),
                          riesgo_cedido: String(r.riesgo_cedido),
                          reaseguradora_asociada: r.reaseguradora_asociada,
                        },
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
                  >
                    <MdEdit size={13} /> Editar
                  </button>
                  <button
                    onClick={() => eliminar(r.id_reaseguro)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors"
                  >
                    <MdDelete size={13} /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ModalReaseguro
          modo={modal.modo}
          dataInicial={modal.data}
          polizas={polizas}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            mostrarToast(modal.modo === 'crear' ? 'Reaseguro creado' : 'Reaseguro actualizado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function Kpi({ label, val, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3">
      <p className={`text-xl font-bold leading-tight ${color}`}>{val}</p>
      <p className="text-xs text-text-soft mt-0.5">{label}</p>
    </div>
  );
}

function ModalReaseguro({ modo, dataInicial, polizas, onClose, onSuccess }) {
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
        id_poliza: Number(form.id_poliza),
        riesgo_retenido: Number(form.riesgo_retenido),
        riesgo_cedido: Number(form.riesgo_cedido),
        reaseguradora_asociada: form.reaseguradora_asociada,
      };
      if (modo === 'crear') {
        await apiPost('/reaseguros', payload);
      } else {
        await apiPut(`/reaseguros/${form.id_reaseguro}`, payload);
      }
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo guardar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">{modo === 'crear' ? 'Nuevo' : 'Editar'} reaseguro</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Póliza</label>
            <select
              value={form.id_poliza}
              onChange={(e) => set('id_poliza', e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              <option value="">Seleccionar...</option>
              {polizas.map((p) => (
                <option key={p.id_poliza} value={p.id_poliza}>
                  POL-{String(p.id_poliza).padStart(6, '0')} · {p.producto?.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Riesgo retenido (S/)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.riesgo_retenido}
                onChange={(e) => set('riesgo_retenido', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Riesgo cedido (S/)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.riesgo_cedido}
                onChange={(e) => set('riesgo_cedido', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Reaseguradora</label>
            <input
              value={form.reaseguradora_asociada}
              onChange={(e) => set('reaseguradora_asociada', e.target.value)}
              required
              maxLength={150}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
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
