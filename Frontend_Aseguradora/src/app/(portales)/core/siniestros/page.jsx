'use client';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdWarning,
  MdPerson,
  MdCalendarToday,
  MdAttachMoney,
  MdAssignmentInd,
  MdEdit,
  MdClose,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdHandyman,
  MdAdd,
  MdDeleteOutline,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost, apiDelete } from '@/lib/api';

const ESTADOS = {
  REPORTADO: { label: 'Reportado', badge: 'bg-primary/10 text-primary', dot: 'bg-primary' },
  EN_REVISION: { label: 'En revisión', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  INSPECCION: { label: 'Inspección', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-400' },
  APROBADO: { label: 'Aprobado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  RECHAZADO: { label: 'Rechazado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
  LIQUIDADO: { label: 'Liquidado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
};

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
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

export default function SiniestrosCorePage() {
  const [siniestros, setSiniestros] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [busq, setBusq] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [modalAsignar, setModalAsignar] = useState(null);
  const [modalProveedores, setModalProveedores] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/siniestros');
      setSiniestros(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los siniestros');
    } finally {
      setCargando(false);
    }
  };

  const mostrarToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const cambiarEstado = async (id, estado) => {
    setActualizandoId(id);
    try {
      const data = await apiPatch(`/siniestros/${id}/estado`, { estado_resolucion: estado });
      setSiniestros((prev) => prev.map((s) => (s.id_siniestro === id ? data : s)));
      mostrarToast('Estado actualizado');
    } catch (e) {
      mostrarToast(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtrados = siniestros.filter((s) => {
    const matchEstado = filtro === 'todos' || s.estado_resolucion === filtro;
    const t = busq.toLowerCase();
    const matchBusq =
      t === '' ||
      String(s.id_siniestro).includes(t) ||
      (s.tipo_incidente || '').toLowerCase().includes(t) ||
      (s.cliente_nombre || '').toLowerCase().includes(t);
    return matchEstado && matchBusq;
  });

  const counts = Object.keys(ESTADOS).reduce(
    (acc, k) => ({ ...acc, [k]: siniestros.filter((s) => s.estado_resolucion === k).length }),
    {}
  );

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      <div>
        <h1 className="text-base font-bold text-text">Bandeja de siniestros</h1>
        <p className="text-xs text-text-soft mt-0.5">{siniestros.length} casos en el sistema</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(ESTADOS).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFiltro(filtro === k ? 'todos' : k)}
            className={`text-left rounded-xl border p-3 transition-colors ${
              filtro === k ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-1.5 h-1.5 rounded-full ${v.dot}`} />
              <p className="text-xs text-text-soft truncate">{v.label}</p>
            </div>
            <p className="text-lg font-bold text-text">{counts[k] || 0}</p>
          </button>
        ))}
      </div>

      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por ID, tipo o cliente..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdWarning size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin siniestros</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtrados.map((s) => (
            <SiniestroRow
              key={s.id_siniestro}
              s={s}
              actualizando={actualizandoId === s.id_siniestro}
              onCambiarEstado={(estado) => cambiarEstado(s.id_siniestro, estado)}
              onAsignar={() => setModalAsignar(s)}
              onProveedores={() => setModalProveedores(s)}
            />
          ))}
        </div>
      )}

      {modalAsignar && (
        <ModalAsignar
          siniestro={modalAsignar}
          onClose={() => setModalAsignar(null)}
          onSuccess={(actualizada) => {
            setSiniestros((prev) => prev.map((s) => (s.id_siniestro === actualizada.id_siniestro ? actualizada : s)));
            setModalAsignar(null);
            mostrarToast('Analista asignado');
          }}
        />
      )}

      {modalProveedores && (
        <ModalProveedores
          siniestro={modalProveedores}
          onClose={() => setModalProveedores(null)}
          onToast={mostrarToast}
        />
      )}
    </div>
  );
}

