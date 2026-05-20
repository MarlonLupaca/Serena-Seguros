export { TIPO_SEGURO as TIPO_STYLES, estiloTipo } from '@/lib/tipoSeguroConfig';

export function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
