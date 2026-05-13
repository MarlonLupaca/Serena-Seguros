import {
  MdPictureAsPdf,
  MdImage,
  MdDescription,
  MdInsertDriveFile,
  MdShield,
  MdWarning,
  MdReceiptLong,
  MdFolder,
} from 'react-icons/md';

export const TABLAS = [
  { value: 'general', label: 'General', icon: MdFolder, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' },
  { value: 'poliza', label: 'Póliza', icon: MdShield, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  { value: 'siniestro', label: 'Siniestro', icon: MdWarning, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  { value: 'pago', label: 'Pago', icon: MdReceiptLong, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
];

export function estiloTabla(tabla) {
  return TABLAS.find((t) => t.value === tabla) || TABLAS[0];
}

export function extensionDe(nombreArchivo) {
  if (!nombreArchivo) return '';
  const idx = nombreArchivo.lastIndexOf('.');
  return idx >= 0 ? nombreArchivo.substring(idx + 1).toLowerCase() : '';
}

export function iconoArchivo(ext) {
  if (ext === 'pdf') return MdPictureAsPdf;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return MdImage;
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return MdDescription;
  return MdInsertDriveFile;
}

export function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}
