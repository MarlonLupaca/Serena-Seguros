import { MdDirectionsCar, MdHealthAndSafety, MdFavorite, MdHome } from 'react-icons/md';

export const TIPOS = [
  { id: 'auto', label: 'Auto', icon: MdDirectionsCar, desc: 'Protege tu vehículo' },
  { id: 'salud', label: 'Salud', icon: MdHealthAndSafety, desc: 'Cuida tu bienestar' },
  { id: 'vida', label: 'Vida', icon: MdFavorite, desc: 'Protege tu familia' },
  { id: 'hogar', label: 'Hogar', icon: MdHome, desc: 'Asegura tu vivienda' },
];

export const STEPS = ['Tipo', 'Datos', 'Cobertura', 'Cotización', 'Contratación'];

export const COBERTURAS = {
  auto: [
    { id: 'basica', label: 'Básica', precio: 45, desc: 'Responsabilidad civil + robo total' },
    { id: 'estandar', label: 'Estándar', precio: 75, desc: 'Básica + daños propios + asistencia 24h' },
    { id: 'full', label: 'Full', precio: 110, desc: 'Todo incluido + gastos médicos + auto de reemplazo' },
  ],
  salud: [
    { id: 'individual', label: 'Individual', precio: 89, desc: 'Cobertura para una persona' },
    { id: 'familiar', label: 'Familiar', precio: 149, desc: 'Titular + cónyuge + hijos hasta 25 años' },
    { id: 'premium', label: 'Premium', precio: 210, desc: 'Familiar + internacional + dental' },
  ],
  vida: [
    { id: 'esencial', label: 'Esencial', precio: 35, desc: 'Capital asegurado S/100k' },
    { id: 'plus', label: 'Plus', precio: 60, desc: 'Capital S/200k + invalidez' },
    { id: 'platinum', label: 'Platinum', precio: 95, desc: 'Capital S/500k + enfermedades graves + ahorro' },
  ],
  hogar: [
    { id: 'basica', label: 'Básica', precio: 28, desc: 'Incendio + robo' },
    { id: 'estandar', label: 'Estándar', precio: 48, desc: 'Básica + fenómenos naturales' },
    { id: 'total', label: 'Total', precio: 72, desc: 'Estándar + responsabilidad civil + asistencia técnica' },
  ],
};

export const EXTRAS = [
  { id: 'asistencia', label: 'Asistencia vial premium', precio: 8 },
  { id: 'reemplazo', label: 'Vehículo de reemplazo', precio: 12 },
  { id: 'medico', label: 'Gastos médicos ampliados', precio: 10 },
  { id: 'juridica', label: 'Asistencia jurídica', precio: 6 },
];

export const DEDUCIBLE_OPTS = [
  { val: 0, label: 'Sin deducible', descuento: 0 },
  { val: 500, label: 'S/ 500', descuento: 5 },
  { val: 1000, label: 'S/ 1,000', descuento: 10 },
  { val: 2000, label: 'S/ 2,000', descuento: 15 },
];
