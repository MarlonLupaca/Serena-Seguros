import React from 'react';
import { MdSearch, MdFilterList, MdCheckCircle, MdCancel, MdVisibility } from 'react-icons/md';

export default function SolicitudesPage() {
  const solicitudes = [
    { id: 'SOL-001', cliente: 'Carlos Mendoza', tipo: 'Vehicular', fecha: '19/04/2026', estado: 'Pendiente', monto: '$450.00' },
    { id: 'SOL-002', cliente: 'Lucía Vargas', tipo: 'Salud', fecha: '18/04/2026', estado: 'En Revisión', monto: '$120.00' },
    { id: 'SOL-003', cliente: 'Empresa XYZ', tipo: 'Empresarial', fecha: '17/04/2026', estado: 'Aprobada', monto: '$2,500.00' },
    { id: 'SOL-004', cliente: 'Juan Pérez', tipo: 'Vehicular', fecha: '16/04/2026', estado: 'Rechazada', monto: '$380.00' },
  ];

  const getStatusBadge = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'bg-orange-500/10 text-orange-600';
      case 'En Revisión': return 'bg-blue-500/10 text-blue-600';
      case 'Aprobada': return 'bg-green-500/10 text-green-600';
      case 'Rechazada': return 'bg-red-500/10 text-red-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Solicitudes de Cotización</h1>
          <p className="text-sm text-text-soft mt-1">Revisa y gestiona las solicitudes entrantes de los clientes.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={20} />
            <input type="text" placeholder="Buscar solicitud..." className="pl-10 pr-4 py-2 bg-bg-soft border border-border rounded-xl text-sm focus:outline-none focus:border-primary transition-colors w-full md:w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-bg border border-border rounded-xl text-sm font-medium text-text-soft hover:bg-bg-soft transition-colors">
            <MdFilterList size={18} />
            Filtros
          </button>
        </div>
      </div>

      <div className="bg-bg border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-soft border-b border-border text-sm text-text-soft">
                <th className="px-6 py-4 font-semibold">ID Solicitud</th>
                <th className="px-6 py-4 font-semibold">Cliente</th>
                <th className="px-6 py-4 font-semibold">Tipo de Seguro</th>
                <th className="px-6 py-4 font-semibold">Fecha</th>
                <th className="px-6 py-4 font-semibold">Monto Est.</th>
                <th className="px-6 py-4 font-semibold">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {solicitudes.map((sol) => (
                <tr key={sol.id} className="hover:bg-bg-soft/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text">{sol.id}</td>
                  <td className="px-6 py-4 text-text">{sol.cliente}</td>
                  <td className="px-6 py-4 text-text-soft">{sol.tipo}</td>
                  <td className="px-6 py-4 text-text-soft">{sol.fecha}</td>
                  <td className="px-6 py-4 font-medium text-text">{sol.monto}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(sol.estado)}`}>
                      {sol.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button className="p-1.5 text-text-soft hover:text-primary transition-colors" title="Ver detalles">
                        <MdVisibility size={18} />
                      </button>
                      <button className="p-1.5 text-text-soft hover:text-green-500 transition-colors" title="Aprobar">
                        <MdCheckCircle size={18} />
                      </button>
                      <button className="p-1.5 text-text-soft hover:text-red-500 transition-colors" title="Rechazar">
                        <MdCancel size={18} />
                      </button>
                    </div>
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
