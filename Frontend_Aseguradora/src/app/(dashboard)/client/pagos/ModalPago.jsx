import { useState } from 'react';
import {
  MdArrowBack,
  MdClose,
  MdChevronRight,
  MdNotificationsActive,
  MdPhoneAndroid,
  MdLock,
  MdCheckCircle,
  MdDownload,
} from 'react-icons/md';
import { METODOS_PAGO } from './data';

export default function ModalPago({ cuota, onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [metodo, setMetodo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePagar = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(4);
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm bg-bg rounded-2xl border border-border overflow-hidden shadow-xl">
        {/* Header */}
        {step !== 4 && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-bg-soft transition-colors text-text-soft"
                >
                  <MdArrowBack size={15} />
                </button>
              )}
              <p className="text-sm font-bold text-text">
                {step === 1 && 'Método de pago'}
                {step === 2 && 'Datos de pago'}
                {step === 3 && 'Confirmar pago'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-border hover:bg-bg-soft transition-colors text-text-soft"
            >
              <MdClose size={15} />
            </button>
          </div>
        )}

        {/* Step 1: Elegir método */}
        {step === 1 && (
          <div className="p-5 flex flex-col gap-4">
            <div className="bg-bg-soft rounded-xl p-3.5">
              <p className="text-xs text-text-soft mb-1">Estás pagando</p>
              <p className="text-sm font-bold text-text">{cuota.polizaLabel}</p>
              <p className="text-xs text-text-soft mt-0.5">
                {cuota.periodo} · Cuota {cuota.numeroCuota}/{cuota.totalCuotas}
              </p>
              <p className="text-xl font-bold text-text mt-2">{cuota.monto}</p>
            </div>

            <div className="flex flex-col gap-2">
              {METODOS_PAGO.map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    onClick={() => setMetodo(m.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                      metodo === m.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${metodo === m.id ? 'bg-primary/10' : 'bg-bg-soft'}`}
                    >
                      <Icon size={18} className={metodo === m.id ? 'text-primary' : 'text-text-soft'} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text">{m.label}</p>
                      <p className="text-xs text-text-soft mt-0.5">{m.sub}</p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${metodo === m.id ? 'border-primary' : 'border-border'}`}
                    >
                      {metodo === m.id && <div className="w-2 h-2 rounded-full bg-primary" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!metodo}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-40 text-text-inverse text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Continuar <MdChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 2: Datos tarjeta / info */}
        {step === 2 && (
          <div className="p-5 flex flex-col gap-4">
            {(metodo === 'visa' || metodo === 'debito') && (
              <>
                <div>
                  <label className="text-xs font-medium text-text-soft block mb-1.5">Número de tarjeta</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-soft block mb-1.5">Vencimiento</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                      placeholder="MM/AA"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-text-soft block mb-1.5">CVV</label>
                    <input
                      className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                      placeholder="•••"
                      maxLength={4}
                      type="password"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-text-soft block mb-1.5">Nombre en la tarjeta</label>
                  <input
                    className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
                    placeholder="Como aparece en la tarjeta"
                  />
                </div>
              </>
            )}
            {metodo === 'transferencia' && (
              <div className="bg-bg-soft rounded-xl p-4 flex flex-col gap-2.5">
                <p className="text-xs font-semibold text-text mb-1">Datos para transferencia</p>
                {[
                  { label: 'Banco', val: 'BCP' },
                  { label: 'Tipo de cuenta', val: 'Corriente en soles' },
                  { label: 'N° de cuenta', val: '194-2384920-0-58' },
                  { label: 'CCI', val: '002-194-002384920058-12' },
                  { label: 'A nombre de', val: 'SegurosPlus SAC' },
                ].map(({ label, val }) => (
                  <div key={label} className="flex justify-between text-xs gap-3">
                    <span className="text-text-soft">{label}</span>
                    <span className="font-medium text-text text-right">{val}</span>
                  </div>
                ))}
                <div className="mt-2 flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <MdNotificationsActive size={13} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    Incluye el código <span className="font-bold">{cuota.id}</span> como referencia.
                  </p>
                </div>
              </div>
            )}
            {metodo === 'yape' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-32 h-32 bg-bg-soft rounded-2xl border border-border flex items-center justify-center">
                  <div className="flex flex-col items-center gap-1">
                    <MdPhoneAndroid size={36} className="text-text-soft opacity-30" />
                    <p className="text-xs text-text-soft">QR Yape</p>
                  </div>
                </div>
                <p className="text-xs text-text-soft text-center">
                  Escanea el código con tu app Yape o Plin para completar el pago de{' '}
                  <span className="font-semibold text-text">{cuota.monto}</span>
                </p>
              </div>
            )}

            <div className="flex items-center gap-1.5 text-xs text-text-soft justify-center">
              <MdLock size={12} className="text-emerald-500" />
              <span>Pago seguro cifrado SSL</span>
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              Revisar pago <MdChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Step 3: Confirmación */}
        {step === 3 && (
          <div className="p-5 flex flex-col gap-4">
            <div className="bg-bg-soft rounded-xl p-4 flex flex-col gap-2">
              <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-1">Resumen del pago</p>
              {[
                { label: 'Póliza', val: cuota.polizaLabel },
                { label: 'Periodo', val: cuota.periodo },
                { label: 'Cuota', val: `${cuota.numeroCuota} de ${cuota.totalCuotas}` },
                { label: 'Método', val: METODOS_PAGO.find((m) => m.id === metodo)?.label },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-xs">
                  <span className="text-text-soft">{label}</span>
                  <span className="font-medium text-text">{val}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-1 flex justify-between">
                <span className="text-sm font-semibold text-text">Total</span>
                <span className="text-sm font-bold text-primary">{cuota.monto}</span>
              </div>
            </div>

            <p className="text-xs text-text-soft text-center leading-relaxed">
              Al confirmar autorizas el cargo de <span className="font-semibold text-text">{cuota.monto}</span> a tu
              método seleccionado.
            </p>

            <button
              onClick={handlePagar}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-70 text-text-inverse text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Procesando…
                </>
              ) : (
                <>
                  <MdLock size={14} /> Confirmar pago
                </>
              )}
            </button>
          </div>
        )}

        {/* Step 4: Éxito */}
        {step === 4 && (
          <div className="p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <MdCheckCircle size={28} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-base font-bold text-text">¡Pago realizado!</p>
              <p className="text-xs text-text-soft mt-1 leading-relaxed">
                Tu cuota de <span className="font-semibold text-text">{cuota.monto}</span> fue procesada correctamente.
              </p>
            </div>
            <div className="bg-bg-soft rounded-xl px-4 py-3 w-full text-left flex flex-col gap-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-text-soft">N° operación</span>
                <span className="font-medium text-text">OP-{Math.floor(Math.random() * 9000000 + 1000000)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-soft">Fecha</span>
                <span className="font-medium text-text">{new Date().toLocaleDateString('es-PE')}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-text-soft">Método</span>
                <span className="font-medium text-text">{METODOS_PAGO.find((m) => m.id === metodo)?.label}</span>
              </div>
            </div>
            <div className="flex gap-2 w-full mt-1">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
                <MdDownload size={13} /> Comprobante
              </button>
              <button
                onClick={() => {
                  onSuccess();
                  onClose();
                }}
                className="flex-1 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
