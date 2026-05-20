'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  MdArrowForward,
  MdPhoneInTalk,
  MdExpandMore,
  MdExpandLess,
  MdDirectionsCar,
  MdLocalHospital,
  MdHome,
  MdFavorite,
  MdFlight,
  MdDescription,
  MdCamera,
  MdAssignment,
} from 'react-icons/md';

const PASOS_DETALLE = [
  {
    numero: '01',
    titulo: 'Manten la calma y asegura el area',
    desc: 'Verifica que todas las personas involucradas esten bien. Si hay heridos, llama a emergencias (106). Asegura el area para evitar mas danos.',
    icon: MdAssignment,
  },
  {
    numero: '02',
    titulo: 'Documenta el siniestro',
    desc: 'Toma fotos del lugar, los danos, las placas de los vehiculos involucrados y cualquier evidencia. Obtén datos de testigos si los hay.',
    icon: MdCamera,
  },
  {
    numero: '03',
    titulo: 'Contactanos de inmediato',
    desc: 'Llama a nuestra central de emergencias al (01) 415-1515 disponible las 24 horas, o reporta tu siniestro desde el portal web.',
    icon: MdPhoneInTalk,
  },
  {
    numero: '04',
    titulo: 'Presenta tu documentacion',
    desc: 'Sube los documentos requeridos desde la app o el portal: denuncia policial, fotos, recibos medicos u otros segun el tipo de siniestro.',
    icon: MdDescription,
  },
  {
    numero: '05',
    titulo: 'Recibe tu solucion',
    desc: 'Asignamos taller, grua, clinica o el servicio que necesites. Hacemos seguimiento hasta la resolucion completa de tu caso.',
    icon: MdArrowForward,
  },
];

const TIPOS_SINIESTRO = [
  {
    icon: MdDirectionsCar,
    titulo: 'Vehicular',
    desc: 'Choques, volcaduras, robo de vehiculo, danos por terceros.',
    docs: ['Denuncia policial', 'Fotos del siniestro', 'Licencia de conducir', 'Tarjeta de propiedad'],
  },
  {
    icon: MdLocalHospital,
    titulo: 'Salud',
    desc: 'Emergencias medicas, hospitalizacion, cirugias.',
    docs: ['Informe medico', 'Recibos de gastos', 'Receta medica', 'DNI del asegurado'],
  },
  {
    icon: MdHome,
    titulo: 'Hogar',
    desc: 'Incendios, robos, danos por agua, desastres naturales.',
    docs: ['Denuncia policial (robo)', 'Fotos de los danos', 'Inventario de bienes', 'Presupuesto de reparacion'],
  },
  {
    icon: MdFavorite,
    titulo: 'Vida',
    desc: 'Fallecimiento, invalidez, enfermedades graves.',
    docs: ['Certificado de defuncion o diagnostico', 'DNI del beneficiario', 'Partida de nacimiento', 'Poliza original'],
  },
  {
    icon: MdFlight,
    titulo: 'Viaje',
    desc: 'Emergencias medicas en el extranjero, perdida de equipaje.',
    docs: ['Boletos de viaje', 'Informe medico del extranjero', 'Recibos de gastos', 'Reporte de la aerolinea (equipaje)'],
  },
];

const FAQS = [
  { q: 'Cuanto tiempo tengo para reportar un siniestro?', a: 'Debes reportar tu siniestro dentro de las 72 horas posteriores al evento. En caso de emergencia medica o vehicular, contactanos de inmediato.' },
  { q: 'Cuanto tarda la resolucion de un siniestro?', a: 'Depende del tipo y complejidad. Siniestros vehiculares simples se resuelven en 5-10 dias habiles. Casos complejos pueden tardar hasta 30 dias.' },
  { q: 'Puedo elegir mi taller o clinica?', a: 'Si, puedes elegir dentro de nuestra red de proveedores autorizados. Si prefieres uno externo, consulta con tu asesor.' },
  { q: 'Que pasa si no tengo todos los documentos?', a: 'Puedes iniciar el reporte con lo que tengas. Te daremos un plazo para completar la documentacion sin que afecte tu caso.' },
  { q: 'El deducible se paga siempre?', a: 'Si, el deducible aplica en cada siniestro segun tu poliza. Algunos planes premium no tienen deducible.' },
];

