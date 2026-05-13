import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
} from 'react-icons/md';

export const TIPO_STYLES = {
  VEHICULAR: {
    icon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    label: 'Auto',
    tagline: 'Maneja sin preocupaciones',
  },
  SALUD: {
    icon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    label: 'Salud',
    tagline: 'Tu bienestar, nuestra prioridad',
  },
  VIDA: {
    icon: MdFavorite,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
    label: 'Vida',
    tagline: 'Protege a quienes más quieres',
  },
  HOGAR: {
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    label: 'Hogar',
    tagline: 'Tu casa, siempre protegida',
  },
  VIAJE: {
    icon: MdFlight,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
    label: 'Viaje',
    tagline: 'Explora el mundo sin riesgos',
  },
  EMPRESA: {
    icon: MdBusiness,
    accentBg: 'bg-violet-100',
    accentText: 'text-violet-600',
    label: 'Empresa',
    tagline: 'Protege tu negocio',
  },
};

export function estiloTipo(tipo) {
  return (
    TIPO_STYLES[tipo] || {
      icon: MdShield,
      accentBg: 'bg-bg-soft',
      accentText: 'text-text-soft',
      label: tipo,
      tagline: '',
    }
  );
}

export function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
