import { MdAccountBalance, MdCheck, MdClose, MdCreditCard, MdPictureAsPdf } from 'react-icons/md';

export default function PagosAdminPage() {
  const pagos = [
    { id: 'PAY-8821', client: 'Juan Pérez', monto: 120.00, metodo: 'Visa', banco: 'BCP', status: 'Pendiente' },
    { id: 'PAY-8822', client: 'Logistics SAC', monto: 2500.00, metodo: 'Transferencia', banco: 'Interbank', status: 'Pendiente' },
    { id: 'PAY-8820', client: 'María López', monto: 85.00, metodo: 'Mastercard', banco: 'BBVA', status: 'Validado' },
  ];

  return (
    <div className="py-6 fade-up">
      <header className="mb-8">
        <h1 className="text-xl font-bold text-text">Centro de Pagos</h1>
        <p className="text-xs text-text-soft">Validación de ingresos y conciliación bancaria</p>
      </header>

      <div className="card bg-white shadow-sm border border-border/50 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-bg-soft/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase tracking-wider">Referencia</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase tracking-wider">Titular</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase tracking-wider text-center">Método / Banco</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase text-right tracking-wider">Monto (S/)</th>
              <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase text-center tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {pagos.map((p, i) => (
              <tr key={i} className="hover:bg-bg-soft/10 transition-colors">
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-text">{p.id}</span>
                </td>
                <td className="px-6 py-4 text-xs font-bold text-text-soft">{p.client}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1.5 text-xs text-text font-medium">
                      {p.metodo === 'Transferencia' ? <MdAccountBalance className="text-primary" /> : <MdCreditCard className="text-primary" />}
                      {p.metodo}
                    </div>
                    <span className="text-[9px] font-bold text-text-soft uppercase">{p.banco}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-sm font-bold text-primary">S/ {p.monto.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {p.status === 'Pendiente' ? (
                      <>
                        <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-500 hover:text-white transition-all shadow-sm border border-green-200"><MdCheck size={18} /></button>
                        <button className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-sm border border-red-200"><MdClose size={18} /></button>
                      </>
                    ) : (
                      <button className="flex items-center gap-2 px-3 py-1.5 bg-bg-soft text-text-soft rounded-lg text-[10px] font-bold border border-border">
                        <MdPictureAsPdf /> RECIBO
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}