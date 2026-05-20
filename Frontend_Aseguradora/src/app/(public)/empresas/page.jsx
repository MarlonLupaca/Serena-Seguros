'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MdBusiness,
  MdCheckCircle,
  MdArrowForward,
  MdPeople,
  MdSecurity,
  MdHandshake,
  MdTrendingUp,
} from 'react-icons/md';
import { IoIosArrowForward } from 'react-icons/io';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const BENEFICIOS_EMPRESA = [
  {
    icon: MdPeople,
    titulo: 'Atencion personalizada',
    desc: 'Un ejecutivo de cuenta dedicado para tu empresa, disponible cuando lo necesites.',
  },
  {
    icon: MdSecurity,
    titulo: 'Cumplimiento normativo',
    desc: 'Te ayudamos a cumplir con SCTR, Vida Ley y todas las obligaciones legales.',
  },
  {
    icon: MdHandshake,
    titulo: 'Planes a medida',
    desc: 'Diseñamos coberturas adaptadas al tamaño y rubro de tu empresa.',
  },
  {
    icon: MdTrendingUp,
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
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
              <MdBusiness size={20} />
              Seguros Corporativos
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text">
              Protege tu empresa y a tus colaboradores
            </h1>
            <p className="mt-5 text-[17px] leading-relaxed text-text-soft max-w-xl">
              Soluciones de seguros diseñadas para cada tipo de negocio. Desde microempresas hasta grandes corporaciones, tenemos el plan perfecto para ti.
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
          <div className="flex justify-center">
            <Image
              src="/icons/empresa.png"
              width={400}
              height={400}
              alt="Seguros empresariales"
              className="h-48 md:h-64 object-contain"
            />
          </div>
        </div>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="block w-full absolute -bottom-px" aria-hidden>
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>
      </section>

      {/* Productos */}
      {productos.length > 0 && (
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Nuestras soluciones</span>
            <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
              Seguros corporativos a tu medida
            </h2>
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((p) => (
                <div
                  key={p.id_producto}
                  className="group flex flex-col bg-white rounded-2xl border border-border p-7 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(11,60,93,0.10)] hover:border-primary/25 transition-all duration-300"
                >
                  <p className="font-bold text-lg text-text">{p.nombre}</p>
                  <p className="mt-2 text-sm text-text-soft leading-relaxed grow">
                    {p.limites_cobertura}
                  </p>
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-text-soft">Desde</p>
                    <p className="text-2xl font-extrabold text-primary">
                      S/{Number(p.prima_base).toFixed(2)}
                      <span className="text-sm font-normal text-text-soft">/mes</span>
                    </p>
                  </div>
                  <Link
                    href="/cotizar?tipo=empresas"
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

      {/* Beneficios */}
      <section className="py-20 px-6 bg-bg-soft">
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
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={24} className="text-primary" />
                  </div>
                  <p className="font-bold text-text text-base">{b.titulo}</p>
                  <p className="mt-2 text-sm text-text-soft leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonios empresariales */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Testimonios</span>
          <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Lo que dicen nuestros clientes corporativos
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIOS_EMPRESA.map((t) => (
              <div key={t.nombre} className="bg-bg-soft rounded-2xl p-7">
                <p className="text-sm text-text-soft leading-relaxed italic">
                  &ldquo;{t.texto}&rdquo;
                </p>
                <div className="mt-5 pt-5 border-t border-border">
                  <p className="font-bold text-text text-sm">{t.nombre}</p>
                  <p className="text-xs text-text-soft">{t.cargo}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de contacto */}
      <section id="contacto-empresas" className="py-20 px-6 bg-bg-soft">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold tracking-tight text-text text-center">
            Solicita una asesoria gratuita
          </h2>
          <p className="mt-3 text-text-soft text-center">
            Dejanos tus datos y un ejecutivo se comunicara contigo en menos de 24 horas.
          </p>

          {formEnviado ? (
            <div className="mt-10 text-center p-8 bg-white rounded-2xl border border-primary/20">
              <MdCheckCircle size={48} className="text-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-text">Solicitud recibida!</p>
              <p className="mt-2 text-text-soft">
                Nos comunicaremos contigo en las proximas 24 horas habiles.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-10 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Nombre completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Juan Perez"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Empresa</label>
                  <input
                    type="text"
                    required
                    placeholder="Mi Empresa S.A.C."
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Correo electronico</label>
                  <input
                    type="email"
                    required
                    placeholder="juan@empresa.com"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-text mb-1.5">Telefono</label>
                  <input
                    type="tel"
                    required
                    placeholder="999 888 777"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Numero de empleados
                </label>
                <select
                  required
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                >
                  <option value="">Selecciona</option>
                  <option value="1-10">1 a 10</option>
                  <option value="11-50">11 a 50</option>
                  <option value="51-200">51 a 200</option>
                  <option value="201-500">201 a 500</option>
                  <option value="500+">Mas de 500</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Mensaje <span className="text-text-soft font-normal">(opcional)</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Cuentanos que seguros necesitas..."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
              >
                Enviar solicitud <MdArrowForward size={18} />
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
