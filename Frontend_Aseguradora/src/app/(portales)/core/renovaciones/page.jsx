'use client';

import { useEffect, useState } from 'react';
import {
  MdAutorenew,
  MdCalendarToday,
  MdShield,
  MdRefresh,
  MdClose,
  MdSend,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost } from '@/lib/api';

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
};

function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
}

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

function diasHasta(iso) {
  if (!iso) return null;
  const objetivo = new Date(iso);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / (1000 * 60 * 60 * 24));
}

export default function RenovacionesPage() {
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [dias, setDias] = useState(60);
  const [renovando, setRenovando] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dias]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet(`/polizas/renovaciones?dias=${dias}`);
      setPolizas(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las renovaciones');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
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
          <h1 className="text-base font-bold text-text">Renovaciones</h1>
          <p className="text-xs text-text-soft mt-0.5">Pólizas que vencen en los próximos {dias} días</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-text-soft">Ventana:</label>
          <select
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
          >
            <option value={15}>15 días</option>
            <option value={30}>30 días</option>
            <option value={60}>60 días</option>
            <option value={90}>90 días</option>
          </select>
          <button
            onClick={cargar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
          >
            <MdRefresh size={13} />
          </button>
        </div>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : polizas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdAutorenew size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Ninguna póliza vence en este periodo</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {polizas.map((p) => (
            <PolizaRow
              key={p.id_poliza}
              p={p}
              onRenovar={() => setRenovando(p)}
            />
          ))}
        </div>
      )}

      {renovando && (
        <ModalRenovar
          poliza={renovando}
          onClose={() => setRenovando(null)}
          onSuccess={() => {
            setRenovando(null);
            mostrarToast('Renovación emitida');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function PolizaRow({ p, onRenovar }) {
  const tipoStyle = estiloTipo(p.producto?.tipo_seguro);
  const Icon = tipoStyle.icon;
  const dr = diasHasta(p.vigencia_fin);

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
          <Icon size={20} className={tipoStyle.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-text">POL-{String(p.id_poliza).padStart(6, '0')}</p>
          <p className="text-xs text-text-soft mt-0.5">{p.producto?.nombre} · {p.producto?.tipo_seguro}</p>
          <p className="text-xs text-text-soft mt-1 flex items-center gap-1 flex-wrap">
            <MdCalendarToday size={11} />
            Vence: {formatearFecha(p.vigencia_fin)}
            <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full ${dr <= 7 ? 'bg-rose-100 text-rose-600' : dr <= 30 ? 'bg-amber-100 text-amber-700' : 'bg-bg-soft text-text-soft'}`}>
              en {dr}d
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <p className="text-sm font-bold text-text">{formatearMoneda(p.prima_total)}</p>
          <button
            onClick={onRenovar}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            <MdAutorenew size={13} /> Renovar
          </button>
        </div>
      </div>
    </div>
  );
}

function ModalRenovar({ poliza, onClose, onSuccess }) {
  const hoy = new Date().toISOString().slice(0, 10);
  const [vigenciaInicio, setVigenciaInicio] = useState(hoy);
  const [vigenciaFin, setVigenciaFin] = useState(() => {
    const d = new Date(poliza.vigencia_fin);
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().slice(0, 10);
  });
  const [primaTotal, setPrimaTotal] = useState(String(poliza.prima_total));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPatch(`/polizas/${poliza.id_poliza}/estado`, { estado_poliza: 'VENCIDA' });
      await apiPost('/polizas', {
        id_cliente: poliza.id_cliente,
        id_producto: poliza.producto.id_producto,
        prima_total: Number(primaTotal),
        vigencia_inicio: vigenciaInicio,
        vigencia_fin: vigenciaFin,
      });
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo renovar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Renovar póliza</p>
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
          <div className="bg-bg-soft rounded-xl p-3">
            <p className="text-xs text-text-soft">Póliza original</p>
            <p className="text-sm font-bold text-text">POL-{String(poliza.id_poliza).padStart(6, '0')}</p>
            <p className="text-xs text-text-soft">{poliza.producto?.nombre}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Nueva vigencia inicio</label>
              <input
                type="date"
                value={vigenciaInicio}
                onChange={(e) => setVigenciaInicio(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Nueva vigencia fin</label>
              <input
                type="date"
                value={vigenciaFin}
                onChange={(e) => setVigenciaFin(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Prima total nueva (S/)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={primaTotal}
              onChange={(e) => setPrimaTotal(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold"
            >
              <MdSend size={13} /> {enviando ? 'Renovando...' : 'Confirmar renovación'}
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
