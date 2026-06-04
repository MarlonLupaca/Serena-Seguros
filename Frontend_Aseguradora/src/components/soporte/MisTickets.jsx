"use client";

import React, { useEffect, useState } from 'react';
import { apiGet } from '@/lib/api';
import { MdHistory, MdAccessTime, MdCheckCircle, MdError } from 'react-icons/md';

export default function MisTickets() {
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarTickets();
  }, []);

  const cargarTickets = async () => {
    try {
      const data = await apiGet('/soporte/tickets');
      console.log("Respuesta limpia de tickets DTO:", data);
      
      // Como el backend ahora devuelve una lista plana de DTOs:
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        setTickets([]);
      }
    } catch (e) {
      setError('No se pudieron cargar los tickets.');
    } finally {
      setCargando(false);
    }
  };

  const getStatusColor = (statusName) => {
    if (!statusName) return 'bg-gray-100 text-gray-700';
    const s = statusName.toUpperCase();
    if (s.includes('PENDIENTE') || s.includes('NEW')) return 'bg-blue-100 text-blue-700';
    if (s.includes('CURSO') || s.includes('PROGRESS')) return 'bg-amber-100 text-amber-700';
    if (s.includes('RESUELTO') || s.includes('DONE')) return 'bg-emerald-100 text-emerald-700';
    return 'bg-gray-100 text-gray-700';
  };

  if (cargando) {
    return <div className="text-sm text-text-soft">Cargando tus tickets...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500 flex items-center gap-2"><MdError /> {error}</div>;
  }

  if (!Array.isArray(tickets) || tickets.length === 0) {
    return (
      <div className="bg-bg rounded-2xl border border-border p-6 text-center">
        <MdHistory className="mx-auto text-border mb-2" size={32} />
        <p className="text-sm font-medium text-text">No tienes tickets reportados</p>
        <p className="text-xs text-text-soft mt-1">Aquí aparecerá el historial de tus solicitudes de soporte.</p>
      </div>
    );
  }

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MdHistory className="text-primary" size={18} />
          <h3 className="text-sm font-bold text-text">Mis Tickets Recientes</h3>
        </div>
        <button onClick={cargarTickets} className="text-xs text-primary hover:underline font-medium">
          Actualizar
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border text-xs uppercase text-text-soft">
              <th className="p-4">ID</th>
              <th className="p-4">Asunto</th>
              <th className="p-4">Fecha</th>
              <th className="p-4">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tickets.map((ticket, index) => {
              const statusName = ticket.estado || 'Desconocido';
              const fechaStr = new Date(ticket.fecha).toLocaleString('es-PE', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              });

              return (
                <tr key={index} className="border-b border-border/50 hover:bg-bg/50 transition-colors">
                  <td className="p-4 font-medium text-sm text-text">{ticket.ticket_id || ticket.ticketId}</td>
                  <td className="p-4 text-sm text-text">{ticket.asunto}</td>
                  <td className="p-4 text-sm text-text-soft">{fechaStr}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(statusName)}`}>
                      {statusName}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
