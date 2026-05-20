import {
  MdHourglassEmpty,
  MdWarningAmber,
  MdCheckCircle,
  MdCreditCard,
  MdAccountBalance,
  MdPhoneAndroid,
  MdPayment,
} from 'react-icons/md';

export { TIPO_SEGURO as TIPO_STYLES, estiloTipo } from '@/lib/tipoSeguroConfig';

export const ESTADO_CONFIG = {
  PENDIENTE: {
    label: 'Pendiente',
    badge: 'bg-warning-soft text-warning-text',
    dot: 'bg-warning',
    icon: MdHourglassEmpty,
  },
  VENCIDO: {
    label: 'Vencido',
    badge: 'bg-danger-soft text-danger-text',
    dot: 'bg-danger',
    icon: MdWarningAmber,
  },
  PAGADO: {
    label: 'Pagado',
    badge: 'bg-success-soft text-success-text',
    dot: 'bg-success',
    icon: MdCheckCircle,
  },
};

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
