'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdBusiness, MdCheckCircle, MdArrowForward } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import { IoIosArrowBack } from 'react-icons/io';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const BENEFICIOS_EMPRESA = [
  {
    url: '/icons/atencion.png',
    titulo: 'Atencion personalizada',
    desc: 'Un ejecutivo de cuenta dedicado para tu empresa, disponible cuando lo necesites.',
  },
  {
    url: '/icons/escudov2.png',
    titulo: 'Cumplimiento normativo',
    desc: 'Te ayudamos a cumplir con SCTR, Vida Ley y todas las obligaciones legales.',
  },
  {
    url: '/icons/responsabilidadv2.png',
    titulo: 'Planes a medida',
    desc: 'Diseñamos coberturas adaptadas al tamaño y rubro de tu empresa.',
  },
  {
    url: '/icons/estadistica.png',
    titulo: 'Ahorro corporativo',
    desc: 'Descuentos por volumen y paquetes que optimizan tu presupuesto.',
  },
];

const TESTIMONIOS_EMPRESA = [
  {
    nombre: 'Carlos Mendoza',
    cargo: 'Gerente General, Constructora del Sur',
    texto: 'El SCTR y la responsabilidad civil nos dieron tranquilidad total en obra.',
  },
  {
    nombre: 'Ana Torres',
    cargo: 'Directora de RRHH, Tech Solutions',
    texto: 'Nuestros empleados valoran mucho el plan de salud corporativo que contratamos.',
  },
  {
    nombre: 'Roberto Diaz',
    cargo: 'Dueno, Transportes Diaz',
    texto: 'El seguro de carga nos ahorro miles cuando tuvimos un siniestro en ruta.',
  },
];

