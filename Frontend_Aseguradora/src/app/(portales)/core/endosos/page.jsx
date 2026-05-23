'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiGet, apiPatch, apiDownloadFile } from '@/lib/api';
import ModalDetalleEndoso from '../../componentsMain/ModalDetalleEndoso';
import { MdAttachMoney, MdCheck, MdEditNote } from 'react-icons/md';

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CoreEndososPage() {
  const [endosos, setEndosos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await apiGet('/endosos?estado=EN_REVISION_TECNICA');
      setEndosos(data || []);
    } catch (e) {
      toast.error('Error al cargar endosos en revisión técnica');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id, nuevo) => {
    setActualizando(id);
    try {
      await apiPatch(`/endosos/${id}/estado`, { estado_aprobacion: nuevo });
      toast.success(`Endoso actualizado a ${nuevo.replace(/_/g, ' ')}`);
      cargar();
    } catch (e) {
      toast.error('Error al actualizar');
    } finally {
      setActualizando(null);
    }
  };

  const descargarDoc = async (url, id) => {
    try {
      const urlDescarga = url.startsWith('/') ? url : `/mis-documentos/${url}/archivo`;
      await apiDownloadFile(urlDescarga, `documento-endoso-${id}.pdf`);
    } catch (e) {
      toast.error('No se pudo descargar el documento');
    }
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Revisión Técnica de Endosos</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Evalúa las solicitudes de modificación. Si afectan el costo, derívalos a Finanzas.
        </p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando solicitudes...
        </div>
      ) : endosos.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdEditNote size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay endosos pendientes de revisión técnica</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {endosos.map((e) => (
            <EndosoCardCore
              key={e.id_endoso}
              endoso={e}
              actualizando={actualizando === e.id_endoso}
              onCambiarEstado={(nuevo) => cambiarEstado(e.id_endoso, nuevo)}
              onDescargar={() => descargarDoc(e.archivo_url, e.id_endoso)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EndosoCardCore({ endoso, actualizando, onCambiarEstado, onDescargar }) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="h-1 w-full bg-indigo-400" />
      <div className="p-5 flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">{endoso.tipo_cambio}</p>
            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
              EN REVISIÓN TÉCNICA
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            END-{String(endoso.id_endoso).padStart(6, '0')} · POL-{String(endoso.id_poliza).padStart(6, '0')}
          </p>

          <button
            onClick={() => setModalAbierto(true)}
            className="mt-3 text-xs font-semibold text-primary hover:underline"
          >
            Ver todo el detalle
          </button>
        </div>

        <div className="flex flex-col gap-2 shrink-0 w-full md:w-56 pt-2 md:pt-0 md:border-l md:border-border md:pl-4">
          <button
            onClick={() => onCambiarEstado('APROBADO')}
            disabled={actualizando}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 w-full justify-center"
          >
            <MdCheck size={14} /> Aprobar (Sin impacto)
          </button>
          <button
            onClick={() => onCambiarEstado('EN_REVISION_FINANZAS')}
            disabled={actualizando}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 w-full justify-center"
          >
            <MdAttachMoney size={14} /> Derivar a Finanzas
          </button>
        </div>
      </div>

      <ModalDetalleEndoso
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        endoso={endoso}
        onDescargar={onDescargar}
        acciones={
          <>
            <button
              onClick={() => {
                onCambiarEstado('RECHAZADO');
                setModalAbierto(false);
              }}
              disabled={actualizando}
              className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Rechazar
            </button>
            <button
              onClick={() => {
                onCambiarEstado('OBSERVADO');
                setModalAbierto(false);
              }}
              disabled={actualizando}
              className="px-4 py-2 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Observar
            </button>
            <button
              onClick={() => {
                onCambiarEstado('EN_REVISION_FINANZAS');
                setModalAbierto(false);
              }}
              disabled={actualizando}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <MdAttachMoney size={16} /> A Finanzas
            </button>
            <button
              onClick={() => {
                onCambiarEstado('APROBADO');
                setModalAbierto(false);
              }}
              disabled={actualizando}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <MdCheck size={16} /> Aprobar
            </button>
          </>
        }
      />
    </div>
  );
}
