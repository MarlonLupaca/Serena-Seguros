'use client';

import { useEffect, useState } from 'react';
import {
  MdEdit,
  MdSearch,
  MdCheck,
  MdClose,
  MdCalendarToday,
  MdHourglassEmpty,
  MdThumbUp,
  MdThumbDown,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', icon: MdHourglassEmpty },
  APROBADO: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', icon: MdThumbUp },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400', icon: MdThumbDown },
};

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

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EndososPage() {
  const [endosos, setEndosos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('PENDIENTE');
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
      const data = await apiGet('/endosos');
      setEndosos(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los endosos');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const cambiarEstado = async (id, estado) => {
    setActualizandoId(id);
    try {
      const data = await apiPatch(`/endosos/${id}/estado`, { estado_aprobacion: estado });
      setEndosos((prev) => prev.map((e) => (e.id_endoso === id ? data : e)));
      mostrarToast(`Endoso ${estado.toLowerCase()}`);
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtrados = endosos.filter((e) => {
    const matchEstado = filtro === 'todos' || e.estado_aprobacion === filtro;
    const t = busq.toLowerCase();
    const matchBusq =
      t === '' ||
      String(e.id_endoso).includes(t) ||
      (e.tipo_cambio || '').toLowerCase().includes(t) ||
      (e.poliza_nombre || '').toLowerCase().includes(t);
    return matchEstado && matchBusq;
  });

  const counts = Object.keys(ESTADOS).reduce(
    (acc, k) => ({ ...acc, [k]: endosos.filter((e) => e.estado_aprobacion === k).length }),
    {}
  );

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-base font-bold text-text">Gestión de endosos</h1>
        <p className="text-xs text-text-soft mt-0.5">{endosos.length} endosos en total</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {Object.entries(ESTADOS).map(([k, v]) => {
          const Icon = v.icon;
          return (
            <button
              key={k}
              onClick={() => setFiltro(filtro === k ? 'todos' : k)}
              className={`text-left rounded-xl border p-3 transition-colors flex items-center gap-3 ${
                filtro === k ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${v.badge}`}>
                <Icon size={17} />
              </div>
              <div>
                <p className="text-lg font-bold text-text leading-tight">{counts[k] || 0}</p>
                <p className="text-xs text-text-soft">{v.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por póliza, tipo o ID..."
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
          <MdEdit size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin endosos</p>
          <p className="text-xs text-text-soft mt-1">No hay endosos con este filtro.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((e) => (
            <EndosoCard
              key={e.id_endoso}
              e={e}
              actualizando={actualizandoId === e.id_endoso}
              onAprobar={() => cambiarEstado(e.id_endoso, 'APROBADO')}
              onRechazar={() => cambiarEstado(e.id_endoso, 'RECHAZADO')}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EndosoCard({ e, onAprobar, onRechazar, actualizando }) {
  const tipoStyle = estiloTipo(e.poliza_tipo);
  const Icon = tipoStyle.icon;
  const est = ESTADOS[e.estado_aprobacion] || ESTADOS.PENDIENTE;

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
          <Icon size={20} className={tipoStyle.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">END-{String(e.id_endoso).padStart(6, '0')}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
              {est.label}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            POL-{String(e.id_poliza).padStart(6, '0')} · {e.poliza_nombre}
          </p>
          <p className="text-sm font-semibold text-text mt-2">{e.tipo_cambio}</p>
          <p className="text-xs text-text-soft mt-1">{e.descripcion_cambio}</p>
          <p className="text-xs text-text-soft mt-2 flex items-center gap-1">
            <MdCalendarToday size={11} /> Solicitado el {formatearFecha(e.fecha_solicitud)}
          </p>
        </div>
        {e.estado_aprobacion === 'PENDIENTE' && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={onAprobar}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdCheck size={13} /> Aprobar
            </button>
            <button
              onClick={onRechazar}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-300 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <MdClose size={13} /> Rechazar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
