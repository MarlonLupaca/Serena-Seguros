import Link from 'next/link';
import { MdArrowForward, MdArrowOutward } from 'react-icons/md';
import { promos } from '../data';
import Image from 'next/image';

export function SectionPromos() {
  return (
    <section id="promos" className="py-24 md:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-14 relative z-10">
          <div className="max-w-2xl">
            <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Promociones</span>
            <h2 className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text leading-tight">
              Ofertas por tiempo limitado
            </h2>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-primary font-bold text-sm hover:gap-3 transition-all pb-2"
          >
            Ver todas <MdArrowForward size={17} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {promos.map((p) => (
            <article
              key={p.title}
              className="group relative flex flex-col min-h-73 rounded-[35px] p-8 border border-border bg-white transition-all duration-500 overflow-hidden shadow-[0_10px_30px_rgba(11,60,93,0.04)] hover:shadow-[0_20px_45px_rgba(11,60,93,0.1)] hover:scale-[1.02]"
            >
              <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute -top-6 -right-6 w-44 h-44 bg-primary/10 rounded-full blur-[45px] transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-accent/5 rounded-full blur-[55px] transition-transform duration-700 group-hover:scale-110" />
                <div
                  className="absolute inset-0 opacity-[0.03]"
                  style={{
                    backgroundImage: `radial-gradient(${'#0b3c5d'} 0.5px, transparent 0.5px)`,
                    backgroundSize: '12px 12px',
                  }}
                />
              </div>

              {/* --- CONTENIDO --- */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="mb-auto">
                  {/* Badge Glassmorphism */}
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/70 backdrop-blur-md border border-white text-primary text-[10px] font-black uppercase tracking-widest shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-primary" />
                    {p.badge}
                  </span>

                  <Image
                    src={p.url}
                    height={500}
                    width={500}
                    alt={p.title}
                    className="h-13.75 object-contain w-fit mb-3 mt-3"
                  />

                  <p className="mt-4 text-2xl font-extrabold text-text tracking-tight leading-tight">{p.title}</p>
                  <p className="mt-1 text-text-soft text-sm leading-relaxed">{p.desc}</p>
                </div>

                {/* Acción inferior */}
                <div className=" flex items-center justify-between">
                  <span className="text-[13px] font-bold text-primary">Saber más</span>
                  <div className="cursor-pointer w-10 h-10 rounded-2xl bg-white border border-border text-text flex items-center justify-center transition-all duration-300 shadow-sm group-hover:bg-primary group-hover:text-white group-hover:border-primary group-hover:shadow-primary/20">
                    <MdArrowOutward size={22} />
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
