'use client';

import { useEffect, useState } from 'react';
import {
  MdClose,
  MdPerson,
  MdShield,
  MdPayment,
  MdReportProblem,
  MdHistory,
  MdNotes,
  MdSend,
  MdBadge,
  MdEmail,
  MdPhone,
  MdCalendarToday,
} from 'react-icons/md';
import { apiGet, apiPost } from '@/lib/api';

const ESTADO_CRM_BADGE = {
  NUEVO: 'bg-sky-100 text-sky-700',
  CONTACTADO: 'bg-violet-100 text-violet-700',
  CLIENTE: 'bg-emerald-100 text-emerald-700',
  INACTIVO: 'bg-slate-100 text-slate-600',
};

const ESTADO_POLIZA_BADGE = {
  ACTIVA: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  VENCIDA: 'bg-rose-100 text-rose-600',
  CANCELADA: 'bg-slate-100 text-slate-600',
};

const ESTADO_CUOTA_BADGE = {
  PAGADO: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  VENCIDO: 'bg-rose-100 text-rose-600',
};

const ESTADO_SINIESTRO_BADGE = {
  REGISTRADO: 'bg-primary/10 text-primary',
  EN_REVISION: 'bg-amber-100 text-amber-700',
  DOCUMENTACION_PENDIENTE: 'bg-orange-100 text-orange-600',
  EN_EVALUACION: 'bg-sky-100 text-sky-700',
  PROVEEDOR_ASIGNADO: 'bg-indigo-100 text-indigo-700',
  LIQUIDACION_CALCULADA: 'bg-teal-100 text-teal-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-700',
  PENDIENTE_ACEPTACION: 'bg-fuchsia-100 text-fuchsia-700',
  PAGO_PROGRAMADO: 'bg-violet-100 text-violet-700',
  FINALIZADO: 'bg-slate-100 text-slate-700',
};

