'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdCheckCircle, MdArrowForward, MdExpandMore, MdExpandLess } from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';
import { getSeguroBySlug } from '../data';
import { benefits } from '../../../Landing/data';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export default function SeguroDetallePage() {
  const { tipo } = useParams();
  const seguro = getSeguroBySlug(tipo);
  const [productos, setProductos] = useState([]);
  const [faqOpen, setFaqOpen] = useState(null);

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
        <Link href="/#seguros" className="text-primary font-semibold hover:underline">
          Ver todos los seguros
        </Link>
      </div>
    );
  }

  const Icon = seguro.icon;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-soft px-6 pt-20 pb-24">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <Icon size={20} />
              {seguro.titulo}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text">
              {seguro.subtitulo}
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-text-soft max-w-xl">
              {seguro.descripcion}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/cotizar?tipo=${tipo}`}
                className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
              >
                Cotizar ahora <IoIosArrowForward size={18} />
              </Link>
              <a
                href="tel:015135000"
                className="inline-flex items-center gap-2 bg-white border border-text text-text font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
              >
                Llamar a un asesor
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src={seguro.imagen}
              width={400}
              height={400}
              alt={seguro.titulo}
              className="h-48 md:h-64 object-contain"
            />
          </div>
        </div>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="block w-full absolute -bottom-px" aria-hidden>
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>
      </section>

      {/* Planes disponibles */}
      {productos.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Nuestros planes</span>
            <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
              Elige el plan que mejor se adapte a ti
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((p) => (
                <div
                  key={p.id_producto}
                  className="group relative flex flex-col bg-white rounded-2xl border border-border p-7 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(11,60,93,0.10)] hover:border-primary/25 transition-all duration-300"
                >
                  <p className="font-bold text-lg text-text">{p.nombre}</p>
                  <p className="mt-2 text-sm text-text-soft leading-relaxed grow">
                    {p.limites_cobertura}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-soft">Prima base mensual</p>
                    <p className="text-2xl font-extrabold text-primary">
                      S/{Number(p.prima_base).toFixed(2)}
                    </p>
                  </div>
                  <Link
                    href={`/cotizar?tipo=${tipo}`}
                    className="mt-5 inline-flex items-center gap-1 text-primary font-bold text-sm hover:gap-2.5 transition-all duration-200"
                  >
                    Cotizar <IoIosArrowForward size={15} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Coberturas */}
      <section className="py-20 px-6 bg-bg-soft">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Coberturas</span>
          <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Lo que incluye tu seguro
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {seguro.coberturas.map((c) => (
              <div key={c} className="flex items-start gap-3 bg-white rounded-xl p-5 border border-border">
                <MdCheckCircle size={22} className="text-primary shrink-0 mt-0.5" />
                <p className="text-sm text-text leading-relaxed">{c}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Por que elegirnos */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Ventajas</span>
          <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Por que elegir Serena Seguros
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.t} className="flex flex-col items-start p-6 bg-bg-soft rounded-2xl">
                <Image src={b.url} width={48} height={48} alt={b.t} className="h-12 w-12 object-contain mb-4" />
                <p className="font-bold text-text text-base">{b.t}</p>
                <p className="mt-2 text-sm text-text-soft leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-bg-soft">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Preguntas frecuentes</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text leading-tight mb-10">
            Resolvemos tus dudas
          </h2>
          <div className="space-y-3">
            {seguro.faqs.map((f, i) => (
              <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-text text-[15px]">{f.q}</span>
                  {faqOpen === i ? (
                    <MdExpandLess size={22} className="text-primary shrink-0" />
                  ) : (
                    <MdExpandMore size={22} className="text-text-soft shrink-0" />
                  )}
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 text-sm text-text-soft leading-relaxed">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-text">
            Protege lo que importa hoy
          </h2>
          <p className="mt-4 text-lg text-text-soft">
            Cotiza tu {seguro.titulo.toLowerCase()} en minutos y recibe una propuesta personalizada.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href={`/cotizar?tipo=${tipo}`}
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              Cotizar ahora <MdArrowForward size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
