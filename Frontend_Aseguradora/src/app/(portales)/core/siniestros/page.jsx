'use client';
import toast from 'react-hot-toast';

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
  MdEngineering,
  MdSave,
  MdDownload,
  MdInsertDriveFile,
  MdPaid,
} from 'react-icons/md';
import { apiGet, apiPatch, apiPost, apiDelete, apiDownloadFile } from '@/lib/api';
import ModalConfirm from '../../componentsMain/ModalConfirm';

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
  const [modalPerito, setModalPerito] = useState(null);
  const [modalIndemnizar, setModalIndemnizar] = useState(null);
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
const cambiarEstado = async (id, estado) => {
    setActualizandoId(id);
    try {
      const data = await apiPatch(`/siniestros/${id}/estado`, { estado_resolucion: estado });
      setSiniestros((prev) => prev.map((s) => (s.id_siniestro === id ? data : s)));
      toast.success('Estado actualizado');
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
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
              onPerito={() => setModalPerito(s)}
              onIndemnizar={() => setModalIndemnizar(s)}
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
            toast.success('Analista asignado');
          }}
        />
      )}

      {modalProveedores && (
        <ModalProveedores
          siniestro={modalProveedores}
          onClose={() => setModalProveedores(null)}
          onToast={(msg) => toast.success(msg)}
        />
      )}

      {modalPerito && (
        <ModalPerito
          siniestro={modalPerito}
          onClose={() => setModalPerito(null)}
          onSuccess={(actualizada) => {
            setSiniestros((prev) =>
              prev.map((s) => (s.id_siniestro === actualizada.id_siniestro ? actualizada : s))
            );
            setModalPerito(null);
            toast.success('Informe del perito guardado');
          }}
        />
      )}

      {modalIndemnizar && (
        <ModalIndemnizar
          siniestro={modalIndemnizar}
          onClose={() => setModalIndemnizar(null)}
          onSuccess={() => {
            setModalIndemnizar(null);
            toast.success('Indemnizacion registrada');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function SiniestroRow({ s, onCambiarEstado, onAsignar, onProveedores, onPerito, onIndemnizar, actualizando }) {
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
            onClick={onPerito}
            disabled={actualizando}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
            title={s.observaciones_perito ? 'Ver informe del perito' : 'Registrar informe del perito'}
          >
            <MdEngineering size={13} /> {s.observaciones_perito ? 'Ver perito' : 'Perito'}
          </button>
          {(s.estado_resolucion === 'APROBADO' || s.estado_resolucion === 'LIQUIDADO') && (
            <button
              onClick={onIndemnizar}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-colors disabled:opacity-50"
              title="Liquidar e indemnizar"
            >
              <MdPaid size={13} /> {s.estado_resolucion === 'LIQUIDADO' ? 'Ver indemnizacion' : 'Liquidar e indemnizar'}
            </button>
          )}
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
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
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
  const [confirmacion, setConfirmacion] = useState(null);

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

  const quitar = (idProveedor) => {
    setConfirmacion({
      mensaje: '¿Quitar este proveedor del caso?',
      accion: async () => {
        try {
          await apiDelete(`/siniestros/${siniestro.id_siniestro}/proveedores/${idProveedor}`);
          onToast('Proveedor quitado');
          cargar();
        } catch (e) {
          setError(e.mensaje || 'No se pudo quitar');
        }
      },
    });
  };

  const yaAsignados = new Set(asignados.map((a) => a.id_proveedor));
  const disponibles = proveedores.filter((p) => !yaAsignados.has(p.id_proveedor));
  const totalCosto = asignados.reduce((acc, a) => acc + Number(a.costo_servicio || 0), 0);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
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
        <ModalConfirm
          abierto={!!confirmacion}
          titulo="Confirmar accion"
          mensaje={confirmacion?.mensaje}
          textoConfirmar="Quitar"
          variante="danger"
          onConfirmar={confirmacion?.accion}
          onCancelar={() => setConfirmacion(null)}
        />
      </div>
    </div>
  );
}

function ModalPerito({ siniestro, onClose, onSuccess }) {
  const [observaciones, setObservaciones] = useState(siniestro.observaciones_perito || '');
  const [monto, setMonto] = useState(
    siniestro.monto_estimado_perito != null ? String(siniestro.monto_estimado_perito) : ''
  );
  const [informe, setInforme] = useState(siniestro.informe_tecnico || '');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [documentos, setDocumentos] = useState([]);

  useEffect(() => {
    apiGet(`/siniestros/${siniestro.id_siniestro}/documentos`)
      .then((data) => setDocumentos(data || []))
      .catch(() => setDocumentos([]));
  }, [siniestro.id_siniestro]);

  const descargarDoc = async (doc) => {
    try {
      await apiDownloadFile(`/documentos/${doc.id_documento}/archivo`, doc.nombre_archivo);
    } catch (e) {
      setError(e.mensaje || 'No se pudo descargar');
    }
  };

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      const data = await apiPost(`/siniestros/${siniestro.id_siniestro}/perito/observacion`, {
        observaciones_perito: observaciones || null,
        monto_estimado_perito: monto ? Number(monto) : null,
        informe_tecnico: informe || null,
      });
      onSuccess(data);
    } catch (err) {
      setError(err.mensaje || 'No se pudo guardar el informe');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
              <MdEngineering size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Informe del perito</p>
              <p className="text-[11px] text-text-soft">
                SIN-{String(siniestro.id_siniestro).padStart(6, '0')} · {siniestro.tipo_incidente}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>

        <form onSubmit={enviar} className="p-5 flex flex-col gap-3 overflow-y-auto">
          {error && (
            <div className="p-2.5 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="bg-bg-soft border border-border rounded-xl p-3 grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-text-soft">Cliente</p>
              <p className="font-semibold text-text">{siniestro.cliente_nombre}</p>
            </div>
            <div>
              <p className="text-text-soft">Monto reclamado</p>
              <p className="font-semibold text-text">{formatearMoneda(siniestro.monto_reclamado)}</p>
            </div>
            <div className="col-span-2">
              <p className="text-text-soft">Póliza</p>
              <p className="font-semibold text-text truncate">
                POL-{String(siniestro.id_poliza).padStart(6, '0')} · {siniestro.poliza_nombre}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">
              Observaciones del perito
            </label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={4}
              maxLength={4000}
              placeholder="Detalla lo que el perito constato en la inspeccion..."
              className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Monto estimado (S/)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Informe técnico (referencia)
              </label>
              <input
                type="text"
                value={informe}
                onChange={(e) => setInforme(e.target.value)}
                maxLength={500}
                placeholder="Nombre o link del informe"
                className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>

          {documentos.length > 0 && (
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">
                Evidencias del cliente ({documentos.length})
              </p>
              <div className="flex flex-col gap-1.5">
                {documentos.map((doc) => (
                  <div
                    key={doc.id_documento}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border bg-bg-soft"
                  >
                    <MdInsertDriveFile size={14} className="text-primary shrink-0" />
                    <p className="text-xs text-text flex-1 truncate">{doc.nombre_archivo}</p>
                    <button
                      type="button"
                      onClick={() => descargarDoc(doc)}
                      className="p-1 rounded hover:bg-bg text-text-soft"
                      title="Descargar"
                    >
                      <MdDownload size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <p className="text-[11px] text-text-soft">
            Al guardar, el caso pasa automaticamente al estado <strong>INSPECCION</strong> si estaba en
            REPORTADO o EN_REVISION.
          </p>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdSave size={13} /> {enviando ? 'Guardando...' : 'Guardar informe'}
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

function ModalIndemnizar({ siniestro, onClose, onSuccess }) {
  const [historial, setHistorial] = useState([]);
  const [beneficiarios, setBeneficiarios] = useState([]);
  const [montoAprobado, setMontoAprobado] = useState(
    siniestro.monto_estimado_perito != null
      ? String(siniestro.monto_estimado_perito)
      : siniestro.monto_reclamado != null
      ? String(siniestro.monto_reclamado)
      : ''
  );
  const [montoPagado, setMontoPagado] = useState('');
  const [medioPago, setMedioPago] = useState('TRANSFERENCIA');
  const [idPolizaBeneficiario, setIdPolizaBeneficiario] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet(`/siniestros/${siniestro.id_siniestro}/indemnizacion`)
      .then((data) => setHistorial(data || []))
      .catch(() => setHistorial([]));
    apiGet(`/polizas/${siniestro.id_poliza}`)
      .then((data) => setBeneficiarios(data?.beneficiarios || []))
      .catch(() => setBeneficiarios([]));
  }, [siniestro.id_siniestro, siniestro.id_poliza]);

  const enviar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setError('');
    try {
      await apiPost(`/siniestros/${siniestro.id_siniestro}/indemnizacion`, {
        monto_aprobado: Number(montoAprobado),
        monto_pagado: montoPagado ? Number(montoPagado) : 0,
        medio_pago: medioPago,
        id_poliza_beneficiario: idPolizaBeneficiario ? Number(idPolizaBeneficiario) : null,
        observaciones: observaciones || null,
      });
      onSuccess();
    } catch (err) {
      setError(err.mensaje || 'No se pudo registrar la indemnizacion');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
              <MdPaid size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-text">Liquidar e indemnizar</p>
              <p className="text-[11px] text-text-soft">
                SIN-{String(siniestro.id_siniestro).padStart(6, '0')} · {siniestro.tipo_incidente}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>

        <form onSubmit={enviar} className="p-5 flex flex-col gap-3 overflow-y-auto">
          {error && (
            <div className="p-2.5 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          {historial.length > 0 && (
            <div className="bg-bg-soft border border-border rounded-xl p-3">
              <p className="text-xs font-semibold text-text-soft mb-2">
                Indemnizaciones previas ({historial.length})
              </p>
              <div className="flex flex-col gap-1.5">
                {historial.map((i) => (
                  <div key={i.id_indemnizacion} className="flex justify-between text-xs">
                    <span className="text-text-soft">
                      {i.medio_pago} {i.beneficiario_nombre ? `· ${i.beneficiario_nombre}` : ''}
                    </span>
                    <span className="font-semibold text-text">{formatearMoneda(i.monto_aprobado)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Monto aprobado (S/) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                required
                value={montoAprobado}
                onChange={(e) => setMontoAprobado(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Monto pagado (S/)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={montoPagado}
                onChange={(e) => setMontoPagado(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Medio de pago</label>
            <select
              value={medioPago}
              onChange={(e) => setMedioPago(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              <option value="TRANSFERENCIA">Transferencia bancaria</option>
              <option value="CHEQUE">Cheque</option>
              <option value="REPARACION_DIRECTA">Reparacion directa</option>
              <option value="OTRO">Otro</option>
            </select>
          </div>

          {beneficiarios.length > 0 && (
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Pagar a beneficiario (opcional)
              </label>
              <select
                value={idPolizaBeneficiario}
                onChange={(e) => setIdPolizaBeneficiario(e.target.value)}
                className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              >
                <option value="">Pago directo al asegurado</option>
                {beneficiarios.map((b) => (
                  <option key={b.id_poliza_beneficiario} value={b.id_poliza_beneficiario}>
                    {b.nombres} {b.apellidos} ({b.parentesco}) · {Number(b.porcentaje).toFixed(0)}%
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary resize-none"
            />
          </div>

          <p className="text-[11px] text-text-soft">
            Al confirmar, el siniestro pasa a <strong>LIQUIDADO</strong> y se notifica al asegurado.
          </p>

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              disabled={enviando || !montoAprobado}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold transition-colors"
            >
              <MdAttachMoney size={13} />
              {enviando ? 'Registrando...' : 'Registrar indemnizacion'}
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
