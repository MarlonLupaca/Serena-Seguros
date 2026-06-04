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
} from 'react-icons/md';
import { apiGet, apiPatch } from '@/lib/api';
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';
import ModalConfirm from '../../componentsMain/ModalConfirm';

const RANGOS = [
  { dias: 7,  label: '7 días' },
  { dias: 15, label: '15 días' },
  { dias: 30, label: '30 días' },
  { dias: 60, label: '60 días' },
  { dias: 90, label: '90 días' },
];

const ESTADO_POLIZA_BADGE = {
  ACTIVA:    'bg-emerald-100 text-emerald-700',
  PENDIENTE: 'bg-amber-100 text-amber-700',
  VENCIDA:   'bg-rose-100 text-rose-600',
  CANCELADA: 'bg-slate-100 text-slate-600',
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
  const [renovaciones, setRenovaciones] = useState([]);
  const [rango, setRango] = useState(30);
  const [busq, setBusq] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);

  useEffect(() => { cargar(); }, [rango]);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet(`/polizas/renovaciones?dias=${rango}`);
      setRenovaciones(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar las renovaciones');
    } finally {
      setCargando(false);
    }
  };

  const marcarNoRenovada = async (idPoliza) => {
    setConfirmacion({
      mensaje: '¿Marcar la póliza como cancelada / no renovada?',
      accion: async () => {
        setActualizando('poliza-' + idPoliza);
        try {
          await apiPatch(`/polizas/${idPoliza}/estado`, { estado_poliza: 'CANCELADA' });
          toast.success('Póliza marcada como cancelada');
          cargar();
        } catch (e) {
          toast.error(e.mensaje || 'No se pudo actualizar');
        } finally {
          setActualizando(null);
        }
      },
    });
  };

  const filtradas = renovaciones.filter((p) => {
    const q = busq.toLowerCase();
    return (
      q === '' ||
      String(p.id_poliza).includes(q) ||
      (p.producto?.nombre || '').toLowerCase().includes(q) ||
      (p.cliente_nombre || '').toLowerCase().includes(q)
    );
  });

  const urgentes = renovaciones.filter((p) => {
    const d = diasHasta(p.vigencia_fin);
    return d != null && d <= 7;
  }).length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Renovaciones</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Pólizas próximas a vencer que requieren gestión de renovación.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Próximas a renovar" val={renovaciones.length} icon={MdAutorenew} bg="bg-amber-100" color="text-amber-600" />
        <Kpi label="Urgentes (≤ 7 días)" val={urgentes} icon={MdShield} bg="bg-rose-100" color="text-rose-600" />
        <Kpi label="Rango actual" val={`${rango} días`} icon={MdCalendarToday} bg="bg-bg-soft" color="text-text" />
        <Kpi label="Filtradas" val={filtradas.length} icon={MdSearch} bg="bg-primary/10" color="text-primary" />
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar por cliente o producto..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
          />
        </div>
        <select
          value={rango}
          onChange={(e) => setRango(Number(e.target.value))}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
        >
          {RANGOS.map((r) => (
            <option key={r.dias} value={r.dias}>Próximas {r.label}</option>
          ))}
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando renovaciones...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdAutorenew size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">Sin renovaciones en el rango seleccionado</p>
        </div>
      ) : (
        <DataTable
          data={filtradas}
          columns={[
            { label: 'Póliza' },
            { label: 'Producto & Cliente' },
            { label: 'Estado' },
            { label: 'Vencimiento' },
            { label: 'Prima', align: 'right' },
            { label: 'Acciones', align: 'right' },
          ]}
          renderRow={(p) => (
            <RenovacionRow
              key={p.id_poliza}
              poliza={p}
              actualizando={actualizando === 'poliza-' + p.id_poliza}
              onEnviarPropuesta={() => toast.success('Propuesta enviada al cliente')}
              onMarcarNoRenovada={() => marcarNoRenovada(p.id_poliza)}
              onRenovar={() => toast.success('Renovación iniciada. Confirma con el cliente.')}
              onRecalcular={() => toast.success('Nueva prima estimada solicitada al área técnica.')}
            />
          )}
        />
      )}

      <ModalConfirm
        abierto={!!confirmacion}
        titulo="Confirmar acción"
        mensaje={confirmacion?.mensaje}
        textoConfirmar="Confirmar"
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

function RenovacionRow({ poliza, actualizando, onEnviarPropuesta, onMarcarNoRenovada, onRenovar, onRecalcular }) {
  const dias = diasHasta(poliza.vigencia_fin);
  const urgencia = dias != null && dias <= 7 ? 'rose' : dias != null && dias <= 30 ? 'amber' : 'sky';

  return (
    <TableRow>
      <TableCell className="text-sm font-bold text-text">
        POL-{String(poliza.id_poliza).padStart(6, '0')}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${urgencia === 'rose' ? 'bg-rose-100 text-rose-600' : urgencia === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
            <MdAutorenew size={18} />
          </div>
          <div>
            <p className="text-sm font-bold text-text">{poliza.producto?.nombre || 'Producto'}</p>
            {poliza.cliente_nombre && (
              <p className="text-[10px] text-text-soft flex items-center gap-1 mt-0.5">
                <MdPerson size={10} /> {poliza.cliente_nombre}
              </p>
            )}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${ESTADO_POLIZA_BADGE[poliza.estado_poliza] || 'bg-bg-soft text-text-soft'}`}>
          {poliza.estado_poliza}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="flex items-center gap-1 text-xs text-text-soft">
            <MdCalendarToday size={11} /> {formatearFecha(poliza.vigencia_fin)}
          </span>
          {dias != null && (
            <span className={`inline-flex items-center justify-center text-[10px] font-medium px-2 py-0.5 rounded-full self-start ${urgencia === 'rose' ? 'bg-rose-100 text-rose-600' : urgencia === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-sky-100 text-sky-600'}`}>
              Vence en {dias} d
            </span>
          )}
        </div>
      </TableCell>
      <TableCell align="right" className="text-sm font-bold text-text">
        {formatearMoneda(poliza.prima_total)}
      </TableCell>
      <TableCell align="right">
        <div className="flex flex-wrap gap-2 justify-end">
          <button onClick={onRenovar} disabled={actualizando} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50">
            <MdAutorenew size={13} /> Renovar
          </button>
          <button onClick={onRecalcular} disabled={actualizando} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50">
            <MdAttachMoney size={13} /> Recalcular
          </button>
          <button onClick={onEnviarPropuesta} disabled={actualizando} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors disabled:opacity-50">
            <MdSend size={13} /> Enviar propuesta
          </button>
          <button onClick={onMarcarNoRenovada} disabled={actualizando} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50">
            <MdCancel size={13} /> Cancelar
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}
