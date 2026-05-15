'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdInbox,
  MdSearch,
  MdShield,
  MdEditNote,
  MdWarning,
  MdFactCheck,
  MdAutorenew,
  MdOpenInNew,
  MdAccessTime,
  MdCalendarToday,
  MdPerson,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';

const BANDEJAS = [
  {
    id: 'emisiones',
    label: 'Emisiones pendientes',
    icon: MdShield,
    accent: 'primary',
    descripcion: 'Pólizas en estado PENDIENTE esperando emisión.',
  },
  {
    id: 'endosos',
    label: 'Endosos pendientes',
    icon: MdEditNote,
    accent: 'amber',
    descripcion: 'Solicitudes de cambio sobre pólizas activas.',
  },
  {
    id: 'siniestros',
    label: 'Siniestros pendientes',
    icon: MdWarning,
    accent: 'rose',
    descripcion: 'Casos reportados o en revisión sin liquidar.',
  },
  {
    id: 'validaciones',
    label: 'Validaciones documentales',
    icon: MdFactCheck,
    accent: 'violet',
    descripcion: 'Identidades y documentos por validar antes de activar al cliente.',
  },
  {
    id: 'renovaciones',
    label: 'Renovaciones por aprobar',
    icon: MdAutorenew,
    accent: 'sky',
    descripcion: 'Pólizas activas próximas a vencer en los próximos 30 días.',
  },
];

