'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdSearch,
  MdSend,
  MdClose,
  MdCalendarToday,
  MdEditNote,
  MdShield,
  MdDownload,
} from 'react-icons/md';
import { apiGet, apiPatch, apiDownloadFile } from '@/lib/api';
import { DataTable, TableRow, TableCell } from '../../componentsMain/DataTable';
import ModalConfirm from '../../componentsMain/ModalConfirm';
import ModalDetalleEndoso from '../../componentsMain/ModalDetalleEndoso';

const ESTADO_ENDOSO_BADGE = {
  PENDIENTE:            'bg-amber-100 text-amber-700',
  EN_REVISION_TECNICA:  'bg-indigo-100 text-indigo-700',
  EN_REVISION_FINANZAS: 'bg-purple-100 text-purple-700',
  APROBADO:             'bg-emerald-100 text-emerald-700',
  RECHAZADO:            'bg-rose-100 text-rose-600',
  OBSERVADO:            'bg-orange-100 text-orange-700',
};

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function EndososPage() {
  const [endosos, setEndosos] = useState([]);
  const [busq, setBusq] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [actualizando, setActualizando] = useState(null);
  const [confirmacion, setConfirmacion] = useState(null);
  const [endosoSeleccionado, setEndosoSeleccionado] = useState(null);
  const [descargandoEndoso, setDescargandoEndoso] = useState(false);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/endosos');
      setEndosos(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los endosos');
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstadoEndoso = async (idEndoso, nuevo) => {
    setActualizando('endoso-' + idEndoso);
    try {
      await apiPatch(`/endosos/${idEndoso}/estado`, { estado_aprobacion: nuevo });
      toast.success(`Endoso ${nuevo.toLowerCase().replace(/_/g, ' ')}`);
      cargar();
      if (endosoSeleccionado?.id_endoso === idEndoso) setEndosoSeleccionado(null);
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo actualizar');
    } finally {
      setActualizando(null);
    }
  };

  const handleDescargar = async (endoso) => {
    if (!endoso?.archivo_url) return;
    setDescargandoEndoso(true);
    try {
      const url = endoso.archivo_url.startsWith('/')
        ? endoso.archivo_url
        : `/mis-documentos/${endoso.archivo_url}/archivo`;
      await apiDownloadFile(url, `documento-endoso-${endoso.id_endoso}.pdf`);
    } catch {
      toast.error('No se pudo descargar el documento');
    } finally {
      setDescargandoEndoso(false);
    }
  };

  const filtrados = endosos.filter((e) => {
    const q = busq.toLowerCase();
    return (
      q === '' ||
      String(e.id_endoso).includes(q) ||
      (e.tipo_cambio || '').toLowerCase().includes(q) ||
      (e.descripcion_cambio || '').toLowerCase().includes(q)
    );
  });

  const pendientes = endosos.filter((e) => e.estado_aprobacion === 'PENDIENTE').length;
  const aprobados  = endosos.filter((e) => e.estado_aprobacion === 'APROBADO').length;

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Endosos</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Gestiona los cambios y modificaciones solicitados sobre pólizas activas.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Total endosos"  val={endosos.length}   icon={MdShield}   bg="bg-primary/10"   color="text-primary" />
        <Kpi label="Pendientes"     val={pendientes}        icon={MdEditNote}  bg="bg-amber-100"    color="text-amber-600" />
        <Kpi label="Aprobados"      val={aprobados}         icon={MdEditNote}  bg="bg-emerald-100"  color="text-emerald-600" />
        <Kpi label="Filtrados"      val={filtrados.length}  icon={MdSearch}    bg="bg-bg-soft"      color="text-text" />
      </div>

      {/* Search */}
      <div className="relative">
        <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por tipo de cambio o descripción..."
          value={busq}
          onChange={(e) => setBusq(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary"
        />
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando endosos...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : filtrados.length === 0 ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center">
          <MdEditNote size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
          <p className="text-sm font-medium text-text">No hay endosos para mostrar</p>
        </div>
      ) : (
        <DataTable
          data={filtrados}
          columns={[
            { label: 'Endoso' },
            { label: 'Descripción' },
            { label: 'Estado' },
            { label: 'Solicitado' },
            { label: 'Adjunto' },
            { label: 'Acciones', align: 'right' },
          ]}
          renderRow={(e) => (
            <EndosoRow
              key={e.id_endoso}
              endoso={e}
              actualizando={actualizando === 'endoso-' + e.id_endoso}
              onCambiarEstado={(estado) => cambiarEstadoEndoso(e.id_endoso, estado)}
              onVerDetalle={() => setEndosoSeleccionado(e)}
              onDescargar={() => handleDescargar(e)}
              descargando={descargandoEndoso}
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

      {endosoSeleccionado && (
        <ModalDetalleEndoso
          abierto={!!endosoSeleccionado}
          onClose={() => setEndosoSeleccionado(null)}
          endoso={endosoSeleccionado}
          onDescargar={() => handleDescargar(endosoSeleccionado)}
          acciones={
            endosoSeleccionado.estado_aprobacion === 'PENDIENTE' ? (
              <>
                <button
                  onClick={() => cambiarEstadoEndoso(endosoSeleccionado.id_endoso, 'RECHAZADO')}
                  disabled={!!actualizando}
                  className="px-4 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  Rechazar Solicitud
                </button>
                <button
                  onClick={() => cambiarEstadoEndoso(endosoSeleccionado.id_endoso, 'EN_REVISION_TECNICA')}
                  disabled={!!actualizando}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  <MdSend size={16} /> Derivar a Operaciones
                </button>
              </>
            ) : (
              <button
                onClick={() => setEndosoSeleccionado(null)}
                className="px-4 py-2 rounded-xl bg-bg-soft hover:bg-border text-text text-sm font-semibold transition-colors"
              >
                Cerrar
              </button>
            )
          }
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

function EndosoRow({ endoso, actualizando, onCambiarEstado, onVerDetalle, onDescargar, descargando }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MdEditNote size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">{endoso.tipo_cambio}</p>
            <p className="text-xs text-text-soft mt-0.5">
              END-{String(endoso.id_endoso).padStart(6, '0')} · POL-{String(endoso.id_poliza).padStart(6, '0')}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <p className="text-xs text-text-soft line-clamp-2 max-w-[200px]">{endoso.descripcion_cambio}</p>
      </TableCell>
      <TableCell>
        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${ESTADO_ENDOSO_BADGE[endoso.estado_aprobacion] || 'bg-bg-soft text-text-soft'}`}>
          {endoso.estado_aprobacion?.replace(/_/g, ' ')}
        </span>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1 text-xs text-text-soft">
          <MdCalendarToday size={11} /> {formatearFecha(endoso.fecha_solicitud)}
        </span>
      </TableCell>
      <TableCell>
        {endoso.archivo_url ? (
          <button onClick={onDescargar} disabled={descargando} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline disabled:opacity-50">
            <MdDownload size={14} /> {descargando ? '...' : 'Descargar'}
          </button>
        ) : (
          <span className="text-xs text-text-soft italic">Ninguno</span>
        )}
      </TableCell>
      <TableCell align="right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={onVerDetalle} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-bg-soft border border-border hover:bg-border/50 text-text text-xs font-semibold transition-colors">
            Ver detalle
          </button>
          {endoso.estado_aprobacion === 'PENDIENTE' && (
            <>
              <button onClick={() => onCambiarEstado('EN_REVISION_TECNICA')} disabled={actualizando} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors disabled:opacity-50">
                <MdSend size={13} /> Derivar
              </button>
              <button onClick={() => onCambiarEstado('RECHAZADO')} disabled={actualizando} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors disabled:opacity-50">
                <MdClose size={13} /> Rechazar
              </button>
            </>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}
