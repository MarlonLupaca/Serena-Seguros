'use client';

import { useState } from 'react';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdClose } from 'react-icons/md';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const ROLES = [
  {
    label: 'Admin',
    email: 'admin@test.com',
    pass: 'admin123',
    path: '/admin',
    url: '/icons/admin.png',
  },
  {
    label: 'Cliente',
    email: 'cliente@test.com',
    pass: 'cliente123',
    path: '/client',
    url: '/icons/cliente.png',
    color: '#0ea5e9',
    bg: '#e0f2fe',
  },
  {
    label: 'Empleado',
    email: 'empleado@test.com',
    pass: 'empleado123',
    path: '/employee',
    url: '/icons/empleado.png',
  },
];

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const user = ROLES.find((u) => u.email === email && u.pass === password);
    if (user) {
      router.push(user.path);
    } else {
      setError('Credenciales incorrectas.');
    }
  };

  const loginAs = (role) => {
    router.push(role.path);
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

          {/* Acceso rápido por rol */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-text-soft uppercase tracking-wider mb-3">Acceso rápido — Demo</p>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map((role) => (
                <button
                  key={role.label}
                  type="button"
                  onClick={() => loginAs(role)}
                  style={{ '--role-color': role.color, '--role-bg': role.bg }}
                  className="cursor-pointer flex items-center justify-center gap-1.5 py-3 px-2 rounded-xl border border-primary bg-bg transition-all hover:scale-103"
                >
                  <Image
                    src={role.url}
                    width={500}
                    height={500}
                    alt={role.label}
                    className="h-8 object-contain w-fit"
                  />
                  <span className="text-xs font-semibold text-text-soft transition-colors">{role.label}</span>
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
              <label className="text-sm font-medium text-text">Email</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                  <MdEmail size={18} />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@test.com"
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
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-primary hover:bg-primary-hover text-white transition-all shadow-lg shadow-primary/25"
            >
              Iniciar sesión
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
