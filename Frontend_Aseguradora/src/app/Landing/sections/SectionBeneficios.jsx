import Image from 'next/image';
import { benefits } from '../data';

export function SectionBeneficios() {
  return (
    <section className="py-24 bg-bg-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Por qué elegirnos</span>
          <p className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text leading-tight">
            Una experiencia simple y confiable
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map((b) => {
            return (
              <div
                key={b.t}
                className="bg-white rounded-2xl border border-border p-7 text-center hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(11,60,93,0.08)] transition-all duration-300"
              >
                <Image
                  src={b.url}
                  height={500}
                  width={500}
                  alt={b.t}
                  className="h-13.75 object-contain w-fit mb-3 mx-auto"
                />
                <p className="font-bold text-text">{b.t}</p>
                <p className="mt-2 text-sm text-text-soft leading-relaxed">{b.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
