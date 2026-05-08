import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
  MdArrowForward,
  MdHourglassEmpty,
  MdSearch,
  MdThumbUp,
  MdThumbDown,
  MdPaid,
} from 'react-icons/md';

export const ESTADO_CONFIG = {
  REPORTADO: {
    label: 'Reportado',
    badge: 'bg-primary/10 text-primary',
    dot: 'bg-primary',
    icon: MdArrowForward,
    paso: 1,
  },
  EN_REVISION: {
    label: 'En revisión',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    icon: MdHourglassEmpty,
    paso: 2,
  },
  INSPECCION: {
    label: 'Inspección',
    badge: 'bg-sky-100 text-sky-700',
    dot: 'bg-sky-400',
    icon: MdSearch,
    paso: 3,
  },
  APROBADO: {
    label: 'Aprobado',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    icon: MdThumbUp,
    paso: 4,
  },
  RECHAZADO: {
    label: 'Rechazado',
    badge: 'bg-rose-100 text-rose-600',
    dot: 'bg-rose-400',
    icon: MdThumbDown,
    paso: 4,
  },
  LIQUIDADO: {
    label: 'Liquidado',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    icon: MdPaid,
    paso: 5,
  },
};

export const ETAPAS = ['Reportado', 'En revisión', 'Inspección', 'Aprobación', 'Liquidación'];

export const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
};

export function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
}

export function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
