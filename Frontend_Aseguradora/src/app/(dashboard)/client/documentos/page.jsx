'use client';

import { useState } from 'react';
import ListaDocumentos from './ListaDocumentos';
import DetalleDocumento from './DetalleDocumento';
import ModalSubida from './ModalSubida';
import { TIPO_CONFIG } from './data';

export default function ModuloDocumentos() {
  const [selected, setSelected] = useState(null);
  const [modalSubida, setModalSubida] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div>
        <div className="px-8 py-5">
          <div className="">
            {/* Título */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-xl font-bold text-text leading-tight">
                    {selected ? selected.nombre : 'Mis documentos'}
                  </h1>
                  <p className="text-sm text-text-soft mt-0.5">
                    {selected
                      ? `${selected.polizaLabel}${selected.siniestroId ? ` · ${selected.siniestroId}` : ''}`
                      : 'Consulta y descarga todos los archivos de tus seguros.'}
                  </p>
                </div>
              </div>
              {selected && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${TIPO_CONFIG[selected.tipo].badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${TIPO_CONFIG[selected.tipo].dot}`} />
                  {TIPO_CONFIG[selected.tipo].label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-8 pb-8">
        {selected ? (
          <DetalleDocumento doc={selected} onBack={() => setSelected(null)} />
        ) : (
          <ListaDocumentos onSelect={setSelected} onSubir={() => setModalSubida(true)} />
        )}
      </div>

      {/* Modal subida */}
      {modalSubida && <ModalSubida onClose={() => setModalSubida(false)} />}
    </div>
  );
}
