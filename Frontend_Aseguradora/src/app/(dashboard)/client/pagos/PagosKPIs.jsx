import { MdAttachMoney, MdHourglassEmpty, MdWarningAmber, MdCheckCircle } from 'react-icons/md';

export default function PagosKPIs({ totalPendiente, counts }) {
  return (
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
  );
}
