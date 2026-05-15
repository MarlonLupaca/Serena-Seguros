'use client';

import { useEffect, useState } from 'react';
import {
  MdDescription,
  MdUploadFile,
  MdAttachFile,
  MdDownload,
  MdDelete,
  MdInsertDriveFile,
  MdPictureAsPdf,
  MdImage,
  MdClose,
} from 'react-icons/md';
import { apiDelete, apiDownloadFile, apiGet, apiUploadFile } from '@/lib/api';

const CATEGORIAS = [
  { value: 'identidad', label: 'Identidad (DNI)' },
  { value: 'general', label: 'General' },
  { value: 'poliza', label: 'Asociado a póliza' },
  { value: 'siniestro', label: 'Asociado a siniestro' },
];

function extension(nombre) {
  if (!nombre) return '';
  const i = nombre.lastIndexOf('.');
  return i >= 0 ? nombre.substring(i + 1).toLowerCase() : '';
}

function iconoArchivo(ext) {
  if (ext === 'pdf') return MdPictureAsPdf;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return MdImage;
  return MdInsertDriveFile;
}

function formatearFecha(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function SeccionDocumentos({ onGuardar }) {
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    setCargando(true);
    setError('');
    try {
      const data = await apiGet('/mis-documentos');
      setDocumentos(data || []);
    } catch (e) {
      setError(e.mensaje || 'No se pudieron cargar los documentos');
    } finally {
      setCargando(false);
    }
  };

  const descargar = async (doc) => {
    try {
      await apiDownloadFile(`/mis-documentos/${doc.id_documento}/archivo`, doc.nombre_archivo);
    } catch (e) {
      onGuardar(e.mensaje || 'No se pudo descargar');
    }
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este documento?')) return;
    try {
      await apiDelete(`/mis-documentos/${id}`);
      onGuardar('Documento eliminado');
      cargar();
    } catch (e) {
      onGuardar(e.mensaje || 'No se pudo eliminar');
    }
  };

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className="h-1 w-full bg-sky-200" />
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center shrink-0">
            <MdDescription size={18} className="text-sky-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Mis documentos</p>
            <p className="text-xs text-text-soft mt-0.5">
              Sube tu DNI, recibos de servicios u otros documentos. Los archivos quedan en tu cuenta.
            </p>
          </div>
        </div>
        <button
          onClick={() => setModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdUploadFile size={13} /> Subir
        </button>
      </div>

      <div className="p-5 flex flex-col gap-2">
        {error && (
          <div className="p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}
        {cargando ? (
          <p className="text-xs text-text-soft text-center py-4">Cargando documentos...</p>
        ) : documentos.length === 0 ? (
          <p className="text-xs text-text-soft text-center py-6 border border-dashed border-border rounded-xl">
            Aún no has subido documentos. Carga tu DNI para agilizar la validación de identidad.
          </p>
        ) : (
          documentos.map((d) => {
            const ext = extension(d.nombre_archivo);
            const Icon = iconoArchivo(ext);
            return (
              <div
                key={d.id_documento}
                className="flex items-center gap-3 p-3 rounded-xl border border-border bg-bg-soft"
              >
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text truncate">{d.nombre_archivo}</p>
                  <p className="text-[11px] text-text-soft mt-0.5">
                    DOC-{String(d.id_documento).padStart(6, '0')} · {d.tabla_referencia} ·{' '}
                    {formatearFecha(d.fecha_carga)}
                  </p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button
                    onClick={() => descargar(d)}
                    className="p-2 rounded-lg border border-border hover:bg-bg text-text-soft transition-colors"
                    title="Descargar"
                  >
                    <MdDownload size={14} />
                  </button>
                  <button
                    onClick={() => eliminar(d.id_documento)}
                    className="p-2 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 transition-colors"
                    title="Eliminar"
                  >
                    <MdDelete size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {modal && (
        <ModalSubir
          onClose={() => setModal(false)}
          onSuccess={() => {
            setModal(false);
            onGuardar('Documento subido');
            cargar();
          }}
        />
      )}
    </div>
  );
}

function ModalSubir({ onClose, onSuccess }) {
  const [archivo, setArchivo] = useState(null);
  const [categoria, setCategoria] = useState('identidad');
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
      fd.append('tabla_referencia', categoria);
      if (idReferencia) fd.append('id_referencia', String(idReferencia));
      await apiUploadFile('/mis-documentos', fd);
      onSuccess();
    } catch (e) {
      setError(e.mensaje || 'No se pudo subir');
    } finally {
      setEnviando(false);
    }
  };

  const requiereIdRef = categoria === 'poliza' || categoria === 'siniestro';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
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
            <MdUploadFile size={22} className="text-primary" />
            <p className="text-xs font-medium text-text">
              {archivo ? 'Cambiar archivo' : 'Seleccionar archivo'}
            </p>
            <p className="text-xs text-text-soft">PDF, JPG, PNG · Máx. 10 MB</p>
            <input
              type="file"
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
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
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary"
            >
              {CATEGORIAS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          {requiereIdRef && (
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                ID de {categoria} (opcional)
              </label>
              <input
                type="number"
                min="0"
                value={idReferencia}
                onChange={(e) => setIdReferencia(e.target.value)}
                placeholder="Ej. 12"
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
