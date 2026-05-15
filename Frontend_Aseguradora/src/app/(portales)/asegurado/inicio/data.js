// data.js

// FALTA ESTE ENDPOINT: GET /api/dashboard/resumen
// ¿Qué hace?: Retorna la data consolidada para las "Tarjetas Resumen" de la parte superior del Dashboard.
// Necesita contar pólizas activas, siniestros abiertos y traer la última cotización generada.
export const mockResumenDashboard = {
  total_polizas_activas: 2,
  siniestros_abiertos: 1,
  ultima_cotizacion: {
    id: 'COT-9921',
    producto: 'Seguro Hogar Premium',
    fecha: '2026-05-10T10:00:00Z',
  },
};

// FALTA ESTE ENDPOINT: GET /api/dashboard/promociones
// ¿Qué hace?: Retorna una lista de avisos comerciales, promociones o recordatorios de renovación
// para la "Zona lateral o inferior" del Dashboard.
export const mockPromociones = [
  {
    id_promo: 1,
    titulo: 'Renueva tu SOAT con 15% dscto',
    descripcion: 'Aprovecha antes de fin de mes y mantén tu vehículo protegido.',
    tipo: 'RENOVACION',
    link_accion: '/asegurado/renovar/101',
  },
  {
    id_promo: 2,
    titulo: 'Campaña de Salud Preventiva',
    descripcion: 'Chequeo general a costo cero en clínicas afiliadas este mes.',
    tipo: 'PROMOCION',
    link_accion: '/asegurado/promociones/salud',
  },
];
