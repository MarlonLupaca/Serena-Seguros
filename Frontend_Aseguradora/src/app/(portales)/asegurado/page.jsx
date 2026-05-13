'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdCreditCard,
  MdWarningAmber,
  MdAccessTime,
  MdCheckCircle,
  MdInfo,
  MdCalendarToday,
  MdChevronRight,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

const TIPO_ICON = {
  VEHICULAR: { icon: MdDirectionsCar, bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary/40' },
  SALUD: { icon: MdHealthAndSafety, bg: 'bg-emerald-100', text: 'text-emerald-600', bar: 'bg-emerald-400' },
  VIDA: { icon: MdFavorite, bg: 'bg-rose-100', text: 'text-rose-500', bar: 'bg-rose-400' },
  HOGAR: { icon: MdHome, bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-400' },
  VIAJE: { icon: MdFlight, bg: 'bg-sky-100', text: 'text-sky-600', bar: 'bg-sky-400' },
  EMPRESA: { icon: MdBusiness, bg: 'bg-violet-100', text: 'text-violet-600', bar: 'bg-violet-400' },
};

function tipoStyle(tipo) {
  return TIPO_ICON[tipo] || { icon: MdShield, bg: 'bg-bg-soft', text: 'text-text-soft', bar: 'bg-border' };
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

function Card({ children, onClick, className = '' }) {
  return (
    <div
      onClick={onClick}
      className={`bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow cursor-pointer overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

const SINIESTRO_ESTADO_BADGE = {
  REPORTADO: 'bg-primary/10 text-primary',
  EN_REVISION: 'bg-amber-100 text-amber-700',
  INSPECCION: 'bg-sky-100 text-sky-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-600',
  LIQUIDADO: 'bg-emerald-100 text-emerald-700',
};

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [polizas, setPolizas] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/mis-polizas').catch(() => []),
      apiGet('/mis-cuotas').catch(() => []),
      apiGet('/mis-siniestros').catch(() => []),
    ]).then(([p, c, s]) => {
      setPolizas(p || []);
      setCuotas(c || []);
      setSiniestros(s || []);
      setCargando(false);
    });
  }, []);

  const polizasActivas = polizas.filter((p) => p.estado_poliza === 'ACTIVA').slice(0, 3);
  const cuotasPendientes = cuotas
    .filter((c) => c.estado_pago === 'PENDIENTE')
    .sort((a, b) => new Date(a.fecha_vencimiento) - new Date(b.fecha_vencimiento));
  const proximaCuota = cuotasPendientes[0];
  const cuotasVencidas = cuotas.filter((c) => {
    if (c.estado_pago === 'VENCIDO') return true;
    if (c.estado_pago === 'PAGADO') return false;
    const d = diasHasta(c.fecha_vencimiento);
    return d != null && d < 0;
  }).length;

  const enCurso = ['REPORTADO', 'EN_REVISION', 'INSPECCION'];
  const siniestroActivo = siniestros.find((s) => enCurso.includes(s.estado_resolucion));

  const notificaciones = [];
  if (proximaCuota) {
    const d = diasHasta(proximaCuota.fecha_vencimiento);
    notificaciones.push({
      id: 'pago-proximo',
      icon: MdAccessTime,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      titulo: 'Pago próximo a vencer',
      desc: `Tu cuota de ${proximaCuota.poliza_nombre} vence en ${d != null ? `${d}d` : 'pronto'}.`,
    });
  }
  if (cuotasVencidas > 0) {
    notificaciones.push({
      id: 'pago-vencido',
      icon: MdWarningAmber,
      color: 'text-rose-500',
      bg: 'bg-rose-50',
      titulo: 'Cuotas vencidas',
      desc: `Tienes ${cuotasVencidas} cuota${cuotasVencidas > 1 ? 's' : ''} vencida${cuotasVencidas > 1 ? 's' : ''}. Regulariza para mantener tu cobertura.`,
    });
  }
  if (siniestroActivo) {
    notificaciones.push({
      id: 'siniestro',
      icon: MdInfo,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      titulo: 'Siniestro en curso',
      desc: `Tu caso SIN-${String(siniestroActivo.id_siniestro).padStart(6, '0')} está ${siniestroActivo.estado_resolucion}.`,
    });
  }
  if (notificaciones.length === 0) {
    notificaciones.push({
      id: 'ok',
      icon: MdCheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      titulo: 'Todo en orden',
      desc: 'No tienes pagos pendientes ni siniestros en curso.',
    });
  }

  return (
    <div className="flex flex-col gap-8 p-6">
      <div>
        <p className="text-xs text-text-soft">Bienvenido de vuelta</p>
        <p className="text-xl font-bold text-text">
          {user ? `${user.nombres} ${user.apellidos}` : 'Asegurado'}
        </p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando información...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col">
              <SectionHeader title="Pólizas activas" onClick={() => router.push('/asegurado/polizas')} />
              {polizasActivas.length === 0 ? (
                <Card onClick={() => router.push('/asegurado/seguros')} className="flex-1">
                  <div className="p-6 text-center">
                    <MdShield size={28} className="text-text-soft mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-text">No tienes pólizas activas</p>
                    <p className="text-xs text-text-soft mt-1">Cotiza tu primer seguro.</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                  {polizasActivas.map((p) => {
                    const t = tipoStyle(p.producto?.tipo_seguro);
                    const Icon = t.icon;
                    return (
                      <Card
                        key={p.id_poliza}
                        onClick={() => router.push('/asegurado/polizas')}
                        className="flex flex-col"
                      >
                        <div className={`h-1 w-full ${t.bar}`} />
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.bg}`}>
                            <Icon size={20} className={t.text} />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-text leading-snug">{p.producto?.nombre}</p>
                            <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                              <MdCalendarToday size={11} /> Vence {formatearFecha(p.vigencia_fin)}
                            </p>
                          </div>
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 self-start">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
                          </span>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <SectionHeader title="Próximo pago" onClick={() => router.push('/asegurado/pagos')} />
              {proximaCuota ? (
                <Card onClick={() => router.push('/asegurado/pagos')} className="flex-1 flex flex-col">
                  <div className="h-1 w-full bg-amber-400" />
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                      <MdCreditCard size={20} className="text-amber-500" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-xs text-text-soft">Póliza</p>
                      <p className="text-sm font-bold text-text">{proximaCuota.poliza_nombre}</p>
                      <p className="text-xs text-text-soft flex items-center gap-1 mt-1">
                        <MdCalendarToday size={11} /> {formatearFecha(proximaCuota.fecha_vencimiento)}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text">{formatearMoneda(proximaCuota.monto)}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 mt-2">
                        <MdAccessTime size={11} />{' '}
                        {(() => {
                          const d = diasHasta(proximaCuota.fecha_vencimiento);
                          if (d == null) return 'Pronto';
                          if (d < 0) return `${Math.abs(d)}d vencida`;
                          return `${d}d restantes`;
                        })()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/asegurado/pagos');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                    >
                      <MdCreditCard size={13} /> Pagar ahora
                    </button>
                  </div>
                </Card>
              ) : (
                <Card onClick={() => router.push('/asegurado/pagos')} className="flex-1">
                  <div className="p-6 text-center">
                    <MdCheckCircle size={28} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-text">Estás al día</p>
                    <p className="text-xs text-text-soft mt-1">No tienes cuotas pendientes.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <SectionHeader title="Siniestro activo" onClick={() => router.push('/asegurado/reportar')} />
              {siniestroActivo ? (
                <Card onClick={() => router.push('/asegurado/reportar')} className="flex-1 flex flex-col">
                  <div className="h-1 w-full bg-amber-400" />
                  <div className="p-5 flex flex-col gap-4 flex-1">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-100">
                      <MdWarningAmber size={20} className="text-amber-500" />
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <p className="text-xs font-bold text-text">
                        SIN-{String(siniestroActivo.id_siniestro).padStart(6, '0')}
                      </p>
                      <p className="text-xs text-text-soft">{siniestroActivo.poliza_nombre}</p>
                      <p className="text-xs text-text-soft mt-1 leading-relaxed line-clamp-2">
                        {siniestroActivo.tipo_incidente}
                      </p>
                    </div>
                    <div>
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${SINIESTRO_ESTADO_BADGE[siniestroActivo.estado_resolucion] || ''}`}
                      >
                        {siniestroActivo.estado_resolucion}
                      </span>
                      <p className="text-xs text-text-soft mt-2 flex items-center gap-1">
                        <MdCalendarToday size={11} /> Reportado {formatearFecha(siniestroActivo.fecha_reporte)}
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card onClick={() => router.push('/asegurado/reportar')} className="flex-1">
                  <div className="p-6 text-center">
                    <MdCheckCircle size={28} className="text-emerald-500 mx-auto mb-2" />
                    <p className="text-sm text-text">Sin siniestros activos</p>
                    <p className="text-xs text-text-soft mt-1">Si pasó algo, repórtalo aquí.</p>
                  </div>
                </Card>
              )}
            </div>

            <div className="lg:col-span-2 flex flex-col">
              <SectionHeader title="Notificaciones" />
              <div className="flex flex-col gap-3 flex-1">
                {notificaciones.map((n) => {
                  const Icon = n.icon;
                  return (
                    <Card key={n.id} className="flex-1">
                      <div className="flex items-start gap-3 p-4 h-full">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.bg}`}>
                          <Icon size={16} className={n.color} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-text">{n.titulo}</p>
                          <p className="text-xs text-text-soft mt-0.5 leading-relaxed">{n.desc}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
