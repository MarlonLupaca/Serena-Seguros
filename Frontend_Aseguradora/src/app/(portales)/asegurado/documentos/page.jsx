'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import ListaDocumentos from './ListaDocumentos';
import DetalleDocumento from './DetalleDocumento';
import ModalSubida from './ModalSubida';

export default function ModuloDocumentos() {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalSubida, setModalSubida] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-documentos');
      setDocumentos(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar tus documentos');
    } finally {
      setCargando(false);
    }
  };

  const onSubidaExitosa = async () => {
    setModalSubida(false);
    await cargar();
  };

  const onEliminado = async () => {
    setSelected(null);
    await cargar();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-8 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-text leading-tight">
              {selected ? selected.nombre_archivo : 'Mis documentos'}
            </h1>
            <p className="text-sm text-text-soft mt-0.5">
              {selected
                ? `${selected.tabla_referencia} #${selected.id_referencia}`
                : 'Consulta y descarga todos los archivos de tus seguros.'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full px-8 pb-8">
        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
            Cargando documentos...
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
            {error}
          </div>
        ) : selected ? (
          <DetalleDocumento
            doc={selected}
            documentos={documentos}
            onBack={() => setSelected(null)}
            onEliminado={onEliminado}
          />
        ) : (
          <ListaDocumentos
            documentos={documentos}
            onSelect={setSelected}
            onSubir={() => setModalSubida(true)}
          />
        )}
      </div>

      {modalSubida && (
        <ModalSubida onClose={() => setModalSubida(false)} onSuccess={onSubidaExitosa} />
      )}
    </div>
  );
}
