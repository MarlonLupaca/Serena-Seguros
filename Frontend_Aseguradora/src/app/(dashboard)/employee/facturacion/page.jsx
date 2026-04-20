import React from 'react';
import { MdPayment, MdCheckCircle, MdCancel, MdReceipt, MdSearch } from 'react-icons/md';

export default function FacturacionPage() {
  const pagos = [
    { id: 'PAY-8821', cliente: 'Juan Pérez', poliza: 'POL-9950', monto: '$120.00', fecha: '19/04/2026', metodo: 'Tarjeta de Crédito', estado: 'Pendiente de Validación' },
    { id: 'PAY-8822', cliente: 'Empresa XYZ', poliza: 'POL-9961', monto: '$2,500.00', fecha: '18/04/2026', metodo: 'Transferencia Bancaria', estado: 'Pendiente de Validación' },
    { id: 'PAY-8820', cliente: 'María López', poliza: 'POL-9932', monto: '$85.00', fecha: '17/04/2026', metodo: 'Tarjeta de Débito', estado: 'Validado' },
  ];

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Pagos y Facturación</h1>
          <p className="text-sm text-text-soft mt-1">Valida los pagos reportados y gestiona la facturación de pólizas.</p>
        </div>
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={20} />
          <input type="text" placeholder="Buscar transacción..." className="pl-10 pr-4 py-2 bg-bg border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors w-full md:w-64 shadow-sm" />
        </div>
      </div>

      <div className="bg-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-soft border-b border-border text-sm text-text-soft">
                <th className="px-6 py-4 font-semibold">Transacción</th>
                <th className="px-6 py-4 font-semibold">Cliente / Póliza</th>
                <th className="px-6 py-4 font-semibold">Monto</th>
                <th className="px-6 py-4 font-semibold">Método</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Validación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {pagos.map((pago) => (
                <tr key={pago.id} className="hover:bg-bg-soft/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <MdReceipt className="text-text-soft" size={18} />
                      <span className="font-medium text-text">{pago.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-text font-medium">{pago.cliente}</span>
                      <span className="text-xs text-text-soft">{pago.poliza}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-text">{pago.monto}</td>
                  <td className="px-6 py-4 text-text-soft">{pago.metodo}</td>
                  <td className="px-6 py-4 text-text-soft">{pago.fecha}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${pago.estado === 'Validado' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                      {pago.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {pago.estado !== 'Validado' ? (
                      <div className="flex items-center justify-center gap-2">
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white rounded-lg transition-colors text-xs font-semibold">
                          <MdCheckCircle size={16} /> Validar
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white rounded-lg transition-colors text-xs font-semibold">
                          <MdCancel size={16} /> Rechazar
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <span className="text-text-soft text-xs font-medium italic">Completado</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
