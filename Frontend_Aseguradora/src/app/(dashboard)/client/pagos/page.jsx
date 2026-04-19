'use client';
import { useState } from 'react';
import {
  MdArrowForward,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdHome,
  MdSearch,
  MdFilterList,
  MdChevronRight,
  MdDownload,
  MdDescription,
  MdAccessTime,
  MdCalendarToday,
  MdCheckCircle,
  MdHourglassEmpty,
  MdWarningAmber,
  MdArrowBack,
  MdCreditCard,
  MdAccountBalance,
  MdPhoneAndroid,
  MdClose,
  MdLock,
  MdReceiptLong,
  MdNotificationsActive,
  MdAttachMoney,
  MdPayment,
} from 'react-icons/md';

// ── Data mock ──────────────────────────────────────────────────
const CUOTAS = [
  {
    id: 'CUO-2024-00182-04',
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    numeroCuota: 4,
    totalCuotas: 12,
    monto: 'S/ 890.00',
    montoNum: 890.0,
    vencimiento: '20/04/2024',
    diasRestantes: 2,
    estado: 'pendiente',
    periodo: 'Abril 2024',
    descripcion: 'Cuota mensual · Plan Cobertura Total',
  },
  {
    id: 'CUO-2024-00182-03',
    polizaId: 'POL-2024-00182',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    numeroCuota: 3,
    totalCuotas: 12,
    monto: 'S/ 890.00',
    montoNum: 890.0,
    vencimiento: '20/03/2024',
    diasRestantes: null,
    estado: 'pagado',
    periodo: 'Marzo 2024',
    descripcion: 'Cuota mensual · Plan Cobertura Total',
    comprobante: 'COMP-2024-03182.pdf',
    fechaPago: '18/03/2024',
    metodoPago: 'Visa •••• 4821',
  },
  {
    id: 'CUO-2024-09871-02',
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    numeroCuota: 2,
    totalCuotas: 6,
    monto: 'S/ 340.00',
    montoNum: 340.0,
    vencimiento: '15/04/2024',
    diasRestantes: -3,
    estado: 'vencido',
    periodo: 'Abril 2024',
    descripcion: 'Cuota bimestral · Plan Familiar Plus',
  },
  {
    id: 'CUO-2024-09871-01',
    polizaId: 'POL-2023-00891',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    numeroCuota: 1,
    totalCuotas: 6,
    monto: 'S/ 340.00',
    montoNum: 340.0,
    vencimiento: '15/02/2024',
    diasRestantes: null,
    estado: 'pagado',
    periodo: 'Febrero 2024',
    descripcion: 'Cuota bimestral · Plan Familiar Plus',
    comprobante: 'COMP-2024-02891.pdf',
    fechaPago: '14/02/2024',
    metodoPago: 'Transferencia BCP',
  },
  {
    id: 'CUO-2022-00345-08',
    polizaId: 'POL-2022-00345',
    polizaLabel: 'Seguro de Hogar',
    polizaIcon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    numeroCuota: 8,
    totalCuotas: 12,
    monto: 'S/ 210.00',
    montoNum: 210.0,
    vencimiento: '30/04/2024',
    diasRestantes: 12,
    estado: 'pendiente',
    periodo: 'Abril 2024',
    descripcion: 'Cuota mensual · Plan Estándar',
  },
];

const HISTORIAL = [
  {
    id: 'PAG-2024-0312',
    polizaLabel: 'Seguro de Auto',
    polizaIcon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    monto: 'S/ 890.00',
    fecha: '18/03/2024',
    metodo: 'Visa •••• 4821',
    comprobante: 'COMP-2024-03182.pdf',
  },
  {
    id: 'PAG-2024-0215',
    polizaLabel: 'Seguro de Salud',
    polizaIcon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    monto: 'S/ 340.00',
    fecha: '14/02/2024',
    metodo: 'Transferencia BCP',
    comprobante: 'COMP-2024-02891.pdf',
  },
  {
    id: 'PAG-2024-0118',
    polizaLabel: 'Seguro de Hogar',
    polizaIcon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    monto: 'S/ 210.00',
    fecha: '28/01/2024',
    metodo: 'Yape',
    comprobante: 'COMP-2024-01345.pdf',
  },
];

