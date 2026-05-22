'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import Image from 'next/image';
import { MdCheckCircle, MdArrowForward, MdExpandMore, MdShield } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import { getSeguroBySlug } from '../data';
import { benefits } from '../../../Landing/data';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function SeguroDetallePage() {
  const { tipo } = useParams();
  const seguro = getSeguroBySlug(tipo);
  const [productos, setProductos] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

  const carouselRef = useRef(null);
  const visibleCount = 4; // cuántas cards se ven a la vez
  const [currentIndex, setCurrentIndex] = useState(0);

  const SEGUROURL = {
    VEHICULAR: '/icons/vehiculo.png',
    SOAT: '/icons/soat.png',
    VIDA: '/icons/vida.png',
    SALUD: '/icons/salud.png',
    VIAJE: '/icons/viaje.png',
    HOGAR: '/icons/hogar.png',
    MASCOTAS: '/icons/mascota.png',
    EMPRESA: '/icons/empresa.png',
  };

  useEffect(() => {
    if (!seguro) return;
    fetch(`${API}/publico/productos/${seguro.tipo}`)
      .then((r) => r.json())
      .then(setProductos)
      .catch(() => setProductos([]));
  }, [seguro]);

  if (!seguro) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6">
        <p className="text-2xl font-bold text-text mb-4">Seguro no encontrado</p>
        <Link href="/#seguros" className="text-primary font-semibold hover:underline flex items-center gap-1">
          Ver todos los seguros <IoIosArrowForward size={16} />
        </Link>
      </div>
    );
  }

  const Icon = seguro.icon;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-soft px-6 pb-28 pt-15">
        {/* Curvas SVG fluidas consistentes */}
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="block w-full -top-7 right-0 rotate-180 absolute"
          aria-hidden
        >
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>
        <svg
          viewBox="0 0 1440 72"
          preserveAspectRatio="none"
          className="block w-full bottom-0 right-0 absolute scale-x-[-1]"
          aria-hidden
        >
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 px-6 ">
          <div className=" pb-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Icon size={20} />
              {seguro.titulo}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[46px] font-extrabold leading-[1.08] tracking-tight text-text">
              {seguro.subtitulo}
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-text-soft max-w-xl">{seguro.descripcion}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/cotizar?tipo=${tipo}`}
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
              >
                Cotizar ahora <MdArrowForward size={18} />
              </Link>
              <a
                href="tel:015135000"
                className="inline-flex items-center gap-2 bg-white border border-border text-text font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:bg-bg-soft shadow-sm hover:-translate-y-0.5 transition-all duration-200"
              >
                Llamar a un asesor
              </a>
            </div>
          </div>

          <Image
            src={seguro.imagen}
            width={400}
            height={400}
            alt={seguro.titulo}
            className="w-48 md:w-full border-black p-0 h-fit flex justify-center items-center object-contain group-hover:scale-102 transition-transform duration-500 "
          />
        </div>
      </section>

      {/* Planes disponibles */}
      {productos.length > 0 && (
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3.5 py-1.5 rounded-md border border-primary/20">
              Nuestros planes
            </span>
            <h2 className="mt-4 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
              Elige el plan que mejor se adapte a ti
            </h2>
          </div>

          {/* Carrusel */}
          <div className="mt-12 relative max-w-7xl mx-auto px-6">
            {/* Contenedor sin scroll nativo */}
            <div className="overflow-hidden">
              <div
                ref={carouselRef}
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
                      {p.tipo_venta ?? 'Online'}
                    </span>

                    {/* Ícono */}
                    <Image
                      src={SEGUROURL[tipo?.toUpperCase()] || '/icons/default.png'}
                      height={44}
                      width={44}
                      alt={p.nombre}
                      className="h-11 w-fit object-contain mb-4"
                    />

                    {/* Nombre */}
                    <p className="font-extrabold text-[16px] text-text tracking-tight leading-snug pr-10">{p.nombre}</p>

                    {/* Precio — pegado al nombre, sin separador */}
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
                      href={`/cotizar?tipo=${tipo}`}
                      className="mt-4 inline-flex items-center gap-1 text-primary font-bold text-[13.5px] hover:gap-2 transition-all duration-200"
                    >
                      Cotizar este plan <IoIosArrowForward size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Controles del carrusel */}
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

      {/* Coberturas */}
      <section className="py-24 px-6 bg-bg-soft">
        <div className="max-w-7xl mx-auto">
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-primary bg-primary/10 px-3.5 py-1.5 rounded-md border border-primary/20">
            <MdShield size={13} />
            Coberturas
          </span>

          <h2 className="mt-4 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Lo que incluye tu seguro
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {seguro.coberturas.map((c, i) => (
              <div
                key={c}
                className="group relative overflow-hidden flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-slate-200/70 hover:border-primary/30 hover:shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Número decorativo */}
                <span className="text-[42px] font-black text-slate-500 group-hover:text-slate-800 leading-none select-none transition-colors duration-300 pointer-events-none w-12 shrink-0 text-center">
                  {String(i + 1).padStart(2, '0')}
                </span>

                {/* Texto */}
                <p className="text-[14px] font-semibold text-text/75 group-hover:text-text leading-snug transition-colors duration-300 pr-8">
                  {c}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
            Ventajas
          </span>
          <h2 className="mt-4 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Por qué elegir Serena Seguros
          </h2>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.t} className="flex flex-col items-start p-7  border border-border rounded-2xl bg-white group">
                <Image src={b.url} height={50} width={50} alt={b.t} className="h-12 w-fit border mb-2" />
                <p className="font-bold text-text text-base tracking-tight">{b.t}</p>
                <p className="mt-2 text-sm text-text-soft leading-relaxed font-medium">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 bg-bg-soft ">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
              Preguntas frecuentes
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text leading-tight">
              Resolvemos tus dudas
            </h2>
          </div>
          <div className="space-y-4">
            {seguro.faqs.map((f, i) => {
              const isOpen = faqOpen === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-border/60 overflow-hidden shadow-sm transition-all duration-300"
                >
                  <button
                    onClick={() => setFaqOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-5 text-left transition-colors hover:bg-bg-soft/30 focus:outline-none"
                  >
                    <span
                      className={`font-bold text-[15px] tracking-tight transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-text'}`}
                    >
                      {f.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full bg-bg-soft flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-text-soft'}`}
                    >
                      <MdExpandMore size={20} />
                    </div>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 pb-6 text-sm text-text-soft/90 leading-relaxed font-medium border-t border-border/40 pt-2">
                        {f.a}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-28 px-6 relative overflow-hidden">
        {/* Fondo sutil decorativo de marca corporativa */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
            Cotización Inmediata
          </span>
          <h2 className="mt-5 text-3xl md:text-[44px] font-extrabold tracking-tight text-text leading-tight">
            Protege lo que importa hoy
          </h2>
          <p className="mt-4 text-base md:text-lg text-text-soft max-w-xl mx-auto leading-relaxed">
            Cotiza tu <span className="font-semibold text-text">{seguro.titulo.toLowerCase()}</span> en minutos y recibe
            una propuesta automatizada y adaptada a tus necesidades.
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href={`/cotizar?tipo=${tipo}`}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 group"
            >
              Cotizar ahora <MdArrowForward size={18} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
