'use client';

import { useState } from 'react';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff, MdClose, MdPerson } from 'react-icons/md';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex bg-bg relative">
      {/* X para volver al landing */}
      <Link
        href="/"
        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-bg-soft hover:bg-border text-text-soft hover:text-text transition-colors"
        aria-label="Volver al inicio"
      >
        <MdClose size={20} />
      </Link>

      {/* Left: Form */}
      <div className="lg:w-[50%] mx-auto w-full flex justify-center">
        <div className="flex flex-col justify-center max-w-xl px-15 mx-auto bg-bg">
          {/* Logo */}
          <div className="mb-8">
            <div className="flex items-center gap-2">
              <Image src="/img/logo.png" width={500} height={500} alt="logo" className="h-9 object-contain w-fit" />
              <span className="text-text font-bold text-xl tracking-wide whitespace-nowrap">
                Serena <span className="text-primary">Seguros</span>
              </span>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-7">
            <p className="text-3xl font-bold mb-1 text-text">Crear cuenta</p>
            <p className="text-sm text-text-soft">Completa los datos para empezar</p>
          </div>

          {/* Form */}
          <div className="flex flex-col gap-4 ">
            {/* Nombre + Apellido */}
            <div className="flex gap-3 ">
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-medium text-text">Nombre</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                    <MdPerson size={17} />
                  </span>
                  <input
                    type="text"
                    placeholder="Juan"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-sm font-medium text-text">Apellido</label>
                <input
                  type="text"
                  placeholder="Pérez"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                  <MdEmail size={17} />
                </span>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                  <MdLock size={17} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text transition-colors"
                >
                  {showPassword ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text">Confirmar contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft">
                  <MdLock size={17} />
                </span>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repite tu contraseña"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-soft hover:text-text transition-colors"
                >
                  {showConfirm ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary mt-0.5 shrink-0" />
              <p className="text-sm text-text-soft leading-snug">
                <span>Acepto los </span>
                <Link href="#" className="font-medium text-primary hover:text-primary-hover transition-colors">
                  Términos de servicio
                </Link>
                <span> y la </span>
                <Link href="#" className="font-medium text-primary hover:text-primary-hover transition-colors">
                  Política de privacidad
                </Link>
              </p>
            </label>

            {/* Submit */}
            <button className="w-full py-3 rounded-xl text-sm font-semibold mt-1 bg-primary hover:bg-primary-hover text-text-inverse transition-colors">
              Crear cuenta
            </button>

            {/* Login */}
            <p className="text-sm text-center mt-1 text-text-soft">
              <span>¿Ya tienes cuenta? </span>
              <Link href="/login" className="font-semibold text-primary hover:text-primary-hover transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right: Decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-linear-to-br from-primary to-text pb-10">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/10" />
        <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-white/10" />

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-12 text-center">
          <Image src="/img/registerAseguradora.svg" width={500} height={500} alt="register" />

          <h2 className="text-3xl font-bold mb-3 text-text-inverse">Únete hoy</h2>
          <p className="text-base leading-relaxed max-w-xs text-white/75">
            Crea tu cuenta en segundos y accede a todas las seguros que tenemos para ti.
          </p>

          <div className="flex gap-4 mt-10">
            {[
              ['+10k', 'Usuarios'],
              ['99%', 'Satisfacción'],
              ['24/7', 'Soporte'],
            ].map(([val, label]) => (
              <div key={label} className="flex flex-col items-center">
                <span className="text-xl font-bold text-white">{val}</span>
                <span className="text-xs text-white/60">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
