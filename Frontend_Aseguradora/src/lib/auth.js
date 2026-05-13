import { apiPost } from './api';

const KEY_TOKEN = 'serena_access_token';
const KEY_REFRESH = 'serena_refresh_token';
const KEY_USER = 'serena_user';

export const PORTAL_TO_PATH = {
  ASEGURADO: '/asegurado',
  COMERCIAL: '/comercial',
  TECNICO: '/core',
  OPERATIVO: '/operativo',
  EJECUTIVO: '/ejecutivo',
};

export const PORTALES = [
  { value: 'ASEGURADO', label: 'Asegurado' },
  { value: 'COMERCIAL', label: 'Comercial' },
  { value: 'TECNICO', label: 'Tecnico' },
  { value: 'OPERATIVO', label: 'Operativo' },
  { value: 'EJECUTIVO', label: 'Ejecutivo' },
];

export async function login(username, password) {
  const data = await apiPost('/auth/login', { username, password });
  persist(data);
  return data;
}

export async function registro(payload) {
  const data = await apiPost('/auth/registro', payload);
  persist(data);
  return data;
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_USER);
}

export function getUser() {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(KEY_USER);
  return raw ? JSON.parse(raw) : null;
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY_TOKEN);
}

function persist(data) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY_TOKEN, data.access_token);
  localStorage.setItem(KEY_REFRESH, data.refresh_token);
  localStorage.setItem(
    KEY_USER,
    JSON.stringify({
      username: data.username,
      nombres: data.nombres,
      apellidos: data.apellidos,
      portal_acceso: data.portal_acceso,
    })
  );
}
