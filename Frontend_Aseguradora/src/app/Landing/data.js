import {
  MdDirectionsCar,
  MdFavorite,
  MdLocalHospital,
  MdShield,
  MdFlight,
  MdHome,
  MdPets,
  MdVerified,
  MdBolt,
  MdSupportAgent,
  MdLock,
} from 'react-icons/md';

export const navItems = [
  { label: 'Seguros para ti', href: '#seguros' },
  { label: 'Empresas', href: '#empresas' },
  { label: 'Siniestros', href: '#siniestros' },
  { label: 'Promociones', href: '#promos' },
  { label: 'Atención al cliente', href: '#contacto' },
];

export const quoteTabs = [
  { id: 'auto', label: 'Vehicular', icon: MdDirectionsCar },
  { id: 'soat', label: 'SOAT', icon: MdShield },
  { id: 'vida', label: 'Vida', icon: MdFavorite },
  { id: 'salud', label: 'Salud', icon: MdLocalHospital },
  { id: 'viajes', label: 'Viajes', icon: MdFlight },
  { id: 'hogar', label: 'Hogar', icon: MdHome },
  { id: 'mascot', label: 'Mascotas', icon: MdPets },
];

export const services = [
  {
    title: 'Seguro Vehicular',
    desc: 'Red de +800 talleres y grúa 24/7 en todo el país.',
    url: '/icons/vehiculo.png',
    tag: 'Más vendido',
  },
  {
    title: 'SOAT Digital',
    desc: 'Compra en 3 minutos y recíbelo al instante en tu correo.',
    url: '/icons/soat.png',
    tag: 'Desde S/47',
  },
  {
    title: 'Seguro de Vida',
    desc: 'Protege a los que amas y recibe hasta el 100% de lo pagado.',
    url: '/icons/vida.png',
  },
  {
    title: 'Seguro de Salud',
    desc: 'Atención en las mejores clínicas con copagos bajos.',
    url: '/icons/salud.png',
  },
  {
    title: 'Viajes',
    desc: 'Cobertura internacional con asistencia médica ilimitada.',
    url: '/icons/viaje.png',
  },
  {
    title: 'Hogar',
    desc: 'Tu casa protegida ante robo, incendio y desastres naturales.',
    url: '/icons/hogar.png',
  },
  {
    title: 'Mascotas',
    desc: 'Consultas, vacunas y emergencias para tu engreído.',
    url: '/icons/mascota.png',
    tag: 'Nuevo',
  },
  {
    title: 'Empresas',
    desc: 'Seguros corporativos hechos a la medida de tu negocio.',
    url: '/icons/empresa.png',
  },
];

export const stats = [
  { n: '+1.2M', l: 'clientes protegidos' },
  { n: '+35', l: 'años de experiencia' },
  { n: '24/7', l: 'asistencia inmediata' },
  { n: '4.8★', l: 'satisfacción promedio' },
];

export const benefits = [
  {
    url: '/icons/reloj.png',
    t: 'Cotización en 3 min',
    d: '100% online, sin papeleos ni llamadas interminables.',
  },
  {
    url: '/icons/auriculares.png',
    t: 'Asistencia 24/7',
    d: 'Un equipo humano siempre disponible para ayudarte.',
  },
  {
    url: '/icons/tarjeta.png',
    t: 'Pagos seguros',
    d: 'Transacciones encriptadas y múltiples medios de pago.',
  },
  {
    url: '/icons/sbs.png',
    t: 'Respaldo SBS',
    d: 'Regulados por la Superintendencia de Banca y Seguros.',
  },
];

export const promos = [
  {
    badge: 'Hasta 30% OFF',
    title: 'Seguro Vehicular Full',
    desc: 'Llantas, lunas y auto sustituto incluidos.',
    url: '/icons/vehiculo.png',
    grad: 'from-bg-deep via-[#0033a0] to-accent',
  },
  {
    badge: 'Desde S/47',
    title: 'SOAT Digital 2026',
    desc: 'Recíbelo en minutos en tu correo.',
    url: '/icons/soat.png',
    grad: 'from-[#0b3c5d] to-primary',
  },
  {
    badge: '2x1',
    title: 'Viajes Internacionales',
    desc: 'Lleva un acompañante sin costo este verano.',
    url: '/icons/viaje.png',
    grad: 'from-bg-deep to-[#0033a0]',
  },
];

export const testimonials = [
  {
    name: 'María Gutiérrez',
    role: 'Cliente vehicular',
    text: 'La atención fue rapidísima. En menos de 30 min tenía grúa y taller asignado.',
  },
  {
    name: 'Jorge Ramírez',
    role: 'Cliente SOAT',
    text: 'Compré mi SOAT desde el celular en el estacionamiento. Increíblemente simple.',
  },
  {
    name: 'Lucía Pérez',
    role: 'Cliente de salud',
    text: 'La red de clínicas es excelente y nunca tuve problemas con los reembolsos.',
  },
];

export const steps = [
  { n: '01', t: 'Mantén la calma', d: 'Revisa que todos estén bien y documenta el lugar.' },
  { n: '02', t: 'Llámanos', d: 'Te guiamos en cada paso desde el primer minuto.' },
  { n: '03', t: 'Reporta online', d: 'Sube tus documentos desde la app o el portal.' },
  { n: '04', t: 'Solución rápida', d: 'Asignamos taller, grúa o atención médica.' },
];
