'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdAssignmentTurnedIn,
  MdBarChart,
  MdDescription,
  MdFlag,
  MdGroups,
  MdInsights,
  MdPayments,
  MdPendingActions,
  MdReportProblem,
  MdTrendingUp,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

const COLORES_ESTADO = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-700',
};

const COLOR_OBJ = {
  EN_PROGRESO: 'bg-primary',
  EN_RIESGO: 'bg-amber-500',
  RETRASADO: 'bg-rose-500',
  CUMPLIDO: 'bg-emerald-500',
};

export default function EjecutivoDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [resumen, setResumen] = useState(null);
  const [comercial, setComercial] = useState(null);
  const [siniestralidad, setSiniestralidad] = useState(null);
  const [aprobaciones, setAprobaciones] = useState([]);
  const [objetivos, setObjetivos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/ejecutivo/resumen').catch(() => null),
      apiGet('/ejecutivo/comercial').catch(() => null),
      apiGet('/ejecutivo/siniestralidad').catch(() => null),
      apiGet('/aprobaciones?estado=PENDIENTE').catch(() => []),
      apiGet('/objetivos').catch(() => []),
    ]).then(([r, c, s, a, o]) => {
      setResumen(r);
      setComercial(c);
      setSiniestralidad(s);
      setAprobaciones(a || []);
      setObjetivos(o || []);
      setCargando(false);
    });
  }, []);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-xs text-text-soft">Hola</p>
        <p className="text-xl font-bold text-text">{user ? `${user.nombres} ${user.apellidos}` : 'Ejecutivo'}</p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando indicadores...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Polizas activas" valor={resumen?.polizas_activas ?? 0} icon={MdDescription} bg="bg-primary/10" color="text-primary" onClick={() => router.push('/ejecutivo/produccion')} />
            <Kpi label="Siniestros pendientes" valor={resumen?.siniestros_pendientes ?? 0} icon={MdReportProblem} bg="bg-rose-100" color="text-rose-600" onClick={() => router.push('/ejecutivo/siniestralidad')} />
            <Kpi label="Recaudacion mes" valor={formatearMoneda(resumen?.recaudacion_mes)} icon={MdPayments} bg="bg-emerald-100" color="text-emerald-600" onClick={() => router.push('/ejecutivo/financiero')} />
            <Kpi label="Aprobaciones" valor={resumen?.aprobaciones_pendientes ?? 0} icon={MdAssignmentTurnedIn} bg="bg-amber-100" color="text-amber-700" onClick={() => router.push('/ejecutivo/aprobaciones')} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <KpiCompact label="Conversion comercial" valor={`${comercial?.tasa_conversion ?? 0}%`} icon={MdTrendingUp} />
            <KpiCompact label="Indice siniestralidad" valor={`${siniestralidad?.indice_siniestralidad ?? 0}%`} icon={MdInsights} />
            <KpiCompact label="Clientes registrados" valor={resumen?.clientes_totales ?? 0} icon={MdGroups} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card titulo="Aprobaciones pendientes" subtitulo={`${aprobaciones.length} solicitudes en cola`} icon={MdPendingActions} onClick={() => router.push('/ejecutivo/aprobaciones')}>
              {aprobaciones.length === 0 ? (
                <p className="text-xs text-text-soft">Sin aprobaciones pendientes.</p>
              ) : (
                aprobaciones.slice(0, 4).map((a) => (
                  <div key={a.id_aprobacion} className="flex items-center gap-3 border-t border-border pt-2 first:border-0 first:pt-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-text truncate">{a.modulo_origen}</p>
                      <p className="text-[11px] text-text-soft truncate">{a.comentarios_previos || 'Sin comentarios'}</p>
                    </div>
                    <p className="text-xs font-bold text-text">{formatearMoneda(a.monto_impacto)}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${COLORES_ESTADO[a.estado_gerencial]}`}>{a.estado_gerencial}</span>
                  </div>
                ))
              )}
            </Card>

            <Card titulo="Objetivos corporativos" subtitulo={`${objetivos.length} metas asignadas`} icon={MdFlag} onClick={() => router.push('/ejecutivo/objetivos')}>
              {objetivos.length === 0 ? (
                <p className="text-xs text-text-soft">Sin objetivos cargados.</p>
              ) : (
                objetivos.slice(0, 4).map((o) => (
                  <div key={o.id_objetivo} className="border-t border-border pt-2 first:border-0 first:pt-0">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-text truncate">{o.descripcion}</span>
                      <span className="text-text-soft shrink-0">{o.porcentaje_avance}%</span>
                    </div>
                    <div className="h-1.5 bg-bg-soft rounded-full mt-1 overflow-hidden">
                      <div className={`h-full rounded-full ${COLOR_OBJ[o.estado] || 'bg-primary'}`} style={{ width: `${Math.min(100, Number(o.porcentaje_avance || 0))}%` }} />
                    </div>
                  </div>
                ))
              )}
            </Card>
          </div>

          <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <MdBarChart size={20} className="text-primary" />
              <p className="text-sm font-bold text-text">Mas reportes</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Acceso titulo="Produccion" descripcion="Polizas y prima" onClick={() => router.push('/ejecutivo/produccion')} />
              <Acceso titulo="Comercial" descripcion="Embudo y comisiones" onClick={() => router.push('/ejecutivo/comercial')} />
              <Acceso titulo="Financiero" descripcion="Flujo de caja" onClick={() => router.push('/ejecutivo/financiero')} />
              <Acceso titulo="Simulador" descripcion="Escenarios" onClick={() => router.push('/ejecutivo/simulaciones')} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, valor, icon: Icon, bg, color, onClick }) {
  return (
    <div onClick={onClick} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={17} className={color} />
      </div>
      <div className="min-w-0">
        <p className={`text-xl font-bold leading-tight ${color} truncate`}>{valor}</p>
        <p className="text-xs text-text-soft truncate">{label}</p>
      </div>
    </div>
  );
}

function KpiCompact({ label, valor, icon: Icon }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
      <Icon size={18} className="text-primary" />
      <div>
        <p className="text-base font-bold text-text">{valor}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}

function Card({ titulo, subtitulo, icon: Icon, onClick, children }) {
  return (
    <div onClick={onClick} className="bg-bg rounded-2xl border border-border p-5 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon size={20} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text">{titulo}</p>
          <p className="text-xs text-text-soft">{subtitulo}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function Acceso({ titulo, descripcion, onClick }) {
  return (
    <button onClick={onClick} className="text-left bg-bg-soft rounded-xl border border-border p-3 hover:border-primary/40 transition-colors">
      <p className="text-xs font-bold text-text">{titulo}</p>
      <p className="text-[11px] text-text-soft">{descripcion}</p>
    </button>
  );
}
