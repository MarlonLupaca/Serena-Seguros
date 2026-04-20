export const NOTIFICACIONES_INICIAL = {
  emailVencimiento: true,
  emailSiniestros: true,
  emailPromociones: false,
  emailResumen: true,
  smsVencimiento: false,
  smsSiniestros: true,
  pushTodo: true,
  pushPagos: true,
  pushAlertas: true,
  whatsapp: false,
};

export const PREFERENCIAS_INICIAL = {
  idioma: 'es',
  moneda: 'PEN',
  zonaHoraria: 'America/Lima',
  formatoFecha: 'DD/MM/YYYY',
  tema: 'claro',
};

export const PRIVACIDAD_INICIAL = {
  perfilPublico: false,
  compartirDatos: false,
  cookiesAnaliticas: true,
  cookiesMarketing: false,
  historialVisible: true,
};

export const SESIONES_MOCK = [
  { id: 1, dispositivo: 'Chrome · Windows 11', lugar: 'Lima, Perú', activo: true, fecha: 'Ahora' },
  { id: 2, dispositivo: 'Safari · iPhone 14', lugar: 'Lima, Perú', activo: false, fecha: 'Hace 2 días' },
  { id: 3, dispositivo: 'Firefox · MacOS', lugar: 'Miraflores, Perú', activo: false, fecha: 'Hace 1 semana' },
];
