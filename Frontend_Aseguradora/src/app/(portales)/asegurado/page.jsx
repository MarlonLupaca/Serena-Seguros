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
  MdAssignment,
  MdLocalOffer,
  MdAutorenew,
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
    <div className="flex items-center justify-between mb-3 mt-4">
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
      className={`bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow ${
        onClick ? 'cursor-pointer' : ''
      } overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

const SINIESTRO_EN_CURSO = ['REPORTADO', 'EN_REVISION', 'INSPECCION'];

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();

  const [polizas, setPolizas] = useState([]);
  const [cuotas, setCuotas] = useState([]);
  const [siniestros, setSiniestros] = useState([]);
  const [promociones, setPromociones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/mis-polizas').catch(() => []),
      apiGet('/mis-cuotas').catch(() => []),
      apiGet('/mis-siniestros').catch(() => []),
      apiGet('/promociones').catch(() => []),
    ]).then(([p, c, s, promo]) => {
      setPolizas(p || []);
      setCuotas(c || []);
      setSiniestros(s || []);
      setPromociones(promo || []);
      setCargando(false);
    });
  }, []);

  const polizasActivas = polizas.filter((p) => p.estado_poliza === 'ACTIVA');
  const polizasActivasTop = polizasActivas.slice(0, 3);
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

  const siniestrosAbiertos = siniestros.filter((s) => SINIESTRO_EN_CURSO.includes(s.estado_resolucion));
  const siniestroActivo = siniestrosAbiertos[0];

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
      desc: `Tienes ${cuotasVencidas} cuota${cuotasVencidas > 1 ? 's' : ''} vencida${
        cuotasVencidas > 1 ? 's' : ''
      }. Regulariza para mantener tu cobertura.`,
    });
  }
  if (siniestroActivo) {
    notificaciones.push({
      id: 'siniestro',
      icon: MdInfo,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
      titulo: 'Siniestro en curso',
      desc: `Tu caso SIN-${String(siniestroActivo.id_siniestro).padStart(6, '0')} esta ${siniestroActivo.estado_resolucion}.`,
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
    <div className="flex flex-col gap-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-xs text-text-soft">Bienvenido de vuelta</p>
          <p className="text-xl font-bold text-text">
            {user ? `${user.nombres} ${user.apellidos}` : 'Asegurado'}
          </p>
        </div>
        <button
          onClick={() => router.push('/asegurado/reportar')}
          className="flex items-center gap-2 bg-rose-100 text-rose-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-rose-200 transition-colors"
        >
          <MdWarningAmber size={18} /> Reportar Siniestro
        </button>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando información...
        </div>
      ) : (
        <>
          {/* Tarjetas resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-text-soft mb-1">
                <MdShield size={16} />
                <p className="text-xs font-semibold">Pólizas activas</p>
              </div>
              <p className="text-2xl font-bold text-text">{polizasActivas.length}</p>
            </Card>

            <Card className="p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-text-soft mb-1">
                <MdCreditCard size={16} />
                <p className="text-xs font-semibold">Próximo pago</p>
              </div>
              <p className="text-2xl font-bold text-text">
                {proximaCuota ? formatearMoneda(proximaCuota.monto) : 'S/ 0.00'}
              </p>
            </Card>

            <Card className="p-4 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-text-soft mb-1">
                <MdInfo size={16} />
                <p className="text-xs font-semibold">Siniestros abiertos</p>
              </div>
              <p className="text-2xl font-bold text-text">{siniestrosAbiertos.length}</p>
            </Card>

            <Card className="p-4 flex flex-col justify-center" onClick={() => router.push('/asegurado/seguros')}>
              <div className="flex items-center gap-2 text-text-soft mb-1">
                <MdAssignment size={16} />
                <p className="text-xs font-semibold">Cotizar</p>
              </div>
              <p className="text-sm font-bold text-text truncate">Simula tu seguro</p>
              <p className="text-xs text-text-soft mt-1">Pasa a contratacion en minutos</p>
            </Card>
          </div>

          {/* Polizas vigentes + proximo pago */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 flex flex-col">
              <SectionHeader title="Mis pólizas vigentes" onClick={() => router.push('/asegurado/polizas')} />
              {polizasActivasTop.length === 0 ? (
                <Card onClick={() => router.push('/asegurado/seguros')} className="flex-1">
                  <div className="p-6 text-center">
                    <MdShield size={28} className="text-text-soft mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-text">No tienes polizas activas</p>
                    <p className="text-xs text-text-soft mt-1">Cotiza tu primer seguro.</p>
                  </div>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                  {polizasActivasTop.map((p) => {
                    const t = tipoStyle(p.producto?.tipo_seguro);
                    const Icon = t.icon;
                    return (
                      <Card key={p.id_poliza} className="flex flex-col relative">
                        <div className={`h-1 w-full ${t.bar}`} />
                        <div className="p-4 flex flex-col gap-3 flex-1">
                          <div className="flex justify-between items-start">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${t.bg}`}>
                              <Icon size={20} className={t.text} />
                            </div>
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Activa
                            </span>
                          </div>

                          <div className="flex-1">
                            <p className="text-sm font-bold text-text leading-snug">{p.producto?.nombre}</p>
                            <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                              <MdCalendarToday size={11} /> Vence: {formatearFecha(p.vigencia_fin)}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 mt-2 pt-3 border-t border-border">
                            <button
                              onClick={() => router.push(`/asegurado/polizas`)}
                              className="flex-1 text-center py-1.5 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            >
                              Ver póliza
                            </button>
                            <button
                              onClick={() => router.push(`/asegurado/polizas`)}
                              className="flex-1 text-center py-1.5 text-xs font-semibold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                              <MdAutorenew size={14} /> Renovar
                            </button>
                          </div>
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
                      <p className="text-xs text-text-soft">Poliza asociada</p>
                      <p className="text-sm font-bold text-text">{proximaCuota.poliza_nombre}</p>
                      <p className="text-xs text-text-soft flex items-center gap-1 mt-1">
                        <MdCalendarToday size={11} /> Vence: {formatearFecha(proximaCuota.fecha_vencimiento)}
                      </p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-text">{formatearMoneda(proximaCuota.monto)}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push('/asegurado/pagos');
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-semibold transition-colors"
                    >
                      <MdCreditCard size={13} /> Ir a pagar
                    </button>
                  </div>
                </Card>
              ) : (
                <Card onClick={() => router.push('/asegurado/pagos')} className="flex-1">
                  <div className="p-6 text-center flex flex-col items-center justify-center h-full">
                    <MdCheckCircle size={28} className="text-emerald-500 mb-2" />
                    <p className="text-sm font-bold text-text">Estás al día</p>
                    <p className="text-xs text-text-soft mt-1">No tienes cuotas pendientes.</p>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Avisos + promociones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <SectionHeader title="Avisos y notificaciones" />
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

            <div className="flex flex-col">
              <SectionHeader title="Promociones y renovaciones" onClick={() => router.push('/asegurado/seguros')} />
              <div className="flex flex-col gap-3 flex-1">
                {promociones.length === 0 ? (
                  <div className="p-4 text-center text-sm text-text-soft bg-bg rounded-2xl border border-border">
                    No hay promociones en este momento.
                  </div>
                ) : (
                  promociones.map((promo) => (
                    <Card
                      key={promo.id_promocion}
                      onClick={() => router.push('/asegurado/seguros')}
                      className="flex-1 border-primary/20 bg-primary/5"
                    >
                      <div className="flex items-start gap-3 p-4 h-full">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 bg-primary/20">
                          <MdLocalOffer size={16} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-primary">{promo.titulo}</p>
                          <p className="text-xs text-text-soft mt-0.5 leading-relaxed">{promo.descripcion}</p>
                          <p className="text-[11px] text-primary mt-1 font-semibold">
                            {Number(promo.descuento_pct).toFixed(0)}% off · {promo.producto_nombre}
                          </p>
                        </div>
                        <MdChevronRight size={20} className="text-primary/50 self-center" />
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
