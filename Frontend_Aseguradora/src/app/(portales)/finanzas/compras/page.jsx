'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdShoppingCart,
  MdAdd,
  MdSearch,
  MdCheck,
  MdClose,
  MdLocalShipping,
  MdBusinessCenter,
  MdInventory2,
  MdAttachMoney,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost } from '@/lib/api';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../componentsMain/DataTable';

const PRIORIDADES = {
  BAJA: { label: 'Baja', badge: 'bg-bg-soft text-text-soft' },
  MEDIA: { label: 'Media', badge: 'bg-amber-100 text-amber-700' },
  ALTA: { label: 'Alta', badge: 'bg-rose-100 text-rose-600' },
};

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  APROBADO: { label: 'Aprobado', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  COMPRADO: { label: 'Comprado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

function formatearMoneda(v) {
  if (v == null) return 'S/ 0.00';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function ComprasPage() {
  const [tab, setTab] = useState('solicitudes');
  const [solicitudes, setSolicitudes] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [actualizando, setActualizando] = useState(null);
const [modalSolicitud, setModalSolicitud] = useState(false);
  const [modalProveedor, setModalProveedor] = useState(false);
  const [modalOrden, setModalOrden] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [sol, prov, ord] = await Promise.all([
        apiGet('/compras/solicitudes').catch(() => []),
        apiGet('/compras/proveedores').catch(() => []),
        apiGet('/compras/ordenes').catch(() => []),
      ]);
      setSolicitudes(sol || []);
      setProveedores(prov || []);
      setOrdenes(ord || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
const cambiarEstado = async (id, estado) => {
    setActualizando(id);
    try {
      await apiPatch(`/compras/solicitudes/${id}/estado`, { estado });
      toast.success(`Solicitud ${estado.toLowerCase()}`);
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizando(null);
    }
  };

  const counts = {
    pendientes: solicitudes.filter((s) => s.estado === 'PENDIENTE').length,
    aprobadas: solicitudes.filter((s) => s.estado === 'APROBADO').length,
    compradas: solicitudes.filter((s) => s.estado === 'COMPRADO').length,
    proveedores: proveedores.length,
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Compras y proveedores</h1>
          <p className="text-xs text-text-soft mt-0.5">
            Administra solicitudes internas, proveedores y emite órdenes de compra.
          </p>
        </div>
        <div className="flex gap-2">
          {tab === 'solicitudes' && (
            <button
              onClick={() => setModalSolicitud(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdAdd size={14} /> Nueva solicitud
            </button>
          )}
          {tab === 'proveedores' && (
            <button
              onClick={() => setModalProveedor(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdAdd size={14} /> Nuevo proveedor
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Pendientes" val={counts.pendientes} icon={MdShoppingCart} bg="bg-amber-100" color="text-amber-600" />
        <Kpi label="Aprobadas" val={counts.aprobadas} icon={MdCheck} bg="bg-sky-100" color="text-sky-600" />
        <Kpi label="Compradas" val={counts.compradas} icon={MdLocalShipping} bg="bg-emerald-100" color="text-emerald-600" />
        <Kpi label="Proveedores" val={counts.proveedores} icon={MdBusinessCenter} bg="bg-primary/10" color="text-primary" />
      </div>

      <div className="flex border-b border-border gap-2">
        <TabBtn activo={tab === 'solicitudes'} onClick={() => setTab('solicitudes')}>
          <MdInventory2 size={14} /> Solicitudes
        </TabBtn>
        <TabBtn activo={tab === 'proveedores'} onClick={() => setTab('proveedores')}>
          <MdBusinessCenter size={14} /> Proveedores
        </TabBtn>
        <TabBtn activo={tab === 'ordenes'} onClick={() => setTab('ordenes')}>
          <MdLocalShipping size={14} /> Órdenes
        </TabBtn>
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder={
            tab === 'solicitudes'
              ? 'Buscar producto o área...'
              : tab === 'proveedores'
                ? 'Buscar nombre o RUC...'
                : 'Buscar proveedor o producto...'
          }
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
          {error}
        </div>
      ) : tab === 'solicitudes' ? (
        <SolicitudesList
          solicitudes={solicitudes}
          busq={busq}
          actualizando={actualizando}
          onCambiarEstado={cambiarEstado}
          onEmitirOrden={(s) => setModalOrden(s)}
        />
      ) : tab === 'proveedores' ? (
        <ProveedoresList proveedores={proveedores} busq={busq} />
      ) : (
        <OrdenesList ordenes={ordenes} busq={busq} />
      )}

      {modalSolicitud && (
        <ModalNuevaSolicitud
          onClose={() => setModalSolicitud(false)}
          onSuccess={() => {
            setModalSolicitud(false);
            toast.success('Solicitud creada');
            cargar();
          }}
        />
      )}
      {modalProveedor && (
        <ModalNuevoProveedor
          onClose={() => setModalProveedor(false)}
          onSuccess={() => {
            setModalProveedor(false);
            toast.success('Proveedor creado');
            cargar();
          }}
        />
      )}
      {modalOrden && (
        <ModalEmitirOrden
          solicitud={modalOrden}
          proveedores={proveedores}
          onClose={() => setModalOrden(null)}
          onSuccess={() => {
            setModalOrden(null);
            toast.success('Orden de compra emitida');
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

function TabBtn({ activo, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
        activo ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
      }`}
    >
      {children}
    </button>
  );
}

function SolicitudesList({ solicitudes, busq, actualizando, onCambiarEstado, onEmitirOrden }) {
  const filtradas = solicitudes.filter((s) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      (s.producto || '').toLowerCase().includes(t) ||
      (s.area || '').toLowerCase().includes(t) ||
      String(s.id_solicitud).includes(t)
    );
  });
  if (filtradas.length === 0)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        Sin solicitudes
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableHead>Solicitud</TableHead>
        <TableHead>Prioridad</TableHead>
        <TableHead>Solicitante</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead align="right">Monto Estimado</TableHead>
        <TableHead align="right">Acciones</TableHead>
      </TableHeader>
      <TableBody>
        {filtradas.map((s) => {
          const est = ESTADOS[s.estado] || ESTADOS.PENDIENTE;
          const prio = PRIORIDADES[s.prioridad] || PRIORIDADES.MEDIA;
          const ocupada = actualizando === s.id_solicitud;
          return (
            <TableRow key={s.id_solicitud}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <MdShoppingCart size={18} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text truncate max-w-[200px]">{s.producto}</p>
                    <p className="text-[11px] text-text-soft">SOL-{String(s.id_solicitud).padStart(6, '0')} · {s.area}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${prio.badge}`}>
                  {prio.label}
                </span>
              </TableCell>
              <TableCell>
                <p className="text-sm font-semibold text-text">{s.solicitante_nombre || '—'}</p>
                <p className="text-[11px] text-text-soft">{formatearFecha(s.fecha_solicitud)}</p>
              </TableCell>
              <TableCell>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${est.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                  {est.label}
                </span>
              </TableCell>
              <TableCell align="right">
                <span className="text-sm font-bold text-emerald-600">{formatearMoneda(s.monto_estimado)}</span>
              </TableCell>
              <TableCell align="right">
                <div className="flex gap-2 justify-end shrink-0">
                  {s.estado === 'PENDIENTE' && (
                    <>
                      <button
                        onClick={() => onCambiarEstado(s.id_solicitud, 'APROBADO')}
                        disabled={ocupada}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => onCambiarEstado(s.id_solicitud, 'RECHAZADO')}
                        disabled={ocupada}
                        className="px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        Rechazar
                      </button>
                    </>
                  )}
                  {s.estado === 'APROBADO' && (
                    <button
                      onClick={() => onEmitirOrden(s)}
                      disabled={ocupada}
                      className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50"
                    >
                      Emitir orden
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function ProveedoresList({ proveedores, busq }) {
  const filtrados = proveedores.filter((p) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      (p.nombre || '').toLowerCase().includes(t) ||
      (p.ruc || '').includes(t) ||
      (p.rubro || '').toLowerCase().includes(t)
    );
  });
  if (filtrados.length === 0)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        Sin proveedores
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableHead>Nombre</TableHead>
        <TableHead>RUC</TableHead>
        <TableHead>Contacto</TableHead>
        <TableHead>Teléfono</TableHead>
        <TableHead align="right">Estado</TableHead>
      </TableHeader>
      <TableBody>
        {filtrados.map((p) => (
          <TableRow key={p.id_proveedor_interno}>
            <TableCell>
              <p className="text-sm font-bold text-text truncate max-w-[200px]">{p.nombre}</p>
              <p className="text-[11px] text-text-soft">{p.rubro}</p>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium text-text">{p.ruc}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium text-text">{p.contacto || '—'}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium text-text">{p.telefono || '—'}</span>
            </TableCell>
            <TableCell align="right">
              <span
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  p.estado === 'ACTIVO' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {p.estado}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function OrdenesList({ ordenes, busq }) {
  const filtradas = ordenes.filter((o) => {
    const t = busq.toLowerCase();
    return (
      t === '' ||
      (o.proveedor_nombre || '').toLowerCase().includes(t) ||
      (o.solicitud_producto || '').toLowerCase().includes(t) ||
      String(o.id_orden).includes(t)
    );
  });
  if (filtradas.length === 0)
    return (
      <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
        Sin órdenes emitidas
      </div>
    );

  return (
    <Table>
      <TableHeader>
        <TableHead>Orden</TableHead>
        <TableHead>Proveedor</TableHead>
        <TableHead>Fecha Emisión</TableHead>
        <TableHead align="right">Monto Total</TableHead>
        <TableHead align="right">Estado</TableHead>
      </TableHeader>
      <TableBody>
        {filtradas.map((o) => (
          <TableRow key={o.id_orden}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <MdLocalShipping size={18} className="text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-text truncate max-w-[200px]">{o.solicitud_producto}</p>
                  <p className="text-[11px] text-text-soft">OC-{String(o.id_orden).padStart(6, '0')}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-semibold text-text">{o.proveedor_nombre}</span>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium text-text">{formatearFecha(o.fecha_emision)}</span>
            </TableCell>
            <TableCell align="right">
              <span className="text-sm font-bold text-text">{formatearMoneda(o.monto_total)}</span>
            </TableCell>
            <TableCell align="right">
              <span
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  o.estado === 'CERRADA'
                    ? 'bg-slate-100 text-slate-600'
                    : o.estado === 'RECIBIDA'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-sky-100 text-sky-700'
                }`}
              >
                {o.estado}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function ModalNuevaSolicitud({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    area: '',
    producto: '',
    descripcion: '',
    monto_estimado: '',
    prioridad: 'MEDIA',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/compras/solicitudes', {
        area: form.area,
        producto: form.producto,
        descripcion: form.descripcion || null,
        monto_estimado: Number(form.monto_estimado),
        prioridad: form.prioridad,
      });
      onSuccess();
    } catch (err) {
      setError(err.mensaje || 'No se pudo crear');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalShell titulo="Nueva solicitud de compra" onClose={onClose}>
      <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
        {error && <Err msg={error} />}
        <Field label="Área" valor={form.area} onChange={(v) => setForm({ ...form, area: v })} requerido />
        <Field label="Producto / servicio" valor={form.producto} onChange={(v) => setForm({ ...form, producto: v })} requerido />
        <Field
          label="Descripción"
          valor={form.descripcion}
          onChange={(v) => setForm({ ...form, descripcion: v })}
          textarea
        />
        <div className="grid grid-cols-2 gap-3">
          <Field
            label="Monto estimado (S/)"
            valor={form.monto_estimado}
            onChange={(v) => setForm({ ...form, monto_estimado: v })}
            type="number"
            requerido
          />
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Prioridad</label>
            <select
              value={form.prioridad}
              onChange={(e) => setForm({ ...form, prioridad: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              <option value="BAJA">Baja</option>
              <option value="MEDIA">Media</option>
              <option value="ALTA">Alta</option>
            </select>
          </div>
        </div>
        <BotonesModal enviando={enviando} onCancel={onClose} okLabel="Crear solicitud" />
      </form>
    </ModalShell>
  );
}

function ModalNuevoProveedor({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    rubro: '',
    contacto: '',
    telefono: '',
    email: '',
    estado: 'ACTIVO',
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/compras/proveedores', form);
      onSuccess();
    } catch (err) {
      setError(err.mensaje || 'No se pudo crear');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalShell titulo="Nuevo proveedor interno" onClose={onClose}>
      <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
        {error && <Err msg={error} />}
        <Field label="Nombre" valor={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} requerido />
        <div className="grid grid-cols-2 gap-3">
          <Field label="RUC" valor={form.ruc} onChange={(v) => setForm({ ...form, ruc: v })} requerido />
          <Field label="Rubro" valor={form.rubro} onChange={(v) => setForm({ ...form, rubro: v })} requerido />
        </div>
        <Field label="Contacto" valor={form.contacto} onChange={(v) => setForm({ ...form, contacto: v })} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Teléfono" valor={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} />
          <Field label="Email" valor={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
        </div>
        <BotonesModal enviando={enviando} onCancel={onClose} okLabel="Crear proveedor" />
      </form>
    </ModalShell>
  );
}

function ModalEmitirOrden({ solicitud, proveedores, onClose, onSuccess }) {
  const activos = proveedores.filter((p) => p.estado === 'ACTIVO');
  const [idProveedor, setIdProveedor] = useState(activos[0]?.id_proveedor_interno || '');
  const [montoTotal, setMontoTotal] = useState(String(solicitud.monto_estimado || ''));
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost('/compras/ordenes', {
        id_solicitud: solicitud.id_solicitud,
        id_proveedor_interno: Number(idProveedor),
        monto_total: Number(montoTotal),
      });
      onSuccess();
    } catch (err) {
      setError(err.mensaje || 'No se pudo emitir');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ModalShell titulo="Emitir orden de compra" onClose={onClose}>
      <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
        {error && <Err msg={error} />}
        <div className="bg-bg-soft border border-border rounded-xl p-3 text-xs">
          <p className="text-text-soft">Solicitud</p>
          <p className="font-semibold text-text mt-0.5">{solicitud.producto}</p>
          <p className="text-text-soft mt-0.5">Estimado: {formatearMoneda(solicitud.monto_estimado)}</p>
        </div>
        <div>
          <label className="text-xs font-medium text-text-soft block mb-1.5">Proveedor</label>
          <select
            value={idProveedor}
            onChange={(e) => setIdProveedor(e.target.value)}
            required
            className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
          >
            <option value="">Selecciona...</option>
            {activos.map((p) => (
              <option key={p.id_proveedor_interno} value={p.id_proveedor_interno}>
                {p.nombre} · {p.rubro}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Monto total (S/)"
          valor={montoTotal}
          onChange={setMontoTotal}
          type="number"
          requerido
        />
        <BotonesModal enviando={enviando} onCancel={onClose} okLabel="Emitir orden" />
      </form>
    </ModalShell>
  );
}

function ModalShell({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">{titulo}</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, valor, onChange, type = 'text', requerido = false, textarea = false }) {
  return (
    <div>
      <label className="text-xs font-medium text-text-soft block mb-1.5">{label}</label>
      {textarea ? (
        <textarea
          value={valor || ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
        />
      ) : (
        <input
          type={type}
          value={valor || ''}
          onChange={(e) => onChange(e.target.value)}
          required={requerido}
          className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
        />
      )}
    </div>
  );
}

function Err({ msg }) {
  return (
    <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{msg}</div>
  );
}

function BotonesModal({ enviando, onCancel, okLabel }) {
  return (
    <div className="flex gap-2 mt-2">
      <button
        type="submit"
        disabled={enviando}
        className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
      >
        {enviando ? 'Guardando...' : okLabel}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={enviando}
        className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
      >
        Cancelar
      </button>
    </div>
  );
}
