import {
  MdArrowBack,
  MdCalendarToday,
  MdReceiptLong,
  MdAttachMoney,
  MdWarningAmber,
  MdNotificationsActive,
  MdDownload,
  MdCreditCard,
} from 'react-icons/md';
import { ESTADO_CONFIG } from './data';

export default function DetalleCuota({ cuota, onBack, onPagar }) {
  const est = ESTADO_CONFIG[cuota.estado];
  const PolIcon = cuota.polizaIcon;
  const progreso = Math.round(((cuota.numeroCuota - 1) / cuota.totalCuotas) * 100);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis pagos
      </button>

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
