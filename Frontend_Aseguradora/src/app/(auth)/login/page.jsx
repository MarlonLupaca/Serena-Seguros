'use client';

import { useState } from 'react';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdClose, MdInfo } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const users = [
    { email: 'admin@test.com', pass: 'admin123', role: 'Administrador', path: '/admin' },
    { email: 'cliente@test.com', pass: 'cliente123', role: 'Cliente', path: '/client' },
    { email: 'empleado@test.com', pass: 'empleado123', role: 'Empleado', path: '/employee' },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    const user = users.find((u) => u.email === email && u.pass === password);

    if (user) {
      router.push(user.path);
    } else {
      setError('Credenciales incorrectas. Verifica el panel de simulación.');
    }
  };

  return (
    <div className="min-h-screen flex bg-bg relative">
      <div className="absolute bottom-6 left-6 z-50">
        <button
          onClick={() => setShowCredentials(!showCredentials)}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-xl border border-white/10"
        >
          <MdInfo size={18} />
          {showCredentials ? 'Ocultar Ayuda' : 'Credenciales Simulación'}
        </button>

        {showCredentials && (
          <div className="absolute bottom-14 left-0 w-72 p-5 bg-white border border-border rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-4">
            <h4 className="text-black font-bold mb-3 text-sm border-b pb-2">Cuentas para Prototipo:</h4>
            <div className="space-y-4">
              {users.map((u) => (
                <div key={u.role} className="text-[11px] text-gray-600 leading-relaxed">
                  <p className="font-bold text-primary uppercase mb-1">{u.role}</p>
                  <p>
                    User: <span className="font-mono bg-gray-100 px-1 rounded">{u.email}</span>
                  </p>
                  <p>
                    Pass: <span className="font-mono bg-gray-100 px-1 rounded">{u.pass}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Link
        href="/"
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-bg-soft hover:bg-border text-text-soft hover:text-text transition-colors"
      >
        <MdClose size={20} />
      </Link>
      {/**Imagen */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary to-slate-900 ">
        <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-center">
          <div className="w-44 h-44 rounded-3xl flex items-center justify-center mb-8 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20">
            <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
              <rect x="10" y="20" width="60" height="45" rx="8" fill="rgba(255,255,255,0.3)" />
              <rect x="22" y="10" width="36" height="28" rx="6" fill="rgba(255,255,255,0.5)" />
              <circle cx="40" cy="24" r="8" fill="white" />
              <path d="M22 52 C22 44 58 44 58 52 L58 65 L22 65 Z" fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold mb-4 text-white">Acceso Multi-Perfil</h2>
          <p className="text-lg leading-relaxed max-w-sm text-white/70">
            Explora las diferentes interfaces diseñadas para cada tipo de usuario.
          </p>
        </div>
      </div>
      {/** Login */}

      <div className=" lg:w-[50%] w-full px-15 mx-auto ">
        <div className="flex flex-col justify-center w-fit h-full mx-auto  bg-bg">
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

          <form onSubmit={handleLogin} className="flex flex-col gap-5 max-w-sm">
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
                  className="w-90 pl-10 pr-4 py-3 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-all"
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

            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] uppercase tracking-wider text-text-soft font-bold">o continúa con</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-white border border-border hover:bg-gray-50 text-text transition-colors"
              >
                <FcGoogle size={18} /> Google
              </button>
              <button
                type="button"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-semibold bg-white border border-border hover:bg-gray-50 text-text transition-colors"
              >
                <FaGithub size={18} /> GitHub
              </button>
            </div>

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
