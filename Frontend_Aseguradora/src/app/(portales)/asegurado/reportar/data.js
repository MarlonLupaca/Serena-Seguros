import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdHome,
  MdCarCrash,
  MdSecurity,
  MdLocalHospital,
  MdFireTruck,
  MdPeople,
  MdMoreHoriz,
} from 'react-icons/md';

export const POLIZAS = [
  {
    id: 'POL-2024-00182',
    label: 'Seguro de Auto',
    icon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    plan: 'Full',
    estado: 'activa',
  },
  {
    id: 'POL-2023-00891',
    label: 'Seguro de Salud',
    icon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    plan: 'Familiar',
    estado: 'activa',
  },
  {
    id: 'POL-2024-00510',
    label: 'Seguro de Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    plan: 'Estándar',
    estado: 'en proceso',
  },
];

export const TIPOS = [
  {
    id: 'accidente',
    label: 'Accidente de tránsito',
    desc: 'Colisión, volcamiento u otro evento vial',
    icon: MdCarCrash,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
  },
  {
    id: 'robo',
    label: 'Robo o hurto',
    desc: 'Robo total, parcial o intento de robo',
    icon: MdSecurity,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
  },
  {
    id: 'medico',
    label: 'Emergencia médica',
    desc: 'Hospitalización, urgencia o accidente',
    icon: MdLocalHospital,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
  },
  {
    id: 'daños',
    label: 'Daños a propiedad',
    desc: 'Incendio, inundación, daño estructural',
    icon: MdFireTruck,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
  },
  {
    id: 'terceros',
    label: 'Daños a terceros',
    desc: 'Daños causados a bienes de otras personas',
    icon: MdPeople,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-600',
  },
  {
    id: 'otro',
    label: 'Otro',
    desc: 'Otro tipo de incidente no listado',
    icon: MdMoreHoriz,
    accentBg: 'bg-bg-soft',
    accentText: 'text-text-soft',
  },
];

export const STEPS = [
  { id: 1, label: 'Póliza' },
  { id: 2, label: 'Siniestro' },
  { id: 3, label: 'Detalle' },
  { id: 4, label: 'Evidencia' },
  { id: 5, label: 'Confirmar' },
];

export function generateTicket() {
  return 'SIN-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 90000) + 10000);
}
