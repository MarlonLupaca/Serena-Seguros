'use client';

import { useState } from 'react';
import { MdPerson, MdLock, MdVisibility, MdVisibilityOff, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { login, PORTAL_TO_PATH } from '@/lib/auth';

const ACCESOS_RAPIDOS = [
  { label: 'Asegurado', username: 'asegurado_demo', password: 'demo12345', url: '/icons/cliente.png' },
  { label: 'Comercial', username: 'comercial_demo', password: 'demo12345', url: '/icons/empleado.png' },
  { label: 'Tecnico', username: 'tecnico_demo', password: 'demo12345', url: '/icons/cliente.png' },
  { label: 'Operativo', username: 'operativo_demo', password: 'demo12345', url: '/icons/empleado.png' },
  { label: 'Ejecutivo', username: 'ejecutivo_demo', password: 'demo12345', url: '/icons/admin.png' },
];

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const ingresar = async (user, pass) => {
    setError('');
    setLoading(true);
    try {
      const data = await login(user, pass);
      const path = PORTAL_TO_PATH[data.portal_acceso];
      if (!path) {
        setError('Portal de acceso desconocido');
        return;
      }
      router.push(path);
    } catch (e) {
      setError(e.mensaje || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    ingresar(username, password);
  };

  const accesoRapido = (acceso) => {
    ingresar(acceso.username, acceso.password);
  };

  return (
    <div className="min-h-screen flex bg-bg relative">
      <Link
        href="/"
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-bg-soft hover:bg-border text-text-soft hover:text-text transition-colors"
      >
        <MdClose size={20} />
      </Link>

      {/* Imagen lateral */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary to-slate-900 pb-5">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-center">
          <Image src="/img/loginAseguradora.svg" width={500} height={500} alt="login" />
          <p className="text-2xl font-bold mb-4 text-white">Tu tranquilidad, nuestra prioridad</p>
        </div>
      </div>

      {/* Formulario */}
      <div className="lg:w-[50%] w-full mx-auto h-screen">
        <div className="flex flex-col justify-center max-w-xl h-full mx-auto px-15 bg-bg">
          {/* Logo */}
          <div className="mb-10 text-xl font-bold text-text flex items-center gap-2">
            <Image src="/img/logo.png" width={500} height={500} alt="logo" className="h-9 object-contain w-fit" />
            <span className="text-text font-bold text-xl tracking-wide whitespace-nowrap">
              Serena <span className="text-primary">Seguros</span>
            </span>
          </div>

          <div className="mb-8">
            <p className="text-3xl font-bold text-text">Bienvenido</p>
            <p className="text-sm text-text-soft">Inicia sesión para continuar</p>
          </div>

          {/* Acceso rápido por portal */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-text-soft uppercase tracking-wider mb-3">Acceso rápido — Demo</p>
            <div className="grid grid-cols-3 gap-3">
              {ACCESOS_RAPIDOS.map((acceso) => (
                <button
                  key={acceso.label}
                  type="button"
                  onClick={() => accesoRapido(acceso)}
                  disabled={loading}
                  className="cursor-pointer flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border border-primary bg-bg transition-all hover:scale-103 disabled:opacity-50"
                >
                  <Image
                    src={acceso.url}
                    width={500}
                    height={500}
                    alt={acceso.label}
                    className="h-8 object-contain w-fit"
                  />
                  <span className="text-xs font-semibold text-text-soft transition-colors">{acceso.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Divisor */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-soft">o ingresa con tu cuenta</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Formulario manual */}
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Usuario</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                  <MdPerson size={18} />
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="ej: usuario_demo"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-text">Contraseña</label>
                <Link href="#" className="text-xs font-medium text-primary hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                  <MdLock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
              <span className="text-sm text-text-soft">Recordarme</span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-lg shadow-primary/25 disabled:opacity-60"
            >
              {loading ? 'Ingresando...' : 'Iniciar sesión'}
            </button>

            <p className="text-sm text-center mt-2 text-text-soft">
              <span>¿No tienes cuenta? </span>
              <Link href="/register" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Regístrate
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