const ESTADO_CONFIG = {
  pendiente: {
    label: 'Pendiente',
    badge: 'bg-amber-100 text-amber-700',
    dot: 'bg-amber-400',
    icon: MdHourglassEmpty,
  },
  vencido: {
    label: 'Vencido',
    badge: 'bg-rose-100 text-rose-600',
    dot: 'bg-rose-400',
    icon: MdWarningAmber,
  },
  pagado: {
    label: 'Pagado',
    badge: 'bg-emerald-100 text-emerald-700',
    dot: 'bg-emerald-500',
    icon: MdCheckCircle,
  },
};

const METODOS_PAGO = [
  { id: 'visa', label: 'Tarjeta de crédito', sub: 'Visa / Mastercard', icon: MdCreditCard },
  { id: 'transferencia', label: 'Transferencia', sub: 'Banco BCP, Interbank…', icon: MdAccountBalance },
  { id: 'yape', label: 'Yape / Plin', sub: 'Pago instantáneo', icon: MdPhoneAndroid },
  { id: 'debito', label: 'Tarjeta de débito', sub: 'Débito inmediato', icon: MdPayment },
];

// ── Modal de Pago ──────────────────────────────────────────────
function ModalPago({ cuota, onClose, onSuccess }) {
  const [step, setStep] = useState(1); // 1: metodo, 2: datos, 3: confirmacion, 4: exito
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
            {/* Resumen cuota */}
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

// ── Detail view ────────────────────────────────────────────────
function DetalleCuota({ cuota, onBack, onPagar }) {
  const est = ESTADO_CONFIG[cuota.estado];
  const EstIcon = est.icon;
  const PolIcon = cuota.polizaIcon;
  const progreso = Math.round(((cuota.numeroCuota - 1) / cuota.totalCuotas) * 100);

  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis pagos
      </button>

      {/* Card principal */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${cuota.accentBg}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cuota.accentBg}`}>
                <PolIcon size={20} className={cuota.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{cuota.polizaLabel}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  {cuota.id} · {cuota.descripcion}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-text-soft">Monto a pagar</p>
              <p className="text-xl font-bold text-text mt-0.5">{cuota.monto}</p>
            </div>
          </div>

          {/* Datos rápidos */}
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdCalendarToday, label: 'Vencimiento', val: cuota.vencimiento },
              { icon: MdReceiptLong, label: 'Periodo', val: cuota.periodo },
              { icon: MdAttachMoney, label: 'Cuota', val: `${cuota.numeroCuota} de ${cuota.totalCuotas}` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon size={11} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-xs font-semibold text-text truncate">{val}</p>
              </div>
            ))}
          </div>

          {/* Progreso de póliza */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-text-soft mb-1.5">
              <span>Progreso de póliza</span>
              <span>
                {cuota.numeroCuota - 1}/{cuota.totalCuotas} cuotas pagadas
              </span>
            </div>
            <div className="h-1.5 bg-bg-soft rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${cuota.estado === 'vencido' ? 'bg-rose-400' : 'bg-primary'}`}
                style={{ width: `${progreso}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alerta vencido */}
        {cuota.estado === 'vencido' && (
          <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <MdWarningAmber size={16} className="text-rose-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-700 mb-0.5">Cuota vencida</p>
              <p className="text-xs text-rose-600">
                Esta cuota venció hace {Math.abs(cuota.diasRestantes)} días. Paga ahora para evitar recargos o
                suspensión de cobertura.
              </p>
            </div>
          </div>
        )}

        {/* Alerta próximo a vencer */}
        {cuota.estado === 'pendiente' && cuota.diasRestantes <= 5 && (
          <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <MdNotificationsActive size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-700 mb-0.5">Vence en {cuota.diasRestantes} días</p>
              <p className="text-xs text-amber-700">
                Realiza tu pago antes del {cuota.vencimiento} para mantener tu cobertura activa.
              </p>
            </div>
          </div>
        )}

        {/* Info pago realizado */}
        {cuota.estado === 'pagado' && (
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Detalle del pago</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Fecha de pago', val: cuota.fechaPago },
                { label: 'Método', val: cuota.metodoPago },
                { label: 'Comprobante', val: cuota.comprobante },
              ].map(({ label, val }) => (
                <div
                  key={label}
                  className="flex justify-between items-center text-sm py-1.5 border-b border-border last:border-0"
                >
                  <span className="text-text-soft text-xs">{label}</span>
                  <span className="font-medium text-text text-xs">{val}</span>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
              <MdDownload size={14} /> Descargar comprobante
            </button>
          </div>
        )}

        {/* CTA Pagar */}
        {(cuota.estado === 'pendiente' || cuota.estado === 'vencido') && (
          <div className="p-5 pt-4">
            <button
              onClick={() => onPagar(cuota)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors"
            >
              <MdCreditCard size={16} /> Pagar {cuota.monto}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── List view ──────────────────────────────────────────────────
function ListaPagos({ onSelect, onPagar }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [tab, setTab] = useState('cuotas');

  const filtradas = CUOTAS.filter((c) => {
    const matchFiltro = filtro === 'todos' || c.estado === filtro;
    const matchBusq =
      busqueda === '' ||
      c.id.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.polizaLabel.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.periodo.toLowerCase().includes(busqueda.toLowerCase());
    return matchFiltro && matchBusq;
  });

  const totalPendiente = CUOTAS.filter((c) => c.estado === 'pendiente' || c.estado === 'vencido').reduce(
    (acc, c) => acc + c.montoNum,
    0
  );

  const counts = {
    pendiente: CUOTAS.filter((c) => c.estado === 'pendiente').length,
    vencido: CUOTAS.filter((c) => c.estado === 'vencido').length,
    pagado: CUOTAS.filter((c) => c.estado === 'pagado').length,
  };

  const TABS = [
    { id: 'cuotas', label: 'Cuotas' },
    { id: 'historial', label: 'Historial de pagos' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Por pagar',
            val: `S/ ${totalPendiente.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`,
            color: 'text-text',
            icon: MdAttachMoney,
            bg: 'bg-primary/10',
            iconColor: 'text-primary',
          },
          {
            label: 'Pendientes',
            val: counts.pendiente,
            color: 'text-amber-600',
            icon: MdHourglassEmpty,
            bg: 'bg-amber-100',
            iconColor: 'text-amber-600',
          },
          {
            label: 'Vencidas',
            val: counts.vencido,
            color: 'text-rose-500',
            icon: MdWarningAmber,
            bg: 'bg-rose-100',
            iconColor: 'text-rose-500',
          },
          {
            label: 'Pagadas',
            val: counts.pagado,
            color: 'text-emerald-600',
            icon: MdCheckCircle,
            bg: 'bg-emerald-100',
            iconColor: 'text-emerald-600',
          },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${k.bg}`}>
                <Icon size={17} className={k.iconColor} />
              </div>
              <div>
                <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.val}</p>
                <p className="text-xs text-text-soft">{k.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recordatorio vencidos */}
      {counts.vencido > 0 && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
          <MdWarningAmber size={16} className="text-rose-500 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-bold text-rose-700 mb-0.5">
              Tienes {counts.vencido} cuota{counts.vencido > 1 ? 's' : ''} vencida{counts.vencido > 1 ? 's' : ''}
            </p>
            <p className="text-xs text-rose-600">Regulariza tus pagos para evitar la suspensión de coberturas.</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Cuotas */}
      {tab === 'cuotas' && (
        <>
          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <input
                placeholder="Buscar por póliza, periodo…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
              />
            </div>
            <div className="relative">
              <MdFilterList size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                className="pl-8 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="todos">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="vencido">Vencido</option>
                <option value="pagado">Pagado</option>
              </select>
            </div>
          </div>

          {/* Lista cuotas */}
          {filtradas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdDescription size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">No se encontraron cuotas</p>
              <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtradas.map((c) => {
                const est = ESTADO_CONFIG[c.estado];
                const PolIcon = c.polizaIcon;
                const progreso = Math.round(((c.numeroCuota - 1) / c.totalCuotas) * 100);

                return (
                  <div
                    key={c.id}
                    className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
                    onClick={() => onSelect(c)}
                  >
                    <div className={`h-1 w-full ${c.accentBg}`} />
                    <div className="p-5">
                      <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.accentBg}`}>
                          <PolIcon size={22} className={c.accentText} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-bold text-text">{c.polizaLabel}</p>
                            <span
                              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                              {est.label}
                            </span>
                            {c.estado === 'vencido' && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-rose-100 text-rose-600">
                                <MdWarningAmber size={11} /> {Math.abs(c.diasRestantes)}d vencida
                              </span>
                            )}
                            {c.estado === 'pendiente' && c.diasRestantes <= 5 && (
                              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                <MdAccessTime size={11} /> Vence en {c.diasRestantes}d
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-soft mt-0.5">
                            {c.id} · {c.descripcion}
                          </p>
                          <p className="text-xs text-text-soft mt-0.5">
                            <MdCalendarToday size={11} className="inline mr-1" />
                            Vence: {c.vencimiento}
                            <span className="mx-1.5">·</span>
                            Cuota {c.numeroCuota}/{c.totalCuotas}
                          </p>

                          {/* Progreso */}
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex-1 h-1 bg-bg-soft rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  c.estado === 'vencido'
                                    ? 'bg-rose-400'
                                    : c.estado === 'pagado'
                                      ? 'bg-emerald-500'
                                      : 'bg-primary'
                                }`}
                                style={{ width: `${progreso}%` }}
                              />
                            </div>
                            <span className="text-xs text-text-soft tabular-nums">
                              {c.numeroCuota - 1}/{c.totalCuotas}
                            </span>
                          </div>
                        </div>

                        {/* Monto + acciones */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <p className="text-base font-bold text-text">{c.monto}</p>
                          <div className="flex gap-2">
                            {c.estado === 'pagado' ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                              >
                                <MdDownload size={13} /> Comprobante
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onPagar(c);
                                }}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                              >
                                <MdCreditCard size={13} /> Pagar
                              </button>
                            )}
                            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors">
                              Ver detalle <MdChevronRight size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab: Historial */}
      {tab === 'historial' && (
        <div className="flex flex-col gap-3">
          {HISTORIAL.map((h) => {
            const PolIcon = h.polizaIcon;
            return (
              <div key={h.id} className="bg-bg rounded-2xl border border-border overflow-hidden">
                <div className={`h-1 w-full ${h.accentBg}`} />
                <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${h.accentBg}`}>
                    <PolIcon size={20} className={h.accentText} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-text">{h.polizaLabel}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Pagado
                      </span>
                    </div>
                    <p className="text-xs text-text-soft mt-0.5">
                      {h.id}
                      <span className="mx-1.5">·</span>
                      <MdCalendarToday size={11} className="inline mr-1" />
                      {h.fecha}
                      <span className="mx-1.5">·</span>
                      {h.metodo}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-base font-bold text-text">{h.monto}</p>
                    <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
                      <MdDownload size={13} /> Comprobante
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────
export default function ModuloPagos() {
  const [selected, setSelected] = useState(null);
  const [cuotaPagar, setCuotaPagar] = useState(null);

  return (
    <div className="h-screen  flex flex-col">
      {/* Header */}
      <div>
        <div className="px-8 py-5">
          <div className="mx-auto">
            {/* Título */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-xl font-bold text-text leading-tight">{selected ? selected.id : 'Mis pagos'}</p>
                  <p className="text-sm text-text-soft mt-0.5">
                    {selected
                      ? `${selected.polizaLabel} · ${selected.periodo}`
                      : 'Gestiona las cuotas y pagos de tus pólizas activas.'}
                  </p>
                </div>
              </div>
              {selected && (
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${ESTADO_CONFIG[selected.estado].badge}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${ESTADO_CONFIG[selected.estado].dot}`} />
                  {ESTADO_CONFIG[selected.estado].label}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 w-full px-8">
        {selected ? (
          <DetalleCuota cuota={selected} onBack={() => setSelected(null)} onPagar={(c) => setCuotaPagar(c)} />
        ) : (
          <ListaPagos onSelect={setSelected} onPagar={(c) => setCuotaPagar(c)} />
        )}
      </div>

      {/* Modal pago */}
      {cuotaPagar && (
        <ModalPago cuota={cuotaPagar} onClose={() => setCuotaPagar(null)} onSuccess={() => setCuotaPagar(null)} />
      )}
    </div>
  );
}
