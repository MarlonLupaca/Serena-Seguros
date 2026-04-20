import { MdArrowForward } from 'react-icons/md';

export default function InsuranceCTA() {
  return (
    <div className="bg-linear-to-r from-primary to-text rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <h3 className="text-base font-bold text-text-inverse mb-1">¿No sabes cuál elegir?</h3>
        <p className="text-sm text-white/75">Un asesor te ayuda a encontrar el plan perfecto para ti, sin costo.</p>
      </div>
      <button className="shrink-0 px-5 py-2.5 rounded-xl bg-bg hover:bg-bg-soft text-primary text-sm font-semibold transition-colors flex items-center gap-2">
        Hablar con un asesor
        <MdArrowForward size={16} />
      </button>
    </div>
  );
}
