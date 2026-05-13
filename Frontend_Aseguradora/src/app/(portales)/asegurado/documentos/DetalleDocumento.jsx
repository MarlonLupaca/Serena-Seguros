'use client';

import { useState } from 'react';
import {
  MdArrowBack,
  MdCalendarToday,
  MdFolderOpen,
  MdDownload,
  MdDelete,
} from 'react-icons/md';
import { apiDelete, apiDownloadFile } from '@/lib/api';
import { estiloTabla, extensionDe, formatearFecha, iconoArchivo } from './data';

export default function DetalleDocumento({ doc, documentos, onBack, onEliminado }) {
  const [eliminando, setEliminando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [error, setError] = useState('');

  const tabla = estiloTabla(doc.tabla_referencia);
  const ext = extensionDe(doc.nombre_archivo);
  const ExtIcon = iconoArchivo(ext);

  const relacionados = (documentos || [])
    .filter(
      (d) =>
        d.id_documento !== doc.id_documento &&
        d.tabla_referencia === doc.tabla_referencia &&
        d.id_referencia === doc.id_referencia &&
        doc.id_referencia
    )
    .slice(0, 3);

  const descargar = async () => {
    try {
      await apiDownloadFile(`/mis-documentos/${doc.id_documento}/archivo`, doc.nombre_archivo);
    } catch (e) {
      setError(e.mensaje || 'No se pudo descargar');
    }
  };

  const eliminar = async () => {
    setEliminando(true);
    setError('');
    try {
      await apiDelete(`/mis-documentos/${doc.id_documento}`);
      onEliminado();
    } catch (e) {
      setError(e.mensaje || 'No se pudo eliminar');
      setConfirmar(false);
    } finally {
      setEliminando(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a mis documentos
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${tabla.accentBg}`} />
        <div className="p-5 border-b border-border">
          {error && (
            <div className="mb-3 p-3 text-xs bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center shrink-0 ${tabla.accentBg} gap-0.5`}
            >
              <ExtIcon size={22} className={tabla.accentText} />
              <span className="text-xs font-bold uppercase tracking-wide" style={{ fontSize: 9 }}>
                {ext || 'doc'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text leading-tight">{doc.nombre_archivo}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full mt-1.5 ${tabla.accentBg} ${tabla.accentText}`}
              >
                {tabla.label}
                {doc.id_referencia ? ` · #${doc.id_referencia}` : ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Item icon={MdCalendarToday} label="Subido" val={formatearFecha(doc.fecha_carga)} />
            <Item icon={MdFolderOpen} label="Formato" val={(ext || 'doc').toUpperCase()} />
            <Item icon={MdFolderOpen} label="ID" val={`DOC-${String(doc.id_documento).padStart(6, '0')}`} />
          </div>
        </div>

        <div className="p-5 flex gap-3">
          <button
            onClick={descargar}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
          >
            <MdDownload size={14} /> Descargar
          </button>
          {!confirmar ? (
            <button
              onClick={() => setConfirmar(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-medium text-rose-600 transition-colors"
            >
              <MdDelete size={14} /> Eliminar
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={eliminar}
                disabled={eliminando}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors disabled:opacity-50"
              >
                {eliminando ? 'Eliminando...' : 'Confirmar'}
              </button>
              <button
                onClick={() => setConfirmar(false)}
                disabled={eliminando}
                className="px-3 py-2.5 rounded-xl border border-border text-text-soft text-xs font-medium hover:bg-bg-soft transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="bg-bg rounded-2xl border border-border p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">
            Otros documentos del mismo {doc.tabla_referencia}
          </p>
          <div className="flex flex-col gap-2">
            {relacionados.map((r) => {
              const rExt = extensionDe(r.nombre_archivo);
              const RExtIcon = iconoArchivo(rExt);
              const rTabla = estiloTabla(r.tabla_referencia);
              return (
                <div
                  key={r.id_documento}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-bg-soft transition-colors"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${rTabla.accentBg}`}>
                    <RExtIcon size={15} className={rTabla.accentText} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text truncate">{r.nombre_archivo}</p>
                    <p className="text-xs text-text-soft mt-0.5">{formatearFecha(r.fecha_carga)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Item({ icon: Icon, label, val }) {
  return (
    <div className="bg-bg-soft rounded-xl p-2.5">
      <div className="flex items-center gap-1 mb-0.5">
        <Icon size={11} className="text-text-soft" />
        <p className="text-xs text-text-soft">{label}</p>
      </div>
      <p className="text-xs font-semibold text-text truncate">{val}</p>
    </div>
  );
}
