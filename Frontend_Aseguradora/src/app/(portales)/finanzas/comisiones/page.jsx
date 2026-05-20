'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MdAttachMoney,
  MdSearch,
  MdCheckCircle,
  MdHourglassEmpty,
  MdExpandMore,
  MdExpandLess,
  MdPriceCheck,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';
import { estiloTipo } from '@/lib/tipoSeguroConfig';

const ESTADO_CONFIG = {
  PAGADA: { label: 'Pagada', badge: 'bg-success-soft text-success-text', dot: 'bg-success' },
  PENDIENTE: { label: 'Pendiente', badge: 'bg-warning-soft text-warning-text', dot: 'bg-warning' },
};

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ComisionesOperativoPage() {
  const [comisiones, setComisiones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('PENDIENTE');
  const [busq, setBusq] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/comisiones');
      setComisiones(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las comisiones');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargar(); }, []);

  const marcarPagada = async (id) => {
    setActualizandoId(id);
    try {
      await apiPatch(`/comisiones/${id}/pagar`);
      toast.success('Comisión marcada como pagada');
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtradas = comisiones.filter((c) => {
    const matchFiltro = filtro === 'todos' || c.estado_pago === filtro;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (c.poliza_nombre || '').toLowerCase().includes(t) || (c.agente_nombre || '').toLowerCase().includes(t);
    return matchFiltro && matchBusq;
  });

  const totalPendiente = comisiones.filter((c) => c.estado_pago === 'PENDIENTE').reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);
  const totalPagado = comisiones.filter((c) => c.estado_pago === 'PAGADA').reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Comisiones</h1>
        <p className="text-xs text-text-soft mt-0.5">{comisiones.length} comisiones registradas</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <Kpi label="Por pagar" val={formatearMoneda(totalPendiente)} icon={MdHourglassEmpty} bg="bg-warning-soft" color="text-warning-text" />
        <Kpi label="Pagadas" val={formatearMoneda(totalPagado)} icon={MdCheckCircle} bg="bg-success-soft" color="text-success-text" />
        <Kpi label="Total" val={comisiones.length} icon={MdAttachMoney} bg="bg-primary/10" color="text-primary" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input placeholder="Buscar por póliza o agente..." value={busq} onChange={(e) => setBusq(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary" />
        </div>
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none">
          <option value="todos">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="PAGADA">Pagadas</option>
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-danger-soft border border-danger/20 rounded-2xl p-6 text-sm text-danger-text text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Sin comisiones con este filtro</div>
      ) : (
        <GruposComision comisiones={filtradas} marcarPagada={marcarPagada} actualizandoId={actualizandoId} />
      )}
    </div>
  );
}

function GruposComision({ comisiones, marcarPagada, actualizandoId }) {
  const grupos = {};
  comisiones.forEach((c) => {
    const key = c.id_poliza || 0;
    if (!grupos[key]) grupos[key] = { nombre: c.poliza_nombre || 'Sin póliza', tipo: c.poliza_tipo, id: key, items: [] };
    grupos[key].items.push(c);
  });
  return (
    <div className="flex flex-col gap-4">
      {Object.values(grupos).sort((a, b) => a.nombre.localeCompare(b.nombre)).map((g) => (
        <GrupoPoliza key={g.id} grupo={g} marcarPagada={marcarPagada} actualizandoId={actualizandoId} />
      ))}
    </div>
  );
}

function GrupoPoliza({ grupo, marcarPagada, actualizandoId }) {
  const [abierto, setAbierto] = useState(true);
  const tipoStyle = estiloTipo(grupo.tipo);
  const totalMonto = grupo.items.reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);
  const pendientes = grupo.items.filter((c) => c.estado_pago === 'PENDIENTE').length;

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <button onClick={() => setAbierto(!abierto)} className="w-full px-4 py-3 flex items-center gap-3 hover:bg-bg-soft transition-colors">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg} overflow-hidden`}>
          <Image src={tipoStyle.imagen} width={20} height={20} alt="" className="object-contain" />
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-bold text-text">{grupo.nombre}</p>
          <p className="text-xs text-text-soft mt-0.5">{grupo.items.length} comisión{grupo.items.length > 1 ? 'es' : ''} · {pendientes} pendiente{pendientes !== 1 ? 's' : ''}</p>
        </div>
        <p className="text-sm font-bold text-text shrink-0">{formatearMoneda(totalMonto)}</p>
        {abierto ? <MdExpandLess size={18} className="text-text-soft shrink-0" /> : <MdExpandMore size={18} className="text-text-soft shrink-0" />}
      </button>
      {abierto && (
        <div className="border-t border-border divide-y divide-border/50">
          {grupo.items.map((c) => {
            const est = ESTADO_CONFIG[c.estado_pago] || ESTADO_CONFIG.PENDIENTE;
            return (
              <div key={c.id_comision} className="px-4 py-3 flex items-center gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-text">COM-{String(c.id_comision).padStart(6, '0')}</p>
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />{est.label}
                    </span>
                  </div>
                  <p className="text-xs text-text-soft mt-0.5">{c.agente_nombre || 'Agente'} · {c.porcentaje}%</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-base font-bold text-text">{formatearMoneda(c.monto_generado)}</p>
                  {c.estado_pago === 'PENDIENTE' && (
                    <button onClick={() => marcarPagada(c.id_comision)} disabled={actualizandoId === c.id_comision} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-success hover:bg-success/80 text-white text-xs font-semibold transition-colors disabled:opacity-50">
                      <MdPriceCheck size={13} /> Pagar
                    </button>
                  )}
                </div>
              </div>
            );
          })}
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
