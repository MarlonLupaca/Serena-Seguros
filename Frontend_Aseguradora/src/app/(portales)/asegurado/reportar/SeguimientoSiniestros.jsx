'use client';

import { useEffect, useState } from 'react';
import { MdTimeline, MdClose, MdHistory, MdInsertDriveFile, MdDownload, MdDelete } from 'react-icons/md';
import { apiGet, apiDelete, apiDownloadFile } from '@/lib/api';
import { formatearFecha } from './data';
import ModalConfirm from '../../componentsMain/ModalConfirm';

const ESTADO_BADGE = {
  REGISTRADO: 'bg-primary/10 text-primary',
  EN_REVISION: 'bg-amber-100 text-amber-700',
  DOCUMENTACION_PENDIENTE: 'bg-orange-100 text-orange-600',
  EN_EVALUACION: 'bg-sky-100 text-sky-700',
  PROVEEDOR_ASIGNADO: 'bg-indigo-100 text-indigo-700',
  LIQUIDACION_CALCULADA: 'bg-teal-100 text-teal-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-700',
  PENDIENTE_ACEPTACION: 'bg-fuchsia-100 text-fuchsia-700',
  PAGO_PROGRAMADO: 'bg-violet-100 text-violet-700',
  FINALIZADO: 'bg-slate-100 text-slate-700',
};

