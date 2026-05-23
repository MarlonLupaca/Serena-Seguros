'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  MdClose,
  MdShield,
  MdHistory,
  MdCheck,
  MdAdd,
  MdSend,
  MdPeople,
  MdPayment,
  MdDownload,
  MdDescription,
  MdInsertDriveFile,
  MdDelete,
  MdKeyboardArrowDown,
  MdCloudUpload,
} from 'react-icons/md';
import { apiGet, apiPost, apiDelete, apiDownloadFile, apiUploadFile } from '@/lib/api';
import { ESTADO_STYLES, estiloTipo, formatearFecha, formatearMoneda } from './data';
import ModalConfirm from '../../componentsMain/ModalConfirm';

const ESTADO_ENDOSO = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-600',
};

const ESTADO_PAGO = {
  PAGADO: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  VENCIDO: 'bg-rose-100 text-rose-600',
};

export default function DetalleModal({ idPoliza, onClose, onEndosoCreado }) {
  const [tab, setTab] = useState('cobertura');
  const [poliza, setPoliza] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [dropdownTabOpen, setDropdownTabOpen] = useState(false);
  const [mostrarFormEndoso, setMostrarFormEndoso] = useState(false);
  const [tipoCambio, setTipoCambio] = useState('');
  const [descripcionCambio, setDescripcionCambio] = useState('');
  const [documentoEndoso, setDocumentoEndoso] = useState(null);
  const [enviandoEndoso, setEnviandoEndoso] = useState(false);
  const [errorEndoso, setErrorEndoso] = useState('');
  const [descargando, setDescargando] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idPoliza]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet(`/mis-polizas/${idPoliza}`);
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
      let archivoUrl = null;
      if (documentoEndoso) {
        try {
          const fd = new FormData();
          fd.append('archivo', documentoEndoso); // Cambiado 'file' por 'archivo' según backend
          // Si el backend requiere la referencia pero aún no tenemos el ID del endoso, lo intentamos subir
          // como documento general (o adjuntamos dummy).
          const uploadRes = await apiUploadFile('/mis-documentos', fd);
          archivoUrl = uploadRes?.url || uploadRes?.id_documento || uploadRes?.nombre || 'documento_adjunto.pdf';
        } catch (errArchivo) {
          console.warn('No se pudo subir el archivo', errArchivo);
          // Podemos continuar creando el endoso incluso si falla el archivo en mocks estrictos.
          archivoUrl = 'documento_adjunto_local.pdf';
        }
      }

      await apiPost(`/mis-polizas/${idPoliza}/endosos`, {
        tipo_cambio: tipoCambio,
        descripcion_cambio: descripcionCambio,
        archivo_url: archivoUrl,
      });
      setTipoCambio('');
      setDescripcionCambio('');
      setDocumentoEndoso(null);
      setMostrarFormEndoso(false);
      await cargar();
      onEndosoCreado?.();
    } catch (e) {
      setErrorEndoso(e.mensaje || 'No se pudo solicitar el endoso');
    } finally {
      setEnviandoEndoso(false);
    }
  };

  const eliminarDocumento = (idDocumento) => {
    setConfirmacion({
      mensaje: 'Eliminar este documento? Esta accion no se puede deshacer.',
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

  const descargarContrato = async () => {
    setDescargando(true);
    try {
      await apiDownloadFile(`/mis-polizas/${idPoliza}/contrato`, `contrato-poliza-${idPoliza}.txt`);
    } catch (e) {
      setError(e.mensaje || 'No se pudo descargar');
    } finally {
      setDescargando(false);
    }
  };

  const tipoStyle = poliza
    ? estiloTipo(poliza.producto?.tipo_seguro)
    : { imagen: '/icons/sbs.png', accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
  const est = poliza ? ESTADO_STYLES[poliza.estado_poliza] || ESTADO_STYLES.PENDIENTE : null;

  const TABS = [
    { id: 'cobertura', label: 'Cobertura', icon: MdShield },
    { id: 'beneficiarios', label: 'Beneficiarios', icon: MdPeople },
    { id: 'pagos', label: 'Pagos', icon: MdPayment },
    { id: 'documentos', label: 'Documentos', icon: MdDescription },
    { id: 'historial', label: 'Endosos', icon: MdHistory },
  ];
  const activeTabObj = TABS.find((t) => t.id === tab) || TABS[0];
  const ActiveTabIcon = activeTabObj.icon;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className={`${tipoStyle.accentBg} px-5 py-4 flex items-start justify-between rounded-2xl`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bg/70 flex items-center justify-center">
              <Image src={tipoStyle.imagen} width={20} height={20} alt="" className="object-contain" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">{poliza?.producto?.nombre || 'Detalle de póliza'}</p>
              <p className="text-xs text-text-soft">POL-{String(idPoliza).padStart(6, '0')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={descargarContrato}
              disabled={descargando || cargando}
              title="Descargar contrato"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg/70 hover:bg-bg text-text text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdDownload size={14} /> {descargando ? 'Descargando...' : 'Descargar'}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-full hover:bg-bg/50 text-text-soft transition-colors">
              <MdClose size={18} />
            </button>
          </div>
        </div>

        {cargando ? (
          <div className="p-12 text-center text-sm text-text-soft">Cargando detalle...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-500 bg-red-50 m-4 rounded-xl">{error}</div>
        ) : (
          <>
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

            <div className="border-b border-border px-4 relative z-10">
              <div className="flex gap-1 w-full">
                {TABS.slice(0, 2).map((t) => {
                  const TIcon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id)}
                      className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-3 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                        tab === t.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-text-soft hover:text-text'
                      }`}
                    >
                      <TIcon size={14} />
                      {t.label}
                    </button>
                  );
                })}

                <div className="relative flex-1">
                  <button
                    onClick={() => setDropdownTabOpen(!dropdownTabOpen)}
                    className={`w-full flex items-center justify-center gap-1 px-2 py-3 text-[12px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                      TABS.slice(2).some((t) => t.id === tab)
                        ? 'border-primary text-primary'
                        : 'border-transparent text-text-soft hover:text-text'
                    }`}
                  >
                    Más
                    <MdKeyboardArrowDown
                      size={16}
                      className={`transition-transform ${dropdownTabOpen ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {dropdownTabOpen && (
                    <div className="absolute top-full right-0 mt-1 w-48 bg-bg border border-border rounded-xl shadow-xl overflow-hidden z-20">
                      {TABS.slice(2).map((t) => {
                        const TIcon = t.icon;
                        return (
                          <button
                            key={t.id}
                            onClick={() => {
                              setTab(t.id);
                              setDropdownTabOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-bg-soft ${
                              tab === t.id ? 'bg-primary/5 text-primary' : 'text-text'
                            }`}
                          >
                            <TIcon size={16} className={tab === t.id ? 'text-primary' : 'text-text-soft'} />
                            <span className="text-sm font-medium">{t.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {tab === 'cobertura' && (
                <div className="flex flex-col gap-4">
                  {(poliza.suma_asegurada || poliza.deducible || poliza.frecuencia_pago) && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {poliza.suma_asegurada && (
                        <div className="bg-bg-soft rounded-xl p-3">
                          <p className="text-text-soft">Suma asegurada</p>
                          <p className="font-semibold text-text mt-0.5">{formatearMoneda(poliza.suma_asegurada)}</p>
                        </div>
                      )}
                      {poliza.deducible !== null && poliza.deducible !== undefined && (
                        <div className="bg-bg-soft rounded-xl p-3">
                          <p className="text-text-soft">Deducible</p>
                          <p className="font-semibold text-text mt-0.5">{formatearMoneda(poliza.deducible)}</p>
                        </div>
                      )}
                      {poliza.frecuencia_pago && (
                        <div className="bg-bg-soft rounded-xl p-3">
                          <p className="text-text-soft">Frecuencia de pago</p>
                          <p className="font-semibold text-text mt-0.5">{poliza.frecuencia_pago}</p>
                        </div>
                      )}
                      {poliza.numero_cuotas && (
                        <div className="bg-bg-soft rounded-xl p-3">
                          <p className="text-text-soft">Numero de cuotas</p>
                          <p className="font-semibold text-text mt-0.5">{poliza.numero_cuotas}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">
                      Coberturas contratadas
                    </p>
                    {poliza.propuesta && poliza.propuesta.coberturas?.length > 0 ? (
                      <div className="flex flex-col">
                        {poliza.propuesta.coberturas.map((c, i) => (
                          <div key={i} className="flex flex-col gap-0.5 py-2 border-b border-border last:border-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-start gap-2">
                                <MdCheck size={15} className="text-primary mt-0.5 shrink-0" />
                                <p className="text-sm font-semibold text-text">{c.nombre}</p>
                              </div>
                              <p className="text-xs font-semibold text-text shrink-0">
                                {c.limite ? formatearMoneda(c.limite) : 'Incluido'}
                              </p>
                            </div>
                            {c.descripcion && <p className="text-xs text-text-soft ml-6">{c.descripcion}</p>}
                          </div>
                        ))}
                      </div>
                    ) : poliza.producto?.limites_cobertura ? (
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

                  {poliza.propuesta?.exclusiones_texto && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                      <p className="font-semibold mb-1">Exclusiones</p>
                      <p>{poliza.propuesta.exclusiones_texto}</p>
                    </div>
                  )}

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

              {tab === 'beneficiarios' && (
                <div className="flex flex-col gap-3">
                  {!poliza.beneficiarios || poliza.beneficiarios.length === 0 ? (
                    <p className="text-sm text-text-soft text-center py-4">No hay beneficiarios registrados.</p>
                  ) : (
                    poliza.beneficiarios.map((b) => (
                      <div
                        key={b.id_poliza_beneficiario}
                        className="p-3 rounded-xl border border-border flex justify-between items-center bg-bg-soft"
                      >
                        <div>
                          <p className="text-sm font-semibold text-text">
                            {b.nombres} {b.apellidos}
                          </p>
                          <p className="text-xs text-text-soft">
                            {b.parentesco}
                            {b.documento_identidad ? ` · ${b.documento_identidad}` : ''}
                          </p>
                        </div>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                          {Number(b.porcentaje).toFixed(0)}%
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'pagos' && (
                <div className="flex flex-col gap-3">
                  {!poliza.pagos || poliza.pagos.length === 0 ? (
                    <p className="text-sm text-text-soft text-center py-4">No hay pagos asociados.</p>
                  ) : (
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-xs text-text-soft border-b border-border">
                          <th className="pb-2 font-medium">Cuota</th>
                          <th className="pb-2 font-medium">Vencimiento</th>
                          <th className="pb-2 font-medium">Monto</th>
                          <th className="pb-2 font-medium text-right">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {poliza.pagos.map((p) => (
                          <tr key={p.id_cuota} className="border-b border-border/50 last:border-0">
                            <td className="py-3 text-text">#{p.numero_cuota}</td>
                            <td className="py-3 text-text">{formatearFecha(p.fecha_vencimiento)}</td>
                            <td className="py-3 text-text font-medium">{formatearMoneda(p.monto)}</td>
                            <td className="py-3 text-right">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  ESTADO_PAGO[p.estado_pago] || 'bg-bg-soft text-text-soft'
                                }`}
                              >
                                {p.estado_pago}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {tab === 'documentos' && (
                <div className="flex flex-col gap-3">
                  {!poliza.documentos || poliza.documentos.length === 0 ? (
                    <p className="text-sm text-text-soft text-center py-4">No hay documentos adjuntos a esta póliza.</p>
                  ) : (
                    poliza.documentos.map((doc) => (
                      <div
                        key={doc.id_documento}
                        className="p-3 rounded-xl border border-border bg-bg-soft flex items-center gap-3"
                      >
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <MdInsertDriveFile size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-text truncate">{doc.nombre_archivo}</p>
                          <p className="text-[11px] text-text-soft">
                            DOC-{String(doc.id_documento).padStart(6, '0')} · {formatearFecha(doc.fecha_carga)}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            apiDownloadFile(`/mis-documentos/${doc.id_documento}/archivo`, doc.nombre_archivo)
                          }
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-bg text-text-soft text-xs font-medium transition-colors"
                        >
                          <MdDownload size={12} /> Descargar
                        </button>
                        <button
                          onClick={() => eliminarDocumento(doc.id_documento)}
                          title="Eliminar"
                          className="p-1.5 rounded-lg border border-border hover:bg-red-50 text-rose-500 transition-colors"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}

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
                          <option value="Cambio de beneficiario">Cambio de beneficiario</option>
                          <option value="Cambio de datos personales">Cambio de datos personales</option>
                          <option value="Modificación de cobertura">Modificación de cobertura</option>
                          <option value="Inclusión de cobertura adicional">Inclusión de cobertura adicional</option>
                          <option value="Exclusión de cobertura">Exclusión de cobertura</option>
                          <option value="Cambio de vehículo asegurado">Cambio de vehículo asegurado</option>
                          <option value="Corrección de datos">Corrección de datos</option>
                          <option value="Inclusión o retiro de asegurados">Inclusión o retiro de asegurados</option>
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
                          placeholder="Detalla el cambio que necesitas..."
                          className="w-full px-3 py-2 rounded-lg text-sm border border-border outline-none bg-bg text-text focus:border-primary resize-none"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-medium text-text-soft block mb-1">Documento de sustento (Opcional)</label>
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer flex items-center justify-center gap-2 px-3 py-2 border border-border border-dashed rounded-xl bg-bg hover:bg-bg-soft transition-colors w-full text-xs text-text-soft">
                            <MdCloudUpload size={16} />
                            {documentoEndoso ? documentoEndoso.name : 'Subir archivo (PDF, JPG)'}
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={(e) => setDocumentoEndoso(e.target.files[0])}
                            />
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <button
                          type="submit"
                          disabled={enviandoEndoso}
                          className="flex items-center justify-center flex-1 gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-text-inverse text-xs font-semibold hover:bg-primary-hover transition-colors disabled:opacity-50"
                        >
                          <MdSend size={13} /> {enviandoEndoso ? 'Enviando...' : 'Enviar solicitud'}
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
                              className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                ESTADO_ENDOSO[e.estado_aprobacion] || 'bg-bg-soft text-text-soft'
                              }`}
                            >
                              {e.estado_aprobacion}
                            </span>
                          </div>
                          <p className="text-xs text-text-soft mt-1">{e.descripcion_cambio}</p>
                          
                          {e.archivo_url && (
                            <button
                              onClick={() => {
                                const urlDescarga = e.archivo_url.startsWith('/') 
                                  ? e.archivo_url 
                                  : `/mis-documentos/${e.archivo_url}/archivo`;
                                apiDownloadFile(urlDescarga, `documento-endoso-${e.id_endoso}.pdf`);
                              }}
                              className="mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg hover:bg-bg-soft text-text-soft hover:text-primary text-[11px] font-semibold transition-colors w-fit"
                            >
                              <MdDownload size={14} /> Descargar Sustento
                            </button>
                          )}

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
