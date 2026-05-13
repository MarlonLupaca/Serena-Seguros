'use client';

import { useEffect, useRef, useState } from 'react';
import { IoSearchOutline, IoNotificationsOutline, IoSettingsOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';
import { apiGet, apiPatch } from '@/lib/api';

const TIPO_COLOR = {
  APROBACION: 'bg-amber-100 text-amber-700',
  SINIESTRO: 'bg-rose-100 text-rose-700',
  COBRANZA: 'bg-emerald-100 text-emerald-700',
  COMISION: 'bg-blue-100 text-blue-700',
  GENERAL: 'bg-bg-soft text-text-soft',
};

function formatearFecha(d) {
  if (!d) return '';
  const fecha = new Date(d);
  const min = Math.floor((Date.now() - fecha.getTime()) / 60000);
  if (min < 1) return 'ahora';
  if (min < 60) return `hace ${min} min`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `hace ${hr} h`;
  return fecha.toLocaleDateString('es-PE');
}

const AppHeader = ({ title, subtitle, searchPlaceholder = 'Buscar...', indicatorTitle, indicatorValue }) => {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [items, setItems] = useState([]);
  const [conteo, setConteo] = useState(0);
  const [cargando, setCargando] = useState(false);
  const ref = useRef(null);

  async function cargarConteo() {
    try {
      const r = await apiGet('/notificaciones/conteo');
      setConteo(Number(r?.no_leidas || 0));
    } catch (e) {
      // sin notificaciones (puede no haber rol o sesion)
    }
  }

  async function cargarLista() {
    setCargando(true);
    try {
      const data = await apiGet('/notificaciones');
      setItems(data || []);
    } catch (e) {
      // ignorar
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarConteo();
    const t = setInterval(cargarConteo, 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    function manejarClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener('mousedown', manejarClick);
    return () => document.removeEventListener('mousedown', manejarClick);
  }, []);

  function alternar() {
    if (!abierto) cargarLista();
    setAbierto((v) => !v);
  }

  async function abrirNotificacion(n) {
    try {
      if (!n.leida) {
        await apiPatch(`/notificaciones/${n.id_notificacion}/leer`, {});
        cargarConteo();
      }
    } catch (e) {
      // ignorar
    }
    setAbierto(false);
    if (n.enlace) router.push(n.enlace);
  }

  async function leerTodas() {
    try {
      await apiPatch('/notificaciones/leer-todas', {});
      setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
      setConteo(0);
    } catch (e) {
      // ignorar
    }
  }

  return (
    <header className="flex h-20 w-full items-center justify-between px-8 sticky top-0 bg-gradient-pastel backdrop-blur z-40">
      <div>
        <p className="text-xl text-primary-hover font-bold">{title}</p>
        {subtitle && <p className="text-[0.7rem] text-black/50">{subtitle}</p>}
      </div>

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

      <div className="flex items-center gap-3">
        <div className="relative" ref={ref}>
          <button
            onClick={alternar}
            className="relative rounded-full p-2.5 text-text-soft hover:bg-bg-soft hover:text-primary transition-all"
          >
            <IoNotificationsOutline size={22} />
            {conteo > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-bg">
                {conteo > 9 ? '9+' : conteo}
              </span>
            )}
          </button>

          {abierto && (
            <div className="absolute right-0 top-full mt-2 w-96 bg-bg border border-border rounded-2xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <p className="text-sm font-bold text-text">Notificaciones</p>
                {conteo > 0 && (
                  <button onClick={leerTodas} className="text-[11px] font-semibold text-primary hover:underline">
                    Marcar todas leidas
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {cargando ? (
                  <p className="p-6 text-center text-xs text-text-soft">Cargando...</p>
                ) : items.length === 0 ? (
                  <p className="p-6 text-center text-xs text-text-soft">No tienes notificaciones.</p>
                ) : (
                  items.map((n) => (
                    <button
                      key={n.id_notificacion}
                      onClick={() => abrirNotificacion(n)}
                      className={`w-full text-left p-3 flex items-start gap-2 hover:bg-bg-soft border-b border-border ${
                        n.leida ? '' : 'bg-primary/5'
                      }`}
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${TIPO_COLOR[n.tipo] || TIPO_COLOR.GENERAL}`}>
                        {n.tipo}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${n.leida ? 'text-text-soft' : 'font-bold text-text'} truncate`}>{n.titulo}</p>
                        {n.mensaje && <p className="text-[11px] text-text-soft line-clamp-2">{n.mensaje}</p>}
                        <p className="text-[10px] text-text-mute mt-0.5">{formatearFecha(n.fecha)}</p>
                      </div>
                      {!n.leida && <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />}
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button className="rounded-full p-2.5 text-text-soft hover:bg-bg-soft hover:text-primary transition-all">
          <IoSettingsOutline size={22} />
        </button>

        {indicatorValue && (
          <>
            <div className="mx-2 h-8 w-px bg-border"></div>
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
