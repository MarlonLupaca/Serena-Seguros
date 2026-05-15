'use client';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdHandshake,
  MdAutoAwesome,
  MdPerson,
  MdCalendarToday,
  MdMoreVert,
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

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADOS_LEAD = ['NUEVO', 'CONTACTADO', 'EN_PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO'];

export default function LeadsPage() {
  const [leads, setLeads] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/cotizaciones');
      setLeads((data || []).filter((c) => ESTADOS_LEAD.includes(c.estado_kanban)));
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los leads');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      const actualizada = await apiPatch(`/cotizaciones/${id}/estado`, { estado_kanban: nuevoEstado });
      if (!ESTADOS_LEAD.includes(actualizada.estado_kanban)) {
        setLeads((prev) => prev.filter((l) => l.id_cotizacion !== id));
      } else {
        setLeads((prev) => prev.map((l) => (l.id_cotizacion === id ? actualizada : l)));
      }
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

  const filtrados = leads.filter((l) => {
    const matchBusq =
      busqueda === '' ||
      String(l.id_cotizacion).includes(busqueda.toLowerCase()) ||
      (l.agente_asignado || '').toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || l.estado_kanban === filtroEstado;
    return matchBusq && matchEstado;
  });

  const counts = ESTADOS_LEAD.reduce((acc, k) => {
    acc[k] = leads.filter((l) => l.estado_kanban === k).length;
    return acc;
  }, {});

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Leads</h1>
          <p className="text-xs text-text-soft mt-0.5">{leads.length} leads activos</p>
        </div>
      </div>

      <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
        {ESTADOS_LEAD.map((k) => {
          const cfg = ESTADOS[k];
          return (
            <div key={k} className="bg-bg rounded-xl border border-border p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                <p className="text-xs text-text-soft truncate">{cfg.label}</p>
              </div>
              <p className="text-lg font-bold text-text">{counts[k] || 0}</p>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-bg border border-border rounded-xl px-3 py-2">
          <MdSearch size={14} className="text-text-soft shrink-0" />
          <input
            className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
            placeholder="Buscar por ID o agente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text outline-none cursor-pointer"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          {ESTADOS_LEAD.map((k) => (
            <option key={k} value={k}>
              {ESTADOS[k].label}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando leads...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdHandshake size={22} className="text-text-soft" />
          </div>
          <p className="text-sm font-semibold text-text">Sin leads</p>
          <p className="text-xs text-text-soft max-w-xs">No hay leads que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((lead) => (
            <LeadCard
              key={lead.id_cotizacion}
              lead={lead}
              actualizando={actualizandoId === lead.id_cotizacion}
              onCambiarEstado={(estado) => cambiarEstado(lead.id_cotizacion, estado)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function LeadCard({ lead, onCambiarEstado, actualizando }) {
  const tipoStyle = estiloTipo(lead.producto_interes);
  const Icon = tipoStyle.icon;
  const est = ESTADOS[lead.estado_kanban];
  const [menu, setMenu] = useState(false);

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
            <Icon size={22} className={tipoStyle.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">COT-{String(lead.id_cotizacion).padStart(6, '0')}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                <MdAutoAwesome size={11} /> Generado por asegurado
              </span>
            </div>
            <p className="text-xs text-text-soft mt-0.5">{lead.producto_interes}</p>
            <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
              <span className="flex items-center gap-1">
                <MdPerson size={11} /> Agente: {lead.agente_asignado}
              </span>
              <span className="flex items-center gap-1">
                <MdCalendarToday size={11} /> {formatearFecha(lead.fecha_ingreso)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0 relative">
            <p className="text-sm font-bold text-text">{formatearMoneda(lead.prima_estimada)}</p>
            <button
              onClick={() => setMenu((v) => !v)}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
            >
              <MdMoreVert size={13} /> {actualizando ? 'Actualizando...' : 'Mover a'}
            </button>
            {menu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-bg border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                {Object.entries(ESTADOS)
                  .filter(([k]) => k !== lead.estado_kanban)
                  .map(([key, cfg]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setMenu(false);
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
    </div>
  );
}