const ACCENT_STYLES = {
  primary: { bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary/40' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-400' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-600', bar: 'bg-rose-400' },
  violet: { bg: 'bg-violet-100', text: 'text-violet-600', bar: 'bg-violet-400' },
  sky: { bg: 'bg-sky-100', text: 'text-sky-600', bar: 'bg-sky-400' },
};

const PRIORIDADES = {
  ALTA: { label: 'Alta', badge: 'bg-rose-100 text-rose-600' },
  MEDIA: { label: 'Media', badge: 'bg-amber-100 text-amber-700' },
  BAJA: { label: 'Baja', badge: 'bg-bg-soft text-text-soft' },
};

const SLA_DIAS = { verde: 2, amarillo: 5 };

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function diasDesde(iso) {
  if (!iso) return 0;
  const d = new Date(iso);
  if (isNaN(d)) return 0;
  const hoy = new Date();
  return Math.floor((hoy - d) / (1000 * 60 * 60 * 24));
}

function colorSla(dias) {
  if (dias <= SLA_DIAS.verde) return { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'En tiempo' };
  if (dias <= SLA_DIAS.amarillo) return { dot: 'bg-amber-500', text: 'text-amber-700', label: 'Próximo a vencer' };
  return { dot: 'bg-rose-500', text: 'text-rose-700', label: 'Vencido' };
}

export default function BandejaPage() {
  const router = useRouter();
  const [tab, setTab] = useState('emisiones');
  const [datos, setDatos] = useState({
    emisiones: [],
    endosos: [],
    siniestros: [],
    validaciones: [],
    renovaciones: [],
  });
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [pol, end, sin, val, ren] = await Promise.all([
        apiGet('/polizas?estado=PENDIENTE').catch(() => []),
        apiGet('/endosos?estado=PENDIENTE').catch(() => []),
        apiGet('/siniestros').catch(() => []),
        apiGet('/validaciones?estado=PENDIENTE').catch(() => []),
        apiGet('/polizas/renovaciones?dias=30').catch(() => []),
      ]);
      setDatos({
        emisiones: pol || [],
        endosos: end || [],
        siniestros: (sin || []).filter((s) =>
          ['REPORTADO', 'EN_REVISION', 'INSPECCION', 'APROBADO'].includes(s.estado_resolucion)
        ),
        validaciones: val || [],
        renovaciones: ren || [],
      });
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar la bandeja');
    } finally {
      setCargando(false);
    }
  };

  const items = construirItems(datos[tab] || [], tab);
  const filtrados = items.filter((it) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      (it.numero || '').toLowerCase().includes(t) ||
      (it.cliente || '').toLowerCase().includes(t) ||
      (it.tipoSolicitud || '').toLowerCase().includes(t)
    );
  });

  const totales = BANDEJAS.reduce(
    (acc, b) => ({ ...acc, [b.id]: (datos[b.id] || []).length }),
    {}
  );

  const bandejaActual = BANDEJAS.find((b) => b.id === tab);
  const accent = ACCENT_STYLES[bandejaActual?.accent] || ACCENT_STYLES.primary;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Mesa de trabajo</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Tareas pendientes del equipo técnico. Indicadores SLA por antigüedad del caso.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {BANDEJAS.map((b) => {
          const s = ACCENT_STYLES[b.accent];
          const Icon = b.icon;
          const activa = tab === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setTab(b.id)}
              className={`text-left rounded-xl border p-3 transition-colors ${
                activa ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.bg}`}>
                <Icon size={16} className={s.text} />
              </div>
              <p className="text-[11px] text-text-soft leading-tight">{b.label}</p>
              <p className="text-xl font-bold text-text mt-1">{totales[b.id] || 0}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${accent.bar}`} />
        <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${accent.bg}`}>
              {bandejaActual && <bandejaActual.icon size={20} className={accent.text} />}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text">{bandejaActual?.label}</p>
              <p className="text-xs text-text-soft">{bandejaActual?.descripcion}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-text-soft">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Verde ≤{SLA_DIAS.verde}d
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500" /> Amarillo ≤{SLA_DIAS.amarillo}d
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Rojo &gt;{SLA_DIAS.amarillo}d
            </span>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <div className="relative">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar por N° caso, cliente o tipo de solicitud..."
              value={busq}
              onChange={(e) => setBusq(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
            />
          </div>

          {cargando ? (
            <div className="bg-bg-soft rounded-xl p-12 text-center text-sm text-text-soft">
              Cargando bandeja...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-sm text-red-600 text-center">
              {error}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="bg-bg-soft rounded-xl p-12 text-center">
              <MdInbox size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">Bandeja al día</p>
              <p className="text-xs text-text-soft mt-1">
                No hay casos pendientes en esta sección.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-soft">
                  <tr className="text-xs text-text-soft">
                    <th className="px-3 py-2 text-left font-medium">N° caso</th>
                    <th className="px-3 py-2 text-left font-medium">Cliente</th>
                    <th className="px-3 py-2 text-left font-medium">Tipo solicitud</th>
                    <th className="px-3 py-2 text-left font-medium">Fecha ingreso</th>
                    <th className="px-3 py-2 text-left font-medium">Responsable</th>
                    <th className="px-3 py-2 text-left font-medium">SLA</th>
                    <th className="px-3 py-2 text-left font-medium">Prioridad</th>
                    <th className="px-3 py-2 text-right font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((it) => {
                    const sla = colorSla(it.diasTranscurridos);
                    const prio = PRIORIDADES[it.prioridad] || PRIORIDADES.MEDIA;
                    return (
                      <tr key={`${tab}-${it.id}`} className="border-t border-border">
                        <td className="px-3 py-2.5 font-semibold text-text">{it.numero}</td>
                        <td className="px-3 py-2.5 text-text">
                          <p className="flex items-center gap-1 text-text-soft">
                            <MdPerson size={11} /> {it.cliente || '—'}
                          </p>
                        </td>
                        <td className="px-3 py-2.5 text-text-soft">{it.tipoSolicitud || '—'}</td>
                        <td className="px-3 py-2.5 text-text-soft">
                          <p className="flex items-center gap-1">
                            <MdCalendarToday size={11} /> {formatearFecha(it.fechaIngreso)}
                          </p>
                        </td>
                        <td className="px-3 py-2.5 text-text-soft">{it.responsable || 'Sin asignar'}</td>
                        <td className="px-3 py-2.5">
                          <span className={`flex items-center gap-1 text-xs font-semibold ${sla.text}`}>
                            <span className={`w-2 h-2 rounded-full ${sla.dot}`} />
                            {it.diasTranscurridos}d · {sla.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prio.badge}`}>
                            {prio.label}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right">
                          <button
                            onClick={() => router.push(it.linkExpediente)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold ml-auto"
                          >
                            <MdOpenInNew size={12} /> Abrir
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function construirItems(raw, tipo) {
  return (raw || []).map((r) => {
    switch (tipo) {
      case 'emisiones':
        return {
          id: r.id_poliza,
          numero: `POL-${String(r.id_poliza).padStart(6, '0')}`,
          cliente: r.cliente_nombre || r.producto?.nombre || '—',
          tipoSolicitud: `Emisión ${r.producto?.tipo_seguro || ''}`,
          fechaIngreso: r.fecha_emision,
          diasTranscurridos: diasDesde(r.fecha_emision),
          responsable: null,
          prioridad: 'MEDIA',
          linkExpediente: '/core/emisiones',
        };
      case 'endosos':
        return {
          id: r.id_endoso,
          numero: `END-${String(r.id_endoso).padStart(6, '0')}`,
          cliente: r.poliza_nombre || '—',
          tipoSolicitud: r.tipo_cambio || 'Endoso',
          fechaIngreso: r.fecha_solicitud,
          diasTranscurridos: diasDesde(r.fecha_solicitud),
          responsable: null,
          prioridad: 'MEDIA',
          linkExpediente: '/core/siniestros',
        };
      case 'siniestros':
        return {
          id: r.id_siniestro,
          numero: `SIN-${String(r.id_siniestro).padStart(6, '0')}`,
          cliente: r.cliente_nombre || '—',
          tipoSolicitud: r.tipo_incidente || '—',
          fechaIngreso: r.fecha_reporte,
          diasTranscurridos: diasDesde(r.fecha_reporte),
          responsable: r.analista_asignado,
          prioridad: r.monto_reclamado > 10000 ? 'ALTA' : 'MEDIA',
          linkExpediente: '/core/siniestros',
        };
      case 'validaciones':
        return {
          id: r.id_validacion,
          numero: `VAL-${String(r.id_validacion).padStart(6, '0')}`,
          cliente: r.cliente_nombre,
          tipoSolicitud: 'Validar identidad',
          fechaIngreso: r.fecha_ingreso,
          diasTranscurridos: diasDesde(r.fecha_ingreso),
          responsable: r.validador_nombre,
          prioridad: 'MEDIA',
          linkExpediente: '/core/validaciones',
        };
      case 'renovaciones':
        return {
          id: r.id_poliza,
          numero: `POL-${String(r.id_poliza).padStart(6, '0')}`,
          cliente: r.cliente_nombre || r.producto?.nombre || '—',
          tipoSolicitud: `Renovación ${r.producto?.tipo_seguro || ''}`,
          fechaIngreso: r.fecha_emision,
          diasTranscurridos: diasDesde(r.fecha_emision),
          responsable: null,
          prioridad: 'ALTA',
          linkExpediente: '/core/emisiones',
        };
      default:
        return { id: 0, numero: '—', diasTranscurridos: 0 };
    }
  });
}
