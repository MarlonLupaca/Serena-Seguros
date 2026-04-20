import { useState } from 'react';
import { MdCheckCircle, MdUploadFile, MdInfo } from 'react-icons/md';

export default function StepContratacion({ data }) {
  const [docs, setDocs] = useState({});
  const [confirmado, setConfirmado] = useState(false);
  const reqs =
    data.tipo === 'auto'
      ? [
          'DNI / Carnet de extranjería',
          'Tarjeta de propiedad del vehículo',
          'Fotos del vehículo (frente, posterior, laterales)',
        ]
      : data.tipo === 'salud'
        ? ['DNI / Carnet de extranjería', 'Declaración de salud firmada']
        : data.tipo === 'vida'
          ? ['DNI / Carnet de extranjería', 'Datos de beneficiarios']
          : ['DNI / Carnet de extranjería', 'Título de propiedad o contrato de alquiler'];

  return (
    <div className="flex flex-col gap-5">
      {!confirmado ? (
        <>
          <p className="text-sm text-text-soft">
            Casi listo. Sube los documentos requeridos para completar tu contratación.
          </p>
          <div className="flex flex-col gap-3">
            {reqs.map((r) => (
              <div
                key={r}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${docs[r] ? 'border-primary bg-primary/5' : 'border-border bg-bg'}`}
              >
                <div className="flex items-center gap-3">
                  {docs[r] ? (
                    <MdCheckCircle size={20} className="text-primary shrink-0" />
                  ) : (
                    <MdUploadFile size={20} className="text-text-soft shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${docs[r] ? 'text-primary' : 'text-text'}`}>{r}</p>
                    {docs[r] && <p className="text-xs text-text-soft">{docs[r]}</p>}
                  </div>
                </div>
                <label className="cursor-pointer text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                  {docs[r] ? 'Cambiar' : 'Subir'}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setDocs((prev) => ({ ...prev, [r]: e.target.files[0].name }));
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="bg-bg-soft rounded-xl p-4 flex gap-3 text-sm text-text-soft border border-border">
            <MdInfo size={18} className="text-primary shrink-0 mt-0.5" />
            <p>Todos los documentos son tratados de forma confidencial y solo se usan para validar tu póliza.</p>
          </div>
          <button
            onClick={() => Object.keys(docs).length === reqs.length && setConfirmado(true)}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${Object.keys(docs).length === reqs.length ? 'bg-primary hover:bg-primary-hover text-text-inverse' : 'bg-bg-soft text-text-soft cursor-not-allowed border border-border'}`}
          >
            Confirmar contratación
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MdCheckCircle size={36} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text mb-1">¡Cotización contratada!</h3>
            <p className="text-sm text-text-soft max-w-xs">
              Hemos recibido tu solicitud. En las próximas 24 horas recibirás tu póliza en el correo registrado.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors">
              Ver mis pólizas
            </button>
            <button className="w-full py-2.5 rounded-xl border border-border text-text-soft hover:bg-bg-soft text-sm transition-colors">
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
