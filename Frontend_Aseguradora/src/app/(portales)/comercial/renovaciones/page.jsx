'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdAutorenew,
  MdSend,
  MdCancel,
  MdCalendarToday,
  MdAttachMoney,
  MdPerson,
  MdShield,
  MdEditNote,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';
import ModalConfirm from '../../componentsMain/ModalConfirm';

const RANGOS = [
  { dias: 7, label: '7 días' },
  { dias: 15, label: '15 días' },
  { dias: 30, label: '30 días' },
  { dias: 60, label: '60 días' },
  { dias: 90, label: '90 días' },
];

const ESTADO_POLIZA_BADGE = {
  ACTIVA: 'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  VENCIDA: 'bg-rose-100 text-rose-600',
  CANCELADA: 'bg-slate-100 text-slate-600',
};

const ESTADO_ENDOSO_BADGE = {
  PENDIENTE: 'bg-amber-100 text-amber-700',
  APROBADO: 'bg-emerald-100 text-emerald-700',
  RECHAZADO: 'bg-rose-100 text-rose-600',
};

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

function diasHasta(iso) {
  if (!iso) return null;
  const objetivo = new Date(iso);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  objetivo.setHours(0, 0, 0, 0);
  return Math.round((objetivo - hoy) / (1000 * 60 * 60 * 24));
}

export default function RenovacionesPage() {
  const [tab, setTab] = useState('renovaciones');
  const [renovaciones, setRenovaciones] = useState([]);
  const [endosos, setEndosos] = useState([]);
  const [rango, setRango] = useState(30);
  const [busqRen, setBusqRen] = useState('');
  const [busqEnd, setBusqEnd] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
const [actualizando, setActualizando] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => {
    cargar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rango]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [ren, end] = await Promise.all([
        apiGet(`/polizas/renovaciones?dias=${rango}`).catch(() => []),
        apiGet('/endosos').catch(() => []),
      ]);
      setRenovaciones(ren || []);
      setEndosos(end || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los datos');
    } finally {
      setCargando(false);
    }
  };
