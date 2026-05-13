'use client';

import { useEffect, useState } from 'react';
import {
  MdAdd,
  MdEdit,
  MdSearch,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdClose,
  MdSend,
  MdBlock,
} from 'react-icons/md';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';

const TIPOS = [
  { value: 'VEHICULAR', label: 'Vehicular', icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  { value: 'SALUD', label: 'Salud', icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  { value: 'VIDA', label: 'Vida', icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  { value: 'HOGAR', label: 'Hogar', icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  { value: 'VIAJE', label: 'Viaje', icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  { value: 'EMPRESA', label: 'Empresa', icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
];

function estiloTipo(tipo) {
  return TIPOS.find((t) => t.value === tipo) || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft', label: tipo };
}

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const ESTADO_VACIO = {
  nombre: '',
  tipo_seguro: 'VEHICULAR',
  prima_base: '',
  limites_cobertura: '',
  restricciones_edad: '18',
  tasas: '0',
};

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/productos');
      setProductos(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los productos');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const desactivar = async (id) => {
    try {
      await apiDelete(`/productos/${id}`);
      mostrarToast('Producto desactivado');
      cargar();
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo desactivar');
    }
  };

  const filtrados = productos.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    const matchTipo = filtroTipo === 'todos' || p.tipo_seguro === filtroTipo;
    const matchBusq = busq === '' || (p.nombre || '').toLowerCase().includes(busq.toLowerCase());
    return matchEstado && matchTipo && matchBusq;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Productos y tarifas</h1>
          <p className="text-xs text-text-soft mt-0.5">{productos.length} productos en el catálogo</p>
        </div>
        <button
          onClick={() => setModal({ modo: 'crear', data: { ...ESTADO_VACIO } })}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Nuevo producto
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar producto..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
          />
        </div>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
        >
          <option value="todos">Todos los estados</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
        >
          <option value="todos">Todos los tipos</option>
          {TIPOS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdShield size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin resultados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtrados.map((p) => (
            <ProductoCard
              key={p.id_producto}
              producto={p}
              onEditar={() =>
                setModal({
                  modo: 'editar',
                  data: {
                    id_producto: p.id_producto,
                    nombre: p.nombre,
                    tipo_seguro: p.tipo_seguro,
                    prima_base: String(p.prima_base ?? ''),
                    limites_cobertura: p.limites_cobertura ?? '',
                    restricciones_edad: String(p.restricciones_edad ?? '18'),
                    tasas: String(p.tasas ?? '0'),
                  },
                })
              }
              onDesactivar={() => desactivar(p.id_producto)}
            />
          ))}
        </div>
      )}

      {modal && (
        <ModalProducto
          modo={modal.modo}
          dataInicial={modal.data}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            mostrarToast(modal.modo === 'crear' ? 'Producto creado' : 'Producto actualizado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function ProductoCard({ producto, onEditar, onDesactivar }) {
  const tipoStyle = estiloTipo(producto.tipo_seguro);
  const Icon = tipoStyle.icon;
  const inactivo = producto.estado === 'INACTIVO';

  return (
    <div className={`bg-bg rounded-2xl border border-border overflow-hidden ${inactivo ? 'opacity-60' : ''}`}>
      <div className={`h-1 w-full ${tipoStyle.accentBg}`} />
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tipoStyle.accentBg}`}>
            <Icon size={20} className={tipoStyle.accentText} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-text">{producto.nombre}</p>
            <p className="text-xs text-text-soft mt-0.5">
              {tipoStyle.label} · #{producto.id_producto}
            </p>
          </div>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              inactivo ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {producto.estado}
          </span>
        </div>
        <p className="text-xs text-text-soft line-clamp-2">{producto.limites_cobertura || 'Sin descripción'}</p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-bg-soft rounded-lg p-2">
            <p className="text-text-soft">Prima base</p>
            <p className="font-semibold text-text mt-0.5">{formatearMoneda(producto.prima_base)}</p>
          </div>
          <div className="bg-bg-soft rounded-lg p-2">
            <p className="text-text-soft">Tasa</p>
            <p className="font-semibold text-text mt-0.5">{producto.tasas}%</p>
          </div>
          <div className="bg-bg-soft rounded-lg p-2">
            <p className="text-text-soft">Edad mín.</p>
            <p className="font-semibold text-text mt-0.5">{producto.restricciones_edad}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onEditar}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
          >
            <MdEdit size={13} /> Editar
          </button>
          {!inactivo && (
            <button
              onClick={onDesactivar}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors"
            >
              <MdBlock size={13} /> Desactivar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function ModalProducto({ modo, dataInicial, onClose, onSuccess }) {
  const [form, setForm] = useState(dataInicial);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const payload = {
        nombre: form.nombre,
        tipo_seguro: form.tipo_seguro,
        prima_base: Number(form.prima_base),
        limites_cobertura: form.limites_cobertura || null,
        restricciones_edad: Number(form.restricciones_edad || 18),
        tasas: Number(form.tasas || 0),
      };
      if (modo === 'crear') {
        await apiPost('/productos', payload);
      } else {
        await apiPut(`/productos/${form.id_producto}`, payload);
      }
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo guardar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">{modo === 'crear' ? 'Nuevo producto' : 'Editar producto'}</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3 overflow-y-auto">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Nombre</label>
            <input
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              required
              maxLength={100}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo de seguro</label>
            <select
              value={form.tipo_seguro}
              onChange={(e) => set('tipo_seguro', e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              {TIPOS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Prima base (S/)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.prima_base}
                onChange={(e) => set('prima_base', e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Tasa (%)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.tasas}
                onChange={(e) => set('tasas', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Edad mínima</label>
            <input
              type="number"
              min="0"
              max="120"
              value={form.restricciones_edad}
              onChange={(e) => set('restricciones_edad', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Coberturas (separadas por coma)</label>
            <textarea
              value={form.limites_cobertura}
              onChange={(e) => set('limites_cobertura', e.target.value)}
              rows={3}
              placeholder="Ej: Cobertura todo riesgo, daños a terceros, asistencia 24/7"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
            />
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdSend size={13} /> {enviando ? 'Guardando...' : 'Guardar'}
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
