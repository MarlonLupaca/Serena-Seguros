'use client';

import React from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';

const AppHeader = () => {
  return (
    <header className="flex h-20 w-full items-center justify-between px-4 md:px-8 sticky top-0 bg-gradient-pastel backdrop-blur z-40">
      {/* ESPACIO IZQUIERDO (vacío para mantener balance) */}
      <div className="w-10 md:w-1/3" />

      {/* BUSCADOR (solo desktop/tablet) */}
      <div className="hidden md:flex relative w-1/3">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <IoSearchOutline size={18} />
        </span>
        <input
          type="text"
          placeholder="Buscar pólizas, trámites..."
          className="w-full rounded-xl bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none ring-teal-500/20 transition-all focus:ring-2 placeholder:text-gray-400"
        />
      </div>

      {/* DERECHA */}
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button className="relative rounded-full p-2.5 text-gray-500 hover:bg-gray-50 hover:text-teal-600 transition-all">
          <IoNotificationsOutline size={22} />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        {/* Settings */}
        <button className="rounded-full p-2.5 text-gray-500 hover:bg-gray-50 hover:text-teal-600 transition-all">
          <IoSettingsOutline size={22} />
        </button>

        {/* Divider */}
        <div className="mx-2 h-8 w-px bg-gray-100"></div>

        {/* Estado (SIEMPRE visible) */}
        <div className="flex flex-col items-end mr-2">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold leading-none">
            Estado de cuenta
          </span>
          <span className="text-[13px] font-semibold text-teal-600 mt-1">Al día</span>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
