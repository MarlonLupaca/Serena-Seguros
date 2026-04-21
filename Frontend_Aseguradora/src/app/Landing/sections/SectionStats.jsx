import { stats } from '../data';

export function SectionStats() {
  return (
    <section className=" relative z-10 pt-20 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-3xl shadow-[0_24px_64px_rgba(11,60,93,0.12)] border border-border grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {stats.map((s, i) => (
            <div key={i} className="py-8 px-4 text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-primary tracking-tight">{s.n}</div>
              <div className="text-sm text-text-soft mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