const ESTADO_LEAD_BADGE = {
  NUEVO: 'bg-sky-100 text-sky-700',
  CONTACTADO: 'bg-violet-100 text-violet-700',
  EN_PROPUESTA: 'bg-amber-100 text-amber-700',
  NEGOCIACION: 'bg-blue-100 text-blue-700',
  GANADO: 'bg-emerald-100 text-emerald-700',
  PERDIDO: 'bg-rose-100 text-rose-600',
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatearMoneda(v) {
  if (v == null) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const TABS = [
  { id: 'datos', label: 'Datos', icon: MdPerson },
  { id: 'polizas', label: 'Pólizas', icon: MdShield },
  { id: 'pagos', label: 'Pagos', icon: MdPayment },
  { id: 'siniestros', label: 'Siniestros', icon: MdReportProblem },
  { id: 'historial', label: 'Historial', icon: MdHistory },
  { id: 'notas', label: 'Notas', icon: MdNotes },
];

export default function ModalDetalleCliente({ idCliente, onClose }) {
  const [tab, setTab] = useState('datos');
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [textoNota, setTextoNota] = useState('');
  const [guardandoNota, setGuardandoNota] = useState(false);
  const [errorNota, setErrorNota] = useState('');

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCliente]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet(`/clientes/${idCliente}/resumen`);
      setResumen(data);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar el detalle');
    } finally {
      setCargando(false);
    }
  };

  const enviarNota = async (e) => {
    e.preventDefault();
    if (!textoNota.trim()) return;
    setGuardandoNota(true);
    setErrorNota('');
    try {
      const nueva = await apiPost(`/clientes/${idCliente}/notas`, { texto: textoNota.trim() });
      setResumen((r) => ({ ...r, notas: [nueva, ...(r?.notas || [])] }));
      setTextoNota('');
    } catch (err) {
      setErrorNota(err.mensaje || 'No se pudo guardar la nota');
    } finally {
      setGuardandoNota(false);
    }
  };

  const cliente = resumen?.cliente;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="bg-primary/5 px-5 py-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center text-sm font-bold text-primary uppercase shrink-0">
              {cliente ? `${cliente.nombres?.[0] || ''}${cliente.apellidos?.[0] || ''}` : '·'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-text truncate">
                {cliente ? `${cliente.nombres} ${cliente.apellidos}` : 'Detalle de cliente'}
              </p>
              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="text-xs text-text-soft">CLI-{String(idCliente).padStart(6, '0')}</span>
                {cliente && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      ESTADO_CRM_BADGE[cliente.estado_crm] || 'bg-bg-soft text-text-soft'
                    }`}
                  >
                    {cliente.estado_crm}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-bg/50 text-text-soft transition-colors shrink-0"
          >
            <MdClose size={18} />
          </button>
        </div>

        <div className="flex border-b border-border px-4 gap-1 h-10 border">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
                }`}
              >
                <Icon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {cargando ? (
            <p className="text-sm text-text-soft text-center py-8">Cargando información...</p>
          ) : error ? (
            <p className="text-sm text-rose-500 text-center py-8">{error}</p>
          ) : !resumen ? null : (
            <>
              {tab === 'datos' && <TabDatos cliente={cliente} />}
              {tab === 'polizas' && <TabPolizas polizas={resumen.polizas} />}
              {tab === 'pagos' && <TabPagos cuotas={resumen.cuotas} />}
              {tab === 'siniestros' && <TabSiniestros siniestros={resumen.siniestros} />}
              {tab === 'historial' && <TabHistorial leads={resumen.historial_comercial} />}
              {tab === 'notas' && (
                <TabNotas
                  notas={resumen.notas}
                  texto={textoNota}
                  onTextoChange={setTextoNota}
                  onEnviar={enviarNota}
                  guardando={guardandoNota}
                  error={errorNota}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TabDatos({ cliente }) {
  if (!cliente) return null;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Campo icono={MdPerson} label="Nombres" valor={cliente.nombres} />
      <Campo icono={MdPerson} label="Apellidos" valor={cliente.apellidos} />
      <Campo icono={MdBadge} label="Documento" valor={cliente.documento_identidad} />
      <Campo icono={MdEmail} label="Email" valor={cliente.email} />
      <Campo icono={MdPhone} label="Teléfono" valor={cliente.telefono || '—'} />
      <Campo icono={MdCalendarToday} label="Cliente desde" valor={formatearFecha(cliente.fecha_registro)} />
    </div>
  );
}

function Campo({ icono: Icono, label, valor }) {
  return (
    <div className="bg-bg-soft rounded-xl p-3">
      <p className="text-[11px] text-text-soft flex items-center gap-1 mb-1">
        <Icono size={11} /> {label}
      </p>
      <p className="text-sm font-semibold text-text break-words">{valor || '—'}</p>
    </div>
  );
}

function TabPolizas({ polizas }) {
  if (!polizas || polizas.length === 0) {
    return <Empty texto="El cliente no tiene polizas asociadas." />;
  }
  return (
    <div className="flex flex-col gap-3">
      {polizas.map((p) => (
        <div key={p.id_poliza} className="bg-bg-soft rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-bold text-text">{p.producto?.nombre || 'Poliza'}</p>
              <p className="text-xs text-text-soft mt-0.5">
                POL-{String(p.id_poliza).padStart(6, '0')} · {p.producto?.tipo_seguro}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ESTADO_POLIZA_BADGE[p.estado_poliza] || 'bg-bg-soft text-text-soft'
              }`}
            >
              {p.estado_poliza}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-3 text-xs text-text-soft">
            <div>
              <p>Prima</p>
              <p className="font-semibold text-text mt-0.5">{formatearMoneda(p.prima_total)}</p>
            </div>
            <div>
              <p>Inicio</p>
              <p className="font-semibold text-text mt-0.5">{formatearFecha(p.vigencia_inicio)}</p>
            </div>
            <div>
              <p>Fin</p>
              <p className="font-semibold text-text mt-0.5">{formatearFecha(p.vigencia_fin)}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabPagos({ cuotas }) {
  if (!cuotas || cuotas.length === 0) {
    return <Empty texto="No hay cuotas registradas." />;
  }
  const grupos = {};
  cuotas.forEach((c) => {
    const key = c.id_poliza || 0;
    if (!grupos[key]) grupos[key] = { nombre: c.poliza_nombre || 'Sin póliza', id: key, items: [] };
    grupos[key].items.push(c);
  });
  const lista = Object.values(grupos).sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <div className="flex flex-col gap-4">
      {lista.map((g) => (
        <div key={g.id}>
          <p className="text-xs font-bold text-text mb-2">
            {g.nombre}{' '}
            <span className="text-text-soft font-normal">
              · {g.items.length} cuota{g.items.length > 1 ? 's' : ''}
            </span>
          </p>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-text-soft border-b border-border">
                <th className="pb-2 font-medium">Cuota</th>
                <th className="pb-2 font-medium">Vencimiento</th>
                <th className="pb-2 font-medium">Monto</th>
                <th className="pb-2 font-medium text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {g.items.map((c) => (
                <tr key={c.id_cuota} className="border-b border-border/50 last:border-0">
                  <td className="py-2 text-text">#{c.numero_cuota}</td>
                  <td className="py-2 text-text">{formatearFecha(c.fecha_vencimiento)}</td>
                  <td className="py-2 text-text font-medium">{formatearMoneda(c.monto)}</td>
                  <td className="py-2 text-right">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ESTADO_CUOTA_BADGE[c.estado_pago] || 'bg-bg-soft text-text-soft'}`}
                    >
                      {c.estado_pago}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

function TabSiniestros({ siniestros }) {
  if (!siniestros || siniestros.length === 0) {
    return <Empty texto="No hay siniestros reportados." />;
  }
  return (
    <div className="flex flex-col gap-3">
      {siniestros.map((s) => (
        <div key={s.id_siniestro} className="bg-bg-soft rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div>
              <p className="text-sm font-bold text-text">SIN-{String(s.id_siniestro).padStart(6, '0')}</p>
              <p className="text-xs text-text-soft mt-0.5">
                {s.tipo_incidente} · {formatearFecha(s.fecha_reporte)}
              </p>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ESTADO_SINIESTRO_BADGE[s.estado_resolucion] || 'bg-bg-soft text-text-soft'
              }`}
            >
              {s.estado_resolucion}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-2 line-clamp-2">{s.descripcion}</p>
          {s.monto_reclamado != null && (
            <p className="text-xs text-text-soft mt-2">
              Reclamado: <span className="text-text font-semibold">{formatearMoneda(s.monto_reclamado)}</span>
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

function TabHistorial({ leads }) {
  if (!leads || leads.length === 0) {
    return <Empty texto="Sin cotizaciones o leads en el historial." />;
  }
  return (
    <div className="flex flex-col gap-2">
      {leads.map((l) => (
        <div
          key={l.id_cotizacion}
          className="bg-bg-soft rounded-xl border border-border p-3 flex items-center justify-between gap-3 flex-wrap"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">
              COT-{String(l.id_cotizacion).padStart(6, '0')} · {l.producto_interes}
            </p>
            <p className="text-xs text-text-soft mt-0.5">
              Agente: {l.agente_asignado} · {formatearFecha(l.fecha_ingreso)}
            </p>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
              ESTADO_LEAD_BADGE[l.estado_kanban] || 'bg-bg-soft text-text-soft'
            }`}
          >
            {l.estado_kanban}
          </span>
        </div>
      ))}
    </div>
  );
}

function TabNotas({ notas, texto, onTextoChange, onEnviar, guardando, error }) {
  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={onEnviar} className="flex flex-col gap-2 p-3 bg-bg-soft rounded-xl border border-border">
        {error && <div className="p-2 text-xs bg-red-50 text-red-500 rounded-lg border border-red-100">{error}</div>}
        <textarea
          value={texto}
          onChange={(e) => onTextoChange(e.target.value)}
          rows={2}
          placeholder="Escribe una nota interna sobre el cliente..."
          className="w-full px-3 py-2 rounded-lg text-sm border border-border outline-none bg-bg text-text focus:border-primary resize-none"
        />
        <button
          type="submit"
          disabled={guardando || !texto.trim()}
          className="self-end flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdSend size={13} /> {guardando ? 'Guardando...' : 'Agregar nota'}
        </button>
      </form>

      {!notas || notas.length === 0 ? (
        <Empty texto="Aun no hay notas internas para este cliente." />
      ) : (
        <div className="flex flex-col gap-2">
          {notas.map((n) => (
            <div key={n.id_nota} className="p-3 rounded-xl border border-border bg-bg">
              <p className="text-sm text-text whitespace-pre-wrap">{n.texto}</p>
              <p className="text-[11px] text-text-soft mt-2">
                {n.autor || 'Sistema'} · {formatearFecha(n.fecha)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Empty({ texto }) {
  return (
    <div className="py-8 text-center text-sm text-text-soft border border-dashed border-border rounded-xl">{texto}</div>
  );
}
