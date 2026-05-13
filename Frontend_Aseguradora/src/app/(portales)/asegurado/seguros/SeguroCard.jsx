'use client';

import { useState } from 'react';
import { MdCheck, MdArrowForward } from 'react-icons/md';
import ModalCotizar from './ModalCotizar';
import { estiloTipo, formatearMoneda } from './data';

export default function SeguroCard({ producto }) {
  const [abierto, setAbierto] = useState(false);
  const tipoStyle = estiloTipo(producto.tipo_seguro);
  const Icon = tipoStyle.icon;

  const beneficios = (producto.limites_cobertura || '')
    .split(/[,;\n]/)
    .map((b) => b.trim())
    .filter(Boolean);

  return (
    <div className="bg-bg rounded-2xl border border-border flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
      <div className={`h-1.5 w-full ${tipoStyle.accentBg}`} />
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${tipoStyle.accentBg}`}>
              <Icon size={22} className={tipoStyle.accentText} />
            </div>
            <div>
              <h3 className="text-base font-bold text-text leading-tight">{producto.nombre}</h3>
              <p className={`text-xs font-medium ${tipoStyle.accentText}`}>{tipoStyle.tagline}</p>
            </div>
          </div>
        </div>

        {beneficios.length > 0 && (
          <ul className="flex flex-col gap-2">
            {beneficios.map((b, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-text-soft">
                <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-text-soft">
          <span className="px-2 py-0.5 rounded-full bg-bg-soft border border-border">
            Edad mínima: {producto.restricciones_edad}
          </span>
          {producto.tasas != null && Number(producto.tasas) > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-bg-soft border border-border">
              Tasa: {producto.tasas}%
            </span>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
          <div>
            <span className="text-xs text-text-soft block">Desde</span>
            <span className="text-xl font-bold text-text">
              {formatearMoneda(producto.prima_base)}
              <span className="text-xs font-normal text-text-soft"> /año</span>
            </span>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors"
            onClick={() => setAbierto(true)}
          >
            Cotizar <MdArrowForward size={15} />
          </button>
        </div>
      </div>

      {abierto && <ModalCotizar producto={producto} onClose={() => setAbierto(false)} />}
    </div>
  );
}
