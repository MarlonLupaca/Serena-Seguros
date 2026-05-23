'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdShield,
  MdAttachMoney,
  MdPercent,
  MdEventNote,
} from 'react-icons/md';
import { apiDelete, apiGet, apiPost, apiPut } from '@/lib/api';
import ModalConfirm from '../../componentsMain/ModalConfirm';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../componentsMain/DataTable';

const TIPOS = ['VEHICULAR', 'SALUD', 'VIDA', 'HOGAR', 'VIAJE', 'EMPRESA'];

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, bg: 'bg-primary/10', text: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, bg: 'bg-emerald-100', text: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, bg: 'bg-rose-100', text: 'text-rose-500' },
  HOGAR: { icon: MdHome, bg: 'bg-amber-100', text: 'text-amber-600' },
  VIAJE: { icon: MdFlight, bg: 'bg-sky-100', text: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, bg: 'bg-violet-100', text: 'text-violet-600' },
};

const ESTADO_BADGE = {
  ACTIVO: 'bg-emerald-100 text-emerald-700',
  INACTIVO: 'bg-slate-100 text-slate-600',
};

function estiloTipo(t) {
  return TIPO_STYLES[t] || { icon: MdShield, bg: 'bg-bg-soft', text: 'text-text-soft' };
}

function formatearMoneda(v) {
  if (v == null) return 'S/ 0.00';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [modal, setModal] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
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
const eliminar = (p) => {
    setConfirmacion({
      mensaje: `¿Desactivar el producto "${p.nombre}"?`,
      accion: async () => {
        try {
          await apiDelete(`/productos/${p.id_producto}`);
          toast.success('Producto desactivado');
          cargar();
        } catch (e) {
          toast.error(e.mensaje || 'No se pudo desactivar');
        }
      },
    });
  };

  const filtrados = productos.filter((p) => {
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (p.nombre || '').toLowerCase().includes(t);
    const matchTipo = filtroTipo === 'todos' || p.tipo_seguro === filtroTipo;
    return matchBusq && matchTipo;
  });

  const counts = TIPOS.reduce((acc, t) => {
    acc[t] = productos.filter((p) => p.tipo_seguro === t).length;
    return acc;
  }, {});

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Catálogo de productos</h1>
          <p className="text-xs text-text-soft mt-0.5">
            Administra los productos del negocio asegurador: primas, tasas, deducibles y restricciones.
          </p>
        </div>
        <button
          onClick={() => setModal({})}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Nuevo producto
        </button>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {TIPOS.map((t) => {
          const s = estiloTipo(t);
          const Icon = s.icon;
          return (
            <button
              key={t}
              onClick={() => setFiltroTipo(filtroTipo === t ? 'todos' : t)}
              className={`text-left rounded-xl border p-3 transition-colors ${
                filtroTipo === t ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 ${s.bg}`}>
                <Icon size={14} className={s.text} />
              </div>
              <p className="text-[11px] text-text-soft">{t}</p>
              <p className="text-base font-bold text-text leading-none mt-0.5">{counts[t] || 0}</p>
            </button>
          );
        })}
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por nombre del producto..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
          {error}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdShield size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay productos</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableHead>Producto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead align="right">Prima Base</TableHead>
            <TableHead align="right">Tasa</TableHead>
            <TableHead align="right">Edad min.</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead align="right">Acciones</TableHead>
          </TableHeader>
          <TableBody>
            {filtrados.map((p) => (
              <ProductoTableRow
                key={p.id_producto}
                producto={p}
                onEditar={() => setModal({ producto: p })}
                onEliminar={() => eliminar(p)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      <ModalConfirm
        abierto={!!confirmacion}
        titulo="Confirmar desactivacion"
        mensaje={confirmacion?.mensaje}
        textoConfirmar="Desactivar"
        variante="danger"
        onConfirmar={confirmacion?.accion}
        onCancelar={() => setConfirmacion(null)}
      />

      {modal && (
        <ModalProducto
          producto={modal.producto || null}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
            toast.success(modal.producto ? 'Producto actualizado' : 'Producto creado');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function ProductoTableRow({ producto, onEditar, onEliminar }) {
  const s = estiloTipo(producto.tipo_seguro);
  const Icon = s.icon;
  const inactivo = producto.estado === 'INACTIVO';
  
  return (
    <TableRow className={inactivo ? 'opacity-60' : ''}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${s.bg}`}>
            <Icon size={18} className={s.text} />
          </div>
          <div>
            <p className="text-sm font-bold text-text truncate max-w-[200px]">{producto.nombre}</p>
            <p className="text-xs text-text-soft mt-0.5">PRD-{String(producto.id_producto).padStart(6, '0')}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm font-semibold text-text">{producto.tipo_seguro}</span>
      </TableCell>
      <TableCell align="right">
        <span className="text-sm font-bold text-emerald-600">{formatearMoneda(producto.prima_base)}</span>
      </TableCell>
      <TableCell align="right">
        <span className="text-sm font-semibold text-text">{producto.tasas ?? 0}%</span>
      </TableCell>
      <TableCell align="right">
        <span className="text-sm font-semibold text-text">{producto.restricciones_edad ?? 0} años</span>
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            ESTADO_BADGE[producto.estado] || 'bg-bg-soft'
          }`}
        >
          {producto.estado}
        </span>
      </TableCell>
      <TableCell align="right">
        <div className="flex gap-2 justify-end shrink-0">
          <button
            onClick={onEditar}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-border hover:bg-bg-soft text-text-soft transition-colors"
            title="Editar"
          >
            <MdEdit size={14} />
          </button>
          <button
            onClick={onEliminar}
            disabled={inactivo}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors disabled:opacity-50"
            title="Desactivar"
          >
            <MdDelete size={14} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function ModalProducto({ producto, onClose, onSuccess }) {
  const editando = !!producto;
  const [form, setForm] = useState({
    nombre: producto?.nombre || '',
    tipo_seguro: producto?.tipo_seguro || 'VEHICULAR',
    prima_base: producto?.prima_base != null ? String(producto.prima_base) : '',
    tasas: producto?.tasas != null ? String(producto.tasas) : '0',
    restricciones_edad: producto?.restricciones_edad != null ? String(producto.restricciones_edad) : '18',
    limites_cobertura: producto?.limites_cobertura || '',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const payload = {
        nombre: form.nombre,
        tipo_seguro: form.tipo_seguro,
        prima_base: Number(form.prima_base),
        tasas: form.tasas ? Number(form.tasas) : 0,
        restricciones_edad: form.restricciones_edad ? Number(form.restricciones_edad) : 18,
        limites_cobertura: form.limites_cobertura || null,
      };
      if (editando) {
        await apiPut(`/productos/${producto.id_producto}`, payload);
      } else {
        await apiPost('/productos', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.mensaje || 'No se pudo guardar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">
            {editando
              ? `Editar producto · PRD-${String(producto.id_producto).padStart(6, '0')}`
              : 'Nuevo producto'}
          </p>
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
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
              maxLength={100}
              placeholder="Ej. Auto Total Plus"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Tipo de seguro</label>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS.map((t) => {
                const s = estiloTipo(t);
                const Icon = s.icon;
                const sel = form.tipo_seguro === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setForm({ ...form, tipo_seguro: t })}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-colors ${
                      sel ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'
                    }`}
                  >
                    <Icon size={16} className={s.text} />
                    <span className="text-[10px] font-semibold">{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Prima base (S/)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.prima_base}
                onChange={(e) => setForm({ ...form, prima_base: e.target.value })}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Tasa (%)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.tasas}
                onChange={(e) => setForm({ ...form, tasas: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Edad min.</label>
              <input
                type="number"
                min="0"
                max="120"
                value={form.restricciones_edad}
                onChange={(e) => setForm({ ...form, restricciones_edad: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Límites de cobertura</label>
            <textarea
              value={form.limites_cobertura}
              onChange={(e) => setForm({ ...form, limites_cobertura: e.target.value })}
              rows={3}
              placeholder="Ej. Robo total, choque, daños a terceros, asistencia 24/7..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
            />
            <p className="text-[10px] text-text-soft mt-1">
              Separa coberturas con coma. Aparecerán como lista en el detalle de la póliza.
            </p>
          </div>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Guardando...' : editando ? 'Actualizar producto' : 'Crear producto'}
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