export default function SeguimientoSiniestros({ isStandalone }) {
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [siniestroSeleccionado, setSiniestroSeleccionado] = useState(null);

  useEffect(() => {
    apiGet('/mis-siniestros')
      .then((data) => setSiniestros(data || []))
      .catch(() => setSiniestros([]))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return <div className="p-4 text-sm text-text-soft text-center">Cargando tus casos...</div>;
  if (siniestros.length === 0) return null;

  return (
    <div className={isStandalone ? 'mb-5' : 'mt-8 pt-8 border-t border-border mb-5'}>
      {!isStandalone && <h3 className="text-lg font-bold text-text mb-4">Seguimiento de mis casos</h3>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {siniestros.map((sin) => (
          <div
            key={sin.id_siniestro}
            className="bg-bg rounded-2xl border border-border p-5 flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold bg-bg-soft px-2 py-1 rounded-md text-text-soft">
                  CASO #{String(sin.id_siniestro).padStart(6, '0')}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                    ESTADO_BADGE[sin.estado_resolucion] || 'bg-bg-soft text-text-soft'
                  }`}
                >
                  {sin.estado_resolucion}
                </span>
              </div>
              <p className="text-sm font-bold text-text">{sin.poliza_nombre}</p>
              <p className="text-xs text-text-soft mt-1">{sin.tipo_incidente}</p>
              <p className="text-xs text-text-soft mt-2">Reportado: {formatearFecha(sin.fecha_reporte)}</p>
            </div>

            <button
              onClick={() => setSiniestroSeleccionado(sin.id_siniestro)}
              className="mt-4 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs font-semibold"
            >
              <MdTimeline size={16} /> Ver línea de tiempo
            </button>
          </div>
        ))}
      </div>

      {siniestroSeleccionado && (
        <ModalLineaTiempo 
          id={siniestroSeleccionado} 
          onClose={() => setSiniestroSeleccionado(null)} 
          onUpdate={() => {
            setCargando(true);
            apiGet('/mis-siniestros').then((data) => setSiniestros(data || [])).finally(() => setCargando(false));
          }}
        />
      )}
    </div>
  );
}

import ChatObservaciones from '@/components/chat/ChatObservaciones';

function ModalLineaTiempo({ id, onClose, onUpdate }) {
  const [detalle, setDetalle] = useState(null);
  const [error, setError] = useState('');
  const [confirmacion, setConfirmacion] = useState(null);

  const cargar = () =>
    apiGet(`/mis-siniestros/${id}`)
      .then((data) => setDetalle(data))
      .catch((e) => setError(e.mensaje || 'No se pudo cargar el detalle'));

  useEffect(() => {
    let activo = true;
    apiGet(`/mis-siniestros/${id}`)
      .then((data) => activo && setDetalle(data))
      .catch((e) => activo && setError(e.mensaje || 'No se pudo cargar el detalle'));
    return () => {
      activo = false;
    };
  }, [id]);

  const eliminarDocumento = (idDocumento) => {
    setConfirmacion({
      mensaje: 'Eliminar esta evidencia? Esta accion no se puede deshacer.',
      accion: async () => {
        try {
          await apiDelete(`/mis-documentos/${idDocumento}`);
          await cargar();
        } catch (e) {
          setError(e.mensaje || 'No se pudo eliminar el documento');
        }
      },
    });
  };

  const aceptarPropuesta = async () => {
    try {
      await apiPost(`/mis-siniestros/${id}/aceptar`, {});
      await cargar();
      if (onUpdate) onUpdate();
    } catch (e) {
      setError(e.mensaje || 'No se pudo aceptar la propuesta');
    }
  };

  const eventos = detalle?.timeline || [];
  const documentos = detalle?.documentos || [];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <p className="font-bold text-text text-sm">Seguimiento de Caso #{String(id).padStart(6, '0')}</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={20} />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto">
          {error ? (
            <p className="text-center text-xs text-rose-500">{error}</p>
          ) : !detalle ? (
            <p className="text-center text-xs text-text-soft py-12">Cargando historial...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full min-h-[400px]">
              
              {/* Lado Izquierdo: Timeline y Documentos */}
              <div className="flex flex-col gap-5 lg:pr-8 lg:border-r border-border overflow-y-auto max-h-[600px] pr-2">
                <p className="text-[10px] font-bold text-text-soft uppercase tracking-widest mb-1">Línea de Tiempo</p>
                {eventos.length === 0 ? (
                  <div className="text-center py-6">
                    <MdHistory size={28} className="mx-auto text-text-soft opacity-40 mb-2" />
                    <p className="text-xs text-text-soft">Aun no hay movimientos registrados para este caso.</p>
                    <p className="text-[11px] text-text-soft mt-1">
                      Estado actual: <span className="font-semibold">{detalle.estado_resolucion}</span>
                    </p>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-border ml-3 flex flex-col gap-6">
                    {eventos.map((evento, idx) => (
                      <div key={idx} className="relative pl-6">
                        <span
                          className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-bg ${
                            idx === eventos.length - 1 ? 'bg-primary' : 'bg-text-soft'
                          }`}
                        />
                        <p className="text-xs font-bold text-text">{evento.accion}</p>
                        <p className="text-[10px] text-text-soft mb-1">
                          {formatearFecha(evento.fecha)}
                          {evento.autor ? ` · ${evento.autor}` : ''}
                        </p>
                        <p className="text-xs text-text-soft leading-relaxed">{evento.detalle}</p>
                      </div>
                    ))}
                  </div>
                )}

                {documentos.length > 0 && (
                  <div className="border-t border-border pt-4 mt-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">
                      Evidencias adjuntas ({documentos.length})
                    </p>
                    <div className="flex flex-col gap-2">
                      {documentos.map((doc) => (
                        <div
                          key={doc.id_documento}
                          className="flex items-center gap-2 p-2 rounded-lg border border-border bg-bg-soft"
                        >
                          <MdInsertDriveFile size={16} className="text-primary shrink-0" />
                          <p className="text-xs text-text flex-1 truncate">{doc.nombre_archivo}</p>
                          <button
                            onClick={() =>
                              apiDownloadFile(`/mis-documentos/${doc.id_documento}/archivo`, doc.nombre_archivo)
                            }
                            className="p-1 rounded hover:bg-bg text-text-soft"
                            title="Descargar"
                          >
                            <MdDownload size={14} />
                          </button>
                          <button
                            onClick={() => eliminarDocumento(doc.id_documento)}
                            className="p-1 rounded hover:bg-red-50 text-rose-500"
                            title="Eliminar"
                          >
                            <MdDelete size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {detalle.estado_resolucion === 'PENDIENTE_ACEPTACION' && (
                  <div className="border-t border-border pt-4 mt-2">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col gap-3">
                      <p className="text-sm font-bold text-emerald-800">Propuesta de Indemnización</p>
                      <p className="text-xs text-emerald-700">La aseguradora ha emitido una propuesta para liquidar este siniestro. Por favor revisa el detalle y si estas de acuerdo procede a aceptarla para que programemos el pago.</p>
                      <button 
                        onClick={aceptarPropuesta}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs transition-colors"
                      >
                        Aceptar Propuesta
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Lado Derecho: Chat y Observaciones */}
              <div className="flex flex-col h-[500px]">
                <ChatObservaciones 
                  tipoReferencia="SINIESTRO"
                  idReferencia={id}
                  isAdmin={false}
                />
              </div>

            </div>
          )}
        </div>
      </div>
      <ModalConfirm
        abierto={!!confirmacion}
        titulo="Confirmar eliminacion"
        mensaje={confirmacion?.mensaje}
        textoConfirmar="Eliminar"
        variante="danger"
        onConfirmar={confirmacion?.accion}
        onCancelar={() => setConfirmacion(null)}
      />
    </div>
  );
}
