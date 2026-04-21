import Image from 'next/image';
import Link from 'next/link';
import { FaApple, FaGooglePlay } from 'react-icons/fa';

export function SectionAppCTA() {
  return (
    <section className="pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-4xl bg-linear-to-br from-bg-soft to-accent/20 text-white p-10 md:p-16 grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-text">Serena App</span>
            <p className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text leading-tight">
              Toda tu protección en la palma de tu mano
            </p>
            <div className="mt-8 flex flex-wrap gap-3 ">
              {[
                { Icon: FaApple, iSize: 24, label: 'Descarga en', sub: 'App Store' },
                { Icon: FaGooglePlay, iSize: 20, label: 'Disponible en', sub: 'Google Play' },
              ].map(({ Icon, iSize, label, sub }) => (
                <Link
                  key={sub}
                  href="#"
                  className="inline-flex items-center gap-3 bg-text border border-white/15 text-white px-5 py-3 rounded-2xl backdrop-blur transition-all"
                >
                  <Icon size={iSize} />
                  <span>
                    <div className="text-[10px] opacity-70 leading-none">{label}</div>
                    <div className="font-bold text-[15px] mt-0.5">{sub}</div>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <Image src="/img/celular.png" width={500} height={500} alt="celular" className="h-110 object-contain" />
        </div>
      </div>
    </section>
  );
}
