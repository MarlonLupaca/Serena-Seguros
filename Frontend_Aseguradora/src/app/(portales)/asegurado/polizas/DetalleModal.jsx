'use client';

import { useEffect, useState } from 'react';
import { MdClose, MdShield, MdHistory, MdCheck, MdAdd, MdSend, MdPeople, MdPayment } from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';
import { ESTADO_STYLES, estiloTipo, formatearFecha, formatearMoneda, mockDetallePolizaExtra } from './data';

const ESTADO_ENDOSO = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-600',
};

export default function DetalleModal({ idPoliza, onClose, onEndosoCreado }) {
  const [tab, setTab] = useState('cobertura');
  const [poliza, setPoliza] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarFormEndoso, setMostrarFormEndoso] = useState(false);
  const [tipoCambio, setTipoCambio] = useState('');
  const [descripcionCambio, setDescripcionCambio] = useState('');
  const [enviandoEndoso, setEnviandoEndoso] = useState(false);
  const [errorEndoso, setErrorEndoso] = useState('');

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPoliza]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      // Petición a tu API real
      const data = await apiGet(`/mis-polizas/${idPoliza}`);

      // Simulación de los datos que faltan en tu BD actualmente (Beneficiarios y Pagos)
      // Cuando tu backend devuelva esto, simplemente bórralo.
      data.beneficiarios = data.beneficiarios || mockDetallePolizaExtra.beneficiarios;
      data.pagos = data.pagos || mockDetallePolizaExtra.pagos;

      setPoliza(data);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar el detalle');
    } finally {
      setCargando(false);
    }
  };

  const enviarEndoso = async (e) => {
    e.preventDefault();
    setEnviandoEndoso(true);
    setErrorEndoso('');
    try {
      await apiPost(`/mis-polizas/${idPoliza}/endosos`, {
        tipo_cambio: tipoCambio,
        descripcion_cambio: descripcionCambio,
      });
      setTipoCambio('');
      setDescripcionCambio('');
      setMostrarFormEndoso(false);
      await cargar();
      onEndosoCreado?.();
    } catch (e) {
      setErrorEndoso(e.mensaje || 'No se pudo solicitar el endoso');
    } finally {
      setEnviandoEndoso(false);
    }
  };

  const tipoStyle = poliza
    ? estiloTipo(poliza.producto?.tipo_seguro)
    : { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
  const Icon = tipoStyle.icon;
  const est = poliza ? ESTADO_STYLES[poliza.estado_poliza] || ESTADO_STYLES.PENDIENTE : null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`${tipoStyle.accentBg} px-5 py-4 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bg/70 flex items-center justify-center">
              <Icon size={20} className={tipoStyle.accentText} />
            </div>
            <div>
              <p className="text-sm font-bold text-text">{poliza?.producto?.nombre || 'Detalle de póliza'}</p>
              <p className="text-xs text-text-soft">POL-{String(idPoliza).padStart(6, '0')}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-bg/50 text-text-soft transition-colors">
            <MdClose size={18} />
          </button>
        </div>

        {cargando ? (
          <div className="p-12 text-center text-sm text-text-soft">Cargando detalle...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-500 bg-red-50 m-4 rounded-xl">{error}</div>
        ) : (
          <>
            {/* Info rápida */}
            <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
              <div className="py-3 px-2">
                <p className="text-xs text-text-soft">Tipo</p>
                <p className="text-sm font-semibold mt-0.5 text-text">{poliza.producto?.tipo_seguro || '—'}</p>
              </div>
              <div className="py-3 px-2">
                <p className="text-xs text-text-soft">Prima</p>
                <p className="text-sm font-semibold mt-0.5 text-text">{formatearMoneda(poliza.prima_total)}</p>
              </div>
              <div className="py-3 px-2">
                <p className="text-xs text-text-soft">Estado</p>
                <p className="text-sm font-semibold mt-0.5">
                  <span className={`px-2 py-0.5 rounded-full text-xs ${est.badge}`}>{est.label}</span>
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border px-4 gap-1 overflow-x-auto">
              {[
                { id: 'cobertura', label: 'Cobertura', icon: MdShield },
                { id: 'beneficiarios', label: 'Beneficiarios', icon: MdPeople },
                { id: 'pagos', label: 'Pagos', icon: MdPayment },
                { id: 'historial', label: `Endosos`, icon: MdHistory },
              ].map((t) => {
                const TIcon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                      tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
                    }`}
                  >
                    <TIcon size={14} />
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto p-5">
              {/* TAB COBERTURA */}
              {tab === 'cobertura' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">Cobertura</p>
                    {poliza.producto?.limites_cobertura ? (
                      poliza.producto.limites_cobertura.split(',').map((c, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-2 text-sm text-text-soft py-1.5 border-b border-border last:border-0"
                        >
                          <MdCheck size={15} className="text-primary mt-0.5 shrink-0" />
                          {c.trim()}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-text-soft">Sin información de cobertura.</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                    <div className="bg-bg-soft rounded-xl p-3">
                      <p className="text-text-soft">Inicio vigencia</p>
                      <p className="font-semibold text-text mt-0.5">{formatearFecha(poliza.vigencia_inicio)}</p>
                    </div>
                    <div className="bg-bg-soft rounded-xl p-3">
                      <p className="text-text-soft">Fin vigencia</p>
                      <p className="font-semibold text-text mt-0.5">{formatearFecha(poliza.vigencia_fin)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB BENEFICIARIOS */}
              {tab === 'beneficiarios' && (
                <div className="flex flex-col gap-3">
                  {poliza.beneficiarios?.length === 0 ? (
                    <p className="text-sm text-text-soft text-center py-4">No hay beneficiarios registrados.</p>
                  ) : (
                    poliza.beneficiarios.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl border border-border flex justify-between items-center bg-bg-soft"
                      >
                        <div>
                          <p className="text-sm font-semibold text-text">{b.nombre}</p>
                          <p className="text-xs text-text-soft">{b.parentesco}</p>
                        </div>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                          {b.porcentaje}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB PAGOS ASOCIADOS */}
              {tab === 'pagos' && (
                <div className="flex flex-col gap-3">
                  {poliza.pagos?.length === 0 ? (
                    <p className="text-sm text-text-soft text-center py-4">No hay pagos asociados.</p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-xs text-text-soft border-b border-border">
                          <th className="pb-2 font-medium">Fecha</th>
                          <th className="pb-2 font-medium">Monto</th>
                          <th className="pb-2 font-medium text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poliza.pagos.map((p) => (
                          <tr key={p.id_pago} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-text">{formatearFecha(p.fecha)}</td>
                            <td className="py-3 text-text font-medium">{formatearMoneda(p.monto)}</td>
                            <td className="py-3 text-right">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.estado === 'PAGADO' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}
                              >
                                {p.estado}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* TAB HISTORIAL / ENDOSOS */}
              {tab === 'historial' && (
                <div className="flex flex-col gap-3">
                  {!mostrarFormEndoso && (
                    <button
                      onClick={() => setMostrarFormEndoso(true)}
                      className="self-start flex items-center gap-1.5 px-3 py-2 rounded-xl border border-primary text-primary text-xs font-semibold hover:bg-primary/5 transition-colors"
                    >
                      <MdAdd size={14} /> Solicitar endoso (cambio)
                    </button>
                  )}

                  {mostrarFormEndoso && (
                    <form
                      onSubmit={enviarEndoso}
                      className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-bg-soft"
                    >
                      {errorEndoso && (
                        <div className="p-2 text-xs bg-red-50 text-red-500 rounded-lg border border-red-100">
                          {errorEndoso}
                        </div>
                      )}
                      <div>
                        <label className="text-xs font-medium text-text-soft block mb-1">Tipo de cambio</label>
                        <select
                          value={tipoCambio}
                          onChange={(e) => setTipoCambio(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-lg text-sm border border-border outline-none bg-bg text-text focus:border-primary"
                        >
                          <option value="">Selecciona un tipo...</option>
                          <option value="Cambio de dirección">Cambio de dirección</option>
                          <option value="Inclusión de beneficiario">Inclusión de beneficiario</option>
                          <option value="Cambio de placa">Cambio de placa</option>
                          <option value="Otros">Otros</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-text-soft block mb-1">Descripción detallada</label>
                        <textarea
                          value={descripcionCambio}
                          onChange={(e) => setDescripcionCambio(e.target.value)}
                          required
                          rows={3}
                          placeholder="Detalla el cambio que necesitas (Ej: Nueva dirección es Av. Sol 123)..."
                          className="w-full px-3 py-2 rounded-lg text-sm border border-border outline-none bg-bg text-text focus:border-primary resize-none"
                        />
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          disabled={enviandoEndoso}
                          className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-text-inverse text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                          <MdSend size={13} /> {enviandoEndoso ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMostrarFormEndoso(false)}
                          disabled={enviandoEndoso}
                          className="flex-1 px-3 py-2.5 rounded-xl border border-border text-text-soft text-xs font-medium hover:bg-bg transition-colors disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                      </div>
                    </form>
                  )}

                  {(poliza.endosos || []).length === 0 && !mostrarFormEndoso ? (
                    <p className="text-sm text-text-soft text-center py-4 border border-dashed border-border rounded-xl mt-2">
                      Sin solicitudes de cambio recientes.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2 mt-2">
                      {poliza.endosos?.map((e) => (
                        <div key={e.id_endoso} className="p-3 rounded-xl border border-border">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-text">{e.tipo_cambio}</p>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${ESTADO_ENDOSO[e.estado_aprobacion] || 'bg-bg-soft text-text-soft'}`}
                            >
                              {e.estado_aprobacion}
                            </span>
                          </div>
                          <p className="text-xs text-text-soft mt-1">{e.descripcion_cambio}</p>
                          <p className="text-[10px] font-bold text-text-soft mt-2 uppercase">
                            Solicitado el {formatearFecha(e.fecha_solicitud)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
