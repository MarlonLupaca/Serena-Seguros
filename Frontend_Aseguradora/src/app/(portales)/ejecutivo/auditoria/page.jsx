'use client';

import { useEffect, useState } from 'react';
import { MdHistory, MdRefresh, MdPerson, MdLogin, MdAssignmentTurnedIn, MdReport, MdAttachMoney } from 'react-icons/md';
import { apiGet } from '@/lib/api';

const ICONO_POR_ACCION = {
  login_ok: MdLogin,
  login_fail: MdLogin,
  registro: MdPerson,
  cuota_pagada: MdAttachMoney,
  siniestro_estado: MdReport,
  siniestro_asignar: MdReport,
  aprobacion_aprobado: MdAssignmentTurnedIn,
  aprobacion_rechazado: MdAssignmentTurnedIn,
};

const COLOR_POR_MODULO = {
  auth: 'bg-blue-100 text-blue-700',
  cobranza: 'bg-emerald-100 text-emerald-700',
  siniestros: 'bg-rose-100 text-rose-700',
  aprobaciones: 'bg-amber-100 text-amber-700',
};

function formatearFecha(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('es-PE', { dateStyle: 'short', timeStyle: 'medium' });
}

export default function AuditoriaPage() {
  const [registros, setRegistros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtroModulo, setFiltroModulo] = useState('');
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [modulos, setModulos] = useState([]);

  async function cargar() {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (filtroModulo) params.set('modulo', filtroModulo);
      if (filtroUsuario) params.set('username', filtroUsuario);
      params.set('limite', '200');
      const data = await apiGet('/auditoria?' + params.toString());
      setRegistros(data || []);
      setError(null);
    } catch (e) {
      setError(e.mensaje || 'Error al cargar');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    apiGet('/auditoria/modulos')
      .then((res) => setModulos(res || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargar();
    }, 300);
    return () => clearTimeout(timer);
  }, [filtroModulo, filtroUsuario]);

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <p className="text-xl font-bold text-text">Auditoria de acciones</p>
          <p className="text-xs text-text-soft">Registro inmutable de acciones sensibles realizadas en el sistema.</p>
        </div>
        <button onClick={cargar} className="text-xs px-3 py-2 rounded-lg border border-border hover:bg-bg-soft flex items-center gap-1.5">
          <MdRefresh size={14} /> Refrescar
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-text-soft uppercase">Modulo</label>
          <select
            value={filtroModulo}
            onChange={(e) => setFiltroModulo(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-bg"
          >
            <option value="">Todos</option>
            {modulos.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        <div className="flex flex-col flex-1 min-w-[180px]">
          <label className="text-[10px] font-bold text-text-soft uppercase">Usuario</label>
          <input
            placeholder="username..."
            value={filtroUsuario}
            onChange={(e) => setFiltroUsuario(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-bg"
          />
        </div>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-2.5 rounded-lg">{error}</div>}

      {cargando ? (
        <div className="bg-bg rounded-xl border border-border p-12 text-center text-sm text-text-soft">Cargando registros...</div>
      ) : registros.length === 0 ? (
        <div className="bg-bg rounded-xl border border-border p-10 text-center text-sm text-text-soft">Sin registros para el filtro.</div>
      ) : (
        <div className="bg-bg rounded-xl border border-border divide-y divide-border">
          {registros.map((r) => {
            const Icono = ICONO_POR_ACCION[r.accion] || MdHistory;
            const claseModulo = COLOR_POR_MODULO[r.modulo] || 'bg-bg-soft text-text-soft';
            const fail = r.accion?.endsWith('_fail');
            return (
              <div key={r.id_auditoria} className="p-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${fail ? 'bg-rose-100 text-rose-600' : 'bg-primary/10 text-primary'}`}>
                  <Icono size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-text">{r.accion}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${claseModulo}`}>{r.modulo}</span>
                    {r.username && <span className="text-[11px] text-text-soft">por {r.username}</span>}
                  </div>
                  {r.detalle && <p className="text-xs text-text-soft mt-0.5 truncate">{r.detalle}</p>}
                </div>
                <p className="text-[11px] text-text-mute shrink-0">{formatearFecha(r.fecha)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
