const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const KEY_TOKEN = 'serena_access_token';
const KEY_REFRESH = 'serena_refresh_token';
const KEY_USER = 'serena_user';

const RUTAS_PUBLICAS = ['/auth/login', '/auth/registro'];

function obtenerToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(KEY_TOKEN);
}

function manejarSesionInvalida() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_REFRESH);
  localStorage.removeItem(KEY_USER);
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
