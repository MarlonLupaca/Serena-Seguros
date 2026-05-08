import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
} from 'react-icons/md';

export const ESTADO_STYLES = {
  ACTIVA: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700',
    label: 'Activa',
  },
  PENDIENTE: {
    dot: 'bg-amber-400',
    badge: 'bg-amber-100 text-amber-700',
    label: 'Pendiente',
  },
  VENCIDA: {
    dot: 'bg-rose-400',
    badge: 'bg-rose-100 text-rose-600',
    label: 'Vencida',
  },
  CANCELADA: {
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
    label: 'Cancelada',
  },
};

export const TIPO_STYLES = {
  VEHICULAR: {
    icon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
  },
  SALUD: {
    icon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
  },
  VIDA: {
    icon: MdFavorite,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
  },
  HOGAR: {
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
  },
  VIAJE: {
    icon: MdFlight,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
  },
  EMPRESA: {
    icon: MdBusiness,
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
  },
};

export function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || {
    icon: MdShield,
    accentBg: 'bg-bg-soft',
    accentText: 'text-text-soft',
  };
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
