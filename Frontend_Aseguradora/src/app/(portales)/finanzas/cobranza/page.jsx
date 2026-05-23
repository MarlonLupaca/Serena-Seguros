'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdAttachMoney,
  MdCalendarToday,
  MdCheckCircle,
  MdHourglassEmpty,
  MdPriceCheck,
  MdSearch,
  MdWarning,
  MdUploadFile,
  MdClose,
  MdExpandMore,
  MdExpandLess,
} from 'react-icons/md';
import Image from 'next/image';
import { apiGet, apiPatch, apiUploadFile } from '@/lib/api';
import { estiloTipo } from '@/lib/tipoSeguroConfig';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '../../componentsMain/DataTable';

const ESTADOS = {
  PENDIENTE: { label: 'Pendiente', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400' },
  PAGADO: { label: 'Pagado', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  VENCIDO: { label: 'Vencido', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
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

export default function CobranzaPage() {
  const [cuotas, setCuotas] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtro, setFiltro] = useState('PENDIENTE');
  const [busq, setBusq] = useState('');
  const [actualizandoId, setActualizandoId] = useState(null);
  const [modalImportar, setModalImportar] = useState(false);
  const [modalGrupo, setModalGrupo] = useState(null);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [c, r] = await Promise.all([apiGet('/cobranza'), apiGet('/cobranza/resumen')]);
      setCuotas(c || []);
      setResumen(r);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
  const marcar = async (id) => {
    setActualizandoId(id);
    try {
      await apiPatch(`/cobranza/${id}/pagar`);
      toast.success('Cuota marcada como pagada');
      cargar();
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizandoId(null);
    }
  };

  const filtradas = cuotas.filter((c) => {
    const matchFiltro = filtro === 'todos' || c.estado_pago === filtro;
    const t = busq.toLowerCase();
    const matchBusq = t === '' || (c.poliza_nombre || '').toLowerCase().includes(t) || String(c.id_cuota).includes(t);
    return matchFiltro && matchBusq;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Cobranza</h1>
          <p className="text-xs text-text-soft mt-0.5">{cuotas.length} cuotas en el sistema</p>
        </div>
        <button
          onClick={() => setModalImportar(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdUploadFile size={14} /> Importar carga bancaria
        </button>
      </div>

      {resumen && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Kpi
            label="Recaudado"
            val={formatearMoneda(resumen.recaudado)}
            icon={MdCheckCircle}
            bg="bg-emerald-100"
            color="text-emerald-600"
          />
          <Kpi
            label="Por cobrar"
            val={formatearMoneda(resumen.por_cobrar)}
            icon={MdHourglassEmpty}
            bg="bg-amber-100"
            color="text-amber-600"
          />
          <Kpi
            label="Vencido"
            val={formatearMoneda(resumen.vencido)}
            icon={MdWarning}
            bg="bg-rose-100"
            color="text-rose-500"
          />
          <Kpi
            label="Total cuotas"
            val={resumen.total_cuotas}
            icon={MdAttachMoney}
            bg="bg-primary/10"
            color="text-primary"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            placeholder="Buscar..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
          />
        </div>
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary appearance-none"
        >
          <option value="todos">Todas</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="VENCIDO">Vencidas</option>
          <option value="PAGADO">Pagadas</option>
        </select>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Sin cuotas con este filtro
        </div>
      ) : (
        <TablaGrupos cuotas={filtradas} onVerCuotas={setModalGrupo} />
      )}

      {modalImportar && (
        <ModalImportarCobranza
          onClose={() => setModalImportar(false)}
          onSuccess={(r) => {
            setModalImportar(false);
            toast.success(`Conciliadas ${r.conciliadas} · No encontradas ${r.no_encontradas}`);
            cargar();
          }}
        />
      )}
      {modalGrupo && (
        <ModalCuotas
          grupo={modalGrupo}
          marcar={marcar}
          actualizandoId={actualizandoId}
          onClose={() => setModalGrupo(null)}
        />
      )}
    </div>
  );
}

function TablaGrupos({ cuotas, onVerCuotas }) {
  const grupos = {};
  cuotas.forEach((c) => {
    const key = c.id_poliza || 0;
    if (!grupos[key])
      grupos[key] = { nombre: c.poliza_nombre || 'Sin póliza', tipo: c.poliza_tipo, id: key, items: [] };
    grupos[key].items.push(c);
  });
  const lista = Object.values(grupos).sort((a, b) => a.nombre.localeCompare(b.nombre));

  return (
    <Table>
      <TableHeader>
        <TableHead>Póliza</TableHead>
        <TableHead>Cuotas</TableHead>
        <TableHead>Estado</TableHead>
        <TableHead align="right">Monto Total</TableHead>
        <TableHead align="right">Acciones</TableHead>
      </TableHeader>
      <TableBody>
        {lista.map((g) => {
          const tipoStyle = estiloTipo(g.tipo);
          const pendientes = g.items.filter((c) => c.estado_pago !== 'PAGADO').length;
          const totalMonto = g.items.reduce((acc, c) => acc + Number(c.monto || 0), 0);

          return (
            <TableRow key={g.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image src={tipoStyle.imagen} width={20} height={20} alt="" className="object-contain w-10" />

                  <div>
                    <p className="text-sm font-bold text-text truncate max-w-[200px]">{g.nombre}</p>
                    <p className="text-[11px] text-text-soft">POL-{String(g.id).padStart(6, '0')}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-sm font-semibold text-text">
                  {g.items.length} cuota{g.items.length !== 1 ? 's' : ''}
                </p>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase ${pendientes > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}
                >
                  {pendientes} pendiente{pendientes !== 1 ? 's' : ''}
                </span>
              </TableCell>
              <TableCell align="right">
                <span className="text-sm font-bold text-emerald-600">{formatearMoneda(totalMonto)}</span>
              </TableCell>
              <TableCell align="right">
                <button
                  onClick={() => onVerCuotas(g)}
                  className="px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-semibold transition-colors"
                >
                  Ver cuotas
                </button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

function ModalCuotas({ grupo, marcar, actualizandoId, onClose }) {
  const totalMonto = grupo.items.reduce((acc, c) => acc + Number(c.monto || 0), 0);

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-lg rounded-2xl border border-border shadow-xl overflow-hidden flex flex-col max-h-[92vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-bg-soft">
          <div>
            <p className="text-sm font-bold text-text">{grupo.nombre}</p>
            <p className="text-[11px] text-text-soft mt-0.5">
              POL-{String(grupo.id).padStart(6, '0')} · {formatearMoneda(totalMonto)}
            </p>
          </div>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <div className="overflow-y-auto p-5">
          <div className="flex flex-col gap-3">
            {grupo.items.map((c) => {
              const est = ESTADOS[c.estado_pago] || ESTADOS.PENDIENTE;
              return (
                <div
                  key={c.id_cuota}
                  className="bg-bg rounded-xl border border-border p-4 flex items-center gap-3 flex-wrap sm:flex-nowrap"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-bold text-text">Cuota {c.numero_cuota}</p>
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${est.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                        {est.label}
                      </span>
                    </div>
                    <p className="text-xs text-text-soft mt-1 flex items-center gap-1">
                      <MdCalendarToday size={12} /> Vence {formatearFecha(c.fecha_vencimiento)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-sm font-bold text-text">{formatearMoneda(c.monto)}</p>
                    {c.estado_pago !== 'PAGADO' && (
                      <button
                        onClick={() => marcar(c.id_cuota)}
                        disabled={actualizandoId === c.id_cuota}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        <MdPriceCheck size={14} /> Pagar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ModalImportarCobranza({ onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState(null);

  const enviar = async (e) => {
    e.preventDefault();
    if (!archivo) return;
    setEnviando(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('archivo', archivo);
      const r = await apiUploadFile('/cobranza/importar', formData);
      setResultado(r);
    } catch (err) {
      setError(err.mensaje || 'No se pudo importar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Importar carga bancaria</p>
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
          {!resultado && (
            <>
              <p className="text-xs text-text-soft leading-relaxed">
                Sube un CSV con los IDs de las cuotas a marcar como pagadas. Formato esperado: la primera columna debe
                ser <code className="bg-bg-soft px-1 rounded">id_cuota</code>; las cuotas listadas pasan a estado
                PAGADO.
              </p>
              <input
                type="file"
                accept=".csv,text/csv,text/plain"
                onChange={(e) => setArchivo(e.target.files?.[0] || null)}
                required
                className="text-xs"
              />
              <div className="flex gap-2 mt-2">
                <button
                  type="submit"
                  disabled={enviando || !archivo}
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
                >
                  {enviando ? 'Procesando...' : 'Importar'}
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
            </>
          )}
          {resultado && (
            <div className="flex flex-col gap-3">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm text-emerald-800">
                Importación completada
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Stat label="Conciliadas" val={resultado.conciliadas} color="text-emerald-600" />
                <Stat label="Ya pagadas" val={resultado.ya_pagadas} color="text-sky-600" />
                <Stat label="No encontradas" val={resultado.no_encontradas} color="text-rose-600" />
                <Stat label="Filas inválidas" val={resultado.filas_invalidas} color="text-amber-600" />
              </div>
              <button
                onClick={() => onSuccess(resultado)}
                className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function Stat({ label, val, color }) {
  return (
    <div className="bg-bg-soft border border-border rounded-xl p-2 flex items-center justify-between">
      <span className="text-text-soft">{label}</span>
      <span className={`font-bold ${color}`}>{val}</span>
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
