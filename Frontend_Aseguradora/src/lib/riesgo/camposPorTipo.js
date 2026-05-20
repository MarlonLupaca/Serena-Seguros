// Definicion declarativa de los campos de evaluacion de riesgo por tipo de seguro.
// Cada campo: { name, label, type, options?, required?, placeholder? }
// El backend recibe estos valores como JSON en `datos_riesgo`.

const CAMPOS = {
  VEHICULAR: [
    { name: 'marca', label: 'Marca del vehiculo', type: 'text', required: true, placeholder: 'Ej: Toyota' },
    { name: 'modelo', label: 'Modelo', type: 'text', required: true, placeholder: 'Ej: Yaris' },
    { name: 'anio', label: 'Año', type: 'number', required: true, placeholder: '2022' },
    { name: 'placa', label: 'Placa', type: 'text', required: true, placeholder: 'ABC-123' },
    {
      name: 'uso',
      label: 'Uso del vehiculo',
      type: 'select',
      options: [
        { value: 'PERSONAL', label: 'Personal' },
        { value: 'COMERCIAL', label: 'Comercial' },
      ],
      required: true,
    },
    { name: 'conductor_nombre', label: 'Conductor habitual', type: 'text', placeholder: 'Nombre completo' },
    { name: 'conductor_edad', label: 'Edad del conductor', type: 'number', required: true },
    { name: 'anios_licencia', label: 'Años con licencia', type: 'number', placeholder: '5' },
    { name: 'siniestros_previos', label: 'Siniestros en los ultimos 3 años', type: 'number', placeholder: '0' },
  ],
  VIDA: [
    { name: 'edad', label: 'Edad', type: 'number', required: true },
    { name: 'peso', label: 'Peso (kg)', type: 'number' },
    { name: 'altura', label: 'Altura (cm)', type: 'number' },
    { name: 'fumador', label: '¿Fumador?', type: 'boolean' },
    { name: 'preexistencias', label: '¿Preexistencias medicas declaradas?', type: 'boolean' },
    { name: 'ocupacion', label: 'Ocupacion', type: 'text', required: true, placeholder: 'Ingeniero, docente, etc.' },
    { name: 'ingresos_mensuales', label: 'Ingresos mensuales aprox. (S/)', type: 'number' },
  ],
  SALUD: [
    { name: 'edad', label: 'Edad', type: 'number', required: true },
    { name: 'antecedentes', label: 'Antecedentes medicos', type: 'textarea', placeholder: 'Ninguno o lista breve' },
    {
      name: 'plan_deseado',
      label: 'Plan deseado',
      type: 'select',
      options: [
        { value: 'BASICO', label: 'Basico' },
        { value: 'COMPLETO', label: 'Completo' },
      ],
      required: true,
    },
  ],
  HOGAR: [
    { name: 'direccion', label: 'Direccion del inmueble', type: 'text', required: true },
    { name: 'metros_cuadrados', label: 'Metros cuadrados', type: 'number', required: true },
    {
      name: 'tipo_inmueble',
      label: 'Tipo de inmueble',
      type: 'select',
      options: [
        { value: 'CASA', label: 'Casa' },
        { value: 'DEPARTAMENTO', label: 'Departamento' },
        { value: 'OFICINA', label: 'Oficina' },
      ],
      required: true,
    },
    { name: 'antiguedad_anios', label: 'Antiguedad (años)', type: 'number' },
  ],
  VIAJE: [
    { name: 'destino', label: 'Destino', type: 'text', required: true },
    { name: 'duracion_dias', label: 'Duracion (dias)', type: 'number', required: true },
    {
      name: 'numero_viajeros',
      label: 'Numero de viajeros',
      type: 'number',
      required: true,
      placeholder: '1',
    },
    { name: 'edades', label: 'Edades de los viajeros', type: 'text', placeholder: '35, 8, 6' },
  ],
  EMPRESA: [
    { name: 'rubro', label: 'Rubro', type: 'text', required: true, placeholder: 'Servicios, comercio, etc.' },
    { name: 'numero_empleados', label: 'Numero de empleados', type: 'number', required: true },
    { name: 'valor_activos', label: 'Valor de activos (S/)', type: 'number', required: true },
  ],
  SOAT: [
    { name: 'placa', label: 'Placa del vehiculo', type: 'text', required: true, placeholder: 'ABC-123' },
    {
      name: 'tipo_vehiculo',
      label: 'Tipo de vehiculo',
      type: 'select',
      options: [
        { value: 'AUTO', label: 'Automovil' },
        { value: 'CAMIONETA', label: 'Camioneta / SUV' },
        { value: 'MOTO', label: 'Motocicleta' },
        { value: 'TAXI', label: 'Taxi' },
        { value: 'CARGA', label: 'Carga pesada' },
      ],
      required: true,
    },
    {
      name: 'uso',
      label: 'Uso del vehiculo',
      type: 'select',
      options: [
        { value: 'PARTICULAR', label: 'Particular' },
        { value: 'PUBLICO', label: 'Servicio publico' },
        { value: 'CARGA', label: 'Transporte de carga' },
      ],
      required: true,
    },
    { name: 'anio_fabricacion', label: 'Ano de fabricacion', type: 'number', required: true, placeholder: '2022' },
  ],
  MASCOTAS: [
    {
      name: 'especie',
      label: 'Especie',
      type: 'select',
      options: [
        { value: 'PERRO', label: 'Perro' },
        { value: 'GATO', label: 'Gato' },
      ],
      required: true,
    },
    { name: 'raza', label: 'Raza', type: 'text', required: true, placeholder: 'Labrador, Persa, etc.' },
    { name: 'edad_mascota', label: 'Edad (anos)', type: 'number', required: true },
    { name: 'peso', label: 'Peso (kg)', type: 'number', placeholder: '10' },
    { name: 'vacunas_al_dia', label: 'Vacunas al dia', type: 'boolean' },
    { name: 'nombre_mascota', label: 'Nombre de la mascota', type: 'text', required: true, placeholder: 'Max' },
  ],
};

export function getCampos(tipoSeguro) {
  return CAMPOS[tipoSeguro] || [];
}

export function valoresIniciales(tipoSeguro) {
  const campos = getCampos(tipoSeguro);
  const init = {};
  campos.forEach((c) => {
    if (c.type === 'boolean') init[c.name] = false;
    else init[c.name] = '';
  });
  return init;
}

export function validarCampos(tipoSeguro, valores) {
  const campos = getCampos(tipoSeguro);
  const faltantes = campos
    .filter((c) => c.required)
    .filter((c) => {
      const v = valores[c.name];
      return v === undefined || v === null || (typeof v === 'string' && v.trim() === '');
    })
    .map((c) => c.label);
  return faltantes;
}