const marcarNoRenovada = async (idPoliza) => {
    setConfirmacion({
      mensaje: '¿Marcar la poliza como cancelada/no renovada?',
      accion: async () => {
        setActualizando('poliza-' + idPoliza);
        try {
          await apiPatch(`/polizas/${idPoliza}/estado`, { estado_poliza: 'CANCELADA' });
          toast.success('Poliza marcada como cancelada');
          cargar();
        } catch (e) {
          toast.error(e.mensaje || 'No se pudo actualizar');
        } finally {
          setActualizando(null);
        }
      },
    });
  };

  const cambiarEstadoEndoso = async (idEndoso, nuevo) => {
    setActualizando('endoso-' + idEndoso);
    try {
      await apiPatch(`/endosos/${idEndoso}/estado`, { estado_aprobacion: nuevo });
      toast.success(`Endoso ${nuevo.toLowerCase()}`);
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizando(null);
    }
  };

  const renFiltradas = renovaciones.filter((p) => {
    const texto = busqRen.toLowerCase();
    return (
      texto === '' ||
      String(p.id_poliza).includes(texto) ||
      (p.producto?.nombre || '').toLowerCase().includes(texto) ||
      (p.cliente_nombre || '').toLowerCase().includes(texto)
    );
  });

  const endFiltrados = endosos.filter((e) => {
    const texto = busqEnd.toLowerCase();
    return (
      texto === '' ||
      String(e.id_endoso).includes(texto) ||
      (e.tipo_cambio || '').toLowerCase().includes(texto) ||
      (e.descripcion_cambio || '').toLowerCase().includes(texto)
    );
  });

  const endosoPendientes = endosos.filter((e) => e.estado_aprobacion === 'PENDIENTE').length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div>
        <h1 className="text-base font-bold text-text">Renovaciones y endosos</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Mantén la cartera vigente: renueva próximas a vencer y gestiona los cambios solicitados.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi
          label="Próximas a renovar"
          val={renovaciones.length}
          icon={MdAutorenew}
          bg="bg-amber-100"
          color="text-amber-600"
        />
        <Kpi
          label="Endosos pendientes"
          val={endosoPendientes}
          icon={MdEditNote}
          bg="bg-primary/10"
          color="text-primary"
        />
        <Kpi
          label="Endosos totales"
          val={endosos.length}
          icon={MdShield}
          bg="bg-sky-100"
          color="text-sky-600"
        />
        <Kpi
          label="Rango actual"
          val={`${rango} días`}
          icon={MdCalendarToday}
          bg="bg-bg-soft"
          color="text-text"
        />
      </div>

      <div className="flex border-b border-border gap-2">
        <TabButton activo={tab === 'renovaciones'} onClick={() => setTab('renovaciones')}>
          <MdAutorenew size={14} /> Renovaciones
        </TabButton>
        <TabButton activo={tab === 'endosos'} onClick={() => setTab('endosos')}>
          <MdEditNote size={14} /> Endosos
        </TabButton>
      </div>

      {tab === 'renovaciones' && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <input
                placeholder="Buscar por cliente o producto..."
                value={busqRen}
                onChange={(e) => setBusqRen(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
              />
            </div>
            <select
              value={rango}
              onChange={(e) => setRango(Number(e.target.value))}
              className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
            >
              {RANGOS.map((r) => (
                <option key={r.dias} value={r.dias}>
                  Próximas {r.label}
                </option>
              ))}
            </select>
          </div>

          {cargando ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Cargando renovaciones...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
              {error}
            </div>
          ) : renFiltradas.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdAutorenew size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">Sin renovaciones en el rango seleccionado</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {renFiltradas.map((p) => (
                <RenovacionCard
                  key={p.id_poliza}
                  poliza={p}
                  actualizando={actualizando === 'poliza-' + p.id_poliza}
                  onEnviarPropuesta={() => toast.success('Propuesta enviada al cliente')}
                  onMarcarNoRenovada={() => marcarNoRenovada(p.id_poliza)}
                  onRenovar={() => toast.success('Renovacion iniciada. Confirma con el cliente.')}
                  onRecalcular={() => toast.success('Nueva prima estimada solicitada al area tecnica.')}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {tab === 'endosos' && (
        <div className="flex flex-col gap-3">
          <div className="relative">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar por tipo o descripción..."
              value={busqEnd}
              onChange={(e) => setBusqEnd(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
            />
          </div>

          {cargando ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Cargando endosos...
            </div>
          ) : endFiltrados.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdEditNote size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">No hay endosos para mostrar</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {endFiltrados.map((e) => (
                <EndosoCard
                  key={e.id_endoso}
                  endoso={e}
                  actualizando={actualizando === 'endoso-' + e.id_endoso}
                  onCambiarEstado={(estado) => cambiarEstadoEndoso(e.id_endoso, estado)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <ModalConfirm
        abierto={!!confirmacion}
        titulo="Confirmar eliminacion"
        mensaje={confirmacion?.mensaje}
        textoConfirmar="Eliminar"
        variante="danger"
        onConfirmar={confirmacion?.accion}
        onCancelar={() => setConfirmacion(null)}
      />
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

function TabButton({ activo, onClick, children }) {
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

function RenovacionCard({ poliza, actualizando, onEnviarPropuesta, onMarcarNoRenovada, onRenovar, onRecalcular }) {
  const dias = diasHasta(poliza.vigencia_fin);
  const urgencia =
    dias != null && dias <= 7 ? 'rose' : dias != null && dias <= 30 ? 'amber' : 'sky';

  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className={`h-1 w-full ${urgencia === 'rose' ? 'bg-rose-400' : urgencia === 'amber' ? 'bg-amber-400' : 'bg-sky-400'}`} />
      <div className="p-5 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${urgencia === 'rose' ? 'bg-rose-100 text-rose-600' : urgencia === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
          <MdAutorenew size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">{poliza.producto?.nombre || 'Producto'}</p>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ESTADO_POLIZA_BADGE[poliza.estado_poliza] || 'bg-bg-soft text-text-soft'
              }`}
            >
              {poliza.estado_poliza}
            </span>
            {dias != null && (
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  urgencia === 'rose'
                    ? 'bg-rose-100 text-rose-600'
                    : urgencia === 'amber'
                      ? 'bg-amber-100 text-amber-600'
                      : 'bg-sky-100 text-sky-600'
                }`}
              >
                Vence en {dias} d
              </span>
            )}
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            POL-{String(poliza.id_poliza).padStart(6, '0')} · {poliza.producto?.tipo_seguro}
          </p>
          <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-text-soft">
            {poliza.cliente_nombre && (
              <span className="flex items-center gap-1">
                <MdPerson size={11} /> {poliza.cliente_nombre}
              </span>
            )}
            <span className="flex items-center gap-1">
              <MdCalendarToday size={11} /> Vence: {formatearFecha(poliza.vigencia_fin)}
            </span>
            <span className="flex items-center gap-1">
              <MdAttachMoney size={11} /> Prima: {formatearMoneda(poliza.prima_total)}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onRenovar}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <MdAutorenew size={13} /> Renovar
            </button>
            <button
              onClick={onRecalcular}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
            >
              <MdAttachMoney size={13} /> Recalcular
            </button>
            <button
              onClick={onEnviarPropuesta}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50"
            >
              <MdSend size={13} /> Enviar propuesta
            </button>
            <button
              onClick={onMarcarNoRenovada}
              disabled={actualizando}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50"
            >
              <MdCancel size={13} /> No renovar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function EndosoCard({ endoso, actualizando, onCambiarEstado }) {
  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-1 w-full bg-primary/30" />
      <div className="p-5 flex items-start gap-4 flex-wrap sm:flex-nowrap">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <MdEditNote size={20} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-text">{endoso.tipo_cambio}</p>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                ESTADO_ENDOSO_BADGE[endoso.estado_aprobacion] || 'bg-bg-soft text-text-soft'
              }`}
            >
              {endoso.estado_aprobacion}
            </span>
          </div>
          <p className="text-xs text-text-soft mt-0.5">
            END-{String(endoso.id_endoso).padStart(6, '0')} · POL-{String(endoso.id_poliza).padStart(6, '0')}
          </p>
          <p className="text-xs text-text-soft mt-1 line-clamp-2">{endoso.descripcion_cambio}</p>
          <p className="text-[11px] text-text-soft mt-2 flex items-center gap-1">
            <MdCalendarToday size={11} /> Solicitado: {formatearFecha(endoso.fecha_solicitud)}
          </p>
        </div>
        {endoso.estado_aprobacion === 'PENDIENTE' && (
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={() => onCambiarEstado('APROBADO')}
                disabled={actualizando}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                <MdCheck size={13} /> Aprobar
              </button>
              <button
                onClick={() => onCambiarEstado('RECHAZADO')}
                disabled={actualizando}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50"
              >
                <MdClose size={13} /> Rechazar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
