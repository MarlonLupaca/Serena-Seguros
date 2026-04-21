"use client";
import { useState } from 'react';
import {
  MdBadge,
  MdBusiness,
  MdMail,
  MdPeople,
  MdPhone,
  MdSearch,
  MdStar
} from 'react-icons/md';

export default function UsuariosPage() {
  const [activeTab, setActiveTab] = useState('todos');

  const userStats = [
    { label: 'Total Usuarios', value: '4,680', icon: MdPeople, color: 'text-primary' },
    { label: 'Clientes VIP', value: '840', icon: MdStar, color: 'text-yellow-500' },
    { label: 'Personal Interno', value: '159', icon: MdBadge, color: 'text-purple-500' },
  ];

  const allUsers = [
    // PERSONAL INTERNO
    { name: 'Liz Canchari', id: '72334455', email: 'liz.c@serena.pe', phone: '911 222 333', type: 'person', role: 'Administrador', category: 'interno', isVip: true },
    { name: 'Marlon Lupaca', id: '70889911', email: 'marlon.l@serena.pe', phone: '955 666 777', type: 'person', role: 'Analista', category: 'interno' },
    { name: 'Luis Alatta', id: '74556677', email: 'luis.a@serena.pe', phone: '944 333 222', type: 'person', role: 'Analista', category: 'interno' },
    
    // CLIENTES (PERSONAS)
    { name: 'Miguel Ángeles', id: '71234567', email: 'miguel.a@gmail.com', phone: '987 654 321', type: 'person', role: 'Cliente', category: 'externo' },
    { name: 'Sofía Castro', id: '45678912', email: 'sofia.c@outlook.com', phone: '912 345 678', type: 'person', role: 'Cliente', category: 'externo' },
    { name: 'Carlos Ruiz', id: '12345678', email: 'carlos.ruiz@yahoo.com', phone: '933 444 555', type: 'person', role: 'Cliente', category: 'externo', isVip: true },
    { name: 'Andrea Rojas', id: '44556677', email: 'andrea.r@gmail.com', phone: '999 888 777', type: 'person', role: 'Cliente', category: 'externo' },
    
    // CLIENTES (EMPRESAS)
    { name: 'Logistics SAC', id: '20123456789', email: 'contacto@logistics.com', phone: '01 444 5555', type: 'business', role: 'Cliente', category: 'externo', isVip: true },
    { name: 'Inversiones Sur', id: '20556677881', email: 'admin@invsur.pe', phone: '054 223 344', type: 'business', role: 'Cliente', category: 'externo', isVip: true },
    { name: 'TecnoWorld EIRL', id: '20887766554', email: 'ventas@tecnoworld.com', phone: '01 777 8888', type: 'business', role: 'Cliente', category: 'externo' },
  ];

  const filteredUsers = allUsers.filter(user => {
    if (activeTab === 'todos') return true;
    return user.category === activeTab;
  });

  return (
    <div className="py-6 fade-up">
      {/* HEADER */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-text">Gestión de Usuarios</h1>
          <p className="text-xs text-text-soft">Control centralizado de clientes y colaboradores</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por DNI, RUC o Nombre..." 
              className="pl-10 pr-4 py-2 bg-white border border-border rounded-xl text-xs focus:outline-none focus:border-primary w-64 shadow-sm"
            />
          </div>
        </div>
      </header>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {userStats.map((stat, i) => (
          <div key={i} className="card p-4 flex items-center gap-4 bg-white">
            <div className={`p-2.5 rounded-xl bg-bg-soft ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-text-soft uppercase">{stat.label}</p>
              <p className="text-lg font-bold text-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* TABS DE FILTRADO */}
      <div className="flex gap-2 mb-6 bg-bg-soft p-1 rounded-2xl w-fit border border-border shadow-inner">
        {['todos', 'externo', 'interno'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl text-[11px] font-bold transition-all uppercase
              ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-text-soft hover:text-text'}`}
          >
            {tab === 'externo' ? 'Clientes' : tab === 'interno' ? 'Personal' : 'Todos'}
          </button>
        ))}
      </div>

      {/* TABLA UNIFICADA */}
      <div className="card overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg-soft/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Usuario</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Rol / Cargo</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Contacto</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-soft uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredUsers.map((user, index) => (
                <tr key={index} className="hover:bg-bg-soft/20 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm shadow-inner
                        ${user.type === 'business' ? 'bg-purple-100 text-purple-600' : 'bg-primary/10 text-primary'}`}>
                        {user.type === 'business' ? <MdBusiness size={20} /> : user.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text flex items-center gap-1.5">
                          {user.name}
                          {user.isVip && <MdStar className="text-yellow-500" size={14} title="VIP" />}
                        </span>
                        <span className="text-[10px] text-text-soft font-medium">
                          ID: {user.id}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border
                      ${user.category === 'interno' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-[11px] text-text-soft">
                      <div className="flex items-center gap-1"><MdMail className="text-primary/60" size={12} /> {user.email}</div>
                      <div className="flex items-center gap-1"><MdPhone className="text-primary/60" size={12} /> {user.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                      <span className="text-[11px] font-bold text-text">ACTIVO</span>
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