'use client';

import { useEffect, useState } from 'react';
import {
  MdWarning,
  MdAdd,
  MdClose,
  MdTrendingUp,
  MdLocalShipping,
  MdGavel,
  MdAccountBalance,
  MdHub,
} from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';

const TIPO_META = {
  CONCENTRACION: { label: 'Concentración', icon: MdHub, color: 'text-primary', bg: 'bg-primary/10' },
  SINIESTRALIDAD: { label: 'Siniestralidad', icon: MdWarning, color: 'text-rose-600', bg: 'bg-rose-100' },
  MORA: { label: 'Mora', icon: MdAccountBalance, color: 'text-amber-600', bg: 'bg-amber-100' },
  PROVEEDOR: { label: 'Proveedor', icon: MdLocalShipping, color: 'text-sky-600', bg: 'bg-sky-100' },
  REGULATORIO: { label: 'Regulatorio', icon: MdGavel, color: 'text-violet-600', bg: 'bg-violet-100' },
  OTRO: { label: 'Otro', icon: MdTrendingUp, color: 'text-text-soft', bg: 'bg-bg-soft' },
};

const SEVERIDAD_META = {
  BAJA: { label: 'Baja', badge: 'bg-bg-soft text-text-soft', bar: 'bg-slate-300' },
  MEDIA: { label: 'Media', badge: 'bg-amber-100 text-amber-700', bar: 'bg-amber-400' },
  ALTA: { label: 'Alta', badge: 'bg-rose-100 text-rose-600', bar: 'bg-rose-400' },
  CRITICA: { label: 'Crítica', badge: 'bg-red-100 text-red-700', bar: 'bg-red-500' },
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function RiesgosPage() {
  const [alertas, setAlertas] = useState([]);
  const [manuales, setManuales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/riesgos-corporativos');
      setAlertas(data?.alertas_calculadas || []);
      setManuales(data?.registros_manuales || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los riesgos');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Riesgos corporativos</h1>
          <p className="text-xs text-text-soft mt-0.5">
            Monitorea alertas automáticas y registra riesgos detectados por la dirección.
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={14} /> Nuevo riesgo
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
          Alertas automáticas
        </p>
        {cargando ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
            Cargando alertas...
          </div>
        ) : alertas.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-8 text-center text-sm text-text-soft">
            Sin alertas calculadas en este momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {alertas.map((a, idx) => (
              <AlertaCard key={idx} alerta={a} />
            ))}
          </div>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">
          Registros manuales de la gerencia
        </p>
        {cargando ? null : manuales.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-8 text-center text-sm text-text-soft">
            Aún no hay riesgos registrados manualmente.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {manuales.map((r) => (
              <RiesgoRow key={r.id_riesgo} riesgo={r} />
            ))}
          </div>
        )}
      </section>

      {modal && (
        <ModalNuevoRiesgo
          onClose={() => setModal(false)}
          onSuccess={() => {
            setModal(false);
            mostrarToast('Riesgo registrado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function AlertaCard({ alerta }) {
  const meta = TIPO_META[alerta.tipo] || TIPO_META.OTRO;
  const Icon = meta.icon;
  const sev = SEVERIDAD_META[alerta.severidad] || SEVERIDAD_META.MEDIA;

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`h-1 w-full ${sev.bar}`} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
            <Icon size={20} className={meta.color} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text">{alerta.titulo}</p>
            <p className="text-[11px] text-text-soft">{meta.label}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sev.badge}`}>
            {sev.label}
          </span>
        </div>
        <p className="text-xs text-text-soft leading-relaxed">{alerta.descripcion}</p>
        {alerta.valor != null && Number(alerta.valor) > 0 && (
          <div className="flex items-baseline gap-1 pt-2 border-t border-border">
            <p className={`text-2xl font-bold ${meta.color}`}>
              {Number(alerta.valor).toFixed(alerta.unidad === '%' ? 1 : 0)}
            </p>
            <p className="text-xs text-text-soft">{alerta.unidad}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function RiesgoRow({ riesgo }) {
  const meta = TIPO_META[riesgo.tipo] || TIPO_META.OTRO;
  const Icon = meta.icon;
  const sev = SEVERIDAD_META[riesgo.severidad] || SEVERIDAD_META.MEDIA;

  return (
    <div className="bg-bg rounded-2xl border border-border p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${meta.bg}`}>
        <Icon size={20} className={meta.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-bold text-text">RSK-{String(riesgo.id_riesgo).padStart(6, '0')}</p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sev.badge}`}>
            {sev.label}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-bg-soft text-text-soft">
            {meta.label}
          </span>
          {riesgo.area_afectada && (
            <span className="text-[10px] text-text-soft">· Área {riesgo.area_afectada}</span>
          )}
        </div>
        <p className="text-sm text-text mt-1">{riesgo.descripcion}</p>
        <p className="text-[11px] text-text-soft mt-2">
          Registrado: {formatearFecha(riesgo.fecha_registro)}
          {riesgo.registrado_por && ` · por ${riesgo.registrado_por}`}
        </p>
      </div>
    </div>
  );
}

function ModalNuevoRiesgo({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    tipo: 'CONCENTRACION',
    severidad: 'MEDIA',
    area_afectada: '',
    descripcion: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/riesgos-corporativos', form);
      onSuccess();
    } catch (err) {
      setError(err.mensaje || 'No se pudo registrar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Registrar riesgo corporativo</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              >
                {Object.entries(TIPO_META).map(([k, m]) => (
                  <option key={k} value={k}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Severidad</label>
              <select
                value={form.severidad}
                onChange={(e) => setForm({ ...form, severidad: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              >
                {Object.entries(SEVERIDAD_META).map(([k, m]) => (
                  <option key={k} value={k}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Área afectada</label>
            <input
              value={form.area_afectada}
              onChange={(e) => setForm({ ...form, area_afectada: e.target.value })}
              placeholder="Ej. Comercial, Tecnico, Finanzas..."
              maxLength={100}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Descripción</label>
            <textarea
              value={form.descripcion}
              onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
              required
              rows={4}
              maxLength={2000}
              placeholder="Describe el riesgo y posibles acciones preventivas..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando || !form.descripcion.trim()}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Guardando...' : 'Registrar riesgo'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
