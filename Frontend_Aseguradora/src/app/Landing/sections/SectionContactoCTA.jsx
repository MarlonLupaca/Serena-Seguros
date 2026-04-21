import Link from 'next/link';
import { MdArrowForward, MdWhatsapp } from 'react-icons/md';

export function SectionContactoCTA() {
  return (
    <section id="contacto" className="py-20 bg-bg-soft">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">
          ¿Listo para empezar?
        </span>
        <h2 className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text">Cotiza tu seguro hoy</h2>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/cotizar"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-bold text-[15px] px-7 py-3.5 rounded-2xl transition-all"
          >
            Cotizar ahora <MdArrowForward size={18} />
          </Link>
          <Link
            href="#"
            className="inline-flex items-center gap-2 font-bold text-primary border border-primary rounded-2xl text-[15px] px-4 py-3.5"
          >
            <MdWhatsapp size={20} /> Escríbenos por WhatsApp
          </Link>
        </div>
      </div>
    </section>
  );
}
