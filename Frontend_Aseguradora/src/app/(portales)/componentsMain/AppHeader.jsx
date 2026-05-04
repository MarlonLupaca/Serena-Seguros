import React from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';

const AppHeader = ({ title, subtitle, searchPlaceholder = 'Buscar...', indicatorTitle, indicatorValue }) => {
  return (
    <header className="flex h-20 w-full items-center justify-between px-8 sticky top-0 bg-gradient-pastel backdrop-blur z-40">
      {/* LEFT: Contexto */}
      <div>
        <p className="text-xl text-primary-hover font-bold">{title}</p>
        {subtitle && <p className="text-[0.7rem] text-black/50">{subtitle}</p>}
      </div>

      {/* CENTER: Búsqueda global */}
      <div className="hidden md:flex relative w-1/3">
        <span className="absolute inset-y-0 left-3 flex items-center text-text-soft">
          <IoSearchOutline size={18} />
        </span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          className="w-full rounded-xl bg-bg-soft py-2.5 pl-10 pr-4 text-sm outline-none ring-primary/20 transition-all focus:ring-2 placeholder:text-text-soft"
        />
      </div>

      {/* RIGHT: Acciones */}
      <div className="flex items-center gap-3">
        {/* Notificaciones */}
        <button className="relative rounded-full p-2.5 text-text-soft hover:bg-bg-soft hover:text-primary transition-all">
          <IoNotificationsOutline size={22} />
          {/* Badge */}
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-red-500 border-2 border-bg"></span>
        </button>

        {/* Settings */}
        <button className="rounded-full p-2.5 text-text-soft hover:bg-bg-soft hover:text-primary transition-all">
          <IoSettingsOutline size={22} />
        </button>

        {/* Mostrar el divisor y el indicador solo si se envía un valor para el indicador */}
        {indicatorValue && (
          <>
            {/* Divider */}
            <div className="mx-2 h-8 w-px bg-border"></div>

            {/* Indicadores rápidos */}
            <div className="hidden lg:flex flex-col items-end mr-2">
              <span className="text-[10px] uppercase tracking-widest text-text-soft font-bold leading-none">
                {indicatorTitle}
              </span>
              <span className="text-[13px] font-semibold text-primary mt-1">{indicatorValue}</span>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
