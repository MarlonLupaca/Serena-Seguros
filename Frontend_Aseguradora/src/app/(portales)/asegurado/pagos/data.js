import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
  MdHourglassEmpty,
  MdWarningAmber,
  MdCheckCircle,
  MdCreditCard,
  MdAccountBalance,
  MdPhoneAndroid,
  MdPayment,
} from 'react-icons/md';

export const ESTADO_CONFIG = {
  PENDIENTE: {
    label: 'Pendiente',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    icon: MdHourglassEmpty,
  },
  VENCIDO: {
    label: 'Vencido',
    badge: 'bg-rose-100 text-rose-600',
    dot: 'bg-rose-400',
    icon: MdWarningAmber,
  },
  PAGADO: {
    label: 'Pagado',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
  },
};

export const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
};

export function estiloTipo(tipo) {
  return (
    TIPO_STYLES[tipo] || {
      icon: MdShield,
      accentBg: 'bg-bg-soft',
      accentText: 'text-text-soft',
    }
  );
}

export const METODOS_PAGO = [
  { id: 'visa', label: 'Tarjeta de crédito', sub: 'Visa / Mastercard', icon: MdCreditCard },
  { id: 'transferencia', label: 'Transferencia', sub: 'Banco BCP, Interbank', icon: MdAccountBalance },
  { id: 'yape', label: 'Yape / Plin', sub: 'Pago instantáneo', icon: MdPhoneAndroid },
  { id: 'debito', label: 'Tarjeta de débito', sub: 'Débito inmediato', icon: MdPayment },
];

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

export function diasHasta(iso) {
  if (!iso) return null;
  const objetivo = new Date(iso);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / (1000 * 60 * 60 * 24));
}

export function clasificarEstado(cuota) {
  if (cuota.estado_pago === 'PAGADO') return 'PAGADO';
  if (cuota.estado_pago === 'VENCIDO') return 'VENCIDO';
  const d = diasHasta(cuota.fecha_vencimiento);
  if (d != null && d < 0) return 'VENCIDO';
  return 'PENDIENTE';
}
