import { useState } from 'react';
import { MdChevronRight, MdPictureAsPdf, MdAutorenew } from 'react-icons/md';
import { apiDownloadFile } from '@/lib/api';
import { ESTADO_STYLES, estiloTipo, formatearFecha, formatearMoneda } from './data';

export default function PolizaCard({ p, onVerDetalle, onRenovar }) {
  const [descargando, setDescargando] = useState(false);
  const tipoStyle = estiloTipo(p.producto?.tipo_seguro);
  const Icon = tipoStyle.icon;
  const est = ESTADO_STYLES[p.estado_poliza] || ESTADO_STYLES.PENDIENTE;

  const handleDescargar = async () => {
    setDescargando(true);
    try {
      await apiDownloadFile(`/mis-polizas/${p.id_poliza}/contrato`, `contrato-poliza-${p.id_poliza}.txt`);
    } catch (e) {
      alert(e.mensaje || 'No se pudo descargar el contrato');
    } finally {
      setDescargando(false);
    }
  };

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-start gap-4 flex-1 w-full">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
            <Icon size={22} className={tipoStyle.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-sm font-bold text-text">{p.producto?.nombre || 'Producto'}</span>
              <span
                className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              POL-{String(p.id_poliza).padStart(6, '0')} · {p.producto?.tipo_seguro}
            </p>
          </div>
        </div>

        <div className="flex gap-4 text-xs text-text-soft shrink-0 flex-wrap sm:flex-nowrap justify-between">
          <div className="text-center hidden md:block">
            <p className="text-text-soft">Vigencia inicio</p>
            <p className="font-semibold text-text mt-0.5">{formatearFecha(p.vigencia_inicio)}</p>
          </div>
          <div className="text-center">
            <p className="text-text-soft">Vigencia fin</p>
            <p className="font-semibold text-text mt-0.5">{formatearFecha(p.vigencia_fin)}</p>
          </div>
          <div className="text-center">
            <p className="text-text-soft">Prima</p>
            <p className="font-semibold text-text mt-0.5">{formatearMoneda(p.prima_total)}</p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0 justify-between sm:justify-end mt-2 sm:mt-0">
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            Ver detalle <MdChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
