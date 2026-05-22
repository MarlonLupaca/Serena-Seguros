'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MdClose,
  MdCheckCircle,
  MdArrowForward,
  MdArrowBack,
  MdUploadFile,
  MdAttachFile,
  MdDeleteOutline,
  MdAdd,
  MdLock,
} from 'react-icons/md';
import Image from 'next/image';
import { apiGet, apiPost, apiUploadFile } from '@/lib/api';
import FormularioRiesgo from '@/components/riesgo/FormularioRiesgo';
import { valoresIniciales, validarCampos } from '@/lib/riesgo/camposPorTipo';
import { estiloTipo, formatearMoneda } from './data';

const PASOS = [
  'Datos del riesgo',
  'Cotizacion preliminar',
  'Propuesta formal',
  'Beneficiarios',
  'Documentos y declaracion',
  'Pago 1.ra cuota',
  'Confirmacion',
];

export default function ModalCotizar({ producto, onClose, prefill }) {
  const tipoStyle = estiloTipo(producto.tipo_seguro);

  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const [datosRiesgo, setDatosRiesgo] = useState(() => ({
    ...valoresIniciales(producto.tipo_seguro),
    ...(prefill?.datosRiesgo || {}),
  }));
  const [sumaAsegurada, setSumaAsegurada] = useState(prefill?.sumaAsegurada ? String(prefill.sumaAsegurada) : '');

  const [cotizacion, setCotizacion] = useState(prefill?.cotizacion || null);
  const [evaluacion, setEvaluacion] = useState(null);
  const [propuesta, setPropuesta] = useState(null);

  const [beneficiariosCatalogo, setBeneficiariosCatalogo] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([
    { id_beneficiario: null, nombres: '', apellidos: '', parentesco: '', documento_identidad: '', porcentaje: 100 },
  ]);

  const [documentos, setDocumentos] = useState([]);
  const [terminos, setTerminos] = useState(false);
  const [declaracion, setDeclaracion] = useState(false);

  const [polizaEmitida, setPolizaEmitida] = useState(null);
  const [cuotaPrincipal, setCuotaPrincipal] = useState(null);
  const [pagoConfirmado, setPagoConfirmado] = useState(false);

  useEffect(() => {
    apiGet('/perfil/beneficiarios')
      .then((res) => setBeneficiariosCatalogo(res || []))
      .catch(() => setBeneficiariosCatalogo([]));
  }, []);

  const sumaPorcentaje = useMemo(
    () => beneficiarios.reduce((acc, b) => acc + Number(b.porcentaje || 0), 0),
    [beneficiarios]
  );

  // ----- Step 1: Datos del riesgo y avance a cotizacion preliminar -----
  const irACotizacionPreliminar = async () => {
    const faltantes = validarCampos(producto.tipo_seguro, datosRiesgo);
    if (faltantes.length) {
      setError('Completa los campos obligatorios: ' + faltantes.join(', '));
      return;
    }
    if (!sumaAsegurada || Number(sumaAsegurada) <= 0) {
      setError('Indica una suma asegurada valida');
      return;
    }
    setCargando(true);
    setError('');
    try {
      let lead = cotizacion;
      if (!lead) {
        lead = await apiPost('/mis-cotizaciones', {
          producto_interes: producto.tipo_seguro,
          id_producto: producto.id_producto,
        });
        setCotizacion(lead);
      }
      const evalResp = await apiPost(`/mis-cotizaciones/${lead.id_cotizacion}/evaluacion`, {
        datos_riesgo: datosRiesgo,
        suma_asegurada: Number(sumaAsegurada),
      });
      setEvaluacion(evalResp);
      setPaso(2);
    } catch (e) {
      setError(e.mensaje || 'No se pudo registrar la evaluacion');
    } finally {
      setCargando(false);
    }
  };

  // ----- Step 2: solicitar propuesta formal -----
  const generarPropuesta = async (frecuencia = 'MENSUAL') => {
    if (!cotizacion) return;
    setCargando(true);
    setError('');
    try {
      const resp = await apiPost(`/mis-cotizaciones/${cotizacion.id_cotizacion}/propuesta`, {
        suma_asegurada: Number(sumaAsegurada),
        deducible: 250,
        frecuencia_pago: frecuencia,
        vigencia_meses: 12,
      });
      setPropuesta(resp);
      setPaso(3);
    } catch (e) {
      setError(e.mensaje || 'No se pudo generar la propuesta');
    } finally {
      setCargando(false);
    }
  };

  // ----- Step 4: beneficiarios -----
  const agregarBeneficiario = () =>
    setBeneficiarios((prev) => [
      ...prev,
      { id_beneficiario: null, nombres: '', apellidos: '', parentesco: '', documento_identidad: '', porcentaje: 0 },
    ]);
  const eliminarBeneficiario = (idx) => setBeneficiarios((prev) => prev.filter((_, i) => i !== idx));
  const cambiarBeneficiario = (idx, campo, valor) =>
    setBeneficiarios((prev) => prev.map((b, i) => (i === idx ? { ...b, [campo]: valor } : b)));

  const importarDesdeCatalogo = (idx, idBeneficiarioStr) => {
    const idBeneficiario = idBeneficiarioStr ? Number(idBeneficiarioStr) : null;
    const fuente = beneficiariosCatalogo.find((c) => c.id_beneficiario === idBeneficiario);
    if (!fuente) {
      cambiarBeneficiario(idx, 'id_beneficiario', null);
      return;
    }
    setBeneficiarios((prev) =>
      prev.map((b, i) =>
        i === idx
          ? {
              id_beneficiario: fuente.id_beneficiario,
              nombres: fuente.nombres,
              apellidos: fuente.apellidos,
              parentesco: fuente.parentesco,
              documento_identidad: fuente.documento_identidad || '',
              porcentaje: b.porcentaje || 100,
            }
          : b
      )
    );
  };

  // ----- Step 5: aceptar propuesta (emite poliza PENDIENTE) -----
  const aceptarPropuesta = async () => {
    if (!terminos || !declaracion) {
      setError('Debes aceptar terminos y declarar veracidad.');
      return;
    }
    if (!propuesta || !cotizacion) return;
    setCargando(true);
    setError('');
    try {
      const resp = await apiPost(`/mis-cotizaciones/${cotizacion.id_cotizacion}/aceptar`, {
        acepta_terminos: terminos,
        declaracion_veraz: declaracion,
      });
      setPolizaEmitida(resp);

      // designar beneficiarios
      try {
        await apiPost(`/mis-polizas/${resp.id_poliza}/beneficiarios`, {
          beneficiarios: beneficiarios.map((b) => ({
            id_beneficiario: b.id_beneficiario || null,
            nombres: b.nombres,
            apellidos: b.apellidos,
            parentesco: b.parentesco,
            documento_identidad: b.documento_identidad || null,
            porcentaje: Number(b.porcentaje),
          })),
        });
      } catch (eBen) {
        console.warn('No se pudieron designar beneficiarios', eBen);
      }

      // subir documentos
      if (documentos.length > 0) {
        for (const f of documentos) {
          try {
            const fd = new FormData();
            fd.append('archivo', f);
            fd.append('tabla_referencia', 'poliza');
            fd.append('id_referencia', String(resp.id_poliza));
            await apiUploadFile('/mis-documentos', fd);
          } catch (eFile) {
            console.warn('No se pudo subir', f.name, eFile);
          }
        }
      }

      // localizar la primera cuota
      try {
        const cuotas = await apiGet('/mis-cuotas?estado=PENDIENTE');
        const primera = (cuotas || [])
          .filter((c) => c.id_poliza === resp.id_poliza)
          .sort((a, b) => a.numero_cuota - b.numero_cuota)[0];
        setCuotaPrincipal(primera);
      } catch (eCuotas) {
        console.warn('No se pudo cargar las cuotas', eCuotas);
      }
      setPaso(6);
    } catch (e) {
      setError(e.mensaje || 'No se pudo emitir la poliza');
    } finally {
      setCargando(false);
    }
  };

  // ----- Step 6: pagar primera cuota -----
  const pagarPrimeraCuota = async () => {
    if (!cuotaPrincipal) return;
    setCargando(true);
    setError('');
    try {
      await apiPost(`/mis-cuotas/${cuotaPrincipal.id_cuota}/pagar`);
      setPagoConfirmado(true);
      setPaso(7);
    } catch (e) {
      setError(e.mensaje || 'No se pudo procesar el pago');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {paso > 1 && paso < 7 && (
              <button onClick={() => setPaso(paso - 1)} className="text-text-soft hover:text-text">
                <MdArrowBack size={20} />
              </button>
            )}
            <p className="text-sm font-bold text-text">
              Paso {paso}: {PASOS[paso - 1]}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={cargando}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft disabled:opacity-50"
          >
            <MdClose size={15} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 bg-bg-soft rounded-xl p-3 mb-4">
            <Image src={tipoStyle.imagen} width={20} height={20} alt="" className="object-contain w-10 rounded-xl" />

            <div>
              <p className="text-sm font-bold text-text">{producto.nombre}</p>
              <p className="text-xs text-text-soft">{producto.tipo_seguro}</p>
            </div>
          </div>

          {paso === 1 && (
            <div className="flex flex-col gap-4">
              <FormularioRiesgo tipoSeguro={producto.tipo_seguro} valores={datosRiesgo} onChange={setDatosRiesgo} />
              <div>
                <label className="text-xs font-medium text-text-soft block mb-1.5">Suma asegurada deseada (S/) *</label>
                <input
                  type="number"
                  min="0"
                  value={sumaAsegurada}
                  onChange={(e) => setSumaAsegurada(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  placeholder="Ej: 50000"
                />
              </div>
              <button
                onClick={irACotizacionPreliminar}
                disabled={cargando}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                {cargando ? 'Evaluando riesgo...' : 'Calcular cotizacion preliminar'} <MdArrowForward size={16} />
              </button>
            </div>
          )}

          {paso === 2 && (
            <div className="flex flex-col gap-4">
              <div className="bg-bg-soft rounded-xl p-4 border border-border">
                <p className="text-xs text-text-soft mb-1">Factor de riesgo aplicado</p>
                <p className="text-2xl font-bold text-text">x {evaluacion?.factor_riesgo}</p>
                <p className="text-xs text-text-soft mt-1">Calculado a partir de los datos del riesgo declarados.</p>
              </div>
              <p className="text-sm text-text-soft">
                Selecciona la frecuencia de pago para generar la propuesta formal:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {['MENSUAL', 'TRIMESTRAL', 'ANUAL', 'UNICO'].map((f) => (
                  <button
                    key={f}
                    onClick={() => generarPropuesta(f)}
                    disabled={cargando}
                    className="px-3 py-3 rounded-xl border border-border hover:border-primary hover:bg-primary/5 text-sm font-semibold text-text transition-colors disabled:opacity-50"
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {paso === 3 && propuesta && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <Resumen label="Prima calculada" valor={formatearMoneda(propuesta.prima_calculada)} />
                <Resumen label="Suma asegurada" valor={formatearMoneda(propuesta.suma_asegurada)} />
                <Resumen label="Deducible" valor={formatearMoneda(propuesta.deducible)} />
                <Resumen
                  label="Pagos"
                  valor={`${propuesta.numero_cuotas} ${propuesta.frecuencia_pago.toLowerCase()}`}
                />
                <Resumen label="Vigencia" valor={`${propuesta.vigencia_meses} meses`} />
                <Resumen label="Oferta valida hasta" valor={propuesta.valida_hasta} />
              </div>

              <div>
                <p className="text-sm font-bold text-text mb-2">Coberturas</p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left border-b border-border">
                        <th className="py-2 font-semibold text-text">Cobertura</th>
                        <th className="py-2 font-semibold text-text">Descripcion</th>
                        <th className="py-2 font-semibold text-text text-right">Limite</th>
                      </tr>
                    </thead>
                    <tbody>
                      {propuesta.coberturas.map((c, i) => (
                        <tr key={i} className="border-b border-border/50">
                          <td className="py-2 font-medium text-text">{c.nombre}</td>
                          <td className="py-2 text-text-soft">{c.descripcion}</td>
                          <td className="py-2 text-text text-right">
                            {c.limite ? formatearMoneda(c.limite) : 'Incluido'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {propuesta.exclusiones_texto && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <p className="font-semibold mb-1">Exclusiones</p>
                  <p>{propuesta.exclusiones_texto}</p>
                </div>
              )}

              <button
                onClick={() => setPaso(4)}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors"
              >
                Acepto avanzar con esta propuesta <MdArrowForward size={16} />
              </button>
            </div>
          )}

          {paso === 4 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-soft">
                Designa los beneficiarios de esta poliza. La suma de porcentajes debe ser exactamente 100%.
              </p>
              {beneficiarios.map((b, idx) => (
                <div key={idx} className="border border-border rounded-xl p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {beneficiariosCatalogo.length > 0 && (
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-text-soft block mb-1.5">
                        Importar desde mi perfil
                      </label>
                      <select
                        value={b.id_beneficiario || ''}
                        onChange={(e) => importarDesdeCatalogo(idx, e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                      >
                        <option value="">Crear uno nuevo</option>
                        {beneficiariosCatalogo.map((c) => (
                          <option key={c.id_beneficiario} value={c.id_beneficiario}>
                            {c.nombres} {c.apellidos} ({c.parentesco})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <input
                    placeholder="Nombres"
                    value={b.nombres}
                    onChange={(e) => cambiarBeneficiario(idx, 'nombres', e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  />
                  <input
                    placeholder="Apellidos"
                    value={b.apellidos}
                    onChange={(e) => cambiarBeneficiario(idx, 'apellidos', e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  />
                  <input
                    placeholder="Parentesco"
                    value={b.parentesco}
                    onChange={(e) => cambiarBeneficiario(idx, 'parentesco', e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  />
                  <input
                    placeholder="Documento (opcional)"
                    value={b.documento_identidad}
                    onChange={(e) => cambiarBeneficiario(idx, 'documento_identidad', e.target.value)}
                    className="px-3 py-2 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  />
                  <div>
                    <label className="text-xs font-medium text-text-soft block mb-1.5">Porcentaje</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={b.porcentaje}
                      onChange={(e) => cambiarBeneficiario(idx, 'porcentaje', Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                    />
                  </div>
                  {beneficiarios.length > 1 && (
                    <button
                      onClick={() => eliminarBeneficiario(idx)}
                      className="md:col-span-2 flex items-center justify-center gap-1 py-2 rounded-xl border border-rose-200 text-rose-500 text-xs font-semibold hover:bg-rose-50"
                    >
                      <MdDeleteOutline size={14} /> Quitar beneficiario
                    </button>
                  )}
                </div>
              ))}
              <div className="flex justify-between items-center">
                <button
                  onClick={agregarBeneficiario}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-sm font-semibold text-text"
                >
                  <MdAdd size={16} /> Agregar beneficiario
                </button>
                <p className={`text-sm font-bold ${sumaPorcentaje === 100 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  Suma: {sumaPorcentaje}%
                </p>
              </div>
              <button
                onClick={() => setPaso(5)}
                disabled={sumaPorcentaje !== 100}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                Continuar
              </button>
            </div>
          )}

          {paso === 5 && (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm font-bold text-text mb-2">Documentos requeridos</p>
                <label className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-bg-soft transition-colors cursor-pointer">
                  <MdUploadFile size={24} className="text-primary" />
                  <p className="text-xs text-text font-medium">
                    {documentos.length > 0 ? 'Agregar mas archivos' : 'Sube DNI, recibo de servicios u otros'}
                  </p>
                  <p className="text-[11px] text-text-soft text-center">PDF, JPG, PNG · Maximo 10 MB por archivo</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*,.pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const nuevos = Array.from(e.target.files || []).filter((f) => f.size < 10 * 1024 * 1024);
                      setDocumentos((prev) => [...prev, ...nuevos]);
                      e.target.value = '';
                    }}
                  />
                </label>
                {documentos.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {documentos.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-bg-soft"
                      >
                        <MdAttachFile size={14} className="text-primary shrink-0" />
                        <p className="text-xs text-text flex-1 truncate">{f.name}</p>
                        <button
                          onClick={() => setDocumentos((prev) => prev.filter((_, idx) => idx !== i))}
                          className="p-1 rounded hover:bg-rose-100 text-text-soft hover:text-rose-500"
                        >
                          <MdDeleteOutline size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declaracion}
                  onChange={(e) => setDeclaracion(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <p className="text-xs text-text-soft leading-relaxed">
                  Declaro que toda la informacion entregada es veraz (principio de buena fe).
                </p>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={terminos}
                  onChange={(e) => setTerminos(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                />
                <p className="text-xs text-text-soft leading-relaxed">
                  Acepto los terminos, condiciones y exclusiones de la propuesta.
                </p>
              </label>
              <button
                onClick={aceptarPropuesta}
                disabled={cargando || !terminos || !declaracion}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                {cargando ? 'Emitiendo poliza...' : 'Aceptar y emitir poliza'} <MdArrowForward size={16} />
              </button>
            </div>
          )}

          {paso === 6 && polizaEmitida && (
            <div className="flex flex-col gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <p className="text-sm font-bold text-emerald-800">
                  Poliza POL-{String(polizaEmitida.id_poliza).padStart(6, '0')} emitida
                </p>
                <p className="text-xs text-emerald-700 mt-1">
                  Estado actual: <span className="font-semibold">{polizaEmitida.estado_poliza}</span>. Se activara al
                  pagar la primera cuota.
                </p>
              </div>
              {cuotaPrincipal ? (
                <div className="bg-bg-soft rounded-xl p-4 border border-border">
                  <p className="text-xs text-text-soft">Primera cuota</p>
                  <p className="text-2xl font-bold text-text mt-1">{formatearMoneda(cuotaPrincipal.monto)}</p>
                  <p className="text-xs text-text-soft mt-1">
                    Vence: <span className="font-semibold text-text">{cuotaPrincipal.fecha_vencimiento}</span>
                  </p>
                </div>
              ) : (
                <p className="text-xs text-text-soft">
                  No se encontro la cuota inicial. Puedes pagarla luego desde la seccion Pagos.
                </p>
              )}
              <button
                onClick={pagarPrimeraCuota}
                disabled={cargando || !cuotaPrincipal}
                className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                {cargando ? (
                  'Procesando pago...'
                ) : (
                  <>
                    <MdLock size={14} /> Pagar y activar poliza
                  </>
                )}
              </button>
              <button
                onClick={() => setPaso(7)}
                className="w-full py-2.5 rounded-xl border border-border hover:bg-bg-soft text-text text-sm font-semibold"
              >
                Pagar mas tarde
              </button>
            </div>
          )}

          {paso === 7 && polizaEmitida && (
            <div className="p-2 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <MdCheckCircle size={32} className="text-emerald-600" />
              </div>
              <p className="text-xl font-bold text-text">{pagoConfirmado ? '¡Poliza activa!' : 'Poliza emitida'}</p>
              <p className="text-sm text-text-soft leading-relaxed">
                {pagoConfirmado
                  ? 'Tu poliza esta vigente. Revisa tus pagos y beneficiarios en Mis polizas.'
                  : 'Tu poliza fue emitida en estado PENDIENTE. Activa la cobertura pagando la primera cuota.'}
              </p>
              <div className="bg-bg-soft rounded-xl px-5 py-4 w-full mt-2">
                <Linea label="Poliza" val={`POL-${String(polizaEmitida.id_poliza).padStart(6, '0')}`} />
                <Linea label="Estado" val={pagoConfirmado ? 'ACTIVA' : polizaEmitida.estado_poliza} />
                <Linea label="Prima total" val={formatearMoneda(polizaEmitida.prima_total)} />
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-xl bg-bg border border-border hover:bg-bg-soft text-text text-sm font-semibold transition-colors"
              >
                Ir a mis polizas
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Resumen({ label, valor }) {
  return (
    <div className="bg-bg-soft rounded-xl p-3 border border-border">
      <p className="text-xs text-text-soft">{label}</p>
      <p className="text-sm font-bold text-text mt-1">{valor}</p>
    </div>
  );
}

function Linea({ label, val }) {
  return (
    <div className="flex justify-between items-center text-sm gap-3 py-1.5 border-b border-border/50 last:border-0">
      <span className="text-text-soft">{label}</span>
      <span className="font-bold text-text text-right">{val}</span>
    </div>
  );
}
