export { TIPO_SEGURO as TIPO_STYLES, estiloTipo } from '@/lib/tipoSeguroConfig';

export const ESTADO_STYLES = {
  ACTIVA: {
    dot: 'bg-success',
    badge: 'bg-success-soft text-success-text',
    label: 'Activa',
  },
  PENDIENTE: {
    dot: 'bg-warning',
    badge: 'bg-warning-soft text-warning-text',
    label: 'Pendiente',
  },
  VENCIDA: {
    dot: 'bg-danger',
    badge: 'bg-danger-soft text-danger-text',
    label: 'Vencida',
  },
  CANCELADA: {
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600',
    label: 'Cancelada',
  },
};

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
