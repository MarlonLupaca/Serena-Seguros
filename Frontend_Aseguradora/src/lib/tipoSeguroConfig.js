export const TIPO_SEGURO = {
  VEHICULAR: {
    imagen: '/icons/vehiculo.png',
    label: 'Auto',
    tagline: 'Maneja sin preocupaciones',
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    bar: 'bg-primary/40',
  },
  SALUD: {
    imagen: '/icons/salud.png',
    label: 'Salud',
    tagline: 'Tu bienestar, nuestra prioridad',
    accentBg: 'bg-success-soft',
    accentText: 'text-success',
    bar: 'bg-success',
  },
  VIDA: {
    imagen: '/icons/vida.png',
    label: 'Vida',
    tagline: 'Protege a quienes mas quieres',
    accentBg: 'bg-danger-soft',
    accentText: 'text-danger',
    bar: 'bg-danger',
  },
  HOGAR: {
    imagen: '/icons/hogar.png',
    label: 'Hogar',
    tagline: 'Tu casa, siempre protegida',
    accentBg: 'bg-warning-soft',
    accentText: 'text-warning',
    bar: 'bg-warning',
  },
  VIAJE: {
    imagen: '/icons/viaje.png',
    label: 'Viaje',
    tagline: 'Explora el mundo sin riesgos',
    accentBg: 'bg-info-soft',
    accentText: 'text-info',
    bar: 'bg-info',
  },
  EMPRESA: {
    imagen: '/icons/empresa.png',
    label: 'Empresa',
    tagline: 'Protege tu negocio',
    accentBg: 'bg-[#ede9fe]',
    accentText: 'text-[#7c3aed]',
    bar: 'bg-[#7c3aed]',
  },
  SOAT: {
    imagen: '/icons/soat.png',
    label: 'SOAT',
    tagline: 'Circula tranquilo y protegido',
    accentBg: 'bg-[#fce7f3]',
    accentText: 'text-[#db2777]',
    bar: 'bg-[#db2777]',
  },
  MASCOTAS: {
    imagen: '/icons/mascota.png',
    label: 'Mascotas',
    tagline: 'Cuida a tu mejor amigo',
    accentBg: 'bg-[#fef9c3]',
    accentText: 'text-[#a16207]',
    bar: 'bg-[#a16207]',
  },
};

const FALLBACK = {
  imagen: '/icons/sbs.png',
  label: 'Seguro',
  tagline: '',
  accentBg: 'bg-bg-soft',
  accentText: 'text-text-soft',
  bar: 'bg-border',
};

export function estiloTipo(tipo) {
  return TIPO_SEGURO[tipo] || FALLBACK;
}