export default function EmpresasPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const visibleCount = 4;
  const [productos, setProductos] = useState([]);
  const [formEnviado, setFormEnviado] = useState(false);

  useEffect(() => {
    fetch(`${API}/publico/productos/EMPRESA`)
      .then((r) => r.json())
      .then(setProductos)
      .catch(() => setProductos([]));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormEnviado(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-soft px-6 pt-20 pb-24">
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="block w-full -top-7 right-0 rotate-180 absolute "
          aria-hidden
        >
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="block w-full bottom-0 right-0  absolute scale-x-[-1] "
          aria-hidden
        >
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center px-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <MdBusiness size={20} />
              Seguros Corporativos
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text">
              Protege tu empresa y a tus colaboradores
            </h1>
            <p className="mt-5 text-[15px] leading-relaxed text-text-soft max-w-xl ">
              Soluciones de seguros diseñadas para cada tipo de negocio. Desde microempresas hasta grandes
              corporaciones, tenemos el plan perfecto para ti.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#contacto-empresas"
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
              >
                Solicitar asesoria <MdArrowForward size={18} />
              </a>
              <a
                href="tel:015135000"
                className="inline-flex items-center gap-2 bg-white border border-text text-text font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
              >
                Llamar a ventas corporativas
              </a>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Image
              src="/img/company.svg"
              width={400}
              height={400}
              alt="Seguros empresariales"
              className="w-48 md:w-130 object-contain"
            />
          </div>
        </div>
      </section>

      {/* Productos */}
      {productos.length > 0 && (
        <section className="pt-24 pb-10 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3.5 py-1.5 rounded-md border border-primary/20">
              Nuestras soluciones
            </span>
            <h2 className="mt-4 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
              Seguros corporativos a tu medida
            </h2>
          </div>

          {/* Carrusel */}
          <div className="mt-12 relative max-w-7xl mx-auto px-6">
            <div className="overflow-hidden">
              <div
                className="flex gap-5 transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * (260 + 20)}px)` }}
              >
                {productos.map((p) => (
                  <div
                    key={p.id_producto}
                    className="group relative flex flex-col shrink-0 w-[260px] rounded-2xl border border-slate-200/80 bg-white p-6 hover:border-primary/40 hover:shadow-[0_16px_32px_-8px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300"
                  >
                    {/* Badge */}
                    <span className="absolute top-4 right-4 text-[10px] font-bold tracking-wide uppercase text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                      Empresas
                    </span>

                    {/* Ícono */}
                    <Image
                      src="/icons/empresa.png"
                      height={44}
                      width={44}
                      alt={p.nombre}
                      className="h-11 w-fit object-contain mb-4"
                    />

                    {/* Nombre */}
                    <p className="font-extrabold text-[16px] text-text tracking-tight leading-snug pr-10">{p.nombre}</p>

                    {/* Precio — pegado al nombre */}
                    <div className="mt-2 flex items-baseline gap-0.5">
                      <span className="text-[11px] font-bold text-primary/70">S/</span>
                      <span className="text-[22px] font-black text-primary leading-none tracking-tight">
                        {Number(p.prima_base).toFixed(2)}
                      </span>
                      <span className="text-[11px] text-text-soft/60 font-medium ml-0.5">/mes</span>
                    </div>

                    {/* Descripción */}
                    <p className="mt-3 text-[13px] text-text-soft leading-relaxed line-clamp-3 grow">
                      {p.limites_cobertura}
                    </p>

                    {/* CTA */}
                    <Link
                      href="/cotizar?tipo=empresas"
                      className="mt-4 inline-flex items-center gap-1 text-primary font-bold text-[13.5px] hover:gap-2 transition-all duration-200"
                    >
                      Cotizar este plan <IoIosArrowForward size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles */}
            <div className="flex items-center justify-end gap-2 mt-6">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                disabled={currentIndex === 0}
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-text-soft hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <IoIosArrowBack size={16} />
              </button>
              <button
                onClick={() => setCurrentIndex((i) => Math.min(i + 1, productos.length - visibleCount))}
                disabled={currentIndex >= productos.length - visibleCount}
                className="w-10 h-10 rounded-full border border-slate-200 bg-primary/[0.06] flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
              >
                <IoIosArrowForward size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Beneficios */}
      <section className="py-20 px-6 pb-30">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Ventajas</span>
          <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Por que las empresas nos eligen
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFICIOS_EMPRESA.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.titulo} className="flex flex-col items-start p-6 bg-white rounded-2xl border border-border">
                  <Image src={b.url} height={50} width={50} alt={b.titulo} className="h-12 w-fit border mb-2" />
                  <p className="font-bold text-text text-base">{b.titulo}</p>
                  <p className="mt-2 text-sm text-text-soft leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonios empresariales */}
      <section className="py-20 px-6 bg-bg-soft">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-start">
            <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              Testimonios
            </span>
            <h2 className="mt-4 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight max-w-2xl">
              Lo que dicen nuestros clientes corporativos
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIOS_EMPRESA.map((t) => (
              <div
                key={t.nombre}
                className="relative bg-white rounded-2xl p-8 border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between group"
              >
                {/* Detalle decorativo: Comilla sutil en el fondo */}
                <div className="absolute top-6 right-8 text-6xl text-primary/5 font-serif select-none pointer-events-none group-hover:text-primary/10 transition-colors duration-300">
                  &ldquo;
                </div>

                <div className="relative">
                  {/* Opcional: Estrellas de calificación si aplica a tu SaaS */}
                  <div className="flex gap-1 mb-4 text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-[15px] text-text-soft leading-relaxed font-medium">&ldquo;{t.texto}&rdquo;</p>
                </div>

                <div className="mt-6 pt-6 border-t border-border/80 flex items-center gap-3">
                  {/* Avatar con iniciales (puedes cambiarlo por t.avatar si tienes imágenes) */}
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                    {t.nombre.charAt(0)}
                  </div>

                  <div className="overflow-hidden">
                    <p className="font-bold text-text text-sm tracking-tight truncate">{t.nombre}</p>
                    <p className="text-xs text-text-soft/90 font-medium truncate">{t.cargo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section id="contacto-empresas" className="py-24 px-6 bg-bg-soft/50">
        <div className="max-w-3xl mx-auto">
          {/* Encabezado con mejor jerarquía */}
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              Contacto B2B
            </span>
            <h2 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-text leading-tight">
              Solicita una asesoría gratuita
            </h2>
            <p className="mt-3 text-[15px] text-text-soft leading-relaxed">
              Déjanos tus datos y un ejecutivo corporativo se comunicará contigo en menos de 24 horas.
            </p>
          </div>

          {formEnviado ? (
            <div className="text-center p-12 bg-white  rounded-3xl border border-primary/20 shadow-xl shadow-primary/5 max-w-2xl mx-auto animate-fade-in">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
                <MdCheckCircle size={36} className="text-primary" />
              </div>
              <p className="text-2xl font-bold text-text tracking-tight">¡Solicitud recibida!</p>
              <p className="mt-2 text-text-soft">Nos comunicaremos contigo en las próximas 24 horas hábiles.</p>
            </div>
          ) : (
            /* Contenedor principal del Formulario */
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white  p-8 md:p-10 rounded-3xl border border-border/60 shadow-xl shadow-text/5 max-w-2xl mx-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/80 mb-2">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Juan Pérez"
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-transparent text-text placeholder:text-text-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/80 mb-2">Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Mi Empresa S.A.C."
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-transparent text-text placeholder:text-text-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/80 mb-2">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan@empresa.com"
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-transparent text-text placeholder:text-text-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text/80 mb-2">Teléfono</label>
                  <input
                    type="tel"
                    required
                    placeholder="999 888 777"
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-transparent text-text placeholder:text-text-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text/80 mb-2">
                  Número de empleados
                </label>
                <div className="relative">
                  <select
                    required
                    className="w-full px-4 py-3.5 rounded-xl border border-border bg-transparent text-text focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm appearance-none cursor-pointer"
                  >
                    <option value="" className="">
                      Selecciona el rango
                    </option>
                    <option value="1-10" className="">
                      1 a 10 empleados
                    </option>
                    <option value="11-50" className="">
                      11 a 50 empleados
                    </option>
                    <option value="51-200" className="">
                      51 a 200 empleados
                    </option>
                    <option value="201-500" className="">
                      201 a 500 empleados
                    </option>
                    <option value="500+" className="">
                      Más de 500 empleados
                    </option>
                  </select>
                  {/* Icono de flecha custom para el select */}
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-text-soft">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text/80 mb-2">
                  Mensaje <span className="text-text-soft/70 font-normal lowercase">(opcional)</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Cuéntanos qué soluciones o seguros específicos necesita tu organización..."
                  className="w-full px-4 py-3.5 rounded-xl border border-border bg-transparent text-text placeholder:text-text-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 mt-2"
              >
                Enviar solicitud corporativa{' '}
                <MdArrowForward size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
