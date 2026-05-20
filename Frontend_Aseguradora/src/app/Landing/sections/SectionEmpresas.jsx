import Link from 'next/link';
import { MdArrowForward, MdBusiness, MdSecurity, MdPeople, MdHandshake } from 'react-icons/md';

const servicios = [
  {
    icon: MdSecurity,
    titulo: 'SCTR',
    desc: 'Seguro complementario de trabajo de riesgo, obligatorio para actividades de alto riesgo.',
  },
  {
    icon: MdPeople,
    titulo: 'EPS Corporativa',
    desc: 'Planes de salud para tus colaboradores con las mejores clinicas del pais.',
  },
  {
    icon: MdHandshake,
    titulo: 'Responsabilidad Civil',
    desc: 'Proteccion ante reclamos de terceros por danos causados por tu empresa.',
  },
  {
    icon: MdBusiness,
    titulo: 'Multiriesgo Negocio',
    desc: 'Cobertura integral para locales comerciales, oficinas e inventario.',
  },
];

export function SectionEmpresas() {
  return (
    <section id="empresas" className="py-24 md:py-32 px-6 bg-bg-soft">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">
            Para empresas
          </span>
          <p className="mt-2 text-3xl md:text-[42px] font-extrabold tracking-tight text-text leading-tight">
            Seguros corporativos a la medida de tu negocio
          </p>
          <p className="mt-4 text-lg text-text-soft leading-relaxed">
            Desde microempresas hasta grandes corporaciones, protegemos tu patrimonio, tus empleados y tus operaciones.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicios.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.titulo}
                className="group flex flex-col bg-white rounded-2xl border border-border p-7 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(11,60,93,0.10)] hover:border-primary/25 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={24} className="text-primary" />
                </div>
                <p className="font-bold text-base text-text">{s.titulo}</p>
                <p className="mt-2 text-sm text-text-soft leading-relaxed grow">{s.desc}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/empresas"
            className="inline-flex items-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
          >
            Ver todos los seguros empresariales <MdArrowForward size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
