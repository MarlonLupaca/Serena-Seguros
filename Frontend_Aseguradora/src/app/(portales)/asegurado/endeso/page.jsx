'use client';

import { useEffect, useState } from 'react';
import {
  MdShield,
  MdAdd,
  MdSend,
  MdClose,
  MdCalendarToday,
  MdEdit,
} from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';

const ESTADO_BADGE = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-600',
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default function ModuloEndoso() {
  const [polizas, setPolizas] = useState([]);
  const [polizaSel, setPolizaSel] = useState(null);
  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    apiGet('/mis-polizas')
      .then((data) => setPolizas((data || []).filter((p) => p.estado_poliza !== 'CANCELADA')))
      .catch((e) => setError(e.mensaje || 'No se pudieron cargar las polizas'))
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => {
    if (!polizaSel) {
      setDetalle(null);
      return;
    }
    cargarDetalle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polizaSel]);

  const cargarDetalle = async () => {
    setCargandoDetalle(true);
    try {
      const data = await apiGet(`/mis-polizas/${polizaSel}`);
      setDetalle(data);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar el detalle');
    } finally {
      setCargandoDetalle(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-8">
      <div className="py-5">
        <p className="text-xl font-bold text-text leading-tight">Solicitar endoso</p>
        <p className="text-sm text-text-soft mt-0.5">Pide cambios en tu póliza: domicilio, vehículo, beneficiarios, etc.</p>
      </div>

      <div className="flex-1 w-full pb-8 flex flex-col gap-4">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">{error}</div>
        )}

        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
            Cargando pólizas...
          </div>
        ) : polizas.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center">
            <MdShield size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text">No tienes pólizas activas</p>
          </div>
        ) : (
          <>
            <div className="bg-bg rounded-2xl border border-border p-4 flex items-center gap-3 flex-wrap">
              <label className="text-xs font-medium text-text-soft">Póliza:</label>
              <select
                value={polizaSel || ''}
                onChange={(e) => setPolizaSel(e.target.value ? Number(e.target.value) : null)}
                className="flex-1 px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors min-w-0"
              >
                <option value="">Selecciona una póliza...</option>
                {polizas.map((p) => (
                  <option key={p.id_poliza} value={p.id_poliza}>
                    POL-{String(p.id_poliza).padStart(6, '0')} · {p.producto?.nombre} ({p.estado_poliza})
                  </option>
                ))}
              </select>
              {polizaSel && (
                <button
                  onClick={() => setModalAbierto(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                >
                  <MdAdd size={14} /> Nuevo endoso
                </button>
              )}
            </div>

            {polizaSel && (
              <div className="bg-bg rounded-2xl border border-border overflow-hidden">
                <div className="p-5 border-b border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-primary/10">
                    <MdEdit size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Endosos solicitados</p>
                    <p className="text-xs text-text-soft mt-0.5">
                      {detalle?.endosos?.length || 0} solicitudes
                    </p>
                  </div>
                </div>
                <div className="p-5">
                  {cargandoDetalle ? (
                    <p className="text-sm text-text-soft text-center py-4">Cargando...</p>
                  ) : !detalle?.endosos || detalle.endosos.length === 0 ? (
                    <p className="text-sm text-text-soft text-center py-4">
                      Aún no has solicitado endosos para esta póliza.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {detalle.endosos.map((e) => (
                        <div key={e.id_endoso} className="p-3 rounded-xl border border-border">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-text">{e.tipo_cambio}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_BADGE[e.estado_aprobacion] || 'bg-bg-soft text-text-soft'}`}
                            >
                              {e.estado_aprobacion}
                            </span>
                          </div>
                          <p className="text-xs text-text-soft mt-1">{e.descripcion_cambio}</p>
                          <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                            <MdCalendarToday size={11} /> {formatearFecha(e.fecha_solicitud)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modalAbierto && polizaSel && (
        <ModalEndoso
          idPoliza={polizaSel}
          onClose={() => setModalAbierto(false)}
          onCreado={() => {
            setModalAbierto(false);
            cargarDetalle();
          }}
        />
      )}
    </div>
  );
}

function ModalEndoso({ idPoliza, onClose, onCreado }) {
  const [tipoCambio, setTipoCambio] = useState('');
  const [descripcionCambio, setDescripcionCambio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost(`/mis-polizas/${idPoliza}/endosos`, {
        tipo_cambio: tipoCambio,
        descripcion_cambio: descripcionCambio,
      });
      onCreado();
    } catch (e) {
      setError(e.mensaje || 'No se pudo crear el endoso');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Solicitar endoso</p>
          <button
            onClick={onClose}
            disabled={enviando}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft disabled:opacity-50"
          >
            <MdClose size={15} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo de cambio</label>
            <input
              value={tipoCambio}
              onChange={(e) => setTipoCambio(e.target.value)}
              required
              maxLength={100}
              placeholder="Ej: Cambio de domicilio"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Descripción</label>
            <textarea
              value={descripcionCambio}
              onChange={(e) => setDescripcionCambio(e.target.value)}
              required
              rows={4}
              placeholder="Detalla el cambio que necesitas..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdSend size={13} /> {enviando ? 'Enviando...' : 'Enviar'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
