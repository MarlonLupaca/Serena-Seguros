import Link from 'next/link';
import { MdArrowForward, MdPhoneInTalk } from 'react-icons/md';
import { steps } from '../data';

export function SectionSiniestros() {
  return (
    <section id="siniestros" className="py-24 md:py-32 relative overflow-hidden bg-bg-soft text-text">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="text-[11px] font-black tracking-[0.15em] uppercase text-primary">
            ¿Tuviste un siniestro?
          </span>
          <h2 className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text leading-[1.1]">
            Estamos contigo las 24 horas
          </h2>
          <p className="mt-4 text-[17px] text-text/90 leading-relaxed max-w-xl">
            Reporta tu caso en línea o llámanos. Nuestro equipo resolverá tu emergencia lo antes posible.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-[15px] px-8 py-4 rounded-2xl shadow-lg shadow-black/5 transition-all hover:-translate-y-0.5"
            >
              Reportar siniestro <MdArrowForward size={18} />
            </Link>

            <Link
              href="#"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-text text-text font-bold text-[15px] px-7 py-4 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-0.5"
            >
              <MdPhoneInTalk size={18} /> (01) 415 1515
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div
              key={s.n}
              className="group bg-white/10 border border-primary backdrop-blur-lg rounded-[30px] p-7 transition-all duration-300 hover:bg-white/15"
            >
              <div className="text-4xl font-black text-primary mb-4 group-hover:text-primary-hover transition-colors">
                {s.n}
              </div>
              <div className="font-extrabold text-[18px] text-text mb-2 tracking-tight">{s.t}</div>
              <div className="text-sm text-text/80 leading-relaxed">{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
