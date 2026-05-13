'use client';

import { useEffect, useState } from 'react';
import {
  MdFactCheck,
  MdSearch,
  MdAssignmentInd,
  MdCalendarToday,
  MdAttachMoney,
  MdEdit,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';

const ESTADOS_EVALUAR = ['EN_REVISION', 'INSPECCION'];
const ESTADOS = {
  REPORTADO: { label: 'Reportado', badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  EN_REVISION: { label: 'En revisión', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  INSPECCION: { label: 'Inspección', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400' },
  APROBADO: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  LIQUIDADO: { label: 'Liquidado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
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

export default function EvaluacionesPage() {
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/siniestros');
      setSiniestros((data || []).filter((s) => ESTADOS_EVALUAR.includes(s.estado_resolucion)));
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

  const decidir = async (id, estado) => {
    setActualizandoId(id);
    try {
      await apiPatch(`/siniestros/${id}/estado`, { estado_resolucion: estado });
      mostrarToast(`Siniestro ${estado.toLowerCase()}`);
      cargar();
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtrados = siniestros.filter((s) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      String(s.id_siniestro).includes(t) ||
      (s.tipo_incidente || '').toLowerCase().includes(t) ||
      (s.cliente_nombre || '').toLowerCase().includes(t)
    );
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-base font-bold text-text">Evaluaciones de siniestros</h1>
        <p className="text-xs text-text-soft mt-0.5">{siniestros.length} casos en evaluación o inspección</p>
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar..."
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
          <MdFactCheck size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay casos pendientes de evaluación</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((s) => {
            const est = ESTADOS[s.estado_resolucion] || ESTADOS.EN_REVISION;
            return (
              <div key={s.id_siniestro} className="bg-bg rounded-2xl border border-border overflow-hidden">
                <div className="h-1 w-full bg-primary/30" />
                <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MdFactCheck size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-text">SIN-{String(s.id_siniestro).padStart(6, '0')}</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                        {est.label}
                      </span>
                    </div>
                    <p className="text-sm text-text mt-1">{s.tipo_incidente}</p>
                    <p className="text-xs text-text-soft mt-1 line-clamp-2">{s.descripcion}</p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
                      <span className="flex items-center gap-1"><MdAssignmentInd size={11} /> {s.analista_asignado || 'Sin asignar'}</span>
                      <span className="flex items-center gap-1"><MdCalendarToday size={11} /> {formatearFecha(s.fecha_reporte)}</span>
                      <span className="flex items-center gap-1"><MdAttachMoney size={11} /> {formatearMoneda(s.monto_reclamado)}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <div className="flex gap-2">
                      <button
                        onClick={() => decidir(s.id_siniestro, 'APROBADO')}
                        disabled={actualizandoId === s.id_siniestro}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => decidir(s.id_siniestro, 'RECHAZADO')}
                        disabled={actualizandoId === s.id_siniestro}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        Rechazar
                      </button>
                    </div>
                    {s.estado_resolucion === 'EN_REVISION' && (
                      <button
                        onClick={() => decidir(s.id_siniestro, 'INSPECCION')}
                        disabled={actualizandoId === s.id_siniestro}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <MdEdit size={13} /> Pasar a inspección
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
