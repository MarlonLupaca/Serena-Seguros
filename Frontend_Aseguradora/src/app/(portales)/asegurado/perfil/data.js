export const PERFIL_INICIAL = {
  nombre: 'Carlos',
  apellidos: 'Ramírez Torres',
  tipoDoc: 'DNI',
  numDoc: '45678921',
  fechaNacimiento: '14/07/1990',
  correo: 'carlos.ramirez@gmail.com',
  correoVerificado: true,
  telefono: '+51 987 654 321',
  telefonoVerificado: true,
  direccion: 'Av. Javier Prado 1280',
  distrito: 'Miraflores',
  ciudad: 'Lima',
  codigoPostal: '15074',
};

export const CONTACTO_EMERGENCIA_INICIAL = {
  nombre: 'María Torres',
  relacion: 'Madre',
  telefono: '+51 976 543 210',
  correo: 'maria.torres@gmail.com',
};

export const BENEFICIARIOS_INICIAL = [
  { id: 1, nombre: 'María Torres', relacion: 'Madre', porcentaje: '60', doc: '23456789' },
  { id: 2, nombre: 'Luis Ramírez', relacion: 'Hermano', porcentaje: '40', doc: '34567890' },
];

export const PREFERENCIAS_INICIAL = {
  emailMarketing: true,
  emailRecordatorios: true,
  smsRecordatorios: false,
  pushNotificaciones: true,
  whatsapp: true,
};
