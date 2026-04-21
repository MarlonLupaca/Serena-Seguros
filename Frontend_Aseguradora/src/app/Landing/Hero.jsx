import { useState } from 'react';
import Link from 'next/link';
import { MdCheckCircle } from 'react-icons/md';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bg-soft text-text px-1">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 lg:pt-25 lg:pb-36 grid lg:grid-cols-2 items-center">
        {/* copy */}
        <div className="">
          <p className="mt-6 text-4xl md:text-5xl lg:text-[58px] font-extrabold leading-[1.06] tracking-tight">
            Protege lo que más importa, <span className="text-primary">cotiza en minutos.</span>
          </p>
          <p className="mt-5 text-[17px] leading-relaxed text-text/78 max-w-120">
            Seguros vehiculares, de vida, salud, viajes y más. 100% online, con asistencia humana cuando la necesites.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/cotizar"
              className="inline-flex items-center gap-2 bg-primary border border-primary text-white font-semibold text-[12px] md:text-[15px]  px-4 py-3 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              Cotizar mi seguro <IoIosArrowForward className="pt-px" size={18} />
            </Link>
            <Link
              href="#seguros"
              className="inline-flex items-center gap-2 bg-white/10 border border-text backdrop-blur text-text font-semibold text-[12px] sm:text-[15px] px-4 py-3 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              Conoce nuestros planes
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text">
            {['100% Online', 'Regulado por SBS', 'Asistencia 24/7'].map((t) => (
              <span key={t} className="flex items-center gap-2 text-[10px] sm:text-[12px]">
                <MdCheckCircle size={17} className="text-primary" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Imagen */}
        <Image src="/img/Family.svg" width={500} height={500} alt="leanding" className=" w-full" />
      </div>

      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="block w-full absolute -bottom-px" aria-hidden>
        <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
      </svg>
      <svg viewBox="0 0 1440 100" preserveAspectRatio="none" className="block w-full absolute -top-5" aria-hidden>
        <path d="M0,36 C360,-8 1080,72 1440,30 L1440,0 L0,0 Z" fill="white" />
      </svg>
    </section>
  );
}