function SiniestroRow({ s, onCambiarEstado, onAsignar, onProveedores, actualizando }) {
  const tipoStyle = estiloTipo(s.poliza_tipo);
  const Icon = tipoStyle.icon;
  const est = ESTADOS[s.estado_resolucion] || ESTADOS.REPORTADO;
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
            <p className="text-sm font-bold text-text">SIN-{String(s.id_siniestro).padStart(6, '0')}</p>
            <span
              className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
              {est.label}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            POL-{String(s.id_poliza).padStart(6, '0')} · {s.poliza_nombre}
          </p>
          <p className="text-sm text-text mt-1">{s.tipo_incidente}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
            <span className="flex items-center gap-1">
              <MdPerson size={11} /> Cliente: {s.cliente_nombre}
            </span>
            <span className="flex items-center gap-1">
              <MdAssignmentInd size={11} /> Analista: {s.analista_asignado || 'Sin asignar'}
            </span>
            <span className="flex items-center gap-1">
              <MdCalendarToday size={11} /> {formatearFecha(s.fecha_reporte)}
            </span>
            <span className="flex items-center gap-1">
              <MdAttachMoney size={11} /> {formatearMoneda(s.monto_reclamado)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0 relative">
          <button
            onClick={onAsignar}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50"
          >
            <MdAssignmentInd size={13} /> {s.id_empleado_analista ? 'Reasignar' : 'Asignar'}
          </button>
          <button
            onClick={onProveedores}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
          >
            <MdHandyman size={13} /> Proveedores
          </button>
          <button
            onClick={() => setMenu((v) => !v)}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
          >
            <MdEdit size={13} /> Cambiar estado
          </button>
          {menu && (
            <div className="absolute right-0 top-full mt-1 w-44 bg-bg border border-border rounded-xl shadow-lg z-10 overflow-hidden">
              {Object.entries(ESTADOS)
                .filter(([k]) => k !== s.estado_resolucion)
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

function ModalAsignar({ siniestro, onClose, onSuccess }) {
  const [empleados, setEmpleados] = useState([]);
  const [seleccionado, setSeleccionado] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/empleados?area=TECNICO')
      .then((data) => setEmpleados(data || []))
      .catch(() => {});
  }, []);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const data = await apiPatch(`/siniestros/${siniestro.id_siniestro}/asignar`, {
        id_empleado_analista: Number(seleccionado),
      });
      onSuccess(data);
    } catch (e) {
      setError(e.mensaje || 'No se pudo asignar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Asignar analista</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <form onSubmit={enviar} className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>
          )}
          <p className="text-xs text-text-soft">
            Caso: <span className="font-semibold text-text">SIN-{String(siniestro.id_siniestro).padStart(6, '0')}</span>
          </p>
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Analista (área TECNICO)</label>
            <select
              value={seleccionado}
              onChange={(e) => setSeleccionado(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              <option value="">Seleccionar...</option>
              {empleados.map((e) => (
                <option key={e.id_empleado} value={e.id_empleado}>
                  {e.nombres} {e.apellidos} · {e.cargo}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando || !seleccionado}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Asignando...' : 'Confirmar'}
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

function ModalProveedores({ siniestro, onClose, onToast }) {
  const [asignados, setAsignados] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [seleccionado, setSeleccionado] = useState('');
  const [costo, setCosto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const cargar = async () => {
    setCargando(true);
    try {
      const [a, p] = await Promise.all([
        apiGet(`/siniestros/${siniestro.id_siniestro}/proveedores`),
        apiGet('/proveedores?estado=ACTIVO'),
      ]);
      setAsignados(a || []);
      setProveedores(p || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const asignar = async (e) => {
    e.preventDefault();
    if (!seleccionado || !costo) return;
    setEnviando(true);
    setError('');
    try {
      await apiPost(`/siniestros/${siniestro.id_siniestro}/proveedores`, {
        id_proveedor: Number(seleccionado),
        costo_servicio: Number(costo),
      });
      setSeleccionado('');
      setCosto('');
      onToast('Proveedor asignado');
      cargar();
    } catch (e) {
      setError(e.mensaje || 'No se pudo asignar');
    } finally {
      setEnviando(false);
    }
  };

  const quitar = async (idProveedor) => {
    if (!confirm('Quitar este proveedor del caso?')) return;
    try {
      await apiDelete(`/siniestros/${siniestro.id_siniestro}/proveedores/${idProveedor}`);
      onToast('Proveedor quitado');
      cargar();
    } catch (e) {
      setError(e.mensaje || 'No se pudo quitar');
    }
  };

  const yaAsignados = new Set(asignados.map((a) => a.id_proveedor));
  const disponibles = proveedores.filter((p) => !yaAsignados.has(p.id_proveedor));
  const totalCosto = asignados.reduce((acc, a) => acc + Number(a.costo_servicio || 0), 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-bold text-text">Proveedores asignados</p>
            <p className="text-[11px] text-text-soft">SIN-{String(siniestro.id_siniestro).padStart(6, '0')} - {siniestro.tipo_incidente}</p>
          </div>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {error && (
            <div className="p-2.5 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">{error}</div>
          )}

          <div>
            <p className="text-xs font-bold text-text mb-2">En el caso ({asignados.length})</p>
            {cargando ? (
              <p className="text-xs text-text-soft">Cargando...</p>
            ) : asignados.length === 0 ? (
              <p className="text-xs text-text-soft">Aun no hay proveedores asignados.</p>
            ) : (
              <div className="flex flex-col divide-y divide-border">
                {asignados.map((a) => (
                  <div key={a.id_proveedor} className="py-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-bg-soft flex items-center justify-center shrink-0">
                      <MdHandyman size={14} className="text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-text truncate">{a.nombre}</p>
                      <p className="text-[11px] text-text-soft">{a.rubro} - {a.ciudad}</p>
                    </div>
                    <p className="text-sm font-bold text-text">{formatearMoneda(a.costo_servicio)}</p>
                    <button onClick={() => quitar(a.id_proveedor)} className="text-rose-600 hover:bg-rose-50 rounded-lg p-1.5">
                      <MdDeleteOutline size={16} />
                    </button>
                  </div>
                ))}
                <div className="pt-2 flex justify-between text-xs">
                  <span className="font-semibold text-text-soft">Costo total</span>
                  <span className="font-bold text-text">{formatearMoneda(totalCosto)}</span>
                </div>
              </div>
            )}
          </div>

          <form onSubmit={asignar} className="flex flex-col gap-2 border-t border-border pt-3">
            <p className="text-xs font-bold text-text">Asignar nuevo</p>
            <select
              value={seleccionado}
              onChange={(e) => setSeleccionado(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-bg-soft"
              required
            >
              <option value="">Selecciona un proveedor...</option>
              {disponibles.map((p) => (
                <option key={p.id_proveedor} value={p.id_proveedor}>
                  {p.nombre} - {p.rubro} - {p.ciudad}
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Costo del servicio"
              value={costo}
              onChange={(e) => setCosto(e.target.value)}
              className="border border-border rounded-lg px-3 py-2 text-sm bg-bg-soft"
              required
            />
            <button
              type="submit"
              disabled={enviando || disponibles.length === 0}
              className="bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary-hover disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <MdAdd size={14} /> {enviando ? 'Guardando...' : 'Agregar al caso'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
