import { MdStar } from 'react-icons/md';
import { testimonials } from '../data';

export function SectionTestimonios() {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Testimonios</span>
          <h2 className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text">
            Lo que dicen nuestros clientes
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl border border-border p-7 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MdStar key={i} size={18} className="text-yellow" />
                ))}
              </div>
              <p className="text-text-soft text-sm leading-relaxed">"{t.text}"</p>
              <div className="mt-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-extrabold text-white text-sm">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-sm text-text">{t.name}</div>
                  <div className="text-xs text-text-mute">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
