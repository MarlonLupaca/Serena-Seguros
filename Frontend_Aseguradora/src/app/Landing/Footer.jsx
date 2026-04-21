import Link from 'next/link';
import { MdShield, MdLocationOn, MdEmail } from 'react-icons/md';
import { MdFacebook } from 'react-icons/md';
import { FaInstagram, FaLinkedin, FaYoutube, FaTiktok } from 'react-icons/fa';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-text text-white/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex items-center gap-2.5 min-w-0">
              <Image
                src="/img/logo.png"
                width={500}
                height={500}
                alt="logo"
                className="h-7 object-contain w-fit shrink-0"
              />

              <span
                className={`text-white font-bold text-[16px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden`}
              >
                Serena <span className="text-primary">Seguros</span>
              </span>
            </div>
          </div>
          <p className="text-sm leading-relaxed max-w-xs">
            Comprometidos con brindarte la mejor protección y tranquilidad para ti, tu familia y tu empresa.
          </p>
          <div className="flex items-center gap-2.5 mt-6">
            {[MdFacebook, FaInstagram, FaLinkedin, FaYoutube, FaTiktok].map((Ic, i) => (
              <Link
                key={i}
                href="#"
                className="w-9 h-9 rounded-full bg-white/8 hover:bg-primary hover:text-bg-deep text-white/70 flex items-center justify-center transition-colors duration-200"
              >
                <Ic size={15} />
              </Link>
            ))}
          </div>
        </div>

        {[
          { h: 'Seguros', items: ['Vehicular', 'Vida', 'Salud', 'SOAT', 'Viajes', 'Hogar', 'Mascotas'] },
          { h: 'Ayuda', items: ['Siniestros', 'Promociones', 'Red de clínicas', 'Pago en línea', 'Facturación'] },
          { h: 'Empresa', items: ['Sobre nosotros', 'Sostenibilidad', 'Trabaja con nosotros', 'Prensa'] },
        ].map((col) => (
          <div key={col.h}>
            <h4 className="font-bold text-white text-sm mb-4">{col.h}</h4>
            <ul className="space-y-2.5 text-sm">
              {col.items.map((it) => (
                <li key={it}>
                  <Link href="#" className="hover:text-primary transition-colors duration-200">
                    {it}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap items-center justify-between gap-4 text-xs text-white/50">
          <div className="flex flex-wrap items-center gap-5">
            <span className="flex items-center gap-1.5">
              <MdLocationOn size={13} /> Av. Juan de Arona 830, San Isidro, Lima
            </span>
            <span className="flex items-center gap-1.5">
              <MdEmail size={13} /> contacto@serenaseguros.pe
            </span>
          </div>
          <span>&copy; {new Date().getFullYear()} Serena Seguros. Todos los derechos reservados.</span>
        </div>
      </div>
    </footer>
  );
}
