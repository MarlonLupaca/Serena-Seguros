'use client';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdReceiptLong,
  MdPerson,
  MdCalendarToday,
  MdEdit,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';

const ESTADOS = {
  NUEVO: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  CONTACTADO: { label: 'Contactado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  EN_PROPUESTA: { label: 'En propuesta', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  NEGOCIACION: { label: 'Negociación', badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  GANADO: { label: 'Ganado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  PERDIDO: { label: 'Perdido', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
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

function Badge({ estado }) {
  const e = ESTADOS[estado] || { label: estado, badge: 'bg-bg-soft text-text-soft', dot: 'bg-border' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${e.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} />
      {e.label}
    </span>
  );
}

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [soloMias, setSoloMias] = useState(false);
  const [actualizandoId, setActualizandoId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soloMias]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const params = soloMias ? '?solo_mias=true' : '';
      const data = await apiGet(`/cotizaciones${params}`);
      setCotizaciones(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las cotizaciones');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      const actualizada = await apiPatch(`/cotizaciones/${id}/estado`, { estado_kanban: nuevoEstado });
      setCotizaciones((prev) => prev.map((c) => (c.id_cotizacion === id ? actualizada : c)));
      mostrarToast('Estado actualizado');
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const filtradas = cotizaciones.filter((c) => {
    const texto = busq.toLowerCase();
    const matchBusq =
      texto === '' ||
      String(c.id_cotizacion).includes(texto) ||
      (c.agente_asignado || '').toLowerCase().includes(texto) ||
      (c.producto_interes || '').toLowerCase().includes(texto);
    const matchEstado = filtroEstado === 'todos' || c.estado_kanban === filtroEstado;
    return matchBusq && matchEstado;
  });

  const contadores = Object.fromEntries(
    Object.keys(ESTADOS).map((k) => [k, cotizaciones.filter((c) => c.estado_kanban === k).length])
  );

  return (
    <div className="py-4 flex flex-col gap-6 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-lg font-bold text-text">Cotizaciones</p>
          <p className="text-xs text-text-soft mt-0.5">{cotizaciones.length} cotizaciones registradas</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-text-soft cursor-pointer">
          <input
            type="checkbox"
            checked={soloMias}
            onChange={(e) => setSoloMias(e.target.checked)}
            className="w-4 h-4 rounded accent-primary"
          />
          Solo las mías
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {Object.entries(ESTADOS).map(([key, val]) => (
          <button
            key={key}
            onClick={() => setFiltroEstado(filtroEstado === key ? 'todos' : key)}
            className={`rounded-xl border p-3 text-left transition-colors ${
              filtroEstado === key ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${val.dot}`} />
              <p className="text-xs text-text-soft truncate">{val.label}</p>
            </div>
            <p className="text-xl font-bold text-text">{contadores[key] ?? 0}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
          placeholder="Buscar por ID, agente o tipo de producto..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-3">
        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
            Cargando cotizaciones...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
            {error}
          </div>
        ) : filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-text-soft gap-2">
            <MdReceiptLong size={32} />
            <p className="text-sm font-semibold text-text">Sin resultados</p>
            <p className="text-xs">Prueba con otro filtro o búsqueda</p>
          </div>
        ) : (
          filtradas.map((c) => (
            <CotizacionCard
              key={c.id_cotizacion}
              c={c}
              actualizando={actualizandoId === c.id_cotizacion}
              onCambiarEstado={(estado) => cambiarEstado(c.id_cotizacion, estado)}
            />
          ))
        )}
      </div>
    </div>
  );
}

function CotizacionCard({ c, onCambiarEstado, actualizando }) {
  const tipoStyle = estiloTipo(c.producto_interes);
  const Icon = tipoStyle.icon;
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
          <Icon size={20} className={tipoStyle.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">COT-{String(c.id_cotizacion).padStart(6, '0')}</p>
            <Badge estado={c.estado_kanban} />
          </div>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
            <MdPerson size={11} /> Agente: {c.agente_asignado}
          </p>
          <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
            <MdCalendarToday size={11} /> {formatearFecha(c.fecha_ingreso)} · {c.producto_interes}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 relative">
          <p className="text-sm font-bold text-text">{formatearMoneda(c.prima_estimada)}</p>
          <button
            onClick={() => setMenuAbierto((v) => !v)}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
          >
            <MdEdit size={13} /> {actualizando ? 'Actualizando...' : 'Cambiar estado'}
          </button>
          {menuAbierto && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-bg border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              {Object.entries(ESTADOS)
                .filter(([k]) => k !== c.estado_kanban)
                .map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMenuAbierto(false);
                      onCambiarEstado(key);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-soft hover:bg-bg-soft transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
