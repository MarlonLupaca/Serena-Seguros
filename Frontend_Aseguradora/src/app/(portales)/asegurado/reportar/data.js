import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
  MdCarCrash,
  MdSecurity,
  MdLocalHospital,
  MdFireTruck,
  MdPeople,
  MdMoreHoriz,
} from 'react-icons/md';

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

// data.js (Añadir al final)

// Simulación del detalle de un siniestro para ver la línea de tiempo y observaciones
export const mockDetalleSiniestro = {
  id_siniestro: 123,
  estado_actual: 'OBSERVADO',
  linea_tiempo: [
    { fecha: '2026-05-12T14:20:00Z', estado: 'REPORTADO', detalle: 'Siniestro reportado por el cliente.' },
    { fecha: '2026-05-13T09:00:00Z', estado: 'EN_REVISION', detalle: 'Documentación en evaluación por el analista.' },
    {
      fecha: '2026-05-14T10:30:00Z',
      estado: 'OBSERVADO',
      detalle: 'Por favor, adjunta una foto más clara del daño vehicular para proceder.',
    },
  ],
  requiere_respuesta: true,
};
