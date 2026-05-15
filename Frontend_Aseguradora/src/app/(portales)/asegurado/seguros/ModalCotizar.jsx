'use client';

import { useState } from 'react';
import { MdClose, MdCheckCircle, MdArrowForward, MdArrowBack, MdUploadFile } from 'react-icons/md';
import {
  estiloTipo,
  formatearMoneda,
  mockSimulacionPlanes,
  mockContratacionExitosa,
  mockGuardarCotizacion,
} from './data';

export default function ModalCotizar({ producto, onClose }) {
  // Manejo de Pasos: 1 (Formulario), 2 (Planes), 3 (Contratar), 4 (Éxito)
  const [step, setStep] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  // Data del Formulario (Paso 2 del PDF)
  const [formData, setFormData] = useState({
    edad: '',
    direccion: '',
    vehiculo_modelo: '',
    cobertura_deseada: 'estandar',
    beneficiarios: '1',
  });

  // Data de la Simulación (Paso 3 del PDF)
  const [planes, setPlanes] = useState([]);
  const [planSeleccionado, setPlanSeleccionado] = useState(null);

  // Data de Contratación (Paso 4 del PDF)
  const [terminosAceptados, setTerminosAceptados] = useState(false);
  const [polizaGenerada, setPolizaGenerada] = useState(null);

  const tipoStyle = estiloTipo(producto.tipo_seguro);
  const Icon = tipoStyle.icon;

  // Acción: Simular planes
  const handleSimular = async () => {
    // Validaciones básicas antes de simular
    if (!formData.edad || (producto.tipo_seguro === 'VEHICULAR' && !formData.vehiculo_modelo)) {
      setError('Por favor, completa los datos obligatorios.');
      return;
    }
    setCargando(true);
    setError('');

    // Simulación del endpoint de simulación de planes
    setTimeout(() => {
      setPlanes(mockSimulacionPlanes);
      setStep(2);
      setCargando(false);
    }, 800);
  };

  // Acción: Guardar cotización
  const handleGuardarCotizacion = async () => {
    setCargando(true);

    // Simulación del endpoint para guardar la cotización
    setTimeout(() => {
      alert(`Éxito: ${mockGuardarCotizacion.mensaje} (ID: ${mockGuardarCotizacion.id_cotizacion})`);
      setCargando(false);
      onClose();
    }, 600);
  };

  // Acción: Contratar
  const handleContratar = async () => {
    if (!terminosAceptados) {
      setError('Debes aceptar los términos y condiciones.');
      return;
    }
    setCargando(true);
    setError('');

    // Simulación del endpoint de emisión de póliza final
    setTimeout(() => {
      setPolizaGenerada(mockContratacionExitosa);
      setStep(4);
      setCargando(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-bg rounded-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Cabecera */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            {step > 1 && step < 4 && (
              <button onClick={() => setStep(step - 1)} className="text-text-soft hover:text-text">
                <MdArrowBack size={20} />
              </button>
            )}
            <p className="text-sm font-bold text-text">
              {step === 1 && 'Paso 1: Datos para cotizar'}
              {step === 2 && 'Paso 2: Compara planes'}
              {step === 3 && 'Paso 3: Contratación'}
              {step === 4 && '¡Póliza Activa!'}
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

        {/* Contenedor scrolleable */}
        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {/* === PASO 1: FORMULARIO DE DATOS === */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 bg-bg-soft rounded-xl p-3 mb-2">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tipoStyle.accentBg}`}>
                  <Icon size={20} className={tipoStyle.accentText} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{producto.nombre}</p>
                  <p className="text-xs text-text-soft">{producto.tipo_seguro}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-text-soft block mb-1.5">Edad del asegurado *</label>
                  <input
                    type="number"
                    value={formData.edad}
                    onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                    placeholder="Ej: 30"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-text-soft block mb-1.5">Dirección / Distrito</label>
                  <input
                    type="text"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                    placeholder="Distrito de residencia"
                  />
                </div>

                {/* Campos Faltantes Agregados */}
                <div>
                  <label className="text-xs font-medium text-text-soft block mb-1.5">Cobertura deseada</label>
                  <select
                    value={formData.cobertura_deseada}
                    onChange={(e) => setFormData({ ...formData, cobertura_deseada: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  >
                    <option value="basica">Básica / Esencial</option>
                    <option value="estandar">Cobertura Estándar</option>
                    <option value="completa">Todo Riesgo</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-soft block mb-1.5">N° Beneficiarios</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.beneficiarios}
                    onChange={(e) => setFormData({ ...formData, beneficiarios: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                  />
                </div>

                {producto.tipo_seguro === 'VEHICULAR' && (
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-text-soft block mb-1.5">Modelo del Vehículo *</label>
                    <input
                      type="text"
                      value={formData.vehiculo_modelo}
                      onChange={(e) => setFormData({ ...formData, vehiculo_modelo: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm border border-border bg-bg text-text focus:border-primary outline-none"
                      placeholder="Ej: Toyota Yaris 2023"
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleSimular}
                disabled={cargando}
                className="mt-4 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                {cargando ? 'Calculando planes...' : 'Ver precios y planes'} <MdArrowForward size={16} />
              </button>
            </div>
          )}

          {/* === PASO 2: RESULTADOS Y COMPARACIÓN === */}
          {step === 2 && (
            <div className="flex flex-col gap-4">
              <p className="text-sm text-text-soft mb-2">Selecciona el plan que mejor se adapte a ti:</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {planes.map((plan) => (
                  <div
                    key={plan.id_plan}
                    onClick={() => setPlanSeleccionado(plan)}
                    className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                      planSeleccionado?.id_plan === plan.id_plan
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-border hover:border-text-soft bg-bg'
                    }`}
                  >
                    <p className="text-sm font-bold text-text">{plan.nombre}</p>
                    <p className="text-xl font-black text-text mt-2">
                      {formatearMoneda(plan.prima_mensual)}{' '}
                      <span className="text-xs font-normal text-text-soft">/mes</span>
                    </p>

                    <div className="mt-4 pt-4 border-t border-border flex flex-col gap-2">
                      <p className="text-xs text-text-soft">
                        <span className="font-semibold text-text">Cobertura:</span> {plan.cobertura}
                      </p>
                      <p className="text-xs text-text-soft">
                        <span className="font-semibold text-text">Deducible:</span> {plan.deducible}
                      </p>
                      <ul className="mt-2 flex flex-col gap-1">
                        {plan.beneficios.map((b, i) => (
                          <li key={i} className="text-[11px] text-text-soft flex items-start gap-1">
                            <MdCheckCircle size={12} className="text-emerald-500 shrink-0 mt-0.5" /> {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => setStep(3)}
                  disabled={!planSeleccionado}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
                >
                  Continuar con {planSeleccionado ? planSeleccionado.nombre : 'el plan'}
                </button>

                <button
                  onClick={handleGuardarCotizacion}
                  disabled={!planSeleccionado || cargando}
                  className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-border hover:bg-bg-soft disabled:opacity-50 text-text text-sm font-semibold transition-colors"
                >
                  Guardar cotización para después
                </button>
              </div>
            </div>
          )}

          {/* === PASO 3: CONTRATACIÓN (Documentos y Términos) === */}
          {step === 3 && (
            <div className="flex flex-col gap-5">
              <div className="bg-bg-soft rounded-xl p-4 border border-border">
                <p className="text-xs text-text-soft">Estás a punto de contratar:</p>
                <div className="flex justify-between items-end mt-1">
                  <p className="text-base font-bold text-text">
                    {producto.nombre} - {planSeleccionado.nombre}
                  </p>
                  <p className="text-lg font-bold text-text">
                    {formatearMoneda(planSeleccionado.prima_mensual)}{' '}
                    <span className="text-xs font-normal text-text-soft">/mes</span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-bold text-text mb-2">Adjuntar Documentos requeridos</p>
                <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-bg-soft transition-colors cursor-pointer">
                  <MdUploadFile size={24} className="text-text-soft" />
                  <p className="text-xs text-text-soft text-center">Sube tu DNI y documentos adicionales (PDF o JPG)</p>
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer mt-2">
                <input
                  type="checkbox"
                  className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  checked={terminosAceptados}
                  onChange={(e) => setTerminosAceptados(e.target.checked)}
                />
                <p className="text-xs text-text-soft leading-relaxed">
                  Acepto los términos y condiciones de la póliza, declaro que los datos ingresados son verdaderos y
                  autorizo el cobro.
                </p>
              </label>

              <button
                onClick={handleContratar}
                disabled={cargando}
                className="mt-2 w-full flex items-center justify-center gap-1.5 py-3 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-sm font-semibold transition-colors"
              >
                {cargando ? 'Procesando pago y emisión...' : 'Confirmar Compra y Emitir Póliza'}
              </button>
            </div>
          )}

          {/* === PASO 4: ÉXITO === */}
          {step === 4 && polizaGenerada && (
            <div className="p-6 flex flex-col items-center text-center gap-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                <MdCheckCircle size={32} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-text">¡Contratación Exitosa!</p>
                <p className="text-sm text-text-soft mt-1 leading-relaxed">
                  Tu póliza ha sido emitida automáticamente.
                </p>
              </div>
              <div className="bg-bg-soft rounded-xl px-5 py-4 w-full mt-2">
                <Linea label="Número de Póliza" val={`POL-${polizaGenerada.id_poliza}`} />
                <Linea label="Estado" val={polizaGenerada.estado} />
                <Linea label="Plan" val={planSeleccionado.nombre} />
                <Linea label="Cobro inicial" val={formatearMoneda(planSeleccionado.prima_mensual)} />
              </div>
              <button
                onClick={onClose}
                className="mt-4 w-full py-3 rounded-xl bg-bg border border-border hover:bg-bg-soft text-text text-sm font-semibold transition-colors"
              >
                Ir a Mis Pólizas
              </button>
            </div>
          )}
        </div>
      </div>
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
