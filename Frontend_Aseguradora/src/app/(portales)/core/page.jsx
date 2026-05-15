'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdShield,
  MdEditDocument,
  MdAutorenew,
  MdWarning,
  MdAssuredWorkload,
  MdHandshake,
  MdPeople,
  MdChevronRight,
  MdCalendarToday,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
}

const ESTADO_SINIESTRO = {
  REPORTADO: 'bg-primary/10 text-primary',
  EN_REVISION: 'bg-amber-100 text-amber-700',
  INSPECCION: 'bg-sky-100 text-sky-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-600',
  LIQUIDADO: 'bg-emerald-100 text-emerald-700',
};

export default function CoreDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [polizas, setPolizas] = useState([]);
  const [endosos, setEndosos] = useState([]);
  const [siniestros, setSiniestros] = useState([]);
  const [renovaciones, setRenovaciones] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [reaseguros, setReaseguros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/polizas').catch(() => []),
      apiGet('/endosos?estado=PENDIENTE').catch(() => []),
      apiGet('/siniestros').catch(() => []),
      apiGet('/polizas/renovaciones?dias=30').catch(() => []),
      apiGet('/proveedores').catch(() => []),
      apiGet('/reaseguros').catch(() => []),
    ]).then(([p, e, s, r, pr, rs]) => {
      setPolizas(p || []);
      setEndosos(e || []);
      setSiniestros(s || []);
      setRenovaciones(r || []);
      setProveedores(pr || []);
      setReaseguros(rs || []);
      setCargando(false);
    });
  }, []);

  const polizasActivas = polizas.filter((p) => p.estado_poliza === 'ACTIVA').length;
  const enCurso = ['REPORTADO', 'EN_REVISION', 'INSPECCION'];
  const siniestrosEnCurso = siniestros.filter((s) => enCurso.includes(s.estado_resolucion));
  const sinAsignar = siniestros.filter((s) => !s.id_empleado_analista && enCurso.includes(s.estado_resolucion));

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-xs text-text-soft">Hola</p>
        <p className="text-xl font-bold text-text">{user ? `${user.nombres} ${user.apellidos}` : 'Técnico'}</p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Pólizas activas" val={polizasActivas} icon={MdShield} bg="bg-primary/10" color="text-primary" onClick={() => router.push('/core/emisiones')} />
            <Kpi label="Endosos pendientes" val={endosos.length} icon={MdEditDocument} bg="bg-amber-100" color="text-amber-600" onClick={() => router.push('/core/bandeja')} />
            <Kpi label="Renuevan en 30d" val={renovaciones.length} icon={MdAutorenew} bg="bg-sky-100" color="text-sky-600" onClick={() => router.push('/core/bandeja')} />
            <Kpi label="Siniestros en curso" val={siniestrosEnCurso.length} icon={MdWarning} bg="bg-rose-100" color="text-rose-500" onClick={() => router.push('/core/siniestros')} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <Header title="Endosos por aprobar" onClick={() => router.push('/core/bandeja')} />
              <div className="bg-bg rounded-2xl border border-border overflow-hidden">
                {endosos.length === 0 ? (
                  <div className="p-6 text-center text-sm text-text-soft">No hay endosos pendientes.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {endosos.slice(0, 5).map((e) => (
                      <div key={e.id_endoso} onClick={() => router.push('/core/bandeja')} className="p-4 flex items-center gap-3 hover:bg-bg-soft cursor-pointer transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                          <MdEditDocument size={18} className="text-amber-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text">END-{String(e.id_endoso).padStart(6, '0')}</p>
                          <p className="text-xs text-text-soft truncate">{e.tipo_cambio}</p>
                        </div>
                        <p className="text-xs text-text-soft shrink-0 hidden sm:block flex items-center gap-1">
                          <MdCalendarToday size={11} className="inline" />
                          {' '}{formatearFecha(e.fecha_solicitud)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <Header title="Siniestros sin analista" onClick={() => router.push('/core/siniestros')} />
              <div className="bg-bg rounded-2xl border border-border overflow-hidden">
                {sinAsignar.length === 0 ? (
                  <div className="p-6 text-center text-sm text-text-soft">Todos los siniestros tienen analista asignado.</div>
                ) : (
                  <div className="divide-y divide-border">
                    {sinAsignar.slice(0, 5).map((s) => (
                      <div key={s.id_siniestro} onClick={() => router.push('/core/siniestros')} className="p-4 flex items-center gap-3 hover:bg-bg-soft cursor-pointer transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                          <MdWarning size={18} className="text-rose-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text">SIN-{String(s.id_siniestro).padStart(6, '0')}</p>
                          <p className="text-xs text-text-soft truncate">{s.tipo_incidente} · {s.cliente_nombre}</p>
                        </div>
                        <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${ESTADO_SINIESTRO[s.estado_resolucion] || ''}`}>
                          {s.estado_resolucion}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card title="Reaseguro" val={reaseguros.length} subtitle="contratos activos" icon={MdAssuredWorkload} onClick={() => router.push('/core/reaseguro')} />
            <Card title="Proveedores" val={proveedores.length} subtitle="en la red" icon={MdHandshake} onClick={() => router.push('/core/proveedores')} />
            <Card title="Pólizas totales" val={polizas.length} subtitle="emitidas" icon={MdShield} onClick={() => router.push('/core/emisiones')} />
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, val, icon: Icon, bg, color, onClick }) {
  return (
    <div onClick={onClick} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
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

function Card({ title, val, subtitle, icon: Icon, onClick }) {
  return (
    <div onClick={onClick} className="bg-bg rounded-2xl border border-border p-5 cursor-pointer hover:shadow-md transition-shadow flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon size={22} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-text-soft">{title}</p>
        <p className="text-xl font-bold text-text">{val}</p>
        <p className="text-xs text-text-soft">{subtitle}</p>
      </div>
      <MdChevronRight size={18} className="text-text-soft" />
    </div>
  );
}

function Header({ title, onClick }) {
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