export default function SiniestrosPage() {
  const [faqOpen, setFaqOpen] = useState(null);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-bg-soft px-6 pt-20 pb-24">
        <div className="max-w-7xl mx-auto text-center">
          <span className="text-[11px] font-extrabold tracking-[0.15em] uppercase text-primary">
            Tuviste un siniestro?
          </span>
          <h1 className="mt-3 text-4xl md:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text">
            Estamos contigo las 24 horas
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-text-soft max-w-2xl mx-auto">
            Reporta tu caso en linea o llamanos. Nuestro equipo resolvera tu emergencia lo antes posible con atencion humana y tecnologia.
          </p>
          <div className="mt-8 flex justify-center flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              Reportar siniestro <MdArrowForward size={18} />
            </Link>
            <a
              href="tel:014151515"
              className="inline-flex items-center gap-2 bg-white border border-red-500 text-red-500 font-semibold text-[15px] px-7 py-3.5 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              <MdPhoneInTalk size={18} /> (01) 415 1515 — Emergencias
            </a>
          </div>
        </div>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" className="block w-full absolute -bottom-px" aria-hidden>
          <path d="M0,36 C360,80 1080,0 1440,42 L1440,72 L0,72 Z" fill="white" />
        </svg>
      </section>

      {/* Proceso paso a paso */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Proceso</span>
          <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Como reportar un siniestro
          </h2>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-5 gap-6">
            {PASOS_DETALLE.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.numero} className="flex flex-col p-6 bg-bg-soft rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-black text-primary">{p.numero}</span>
                    <Icon size={22} className="text-primary" />
                  </div>
                  <p className="font-bold text-text text-[15px] mb-2">{p.titulo}</p>
                  <p className="text-sm text-text-soft leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tipos de siniestro */}
      <section className="py-20 px-6 bg-bg-soft">
        <div className="max-w-7xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Tipos de siniestro</span>
          <h2 className="mt-2 text-3xl md:text-[38px] font-extrabold tracking-tight text-text leading-tight">
            Documentacion segun tu caso
          </h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TIPOS_SINIESTRO.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.titulo} className="bg-white rounded-2xl border border-border p-7">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <p className="font-bold text-text text-lg">{t.titulo}</p>
                  </div>
                  <p className="text-sm text-text-soft leading-relaxed mb-4">{t.desc}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Documentos necesarios:</p>
                  <ul className="space-y-1.5">
                    {t.docs.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-text-soft">
                        <MdDescription size={14} className="text-primary shrink-0 mt-0.5" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-[11px] font-extrabold tracking-[0.12em] uppercase text-primary">Preguntas frecuentes</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-text leading-tight mb-10">
            Dudas sobre siniestros
          </h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={i} className="bg-bg-soft rounded-xl border border-border overflow-hidden">
                <button
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left"
                >
                  <span className="font-semibold text-text text-[15px]">{f.q}</span>
                  {faqOpen === i ? (
                    <MdExpandLess size={22} className="text-primary shrink-0" />
                  ) : (
                    <MdExpandMore size={22} className="text-text-soft shrink-0" />
                  )}
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-5 text-sm text-text-soft leading-relaxed">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6 bg-bg-soft">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-text">
            Necesitas ayuda con un siniestro?
          </h2>
          <p className="mt-4 text-lg text-text-soft">
            Ingresa a tu portal para reportar tu caso o llama a nuestra central de emergencias.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              Reportar siniestro online <MdArrowForward size={18} />
            </Link>
            <a
              href="tel:014151515"
              className="inline-flex items-center gap-2 border border-red-500 text-red-500 font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
            >
              <MdPhoneInTalk size={18} /> (01) 415 1515
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
