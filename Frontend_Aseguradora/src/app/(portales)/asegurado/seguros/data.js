import { MdDirectionsCar, MdHealthAndSafety, MdFavorite, MdHome, MdFlight, MdBusiness, MdShield } from 'react-icons/md';

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

// FALTA ESTE ENDPOINT: POST /api/cotizaciones/simular
// ¿Qué hace?: Recibe los datos del formulario del cliente (edad, vehículo, etc.)
// y devuelve 3 opciones de planes calculados para que el cliente compare.
export const mockSimulacionPlanes = [
  {
    id_plan: 'basico',
    nombre: 'Plan Básico',
    prima_mensual: 80.0,
    cobertura: 'Cobertura esencial',
    deducible: '20%',
    beneficios: ['Asistencia telefónica', 'Cobertura nacional'],
  },
  {
    id_plan: 'intermedio',
    nombre: 'Plan Intermedio',
    prima_mensual: 120.0,
    cobertura: 'Cobertura estándar',
    deducible: '15%',
    beneficios: ['Asistencia presencial', 'Grúa 2 veces/año', 'Cobertura nacional'],
  },
  {
    id_plan: 'premium',
    nombre: 'Plan Premium',
    prima_mensual: 200.0,
    cobertura: 'Todo Riesgo',
    deducible: '10%',
    beneficios: ['Asistencia VIP', 'Grúa ilimitada', 'Auto de reemplazo', 'Cobertura internacional'],
  },
];

// FALTA ESTE ENDPOINT: POST /api/cotizaciones/contratar
// ¿Qué hace?: Recibe el plan seleccionado, la confirmación de los términos
// y los documentos adjuntos, y genera la póliza final automáticamente.
export const mockContratacionExitosa = {
  id_poliza: 99421,
  estado: 'ACTIVA',
  mensaje: 'Póliza generada y activa correctamente.',
};

// FALTA ESTE ENDPOINT: POST /api/cotizaciones/guardar
// ¿Qué hace?: Permite al usuario guardar la simulación sin llegar a contratarla.
export const mockGuardarCotizacion = {
  id_cotizacion: 'COT-9921',
  mensaje: 'Cotización guardada exitosamente en tu perfil.',
};
