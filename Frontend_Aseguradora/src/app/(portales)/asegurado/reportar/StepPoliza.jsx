import Image from 'next/image';
import { MdCheck, MdShield } from 'react-icons/md';
import { estiloTipo } from './data';

export default function StepPoliza({ polizaId, onChange, polizas, cargando, error }) {
  if (cargando) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-6 text-sm text-text-soft text-center">
        Cargando tus pólizas...
      </div>
    );
  }
  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">{error}</div>;
  }
  if (!polizas || polizas.length === 0) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-8 text-center">
        <MdShield size={28} className="text-text-soft mx-auto mb-2 opacity-40" />
        <p className="text-sm font-medium text-text">No tienes pólizas activas</p>
        <p className="text-xs text-text-soft mt-1">
          Necesitas una póliza ACTIVA o PENDIENTE para reportar un siniestro.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-bg rounded-2xl border border-border p-5">
      <p className="text-sm font-bold text-text mb-1">¿Qué póliza se vio afectada?</p>
      <p className="text-xs text-text-soft mb-4">Selecciona la póliza relacionada con el incidente.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {polizas.map((p) => {
          const tipoStyle = estiloTipo(p.producto?.tipo_seguro);
          const sel = polizaId === p.id_poliza;
          return (
            <button
              key={p.id_poliza}
              onClick={() => onChange(p.id_poliza)}
              className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                sel
                  ? 'border-primary bg-primary/5 ring-1 ring-primary/20'
                  : 'border-border hover:border-primary/40 hover:bg-bg-soft'
              }`}
            >
              <Image src={tipoStyle.imagen} width={20} height={20} alt="" className="object-contain w-10 shrink-0 mt-0.5" />

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text leading-tight">{p.producto?.nombre}</p>
                <p className="text-[11px] text-text-soft mt-1">
                  POL-{String(p.id_poliza).padStart(6, '0')} · {p.producto?.tipo_seguro}
                </p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all mt-0.5 ${
                  sel ? 'border-primary bg-primary' : 'border-border'
                }`}
              >
                {sel && <MdCheck size={12} className="text-text-inverse" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
