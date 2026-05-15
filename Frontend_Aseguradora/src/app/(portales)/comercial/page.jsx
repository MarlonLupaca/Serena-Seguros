'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdRequestQuote,
  MdPeople,
  MdAttachMoney,
  MdCampaign,
  MdHandshake,
  MdTrendingUp,
  MdCalendarToday,
  MdChevronRight,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const KANBAN = ['NUEVO', 'CONTACTADO', 'EN_PROPUESTA', 'NEGOCIACION', 'GANADO', 'PERDIDO'];

const KANBAN_COLOR = {
  NUEVO: 'bg-sky-500',
  CONTACTADO: 'bg-violet-500',
  EN_PROPUESTA: 'bg-amber-500',
  NEGOCIACION: 'bg-blue-500',
  GANADO: 'bg-emerald-500',
  PERDIDO: 'bg-rose-400',
};

function formatearMoneda(v) {
  if (v == null) return 'S/ 0';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

export default function ComercialDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/cotizaciones').catch(() => []),
      apiGet('/mis-comisiones').catch(() => []),
      apiGet('/mis-campanas').catch(() => []),
      apiGet('/clientes').catch(() => []),
    ]).then(([cots, coms, camps, clis]) => {
      setCotizaciones(cots || []);
      setComisiones(coms || []);
      setCampanas(camps || []);
      setClientes(clis || []);
      setCargando(false);
    });
  }, []);

  const totalGanado = comisiones
    .filter((c) => c.estado_pago === 'PAGADA')
    .reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);
  const totalPorCobrar = comisiones
    .filter((c) => c.estado_pago === 'PENDIENTE')
    .reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);

  const cuentaPorEstado = KANBAN.reduce(
    (acc, k) => ({ ...acc, [k]: cotizaciones.filter((c) => c.estado_kanban === k).length }),
    {}
  );

  const ultimasCotizaciones = cotizaciones.slice(0, 5);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-xs text-text-soft">Hola</p>
        <p className="text-xl font-bold text-text">{user ? `${user.nombres} ${user.apellidos}` : 'Comercial'}</p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando información...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi
              label="Cotizaciones activas"
              val={cotizaciones.length}
              icon={MdRequestQuote}
              bg="bg-primary/10"
              color="text-primary"
              onClick={() => router.push('/comercial/leads')}
            />
            <Kpi
              label="Clientes"
              val={clientes.length}
              icon={MdPeople}
              bg="bg-emerald-100"
              color="text-emerald-600"
              onClick={() => router.push('/comercial/clientes')}
            />
            <Kpi
              label="Comisión ganada"
              val={formatearMoneda(totalGanado)}
              icon={MdAttachMoney}
              bg="bg-amber-100"
              color="text-amber-600"
              onClick={() => router.push('/comercial/comisiones')}
            />
            <Kpi
              label="Por cobrar"
              val={formatearMoneda(totalPorCobrar)}
              icon={MdTrendingUp}
              bg="bg-rose-100"
              color="text-rose-500"
              onClick={() => router.push('/comercial/comisiones')}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col">
              <SectionHeader
                title="Embudo de cotizaciones"
                onClick={() => router.push('/comercial/leads')}
              />
              <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
                {KANBAN.map((k) => {
                  const total = cotizaciones.length || 1;
                  const cnt = cuentaPorEstado[k] || 0;
                  const pct = Math.round((cnt / total) * 100);
                  return (
                    <div key={k}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-text">{k.replace('_', ' ')}</span>
                        <span className="text-xs text-text-soft">{cnt} cotizaciones</span>
                      </div>
                      <div className="h-2 bg-bg-soft rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${KANBAN_COLOR[k] || 'bg-primary'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col">
              <SectionHeader title="Campañas" onClick={() => router.push('/comercial/campanas')} />
              <div className="bg-bg rounded-2xl border border-border p-5 flex-1 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <MdCampaign size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-text leading-none">{campanas.length}</p>
                    <p className="text-xs text-text-soft">campañas activas</p>
                  </div>
                </div>
                {campanas.slice(0, 3).map((c) => (
                  <div key={c.id_campana} className="border-t border-border pt-2 first:border-0 first:pt-0">
                    <p className="text-xs font-semibold text-text truncate">{c.asunto}</p>
                    <p className="text-xs text-text-soft mt-0.5">
                      {c.enviados} enviados · {c.abiertos} abiertos
                    </p>
                  </div>
                ))}
                {campanas.length === 0 && (
                  <p className="text-xs text-text-soft text-center py-4">Aún no creaste campañas.</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <SectionHeader title="Últimas cotizaciones" onClick={() => router.push('/comercial/leads')} />
            <div className="bg-bg rounded-2xl border border-border overflow-hidden">
              {ultimasCotizaciones.length === 0 ? (
                <div className="p-6 text-center text-sm text-text-soft">No hay cotizaciones todavía.</div>
              ) : (
                <div className="divide-y divide-border">
                  {ultimasCotizaciones.map((c) => (
                    <div
                      key={c.id_cotizacion}
                      onClick={() => router.push('/comercial/leads')}
                      className="p-4 flex items-center gap-3 hover:bg-bg-soft cursor-pointer transition-colors"
                    >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <MdHandshake size={18} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-text">
                          COT-{String(c.id_cotizacion).padStart(6, '0')} · {c.producto_interes}
                        </p>
                        <p className="text-xs text-text-soft mt-0.5">Agente: {c.agente_asignado}</p>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-xs text-text-soft flex items-center gap-1 justify-end">
                          <MdCalendarToday size={11} />
                          {formatearFecha(c.fecha_ingreso)}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full mt-1 ${
                            KANBAN_COLOR[c.estado_kanban] ? 'text-white' : ''
                          } ${KANBAN_COLOR[c.estado_kanban] || 'bg-bg-soft text-text-soft'}`}
                        >
                          {c.estado_kanban}
                        </span>
                      </div>
                      <MdChevronRight size={16} className="text-text-soft" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, val, icon: Icon, bg, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={17} className={color} />
      </div>
      <div>
        <p className={`text-xl font-bold leading-tight ${color}`}>{val}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, onClick }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm font-bold text-text">{title}</p>
      {onClick && (
        <button onClick={onClick} className="flex items-center gap-0.5 text-xs text-primary hover:underline">
          Ver todo <MdChevronRight size={14} />
        </button>
      )}
    </div>
  );
}
