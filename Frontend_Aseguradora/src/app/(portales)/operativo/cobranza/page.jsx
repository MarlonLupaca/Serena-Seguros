'use client';

import { useEffect, useState } from 'react';
import { MdAttachMoney, MdCalendarToday, MdCheckCircle, MdHourglassEmpty, MdPriceCheck, MdSearch, MdWarning } from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  PAGADO: { label: 'Pagado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  VENCIDO: { label: 'Vencido', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
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

export default function CobranzaPage() {
  const [cuotas, setCuotas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('PENDIENTE');
  const [busq, setBusq] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [c, r] = await Promise.all([apiGet('/cobranza'), apiGet('/cobranza/resumen')]);
      setCuotas(c || []);
      setResumen(r);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const marcar = async (id) => {
    setActualizandoId(id);
    try {
      await apiPatch(`/cobranza/${id}/pagar`);
      mostrarToast('Cuota marcada como pagada');
      cargar();
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtradas = cuotas.filter((c) => {
    const matchFiltro = filtro === 'todos' || c.estado_pago === filtro;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (c.poliza_nombre || '').toLowerCase().includes(t) || String(c.id_cuota).includes(t);
    return matchFiltro && matchBusq;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">{toast}</div>}

      <div>
        <h1 className="text-base font-bold text-text">Cobranza</h1>
        <p className="text-xs text-text-soft mt-0.5">{cuotas.length} cuotas en el sistema</p>
      </div>

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi label="Recaudado" val={formatearMoneda(resumen.recaudado)} icon={MdCheckCircle} bg="bg-emerald-100" color="text-emerald-600" />
          <Kpi label="Por cobrar" val={formatearMoneda(resumen.por_cobrar)} icon={MdHourglassEmpty} bg="bg-amber-100" color="text-amber-600" />
          <Kpi label="Vencido" val={formatearMoneda(resumen.vencido)} icon={MdWarning} bg="bg-rose-100" color="text-rose-500" />
          <Kpi label="Total cuotas" val={resumen.total_cuotas} icon={MdAttachMoney} bg="bg-primary/10" color="text-primary" />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input placeholder="Buscar..." value={busq} onChange={(e) => setBusq(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary" />
        </div>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none">
          <option value="todos">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="VENCIDO">Vencidas</option>
          <option value="PAGADO">Pagadas</option>
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Sin cuotas con este filtro</div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtradas.slice(0, 100).map((c) => {
            const est = ESTADOS[c.estado_pago] || ESTADOS.PENDIENTE;
            return (
              <div key={c.id_cuota} className="bg-bg rounded-2xl border border-border p-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MdAttachMoney size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-text">CUO-{String(c.id_cuota).padStart(6, '0')}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />{est.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-soft mt-0.5">POL-{String(c.id_poliza).padStart(6, '0')} · {c.poliza_nombre} · cuota {c.numero_cuota}</p>
                  <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1"><MdCalendarToday size={11} /> Vence {formatearFecha(c.fecha_vencimiento)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-sm font-bold text-text">{formatearMoneda(c.monto)}</p>
                  {c.estado_pago !== 'PAGADO' && (
                    <button onClick={() => marcar(c.id_cuota)} disabled={actualizandoId === c.id_cuota} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50">
                      <MdPriceCheck size={13} /> Pagar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {filtradas.length > 100 && (
            <p className="text-xs text-text-soft text-center py-2">Mostrando primeras 100 de {filtradas.length}</p>
          )}
        </div>
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
