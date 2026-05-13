import {
  MdArrowBack,
  MdCalendarToday,
  MdReceiptLong,
  MdAttachMoney,
  MdWarningAmber,
  MdNotificationsActive,
  MdCreditCard,
} from 'react-icons/md';
import {
  ESTADO_CONFIG,
  estiloTipo,
  formatearFecha,
  formatearMoneda,
  diasHasta,
  clasificarEstado,
} from './data';

export default function DetalleCuota({ cuota, onBack, onPagar }) {
  const tipoStyle = estiloTipo(cuota.poliza_tipo);
  const PolIcon = tipoStyle.icon;
  const clase = clasificarEstado(cuota);
  const est = ESTADO_CONFIG[clase];
  const dr = diasHasta(cuota.fecha_vencimiento);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis pagos
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
                <PolIcon size={20} className={tipoStyle.accentText} />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{cuota.poliza_nombre}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  CUO-{String(cuota.id_cuota).padStart(6, '0')} · {cuota.poliza_tipo}
                </p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs text-text-soft">Monto a pagar</p>
              <p className="text-xl font-bold text-text mt-0.5">{formatearMoneda(cuota.monto)}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Item icon={MdCalendarToday} label="Vencimiento" val={formatearFecha(cuota.fecha_vencimiento)} />
            <Item icon={MdReceiptLong} label="Número de cuota" val={`#${cuota.numero_cuota}`} />
            <Item icon={MdAttachMoney} label="Póliza" val={cuota.poliza_tipo || '—'} />
          </div>
        </div>

        {clase === 'VENCIDO' && dr != null && dr < 0 && (
          <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <MdWarningAmber size={16} className="text-rose-500 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-rose-700 mb-0.5">Cuota vencida</p>
              <p className="text-xs text-rose-600">
                Esta cuota venció hace {Math.abs(dr)} días. Paga ahora para evitar recargos o suspensión de cobertura.
              </p>
            </div>
          </div>
        )}

        {clase === 'PENDIENTE' && dr != null && dr <= 5 && dr >= 0 && (
          <div className="mx-5 mt-4 flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <MdNotificationsActive size={16} className="text-amber-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-bold text-amber-700 mb-0.5">Vence en {dr} días</p>
              <p className="text-xs text-amber-700">
                Realiza tu pago antes del {formatearFecha(cuota.fecha_vencimiento)} para mantener tu cobertura activa.
              </p>
            </div>
          </div>
        )}

        {clase !== 'PAGADO' && (
          <div className="p-5 pt-4">
            <button
              onClick={() => onPagar(cuota)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors"
            >
              <MdCreditCard size={16} /> Pagar {formatearMoneda(cuota.monto)}
            </button>
          </div>
        )}

        {clase === 'PAGADO' && (
          <div className="p-5">
            <p className="text-sm text-text-soft text-center">Esta cuota ya fue pagada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function Item({ icon: Icon, label, val }) {
  return (
    <div className="bg-bg-soft rounded-xl p-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={11} className="text-text-soft" />
        <p className="text-xs text-text-soft">{label}</p>
      </div>
      <p className="text-xs font-semibold text-text truncate">{val}</p>
    </div>
  );
}
