import {
  MdDirectionsCar,
  MdFavorite,
  MdLocalHospital,
  MdShield,
  MdFlight,
  MdHome,
  MdPets,
  MdBusiness,
} from 'react-icons/md';

export const SEGUROS = {
  vehicular: {
    tipo: 'VEHICULAR',
    titulo: 'Seguro Vehicular',
    subtitulo: 'Protege tu auto con la mejor cobertura del mercado',
    descripcion:
      'Red de +800 talleres autorizados, grua 24/7 en todo el pais, auto sustituto y atencion inmediata ante cualquier siniestro.',
    icon: MdDirectionsCar,
    imagen: '/icons/vehiculo.png',
    coberturas: [
      'Danos propios por choque o volcadura',
      'Robo total y parcial',
      'Responsabilidad civil frente a terceros',
      'Grua y auxilio mecanico 24/7',
      'Auto sustituto por siniestro',
      'Cobertura de lunas y llantas',
    ],
    faqs: [
      { q: 'Que cubre el seguro vehicular?', a: 'Cubre danos propios, robo, responsabilidad civil, grua y asistencia en carretera.' },
      { q: 'Puedo elegir mi taller?', a: 'Si, contamos con una red de +800 talleres autorizados en todo el pais.' },
      { q: 'Que pasa si tengo un accidente fuera de la ciudad?', a: 'Nuestra cobertura es a nivel nacional con asistencia 24/7.' },
    ],
  },
  soat: {
    tipo: 'SOAT',
    titulo: 'SOAT Digital',
    subtitulo: 'Tu SOAT en minutos, 100% digital',
    descripcion:
      'Compra tu SOAT desde cualquier dispositivo y recibelo al instante en tu correo. Valido en todo el territorio nacional.',
    icon: MdShield,
    imagen: '/icons/soat.png',
    coberturas: [
      'Gastos medicos por accidente de transito',
      'Invalidez permanente',
      'Muerte por accidente de transito',
      'Gastos de sepelio',
      'Cobertura para ocupantes y terceros',
    ],
    faqs: [
      { q: 'El SOAT digital es valido?', a: 'Si, tiene la misma validez legal que el SOAT fisico.' },
      { q: 'En cuanto tiempo lo recibo?', a: 'Lo recibes en tu correo en menos de 3 minutos.' },
      { q: 'Cubre a los pasajeros?', a: 'Si, cubre a todos los ocupantes del vehiculo y a terceros afectados.' },
    ],
  },
  vida: {
    tipo: 'VIDA',
    titulo: 'Seguro de Vida',
    subtitulo: 'Protege a los que mas amas',
    descripcion:
      'Asegura el futuro de tu familia con planes flexibles que se adaptan a tu presupuesto y necesidades.',
    icon: MdFavorite,
    imagen: '/icons/vida.png',
    coberturas: [
      'Fallecimiento por cualquier causa',
      'Invalidez total y permanente',
      'Enfermedades graves',
      'Doble indemnizacion por muerte accidental',
      'Ahorro con rendimiento garantizado',
      'Exoneracion de prima por invalidez',
    ],
    faqs: [
      { q: 'Desde que edad puedo contratar?', a: 'Puedes contratar desde los 18 hasta los 65 anos.' },
      { q: 'Puedo recuperar mi dinero?', a: 'En planes con ahorro, puedes rescatar hasta el 100% de lo aportado.' },
      { q: 'Cuantos beneficiarios puedo designar?', a: 'No hay limite, puedes designar los que desees y asignar porcentajes.' },
    ],
  },
  salud: {
    tipo: 'SALUD',
    titulo: 'Seguro de Salud',
    subtitulo: 'Atencion medica de calidad cuando la necesites',
    descripcion:
      'Accede a las mejores clinicas del pais con copagos bajos, sin periodos de carencia en emergencias.',
    icon: MdLocalHospital,
    imagen: '/icons/salud.png',
    coberturas: [
      'Consultas medicas y especialistas',
      'Hospitalizacion y cirugia',
      'Emergencias sin periodo de carencia',
      'Examenes y diagnostico por imagenes',
      'Cobertura de maternidad',
      'Medicamentos ambulatorios',
    ],
    faqs: [
      { q: 'Puedo atenderme en cualquier clinica?', a: 'Si, tenemos convenio con las principales clinicas del pais.' },
      { q: 'Hay periodo de carencia?', a: 'En emergencias no. Para otros procedimientos, varia segun el plan.' },
      { q: 'Cubre a mi familia?', a: 'Si, puedes incluir a tu conyuge e hijos en planes familiares.' },
    ],
  },
  viajes: {
    tipo: 'VIAJE',
    titulo: 'Seguro de Viajes',
    subtitulo: 'Viaja tranquilo a cualquier destino del mundo',
    descripcion:
      'Cobertura medica internacional, asistencia en caso de perdida de equipaje, cancelacion de vuelos y mas.',
    icon: MdFlight,
    imagen: '/icons/viaje.png',
    coberturas: [
      'Asistencia medica internacional ilimitada',
      'Repatriacion sanitaria',
      'Perdida o demora de equipaje',
      'Cancelacion o interrupcion de viaje',
      'Asistencia legal en el extranjero',
      'Cobertura para deportes de aventura',
    ],
    faqs: [
      { q: 'Cubre COVID-19?', a: 'Si, incluye cobertura medica por COVID-19 en el destino.' },
      { q: 'Puedo comprar el seguro si ya estoy viajando?', a: 'Se recomienda comprarlo antes del viaje, pero consulta con nuestros asesores.' },
      { q: 'Cubre deportes extremos?', a: 'El plan Aventura incluye deportes como trekking, surf y ski.' },
    ],
  },
  hogar: {
    tipo: 'HOGAR',
    titulo: 'Seguro de Hogar',
    subtitulo: 'Tu casa protegida ante cualquier imprevisto',
    descripcion:
      'Proteccion integral para tu vivienda y tus bienes ante robos, incendios, desastres naturales y mas.',
    icon: MdHome,
    imagen: '/icons/hogar.png',
    coberturas: [
      'Incendio y explosion',
      'Robo y asalto',
      'Terremotos y desastres naturales',
      'Danos por agua e inundacion',
      'Responsabilidad civil del hogar',
      'Asistencia domiciliaria 24/7',
    ],
    faqs: [
      { q: 'Cubre terremotos?', a: 'Si, nuestros planes incluyen cobertura sismica.' },
      { q: 'Puedo asegurar solo el contenido?', a: 'Si, tenemos un plan exclusivo para bienes dentro del hogar.' },
      { q: 'Cubre departamentos alquilados?', a: 'Si, tanto propietarios como inquilinos pueden contratar.' },
    ],
  },
  mascotas: {
    tipo: 'MASCOTAS',
    titulo: 'Seguro de Mascotas',
    subtitulo: 'Porque ellos tambien merecen la mejor atencion',
    descripcion:
      'Consultas veterinarias, vacunas, emergencias y cirugia para tu engreido. Planes desde cachorros hasta seniors.',
    icon: MdPets,
    imagen: '/icons/mascota.png',
    coberturas: [
      'Consultas veterinarias ilimitadas',
      'Vacunacion y desparasitacion',
      'Emergencias y hospitalizacion',
      'Cirugia y anestesia',
      'Examenes de laboratorio',
      'Asistencia dental',
    ],
    faqs: [
      { q: 'Que mascotas puedo asegurar?', a: 'Perros y gatos de cualquier raza y edad.' },
      { q: 'Cubre razas peligrosas?', a: 'Si, todas las razas estan cubiertas.' },
      { q: 'Hay limite de edad?', a: 'No, incluso tenemos un plan especial para mascotas senior (+8 anos).' },
    ],
  },
  empresas: {
    tipo: 'EMPRESA',
    titulo: 'Seguros para Empresas',
    subtitulo: 'Soluciones corporativas a la medida de tu negocio',
    descripcion:
      'Proteccion integral para tu empresa, empleados y patrimonio con planes flexibles y asesoramiento especializado.',
    icon: MdBusiness,
    imagen: '/icons/empresa.png',
    coberturas: [
      'SCTR (Seguro Complementario de Trabajo de Riesgo)',
      'Responsabilidad civil empresarial',
      'Multiriesgo para locales y oficinas',
      'Seguro de carga y transporte',
      'EPS y planes de salud corporativos',
      'Vida ley para empleados',
    ],
    faqs: [
      { q: 'Desde cuantos empleados puedo contratar?', a: 'Desde 1 empleado. Tenemos planes para micro, pequena, mediana y gran empresa.' },
      { q: 'El SCTR es obligatorio?', a: 'Si, para empresas con actividades de alto riesgo es obligatorio por ley.' },
      { q: 'Puedo personalizar las coberturas?', a: 'Si, diseñamos paquetes a medida segun las necesidades de tu empresa.' },
    ],
  },
};

export const TIPOS_SLUG = Object.keys(SEGUROS);

export function getSeguroBySlug(slug) {
  return SEGUROS[slug] || null;
}
