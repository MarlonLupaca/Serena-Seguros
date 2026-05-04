import { useState } from 'react';
import {
  MdClose,
  MdShield,
  MdDescription,
  MdHistory,
  MdPeople,
  MdCheck,
  MdDownload,
  MdPayment,
  MdWarning,
  MdRefresh,
} from 'react-icons/md';
import { ESTADO_STYLES } from './data';

export default function DetalleModal({ poliza, onClose }) {
  const [tab, setTab] = useState('cobertura');
  const est = ESTADO_STYLES[poliza.estado];
  const Icon = poliza.icon;
  const TABS = [
    { id: 'cobertura', label: 'Cobertura', icon: MdShield },
    { id: 'documentos', label: 'Documentos', icon: MdDescription },
    { id: 'historial', label: 'Historial', icon: MdHistory },
    ...(poliza.beneficiarios ? [{ id: 'beneficiarios', label: 'Beneficiarios', icon: MdPeople }] : []),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text/40 backdrop-blur-sm">
      <div className="bg-bg rounded-2xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal header */}
        <div className={`${poliza.accentBg} px-5 py-4 flex items-start justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-bg/70 flex items-center justify-center">
              <Icon size={20} className={poliza.accentText} />
            </div>
            <div>
              <p className="text-sm font-bold text-text">{poliza.label}</p>
              <p className="text-xs text-text-soft">{poliza.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-bg/50 text-text-soft transition-colors">
            <MdClose size={18} />
          </button>
        </div>

        {/* Info rápida */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border text-center">
          {[
            ['Plan', poliza.plan],
            ['Monto', poliza.monto],
            ['Estado', poliza.estado],
          ].map(([k, v]) => (
            <div key={k} className="py-3 px-2">
              <p className="text-xs text-text-soft">{k}</p>
              <p className="text-sm font-semibold mt-0.5 text-text">
                {k === 'Estado' ? (
                  <span className={`px-2 py-0.5 rounded-full text-xs ${est.badge}`}>{est.label}</span>
                ) : (
                  v
                )}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border px-4 gap-1 overflow-x-auto">
          {TABS.map((t) => {
            const TIcon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors ${
                  tab === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
                }`}
              >
                <TIcon size={14} />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="flex-1 overflow-y-auto p-5">
          {tab === 'cobertura' && (
            <div className="flex flex-col gap-4">
              {poliza.bien && (
                <div className="bg-bg-soft rounded-xl p-3 text-sm">
                  <p className="text-xs text-text-soft mb-0.5">Bien asegurado</p>
                  <p className="font-medium text-text">{poliza.bien}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">
                  Coberturas incluidas
                </p>
                {poliza.cobertura.split(',').map((c, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-text-soft py-1.5 border-b border-border last:border-0"
                  >
                    <MdCheck size={15} className="text-primary mt-0.5 shrink-0" />
                    {c.trim()}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">Exclusiones</p>
                <p className="text-sm text-text-soft leading-relaxed">{poliza.exclusiones}</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  ['Inicio', poliza.inicio],
                  ['Vencimiento', poliza.fin],
                  ['Renovación', poliza.renovacion],
                  ['Plan', poliza.plan],
                ].map(([k, v]) => (
                  <div key={k} className="bg-bg-soft rounded-xl p-3">
                    <p className="text-text-soft">{k}</p>
                    <p className="font-semibold text-text mt-0.5">{v}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'documentos' && (
            <div className="flex flex-col gap-2">
              {poliza.documentos.length === 0 ? (
                <p className="text-sm text-text-soft text-center py-6">Sin documentos disponibles aún.</p>
              ) : (
                poliza.documentos.map((doc) => (
                  <div
                    key={doc}
                    className="flex items-center justify-between p-3.5 rounded-xl border border-border hover:bg-bg-soft transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <MdDescription size={18} className="text-primary" />
                      <span className="text-sm font-medium text-text">{doc}</span>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-primary/10 text-text-soft hover:text-primary transition-colors">
                      <MdDownload size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
          {tab === 'historial' && (
            <div className="flex flex-col gap-0 relative">
              <div className="absolute left-4.5 top-0 bottom-0 w-0.5 bg-border" />
              {poliza.historial.map((h, i) => (
                <div key={i} className="flex gap-4 pb-5 relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border-2 border-bg ${
                      h.tipo === 'Pago'
                        ? 'bg-emerald-100 text-emerald-700'
                        : h.tipo === 'Emisión'
                          ? 'bg-primary/20 text-primary'
                          : h.tipo === 'Vencimiento'
                            ? 'bg-rose-100 text-rose-500'
                            : h.tipo === 'Uso'
                              ? 'bg-amber-100 text-amber-600'
                              : 'bg-bg-soft text-text-soft'
                    }`}
                  >
                    {h.tipo[0]}
                  </div>
                  <div className="pt-1">
                    <p className="text-sm font-medium text-text">{h.detalle}</p>
                    <p className="text-xs text-text-soft mt-0.5">
                      {h.fecha} · {h.tipo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === 'beneficiarios' && poliza.beneficiarios && (
            <div className="flex flex-col gap-2">
              {poliza.beneficiarios.map((b) => (
                <div key={b} className="flex items-center gap-3 p-3.5 rounded-xl border border-border">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MdPeople size={18} className="text-primary" />
                  </div>
                  <span className="text-sm font-medium text-text">{b}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones */}
        {poliza.estado !== 'vencida' && (
          <div className="border-t border-border p-4 flex gap-2 flex-wrap">
            {poliza.estado === 'activa' && (
              <>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors">
                  <MdPayment size={14} /> Pagar
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors">
                  <MdWarning size={14} /> Siniestro
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors">
                  <MdRefresh size={14} /> Renovar
                </button>
              </>
            )}
            {poliza.estado === 'en proceso' && (
              <p className="text-xs text-amber-600 font-medium py-1">
                Tu póliza está siendo procesada. Te notificaremos por correo.
              </p>
            )}
          </div>
        )}
        {poliza.estado === 'vencida' && (
          <div className="border-t border-border p-4">
            <button className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors">
              <MdRefresh size={16} /> Renovar póliza
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
