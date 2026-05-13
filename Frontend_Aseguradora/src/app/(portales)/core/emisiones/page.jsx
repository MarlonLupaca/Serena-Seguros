'use client';

import { useEffect, useState } from 'react';
import {
  MdAdd,
  MdSearch,
  MdShield,
  MdClose,
  MdCalendarToday,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdSend,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost } from '@/lib/api';

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
};

const ESTADOS = {
  ACTIVA: { label: 'Activa', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  VENCIDA: { label: 'Vencida', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  CANCELADA: { label: 'Cancelada', badge: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
};

function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
}

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EmisionesPage() {
  const [polizas, setPolizas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [modalNueva, setModalNueva] = useState(false);
  const [actualizandoId, setActualizandoId] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/polizas');
      setPolizas(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las polizas');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const cambiarEstado = async (id, nuevo) => {
    setActualizandoId(id);
    try {
      const data = await apiPatch(`/polizas/${id}/estado`, { estado_poliza: nuevo });
      setPolizas((prev) => prev.map((p) => (p.id_poliza === id ? data : p)));
      mostrarToast('Estado actualizado');
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtradas = polizas.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado_poliza === filtroEstado;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || String(p.id_poliza).includes(t) || (p.producto?.nombre || '').toLowerCase().includes(t);
    return matchEstado && matchBusq;
  });

  const counts = Object.keys(ESTADOS).reduce(
    (acc, k) => ({ ...acc, [k]: polizas.filter((p) => p.estado_poliza === k).length }),
    {}
  );

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Emisión de pólizas</h1>
          <p className="text-xs text-text-soft mt-0.5">{polizas.length} pólizas en el sistema</p>
        </div>
        <button
          onClick={() => setModalNueva(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Emitir póliza
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.entries(ESTADOS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFiltroEstado(filtroEstado === k ? 'todos' : k)}
            className={`text-left rounded-xl border p-3 transition-colors ${
              filtroEstado === k ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
              <p className="text-xs text-text-soft">{v.label}</p>
            </div>
            <p className="text-lg font-bold text-text">{counts[k] || 0}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por ID o producto..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdShield size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin resultados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map((p) => (
            <PolizaRow
              key={p.id_poliza}
              p={p}
              actualizando={actualizandoId === p.id_poliza}
              onCambiarEstado={(estado) => cambiarEstado(p.id_poliza, estado)}
            />
          ))}
        </div>
      )}

      {modalNueva && (
        <ModalEmitir
          onClose={() => setModalNueva(false)}
          onSuccess={() => {
            setModalNueva(false);
            mostrarToast('Póliza emitida');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function PolizaRow({ p, onCambiarEstado, actualizando }) {
  const tipoStyle = estiloTipo(p.producto?.tipo_seguro);
  const Icon = tipoStyle.icon;
  const est = ESTADOS[p.estado_poliza] || ESTADOS.PENDIENTE;
  const [menu, setMenu] = useState(false);

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-4 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
          <Icon size={20} className={tipoStyle.accentText} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">POL-{String(p.id_poliza).padStart(6, '0')}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
              {est.label}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            {p.producto?.nombre} · {p.producto?.tipo_seguro}
          </p>
          <p className="text-xs text-text-soft mt-1 flex items-center gap-1 flex-wrap">
            <MdCalendarToday size={11} />
            {formatearFecha(p.vigencia_inicio)} → {formatearFecha(p.vigencia_fin)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 relative">
          <p className="text-sm font-bold text-text">{formatearMoneda(p.prima_total)}</p>
          <button
            onClick={() => setMenu((v) => !v)}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
          >
            {actualizando ? 'Actualizando...' : 'Cambiar estado'}
          </button>
          {menu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-bg border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              {Object.entries(ESTADOS)
                .filter(([k]) => k !== p.estado_poliza)
                .map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setMenu(false);
                      onCambiarEstado(key);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-soft hover:bg-bg-soft transition-colors"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                    {cfg.label}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalEmitir({ onClose, onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [form, setForm] = useState({
    id_cliente: '',
    id_producto: '',
    prima_total: '',
    vigencia_inicio: new Date().toISOString().slice(0, 10),
    vigencia_fin: '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([apiGet('/clientes'), apiGet('/productos?estado=ACTIVO')])
      .then(([cs, ps]) => {
        setClientes(cs || []);
        setProductos(ps || []);
      })
      .catch(() => {});
  }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/polizas', {
        id_cliente: Number(form.id_cliente),
        id_producto: Number(form.id_producto),
        prima_total: Number(form.prima_total),
        vigencia_inicio: form.vigencia_inicio,
        vigencia_fin: form.vigencia_fin,
      });
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo emitir');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Emitir nueva póliza</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3 overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Cliente</label>
            <select
              value={form.id_cliente}
              onChange={(e) => set('id_cliente', e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((c) => (
                <option key={c.id_cliente} value={c.id_cliente}>
                  {c.nombres} {c.apellidos} · DNI {c.documento_identidad}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Producto</label>
            <select
              value={form.id_producto}
              onChange={(e) => {
                set('id_producto', e.target.value);
                const p = productos.find((p) => String(p.id_producto) === e.target.value);
                if (p) set('prima_total', String(p.prima_base));
              }}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              <option value="">Seleccionar producto...</option>
              {productos.map((p) => (
                <option key={p.id_producto} value={p.id_producto}>
                  {p.nombre} ({p.tipo_seguro}) — {formatearMoneda(p.prima_base)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Prima total (S/)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.prima_total}
              onChange={(e) => set('prima_total', e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Vigencia inicio</label>
              <input
                type="date"
                value={form.vigencia_inicio}
                onChange={(e) => set('vigencia_inicio', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Vigencia fin</label>
              <input
                type="date"
                value={form.vigencia_fin}
                onChange={(e) => set('vigencia_fin', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold"
            >
              <MdSend size={13} /> {enviando ? 'Emitiendo...' : 'Emitir póliza'}
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
