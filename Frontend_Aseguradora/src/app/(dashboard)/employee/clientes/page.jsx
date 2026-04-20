"use client";
import React, { useState } from 'react';
import { 
  MdSearch, MdEmail, MdPhone, MdPerson, MdLocationOn,
  MdFilterList, MdOutlineStar, MdTrendingUp, MdPeopleOutline,
  MdBusiness, MdChevronRight
} from 'react-icons/md';

export default function ClientesPage() {
  const [filterType, setFilterType] = useState('Todos');

  const stats = [
    { label: 'Total Clientes', value: '4,521', icon: MdPeopleOutline, color: 'text-blue-600', bg: 'bg-blue-500/10' },
    { label: 'Clientes VIP (3+ Pólizas)', value: '840', icon: MdOutlineStar, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'Tasa de Retención', value: '94.2%', icon: MdTrendingUp, color: 'text-green-600', bg: 'bg-green-500/10' },
  ];

  const clientes = [
    { id: 1, tipo: 'Natural', nombre: 'Miguel Ángeles', doc: 'DNI: 71234567', email: 'miguel.a@email.com', tel: '+51 987 654 321', polizas: 2, ubicacion: 'Lima, Perú', vip: false },
    { id: 2, tipo: 'Natural', nombre: 'Sofía Castro', doc: 'DNI: 45678912', email: 'sofia.c@email.com', tel: '+51 912 345 678', polizas: 1, ubicacion: 'Arequipa, Perú', vip: false },
    { id: 3, tipo: 'Empresa', nombre: 'Empresa Logistics SAC', doc: 'RUC: 20123456789', email: 'contacto@logistics.com', tel: '+51 01 444 5555', polizas: 5, ubicacion: 'Callao, Perú', vip: true },
    { id: 4, tipo: 'Natural', nombre: 'Carlos Ruiz', doc: 'DNI: 12345678', email: 'carlos.ruiz@email.com', tel: '+51 933 444 555', polizas: 4, ubicacion: 'Trujillo, Perú', vip: true },
    { id: 5, tipo: 'Empresa', nombre: 'Tech Solutions EIRL', doc: 'RUC: 10445566778', email: 'admin@techsol.pe', tel: '+51 01 222 3333', polizas: 2, ubicacion: 'Cusco, Perú', vip: false },
  ];

  const filteredClientes = clientes.filter(c => {
    if (filterType === 'Todos') return true;
    if (filterType === 'VIP') return c.vip;
    return c.tipo === filterType;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* HEADER COMPACTO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Directorio de Clientes</h1>
          <p className="text-[11px] text-text-soft">Búsqueda y gestión de cartera de asegurados.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={16} />
            <input type="text" placeholder="Buscar por Nombre, DNI o RUC..." className="pl-9 pr-3 py-1.5 bg-bg border border-border rounded-lg text-xs focus:outline-none focus:border-primary transition-colors w-full md:w-80 shadow-sm" />
          </div>
        </div>
      </div>

      {/* MÉTRICAS DE RESUMEN */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-bg border border-border rounded-xl p-3 flex items-center gap-3 shadow-sm">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${stat.bg}`}>
                <Icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-[11px] text-text-soft font-medium uppercase tracking-wide">{stat.label}</p>
                <h3 className="text-xl font-bold text-text leading-tight">{stat.value}</h3>
              </div>
            </div>
          )
        })}
      </div>

      {/* FILTROS Y LISTA DE CLIENTES */}
      <div className="bg-bg border border-border rounded-xl shadow-sm flex flex-col">
        {/* FILTROS */}
        <div className="p-3 border-b border-border bg-bg-soft/50 rounded-t-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex bg-bg border border-border rounded-lg p-0.5">
            {['Todos', 'Natural', 'Empresa', 'VIP'].map(tab => (
              <button 
                key={tab}
                onClick={() => setFilterType(tab)}
                className={`px-4 py-1 text-[11px] font-semibold rounded-md transition-all ${filterType === tab ? 'bg-primary text-white shadow-sm' : 'text-text-soft hover:text-text'}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1 bg-bg border border-border rounded-lg text-xs font-semibold text-text-soft hover:bg-bg-soft hover:text-text transition-colors shadow-sm">
            <MdFilterList size={16} />
            Filtros Avanzados
          </button>
        </div>

        {/* LISTA COMPACTA */}
        <div className="flex flex-col divide-y divide-border/50">
          {filteredClientes.map((cliente) => (
            <div key={cliente.id} className="p-4 hover:bg-bg-soft/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 group cursor-pointer">
              
              {/* Info Principal */}
              <div className="flex items-center gap-4 md:w-1/3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${cliente.tipo === 'Empresa' ? 'bg-purple-500/10 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                  {cliente.tipo === 'Empresa' ? <MdBusiness size={20} /> : <MdPerson size={20} />}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-text truncate">{cliente.nombre}</h3>
                    {cliente.vip && <MdOutlineStar size={14} className="text-orange-500 shrink-0" title="Cliente VIP" />}
                  </div>
                  <span className="text-[11px] font-semibold text-text-soft mt-0.5">{cliente.doc}</span>
                </div>
              </div>

              {/* Contacto */}
              <div className="flex flex-col gap-1 md:w-1/3">
                <div className="flex items-center gap-2 text-xs text-text-soft">
                  <MdEmail size={14} />
                  <span className="truncate">{cliente.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-text-soft">
                  <MdPhone size={14} />
                  <span>{cliente.tel}</span>
                </div>
              </div>

              {/* Extras y Acción */}
              <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-2 md:w-1/4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary uppercase tracking-wider">
                  {cliente.polizas} Póliza{cliente.polizas > 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-text-soft">
                  <MdLocationOn size={12} />
                  <span className="truncate">{cliente.ubicacion}</span>
                </div>
              </div>

              <div className="hidden md:flex text-text-soft group-hover:text-primary transition-colors pl-2">
                <MdChevronRight size={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
