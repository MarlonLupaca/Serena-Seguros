import {
  MdCarCrash,
  MdSecurity,
  MdLocalHospital,
  MdFireTruck,
  MdPeople,
  MdMoreHoriz,
} from 'react-icons/md';

export { TIPO_SEGURO as TIPO_STYLES, estiloTipo } from '@/lib/tipoSeguroConfig';

export const TIPOS = [
  {
    id: 'Accidente de transito',
    label: 'Accidente de tránsito',
    desc: 'Colisión, volcamiento u otro evento vial',
    icon: MdCarCrash,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
  },
  {
    id: 'Robo o hurto',
    label: 'Robo o hurto',
    desc: 'Robo total, parcial o intento de robo',
    icon: MdSecurity,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
  },
  {
    id: 'Emergencia medica',
    label: 'Emergencia médica',
    desc: 'Hospitalización, urgencia o accidente',
    icon: MdLocalHospital,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
  },
  {
    id: 'Danos a propiedad',
    label: 'Daños a propiedad',
    desc: 'Incendio, inundación, daño estructural',
    icon: MdFireTruck,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
  },
  {
    id: 'Danos a terceros',
    label: 'Daños a terceros',
    desc: 'Daños causados a bienes de otras personas',
    icon: MdPeople,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
  },
  {
    id: 'Otro',
    label: 'Otro',
    desc: 'Otro tipo de incidente no listado',
    icon: MdMoreHoriz,
    accentBg: 'bg-bg-soft',
    accentText: 'text-text-soft',
  },
];

export const STEPS = [
  { id: 1, label: 'Póliza' },
  { id: 2, label: 'Tipo' },
  { id: 3, label: 'Detalle' },
  { id: 4, label: 'Evidencia' },
  { id: 5, label: 'Confirmar' },
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

// El detalle del siniestro y su timeline viene del backend:
//   GET /mis-siniestros/{id} -> { ..., timeline: [{ accion, detalle, fecha, autor }] }
// El timeline se construye desde auditoria_accion del modulo siniestros.
