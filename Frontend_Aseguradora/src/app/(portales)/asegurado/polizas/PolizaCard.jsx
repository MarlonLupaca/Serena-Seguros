import { useState } from 'react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { MdChevronRight, MdPictureAsPdf, MdAutorenew } from 'react-icons/md';
import { apiDownloadFile } from '@/lib/api';
import { ESTADO_STYLES, estiloTipo, formatearFecha, formatearMoneda } from './data';

export default function PolizaCard({ p, onVerDetalle, onRenovar }) {
  const [descargando, setDescargando] = useState(false);
  const tipoStyle = estiloTipo(p.producto?.tipo_seguro);
  const est = ESTADO_STYLES[p.estado_poliza] || ESTADO_STYLES.PENDIENTE;

  const handleDescargar = async () => {
    setDescargando(true);
    try {
      await apiDownloadFile(`/mis-polizas/${p.id_poliza}/contrato`, `contrato-poliza-${p.id_poliza}.txt`);
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo descargar el contrato');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
        {/* Información Principal */}
        <div className="lg:col-span-5 flex items-center gap-4">
          <Image src={tipoStyle.imagen} width={32} height={32} alt="" className="object-contain w-10 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-text truncate">{p.producto?.nombre || 'Producto'}</span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
            </div>
            <p className="text-xs text-text-soft mt-1">
              POL-{String(p.id_poliza).padStart(6, '0')} · {p.producto?.tipo_seguro}
            </p>
          </div>
        </div>

        {/* Detalles (Vigencia / Prima) */}
        <div className="lg:col-span-4 grid grid-cols-2 md:grid-cols-3 gap-3 text-xs border-y sm:border-y-0 sm:border-x border-border/50 py-3 sm:py-0 px-0 sm:px-4">
          <div className="hidden md:block">
            <p className="text-text-soft">Vigencia inicio</p>
            <p className="font-semibold text-text mt-0.5">{formatearFecha(p.vigencia_inicio)}</p>
          </div>
          <div>
            <p className="text-text-soft">Vigencia fin</p>
            <p className="font-semibold text-text mt-0.5">{formatearFecha(p.vigencia_fin)}</p>
          </div>
          <div>
            <p className="text-text-soft">Prima total</p>
            <p className="font-semibold text-text mt-0.5">{formatearMoneda(p.prima_total)}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="lg:col-span-3 flex items-center gap-2 justify-start sm:justify-end">
          <button
            onClick={handleDescargar}
            disabled={descargando}
            className="p-2 rounded-xl border border-border text-text-soft hover:text-primary hover:bg-primary/5 transition-colors disabled:opacity-50"
            title="Descargar contrato"
          >
            <MdPictureAsPdf size={18} />
          </button>

          {(p.estado_poliza === 'VENCIDA' || p.estado_poliza === 'ACTIVA') && onRenovar && (
            <button
              className="p-2 rounded-xl border border-border text-text-soft hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Renovar poliza"
              onClick={() => onRenovar(p)}
            >
              <MdAutorenew size={18} />
            </button>
          )}

          <button
            onClick={onVerDetalle}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Ver detalle <MdChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
