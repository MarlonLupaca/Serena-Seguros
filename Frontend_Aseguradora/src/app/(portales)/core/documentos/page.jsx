'use client';
import toast from 'react-hot-toast';

import { useEffect, useState } from 'react';
import {
  MdAttachFile,
  MdCalendarToday,
  MdDelete,
  MdDownload,
  MdSearch,
  MdUpload,
  MdClose,
  MdFolder,
  MdShield,
  MdWarning,
  MdReceiptLong,
  MdPictureAsPdf,
  MdImage,
  MdDescription,
  MdInsertDriveFile,
  MdHistory,
  MdPerson,
  MdBadge,
} from 'react-icons/md';
import { apiDelete, apiDownloadFile, apiGet, apiUploadFile } from '@/lib/api';
import ModalConfirm from '../../componentsMain/ModalConfirm';

const TABLAS = [
  { value: 'general', label: 'General', icon: MdFolder, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' },
  { value: 'poliza', label: 'Póliza', icon: MdShield, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  { value: 'siniestro', label: 'Siniestro', icon: MdWarning, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  { value: 'pago', label: 'Pago', icon: MdReceiptLong, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  { value: 'cliente', label: 'Cliente', icon: MdBadge, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
];

function estiloTabla(t) {
  return TABLAS.find((x) => x.value === t) || TABLAS[0];
}

function extension(nombre) {
  if (!nombre) return '';
  const i = nombre.lastIndexOf('.');
  return i >= 0 ? nombre.substring(i + 1).toLowerCase() : '';
}

function iconoArchivo(ext) {
  if (ext === 'pdf') return MdPictureAsPdf;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return MdImage;
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return MdDescription;
  return MdInsertDriveFile;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function CentroDocumentalPage() {
  const [tab, setTab] = useState('archivos');
  const [documentos, setDocumentos] = useState([]);
  const [auditoria, setAuditoria] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busq, setBusq] = useState('');
  const [filtro, setFiltro] = useState('todos');
  const [modal, setModal] = useState(false);
  const [confirmacion, setConfirmacion] = useState(null);
useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const [docs, audit] = await Promise.all([
        apiGet('/mis-documentos').catch(() => []),
        apiGet('/auditoria?modulo=documentos&limite=100').catch(() => []),
      ]);
      setDocumentos(docs || []);
      setAuditoria(audit || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudo cargar');
    } finally {
      setCargando(false);
    }
  };
const descargar = async (doc) => {
    try {
      await apiDownloadFile(`/mis-documentos/${doc.id_documento}/archivo`, doc.nombre_archivo);
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo descargar');
    }
  };

  const eliminar = async (id) => {
    setConfirmacion({
      mensaje: '¿Eliminar este documento del repositorio?',
      accion: async () => {
        try {
          await apiDelete(`/mis-documentos/${id}`);
          toast.success('Documento eliminado');
          cargar();
        } catch (e) {
          toast.error(e.mensaje || 'No se pudo eliminar');
        }
      },
    });
  };

  const filtrados = documentos.filter((d) => {
    const t = busq.toLowerCase().trim();
    const matchBusq =
      t === '' ||
      (d.nombre_archivo || '').toLowerCase().includes(t) ||
      String(d.id_documento).includes(t) ||
      String(d.id_referencia || '').includes(t);
    const matchFiltro = filtro === 'todos' || d.tabla_referencia === filtro;
    return matchBusq && matchFiltro;
  });

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">

      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-base font-bold text-text">Centro documental y auditoría</h1>
          <p className="text-xs text-text-soft mt-0.5">
            Repositorio oficial del sistema: contratos, DNIs, informes, facturas y trazabilidad de accesos.
          </p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdUpload size={15} /> Subir documento
        </button>
      </div>

      <div className="flex border-b border-border gap-2">
        <TabBtn activo={tab === 'archivos'} onClick={() => setTab('archivos')}>
          <MdFolder size={14} /> Archivos ({documentos.length})
        </TabBtn>
        <TabBtn activo={tab === 'auditoria'} onClick={() => setTab('auditoria')}>
          <MdHistory size={14} /> Auditoría ({auditoria.length})
        </TabBtn>
      </div>

      {tab === 'archivos' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <input
                placeholder="Buscar por DNI, cliente, N° póliza, N° siniestro o nombre de archivo..."
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
              <option value="todos">Todas las categorías</option>
              {TABLAS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {cargando ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Cargando...
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">
              {error}
            </div>
          ) : filtrados.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdFolder size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">Sin documentos</p>
              <p className="text-xs text-text-soft mt-1">
                {documentos.length === 0
                  ? 'Aún no hay archivos cargados.'
                  : 'Ajusta los filtros o la búsqueda.'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtrados.map((d) => {
                const tabla = estiloTabla(d.tabla_referencia);
                const ext = extension(d.nombre_archivo);
                const ExtIcon = iconoArchivo(ext);
                return (
                  <div
                    key={d.id_documento}
                    className="bg-bg rounded-2xl border border-border overflow-hidden"
                  >
                    <div className={`h-1 w-full ${tabla.accentBg}`} />
                    <div className="p-4 flex items-center gap-4 flex-wrap sm:flex-nowrap">
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 ${tabla.accentBg} gap-0.5`}
                      >
                        <ExtIcon size={18} className={tabla.accentText} />
                        <span className="font-bold uppercase tracking-wide" style={{ fontSize: 8 }}>
                          {ext || 'doc'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-text truncate">{d.nombre_archivo}</p>
                        <p className="text-xs text-text-soft mt-0.5">
                          DOC-{String(d.id_documento).padStart(6, '0')} · {tabla.label}
                          {d.id_referencia ? ` · #${d.id_referencia}` : ''}
                        </p>
                        <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
                          <MdCalendarToday size={11} /> {formatearFecha(d.fecha_carga)}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => descargar(d)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
                        >
                          <MdDownload size={13} /> Descargar
                        </button>
                        <button
                          onClick={() => eliminar(d.id_documento)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-medium transition-colors"
                        >
                          <MdDelete size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {tab === 'auditoria' && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-text-soft px-1">
            Trazabilidad de accesos y acciones registradas sobre el módulo de documentos.
          </p>
          {cargando ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
              Cargando auditoría...
            </div>
          ) : auditoria.length === 0 ? (
            <div className="bg-bg rounded-2xl border border-border p-12 text-center">
              <MdHistory size={32} className="text-text-soft mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium text-text">Sin registros</p>
              <p className="text-xs text-text-soft mt-1">
                Aún no hay acciones registradas sobre documentos.
              </p>
            </div>
          ) : (
            <div className="bg-bg rounded-2xl border border-border overflow-hidden overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-soft">
                  <tr className="text-xs text-text-soft">
                    <th className="px-3 py-2 text-left font-medium">Usuario</th>
                    <th className="px-3 py-2 text-left font-medium">Acción</th>
                    <th className="px-3 py-2 text-left font-medium">Detalle</th>
                    <th className="px-3 py-2 text-right font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {auditoria.map((a) => (
                    <tr key={a.id_auditoria} className="border-t border-border">
                      <td className="px-3 py-2.5">
                        <p className="text-sm font-semibold text-text flex items-center gap-1">
                          <MdPerson size={12} className="text-text-soft" />
                          {a.username || '—'}
                        </p>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {a.accion}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-xs text-text-soft">{a.detalle || '—'}</td>
                      <td className="px-3 py-2.5 text-right text-xs text-text-soft">
                        {formatearFecha(a.fecha)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

      {modal && (
        <ModalSubir
          onClose={() => setModal(false)}
          onSuccess={() => {
            setModal(false);
            toast.success('Documento subido');
            cargar();
          }}
        />
      )}
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

function ModalSubir({ onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [tabla, setTabla] = useState('general');
  const [idReferencia, setIdReferencia] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');

  const subir = async () => {
    if (!archivo) return;
    setEnviando(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('archivo', archivo);
      fd.append('tabla_referencia', tabla);
      if (idReferencia) fd.append('id_referencia', String(idReferencia));
      await apiUploadFile('/mis-documentos', fd);
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo subir');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Subir documento</p>
          <button onClick={onClose} className="text-text-soft hover:text-text">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          <label className="flex flex-col items-center gap-2 border-2 border-dashed border-primary/25 rounded-xl p-6 cursor-pointer hover:bg-primary/5 transition-colors">
            <MdUpload size={22} className="text-primary" />
            <p className="text-xs font-medium text-text">
              {archivo ? 'Cambiar archivo' : 'Seleccionar archivo'}
            </p>
            <p className="text-xs text-text-soft">PDF, JPG, PNG · Máx. 10 MB</p>
            <input
              type="file"
              className="hidden"
              onChange={(e) => setArchivo(e.target.files?.[0] || null)}
            />
          </label>
          {archivo && (
            <div className="flex items-center gap-2 text-xs text-text-soft bg-bg-soft rounded-lg px-3 py-2">
              <MdAttachFile size={13} className="text-primary shrink-0" />
              <span className="flex-1 truncate">{archivo.name}</span>
            </div>
          )}
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">Categoría</label>
            <select
              value={tabla}
              onChange={(e) => setTabla(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              {TABLAS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          {tabla !== 'general' && (
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                ID de {tabla} (opcional)
              </label>
              <input
                type="number"
                min="0"
                value={idReferencia}
                onChange={(e) => setIdReferencia(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
              />
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <button
              onClick={subir}
              disabled={!archivo || enviando}
              className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-text-inverse text-xs font-semibold transition-colors"
            >
              {enviando ? 'Subiendo...' : 'Subir'}
            </button>
            <button
              onClick={onClose}
              disabled={enviando}
              className="flex-1 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
