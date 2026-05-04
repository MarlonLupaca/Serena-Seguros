import React from 'react';
import { MdFolder, MdCheckCircle, MdCancel, MdRemoveRedEye, MdPictureAsPdf, MdImage } from 'react-icons/md';

export default function ValidarDocumentosPage() {
  const documentos = [
    { id: 'DOC-1021', tipo: 'DNI Titular', formato: 'PDF', archivo: 'dni_roberto_gomez.pdf', cliente: 'Roberto Gómez', ref: 'SOL-005', fecha: 'Hace 2 horas' },
    { id: 'DOC-1022', tipo: 'Tarjeta de Propiedad', formato: 'IMG', archivo: 'tarjeta_propiedad_auto.jpg', cliente: 'Roberto Gómez', ref: 'SOL-005', fecha: 'Hace 2 horas' },
    { id: 'DOC-1023', tipo: 'Examen Médico', formato: 'PDF', archivo: 'informe_clinico_2026.pdf', cliente: 'Lucía Vargas', ref: 'SIN-2026-002', fecha: 'Hace 5 horas' },
  ];

  return (
    <div className="py-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Validación de Documentos</h1>
        <p className="text-sm text-text-soft mt-1">Revisa la autenticidad y claridad de los documentos enviados por los usuarios.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {documentos.map((doc) => (
          <div key={doc.id} className="bg-bg border border-border rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.formato === 'PDF' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                {doc.formato === 'PDF' ? <MdPictureAsPdf size={24} /> : <MdImage size={24} />}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-text truncate" title={doc.tipo}>{doc.tipo}</h3>
                <p className="text-xs text-text-soft truncate mt-0.5" title={doc.archivo}>{doc.archivo}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-bg-soft border border-border rounded text-text-soft">Ref: {doc.ref}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex flex-col gap-1 text-sm">
              <div className="flex justify-between">
                <span className="text-text-soft">Subido por:</span>
                <span className="font-medium text-text">{doc.cliente}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-soft">Fecha:</span>
                <span className="text-text-soft">{doc.fecha}</span>
              </div>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-2">
              <button className="flex items-center justify-center gap-1.5 py-2 bg-bg-soft text-text hover:bg-border transition-colors rounded-lg text-xs font-semibold">
                <MdRemoveRedEye size={16} /> Ver
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-colors rounded-lg text-xs font-semibold">
                <MdCheckCircle size={16} /> Aprobar
              </button>
              <button className="flex items-center justify-center gap-1.5 py-2 bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white transition-colors rounded-lg text-xs font-semibold">
                <MdCancel size={16} /> Rechazar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
