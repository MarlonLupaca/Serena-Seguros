'use client';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { apiGet, apiPatch, apiDownloadFile } from '@/lib/api';
import ModalDetalleEndoso from '../../componentsMain/ModalDetalleEndoso';
import { MdAttachMoney, MdCheck } from 'react-icons/md';

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function FinanzasEndososPage() {
  const [endosos, setEndosos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [actualizando, setActualizando] = useState(null);
  const [diferenciaPrima, setDiferenciaPrima] = useState({});

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    try {
      const data = await apiGet('/endosos?estado=EN_REVISION_FINANZAS');
      setEndosos(data || []);
    } catch (e) {
      toast.error('Error al cargar endosos en revisión financiera');
    } finally {
      setCargando(false);
    }
  };

  const aprobarConCosto = async (id) => {
    const costo = diferenciaPrima[id] || 0;
    if (!costo && costo !== 0) {
      toast.error('Por favor ingresa el recálculo de la prima');
      return;
    }
    setActualizando(id);
    try {
      // Idealmente el backend guardaría la diferencia de prima también
      await apiPatch(`/endosos/${id}/estado`, { estado_aprobacion: 'APROBADO', costo_adicional: Number(costo) });
      toast.success(`Endoso aprobado con recálculo exitoso`);
      cargar();
    } catch (e) {
      toast.error('Error al actualizar');
    } finally {
      setActualizando(null);
    }
  };

  const rechazar = async (id) => {
    setActualizando(id);
    try {
      await apiPatch(`/endosos/${id}/estado`, { estado_aprobacion: 'RECHAZADO' });
      toast.success(`Endoso rechazado`);
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
        <h1 className="text-base font-bold text-text">Recálculo de Primas (Endosos)</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Endosos derivados por el área técnica que requieren recálculo económico.
        </p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando solicitudes...
        </div>
      ) : endosos.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdAttachMoney size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay endosos pendientes de recálculo</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {endosos.map((e) => (
            <EndosoCardFinanzas
              key={e.id_endoso}
              endoso={e}
              actualizando={actualizando === e.id_endoso}
              diferenciaPrima={diferenciaPrima[e.id_endoso]}
              setDiferenciaPrima={(val) => setDiferenciaPrima({ ...diferenciaPrima, [e.id_endoso]: val })}
              onAprobarConCosto={() => aprobarConCosto(e.id_endoso)}
              onRechazar={() => rechazar(e.id_endoso)}
              onDescargar={() => descargarDoc(e.archivo_url, e.id_endoso)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function EndosoCardFinanzas({
  endoso,
  actualizando,
  diferenciaPrima,
  setDiferenciaPrima,
  onAprobarConCosto,
  onRechazar,
  onDescargar,
}) {
  const [modalAbierto, setModalAbierto] = useState(false);

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="h-1 w-full bg-purple-400" />
      <div className="p-5 flex flex-col md:flex-row md:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">{endoso.tipo_cambio}</p>
            <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
              EN REVISIÓN FINANZAS
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

        <div className="flex flex-col gap-3 shrink-0 w-full md:w-64 pt-3 md:pt-0 md:border-l md:border-border md:pl-4 bg-bg-soft md:bg-transparent rounded-xl md:rounded-none p-3 md:p-0">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-text-soft">Diferencia de prima (S/)</label>
            <input
              type="number"
              placeholder="Ej. 150.00"
              value={diferenciaPrima || ''}
              onChange={(ev) => setDiferenciaPrima(ev.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium border border-border outline-none bg-bg text-text focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <button
              onClick={onAprobarConCosto}
              disabled={actualizando}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50 w-full"
            >
              <MdCheck size={14} /> Aprobar endoso
            </button>
          </div>
        </div>
      </div>

      <ModalDetalleEndoso
        abierto={modalAbierto}
        onClose={() => setModalAbierto(false)}
        endoso={endoso}
        onDescargar={onDescargar}
        extraInfo={
          <div className="flex flex-col gap-2 mt-4">
            <label className="text-[11px] font-semibold text-text-soft">Diferencia de prima (S/)</label>
            <input
              type="number"
              placeholder="Ej. 150.00"
              value={diferenciaPrima || ''}
              onChange={(ev) => setDiferenciaPrima(ev.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm font-medium border border-border outline-none bg-bg text-text focus:border-primary"
            />
          </div>
        }
        acciones={
          <>
            <button
              onClick={() => {
                onRechazar();
                setModalAbierto(false);
              }}
              disabled={actualizando}
              className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Rechazar
            </button>
            <button
              onClick={() => {
                onAprobarConCosto();
                setModalAbierto(false);
              }}
              disabled={actualizando}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <MdCheck size={16} /> Aprobar endoso
            </button>
          </>
        }
      />
    </div>
  );
}
