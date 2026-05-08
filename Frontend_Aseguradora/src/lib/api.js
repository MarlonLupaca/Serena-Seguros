const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
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
