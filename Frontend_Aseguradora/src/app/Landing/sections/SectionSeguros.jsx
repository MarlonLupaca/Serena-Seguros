import Link from 'next/link';
import { services } from '../data';
import Image from 'next/image';
import { IoIosArrowForward } from 'react-icons/io';

export function SectionSeguros() {
  return (
    <section id="seguros" className="py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Nuestros seguros</span>
          <p className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text leading-tight">
            Encuentra el seguro ideal para cada momento de tu vida
          </p>
          <p className="mt-4 text-lg text-text-soft leading-relaxed">
            Desde tu auto hasta tu familia — elige la cobertura perfecta y cotiza en línea en pocos minutos.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.title}
                className=" group relative flex flex-col bg-white rounded-2xl border border-border p-7 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(11,60,93,0.10)] hover:border-primary/25 transition-all duration-300 cursor-default"
              >
                {s.tag && (
                  <span className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-bg-soft text-primary">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                    </span>
                    {s.tag}
                  </span>
                )}
                <Image
                  src={s.url}
                  height={500}
                  width={500}
                  alt={s.title}
                  className="h-13.75 object-contain w-fit mb-2"
                />
                <p className="font-bold text-base text-text">{s.title}</p>
                <p className="mt-2 text-sm text-text-soft leading-relaxed grow">{s.desc}</p>
                <Link
                  href="#"
                  className="mt-5 flex  gap-1 text-primary font-bold text-sm hover:gap-2.5 transition-all duration-200 items-center "
                >
                  <span className="pb-1">Cotizar</span> <IoIosArrowForward size={15} />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
