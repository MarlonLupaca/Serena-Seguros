'use client';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdWarning,
  MdPerson,
  MdCalendarToday,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';

const ESTADOS = {
  REPORTADO: { label: 'Reportado', badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  EN_REVISION: { label: 'En revision', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  INSPECCION: { label: 'Inspeccion', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400' },
  APROBADO: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  LIQUIDADO: { label: 'Liquidado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
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

export default function SiniestrosComercialPage() {
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/comercial/siniestros');
      setSiniestros(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los siniestros');
    } finally {
      setCargando(false);
    }
  };

  const filtrados = siniestros.filter((s) => {
    const matchBusq =
      busqueda === '' ||
      String(s.id_siniestro).includes(busqueda) ||
      (s.descripcion || '').toLowerCase().includes(busqueda.toLowerCase());
    const matchEstado = filtroEstado === 'todos' || s.estado_siniestro === filtroEstado;
    return matchBusq && matchEstado;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Siniestros de mis clientes</h1>
        <p className="text-xs text-text-soft mt-0.5">{siniestros.length} siniestros registrados</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-bg border border-border rounded-xl px-3 py-2">
          <MdSearch size={14} className="text-text-soft shrink-0" />
          <input
            className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
            placeholder="Buscar por ID o descripcion..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <select
          className="bg-bg border border-border rounded-xl px-3 py-2 text-xs text-text outline-none cursor-pointer"
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos los estados</option>
          {Object.entries(ESTADOS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando siniestros...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdWarning size={22} className="text-text-soft" />
          </div>
          <p className="text-sm font-semibold text-text">Sin siniestros</p>
          <p className="text-xs text-text-soft max-w-xs">No hay siniestros que coincidan con los filtros.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left border-b border-border">
                <th className="py-3 px-3 font-semibold text-text-soft">ID</th>
                <th className="py-3 px-3 font-semibold text-text-soft">Poliza</th>
                <th className="py-3 px-3 font-semibold text-text-soft">Tipo</th>
                <th className="py-3 px-3 font-semibold text-text-soft">Estado</th>
                <th className="py-3 px-3 font-semibold text-text-soft">Fecha reporte</th>
                <th className="py-3 px-3 font-semibold text-text-soft">Monto reclamado</th>
                <th className="py-3 px-3 font-semibold text-text-soft">Descripcion</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((s) => {
                const est = ESTADOS[s.estado_siniestro] || { label: s.estado_siniestro, badge: 'bg-bg-soft text-text-soft', dot: 'bg-text-soft' };
                const tipoStyle = estiloTipo(s.tipo_seguro);
                const TipoIcon = tipoStyle.icon;
                return (
                  <tr key={s.id_siniestro} className="border-b border-border/50 hover:bg-bg-soft/50 transition-colors">
                    <td className="py-3 px-3 font-bold text-text">SIN-{String(s.id_siniestro).padStart(6, '0')}</td>
                    <td className="py-3 px-3 text-text">POL-{String(s.id_poliza).padStart(6, '0')}</td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <TipoIcon size={14} className={tipoStyle.accentText} />
                        <span className="text-text">{s.tipo_seguro || '—'}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                        {est.label}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-text-soft">{formatearFecha(s.fecha_reporte)}</td>
                    <td className="py-3 px-3 font-medium text-text">{formatearMoneda(s.monto_reclamado)}</td>
                    <td className="py-3 px-3 text-text-soft max-w-[200px] truncate">{s.descripcion || '—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
