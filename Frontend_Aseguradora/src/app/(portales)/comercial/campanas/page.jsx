'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdAdd,
  MdClose,
  MdEmail,
  MdSearch,
  MdSend,
  MdVisibility,
  MdCalendarToday,
  MdCampaign,
  MdTrendingUp,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost } from '@/lib/api';

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CampanasPage() {
  const [campanas, setCampanas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [modalNueva, setModalNueva] = useState(false);
  const [modalEnvio, setModalEnvio] = useState(null);
useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-campanas');
      setCampanas(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las campañas');
    } finally {
      setCargando(false);
    }
  };
const filtradas = campanas.filter((c) =>
    busq === '' ? true : (c.asunto || '').toLowerCase().includes(busq.toLowerCase())
  );

  const totales = {
    campanas: campanas.length,
    enviados: campanas.reduce((acc, c) => acc + (c.enviados || 0), 0),
    abiertos: campanas.reduce((acc, c) => acc + (c.abiertos || 0), 0),
  };
  const tasaApertura = totales.enviados > 0 ? Math.round((totales.abiertos / totales.enviados) * 100) : 0;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Campañas de marketing</h1>
          <p className="text-xs text-text-soft mt-0.5">{totales.campanas} campañas creadas</p>
        </div>
        <button
          onClick={() => setModalNueva(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Nueva campaña
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Total campañas" val={totales.campanas} icon={MdCampaign} bg="bg-primary/10" color="text-primary" />
        <Kpi label="Enviados" val={totales.enviados} icon={MdSend} bg="bg-sky-100" color="text-sky-600" />
        <Kpi label="Abiertos" val={totales.abiertos} icon={MdVisibility} bg="bg-emerald-100" color="text-emerald-600" />
        <Kpi
          label="Tasa apertura"
          val={`${tasaApertura}%`}
          icon={MdTrendingUp}
          bg="bg-amber-100"
          color="text-amber-600"
        />
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por asunto..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando campañas...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdCampaign size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay campañas</p>
          <p className="text-xs text-text-soft mt-1">
            {campanas.length === 0 ? 'Crea tu primera campaña.' : 'No hay coincidencias con la búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map((c) => (
            <CampanaCard key={c.id_campana} c={c} onRegistrarEnvio={() => setModalEnvio(c)} />
          ))}
        </div>
      )}

      {modalNueva && (
        <ModalNuevaCampana
          onClose={() => setModalNueva(false)}
          onSuccess={() => {
            setModalNueva(false);
            toast.success('Campaña creada');
            cargar();
          }}
        />
      )}
      {modalEnvio && (
        <ModalRegistrarEnvio
          campana={modalEnvio}
          onClose={() => setModalEnvio(null)}
          onSuccess={() => {
            setModalEnvio(null);
            toast.success('Envío registrado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function Kpi({ label, val, icon: Icon, bg, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
        <Icon size={17} className={color} />
      </div>
      <div>
        <p className={`text-xl font-bold leading-tight ${color}`}>{val}</p>
        <p className="text-xs text-text-soft">{label}</p>
      </div>
    </div>
  );
}

function CampanaCard({ c, onRegistrarEnvio }) {
  const apertura = c.enviados > 0 ? Math.round((c.abiertos / c.enviados) * 100) : 0;
  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-1 w-full bg-primary/30" />
      <div className="p-5">
        <div className="flex items-start gap-3 flex-wrap sm:flex-nowrap">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MdEmail size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text">{c.asunto}</p>
            <p className="text-xs text-text-soft mt-0.5">CAM-{String(c.id_campana).padStart(6, '0')}</p>
            <p className="text-xs text-text-soft mt-1 line-clamp-2">{c.plantilla}</p>
            <p className="text-xs text-text-soft mt-2 flex items-center gap-1">
              <MdCalendarToday size={11} /> {formatearFecha(c.fecha_creacion)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <p className="text-xs text-text-soft">Enviados / Abiertos</p>
              <p className="text-sm font-bold text-text">
                {c.enviados} / {c.abiertos}
              </p>
              <p className="text-xs text-emerald-600 font-medium">{apertura}% apertura</p>
            </div>
            <button
              onClick={onRegistrarEnvio}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdSend size={13} /> Registrar envío
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalNuevaCampana({ onClose, onSuccess }) {
  const [asunto, setAsunto] = useState('');
  const [plantilla, setPlantilla] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/mis-campanas', { asunto, plantilla });
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo crear la campaña');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Nueva campaña</p>
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
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Asunto</label>
            <input
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
              maxLength={200}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Plantilla</label>
            <textarea
              value={plantilla}
              onChange={(e) => setPlantilla(e.target.value)}
              required
              rows={6}
              placeholder="Cuerpo del correo..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Creando...' : 'Crear campaña'}
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

function ModalRegistrarEnvio({ campana, onClose, onSuccess }) {
  const [enviados, setEnviados] = useState('100');
  const [abiertos, setAbiertos] = useState('25');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPatch(`/mis-campanas/${campana.id_campana}/envio`, {
        enviados: Number(enviados),
        abiertos: abiertos ? Number(abiertos) : null,
      });
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo registrar el envío');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Registrar envío</p>
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
          <p className="text-xs text-text-soft">
            Campaña: <span className="font-semibold text-text">{campana.asunto}</span>
          </p>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Cantidad de envíos a sumar</label>
            <input
              type="number"
              min="0"
              value={enviados}
              onChange={(e) => setEnviados(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">
              Cantidad de aperturas (opcional)
            </label>
            <input
              type="number"
              min="0"
              value={abiertos}
              onChange={(e) => setAbiertos(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Registrando...' : 'Registrar'}
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
