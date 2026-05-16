import Cookies from 'js-cookie';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://serena-seguros.onrender.com/api/v1';

const KEY_TOKEN = 'serena_access_token';
const KEY_REFRESH = 'serena_refresh_token';
const KEY_USER = 'serena_user';

const RUTAS_PUBLICAS = ['/auth/login', '/auth/registro'];

function obtenerToken() {
  if (typeof window === 'undefined') return null;
  return Cookies.get(KEY_TOKEN);
}

function manejarSesionInvalida() {
  if (typeof window === 'undefined') return;
  Cookies.remove(KEY_TOKEN);
  Cookies.remove(KEY_REFRESH);
  Cookies.remove(KEY_USER);
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

async function request(method, path, body) {
  const headers = { 'Content-Type': 'application/json' };

  const esPublica = RUTAS_PUBLICAS.some((r) => path.startsWith(r));
  if (!esPublica) {
    const token = obtenerToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401 && !esPublica) {
    manejarSesionInvalida();
  }

  if (!res.ok) {
    throw {
      status: res.status,
      mensaje: (data && data.mensaje) || 'Error de conexion con el servidor',
      errores: (data && data.errores) || null,
    };
  }

  return data;
}

export const apiPost = (path, body) => request('POST', path, body);
export const apiGet = (path) => request('GET', path);
export const apiPut = (path, body) => request('PUT', path, body);
export const apiPatch = (path, body) => request('PATCH', path, body);
export const apiDelete = (path) => request('DELETE', path);

export async function apiUploadFile(path, formData) {
  const headers = {};
  const token = obtenerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401) manejarSesionInvalida();

  if (!res.ok) {
    throw {
      status: res.status,
      mensaje: (data && data.mensaje) || 'Error al subir el archivo',
      errores: (data && data.errores) || null,
    };
  }
  return data;
}

export async function apiDownloadFile(path, fallbackName = 'archivo') {
  const headers = {};
  const token = obtenerToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method: 'GET', headers });

  if (res.status === 401) {
    manejarSesionInvalida();
    throw { status: 401, mensaje: 'No autenticado' };
  }
  if (!res.ok) {
    throw { status: res.status, mensaje: 'No se pudo descargar el archivo' };
  }

  const disposition = res.headers.get('content-disposition') || '';
  const match = /filename="?([^"]+)"?/.exec(disposition);
  const nombre = match ? match[1] : fallbackName;

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombre;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
