'use client';

import { useState, useEffect, useRef } from 'react';
import {
  MdAdd,
  MdSearch,
  MdClose,
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdPause,
  MdPlayArrow,
  MdCancel,
  MdSend,
  MdSchedule,
  MdPeople,
  MdEmail,
  MdSms,
  MdNotifications,
  MdWhatsapp,
  MdEdit,
  MdDelete,
  MdBarChart,
  MdTrendingUp,
  MdMarkEmailRead,
  MdAdsClick,
  MdPersonOff,
  MdFilterList,
  MdCampaign,
  MdCalendarToday,
  MdAttachMoney,
  MdCheck,
  MdErrorOutline,
} from 'react-icons/md';

/* ─── datos simulados ─── */
const CANALES = [
  { id: 'email', label: 'Email', icon: MdEmail, bg: 'bg-blue-100', text: 'text-blue-600', bar: 'bg-blue-400' },
  { id: 'sms', label: 'SMS', icon: MdSms, bg: 'bg-amber-100', text: 'text-amber-600', bar: 'bg-amber-400' },
  {
    id: 'push',
    label: 'Push',
    icon: MdNotifications,
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    bar: 'bg-violet-400',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: MdWhatsapp,
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    bar: 'bg-emerald-400',
  },
];

const SEGMENTOS = [
  {
    id: 'seg-1',
    label: 'Clientes con póliza próxima a vencer',
    count: 142,
    desc: 'Vencimiento en los próximos 30 días',
  },
  { id: 'seg-2', label: 'Clientes sin seguro de vida', count: 318, desc: 'Tienen vehicular u hogar pero no vida' },
  { id: 'seg-3', label: 'Clientes inactivos +6 meses', count: 87, desc: 'Sin interacción desde hace 6 meses' },
  { id: 'seg-4', label: 'Clientes con siniestro cerrado', count: 55, desc: 'Siniestro resuelto en últimos 3 meses' },
  { id: 'seg-5', label: 'Todos los clientes activos', count: 624, desc: 'Base completa sin opt-out' },
];

const PLANTILLAS_INIT = [
  {
    id: 'tpl-1',
    nombre: 'Renovación anticipada',
    canal: 'email',
    asunto: 'Tu póliza vence pronto – renueva con descuento',
    cuerpo: 'Hola {{nombre}}, tu póliza {{poliza}} vence el {{fecha}}. Renueva ahora y obtén un 10% de descuento.',
  },
  {
    id: 'tpl-2',
    nombre: 'Cross-sell vida',
    canal: 'whatsapp',
    asunto: '',
    cuerpo: 'Hola {{nombre}}, ¿sabías que aún no tienes seguro de vida? Protege a tu familia desde S/ 45/mes.',
  },
  {
    id: 'tpl-3',
    nombre: 'Recuperación inactivos',
    canal: 'sms',
    asunto: '',
    cuerpo: 'Hola {{nombre}}, te echamos de menos. Revisa nuestras ofertas exclusivas en tu portal.',
  },
  {
    id: 'tpl-4',
    nombre: 'Post-siniestro',
    canal: 'email',
    asunto: '¿Cómo fue tu experiencia con nosotros?',
    cuerpo: 'Hola {{nombre}}, tu siniestro ha sido resuelto. Nos gustaría conocer tu opinión.',
  },
];

const CAMPANAS_INIT = [
  {
    id: 'CMP-001',
    nombre: 'Renovaciones Mayo',
    canal: 'email',
    segmentoId: 'seg-1',
    plantillaId: 'tpl-1',
    inicio: '01 May 2025',
    fin: '31 May 2025',
    presupuesto: 800,
    estado: 'activa',
    programada: false,
    enviados: 142,
    entregados: 138,
    abiertos: 94,
    clics: 31,
    optout: 4,
  },
  {
    id: 'CMP-002',
    nombre: 'Cross-sell Vida',
    canal: 'whatsapp',
    segmentoId: 'seg-2',
    plantillaId: 'tpl-2',
    inicio: '10 May 2025',
    fin: '25 May 2025',
    presupuesto: 1200,
    estado: 'pausada',
    programada: false,
    enviados: 180,
    entregados: 175,
    abiertos: 112,
    clics: 48,
    optout: 5,
  },
  {
    id: 'CMP-003',
    nombre: 'Recuperación inactivos',
    canal: 'sms',
    segmentoId: 'seg-3',
    plantillaId: 'tpl-3',
    inicio: '20 May 2025',
    fin: '30 May 2025',
    presupuesto: 300,
    estado: 'programada',
    programada: true,
    enviados: 0,
    entregados: 0,
    abiertos: 0,
    clics: 0,
    optout: 0,
  },
  {
    id: 'CMP-004',
    nombre: 'Post-siniestro NPS',
    canal: 'email',
    segmentoId: 'seg-4',
    plantillaId: 'tpl-4',
    inicio: '05 May 2025',
    fin: '15 May 2025',
    presupuesto: 200,
    estado: 'finalizada',
    programada: false,
    enviados: 55,
    entregados: 53,
    abiertos: 38,
    clics: 12,
    optout: 2,
  },
];

const ESTADOS = {
  activa: { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Activa' },
  pausada: { badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', label: 'Pausada' },
  programada: { badge: 'bg-blue-100 text-blue-700', dot: 'bg-blue-400', label: 'Programada' },
  finalizada: { badge: 'bg-bg-soft text-text-soft', dot: 'bg-border', label: 'Finalizada' },
  cancelada: { badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400', label: 'Cancelada' },
};

const STEPS = ['Campaña', 'Segmento', 'Plantilla', 'Programación', 'Confirmar'];
const fmt = (n) => `S/ ${n.toLocaleString('es-PE', { minimumFractionDigits: 2 })}`;
const pct = (a, b) => (b > 0 ? Math.round((a / b) * 100) : 0);
const getCanal = (id) => CANALES.find((c) => c.id === id);
const getSeg = (id) => SEGMENTOS.find((s) => s.id === id);
const getTpl = (id, tpls) => tpls.find((t) => t.id === id);

/* ─── StepBar ─── */
function StepBar({ current }) {
  return (
    <div className="flex items-center mb-6">
      {STEPS.map((s, i) => (
        <div key={s} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
              ${i < current ? 'bg-primary text-text-inverse' : i === current ? 'bg-primary text-text-inverse ring-4 ring-primary/20' : 'bg-bg-soft text-text-soft border border-border'}`}
            >
              {i < current ? <MdCheck size={14} /> : i + 1}
            </div>
            <span
              className={`text-xs whitespace-nowrap ${i === current ? 'text-text font-semibold' : 'text-text-soft'}`}
            >
              {s}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 mb-4 ${i < current ? 'bg-primary' : 'bg-border'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Badge ─── */
function Badge({ estado }) {
  const e = ESTADOS[estado] || ESTADOS.cancelada;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${e.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} /> {e.label}
    </span>
  );
}

/* ─── MetricBar ─── */
function MetricBar({ label, val, total, color, icon: Icon }) {
  const p = pct(val, total);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs text-text-soft">
          <Icon size={12} />
          {label}
        </span>
        <span className="text-xs font-bold text-text tabular-nums">
          {val.toLocaleString()} <span className="font-normal text-text-soft">({p}%)</span>
        </span>
      </div>
      <div className="h-1.5 bg-bg-soft rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${p}%` }} />
      </div>
    </div>
  );
}

/* ─── Modal nueva campaña ─── */
function NuevaCampanaModal({ plantillas, onClose, onCrear, onNuevaTpl }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ nombre: '', objetivo: '', canal: '', inicio: '', fin: '', presupuesto: '' });
  const [segId, setSegId] = useState(null);
  const [tplId, setTplId] = useState(null);
  const [newTpl, setNewTpl] = useState(null);
  const [programada, setProgramada] = useState(false);
  const [creandoTpl, setCreandoTpl] = useState(false);
  const [tplForm, setTplForm] = useState({ nombre: '', asunto: '', cuerpo: '' });

  const canal = getCanal(form.canal);
  const seg = getSeg(segId);
  const tpl = getTpl(tplId, plantillas) || newTpl;
  const canNext = () => {
    if (step === 0) return form.nombre && form.canal && form.inicio && form.fin;
    if (step === 1) return !!segId;
    if (step === 2) return !!tplId || !!newTpl;
    return true;
  };

  const handleSaveTpl = () => {
    if (!tplForm.nombre || !tplForm.cuerpo) return;
    const t = {
      id: `tpl-new-${Date.now()}`,
      nombre: tplForm.nombre,
      canal: form.canal,
      asunto: tplForm.asunto,
      cuerpo: tplForm.cuerpo,
    };
    onNuevaTpl(t);
    setNewTpl(t);
    setTplId(null);
    setCreandoTpl(false);
  };

  const handleCrear = () => {
    const segObj = getSeg(segId);
    onCrear({
      ...form,
      presupuesto: parseFloat(form.presupuesto) || 0,
      segmentoId: segId,
      plantillaId: tpl?.id,
      programada,
      enviados: 0,
      entregados: 0,
      abiertos: 0,
      clics: 0,
      optout: 0,
      estado: programada ? 'programada' : 'activa',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-2xl shadow-xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <p className="text-sm font-bold text-text">Nueva campaña</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-soft text-text-soft">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">
          <StepBar current={step} />

          {/* Step 0 — Campaña */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Nombre de la campaña</label>
                  <input
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    placeholder="Ej: Renovaciones Junio 2025"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  />
                </div>
                <div className="col-span-2 flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Objetivo</label>
                  <input
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    placeholder="Ej: Aumentar renovaciones en un 20%"
                    value={form.objetivo}
                    onChange={(e) => setForm({ ...form, objetivo: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Fecha inicio</label>
                  <input
                    type="date"
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    value={form.inicio}
                    onChange={(e) => setForm({ ...form, inicio: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Fecha fin</label>
                  <input
                    type="date"
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    value={form.fin}
                    onChange={(e) => setForm({ ...form, fin: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text-soft">Presupuesto (S/)</label>
                  <input
                    type="number"
                    className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                    placeholder="0.00"
                    value={form.presupuesto}
                    onChange={(e) => setForm({ ...form, presupuesto: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-text-soft mb-2 block">Canal de envío</label>
                <div className="grid grid-cols-4 gap-3">
                  {CANALES.map((c) => {
                    const Icon = c.icon;
                    return (
                      <div
                        key={c.id}
                        onClick={() => setForm({ ...form, canal: c.id })}
                        className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border cursor-pointer transition-colors ${form.canal === c.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${c.bg}`}>
                          <Icon size={18} className={c.text} />
                        </div>
                        <p className="text-xs font-semibold text-text">{c.label}</p>
                        {form.canal === c.id && <MdCheck size={14} className="text-primary" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Segmento */}
          {step === 1 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200 mb-1">
                <MdPersonOff size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  Los clientes con opt-out son excluidos automáticamente del envío.
                </p>
              </div>
              {SEGMENTOS.map((s) => (
                <div
                  key={s.id}
                  onClick={() => setSegId(s.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${segId === s.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-bg-soft flex items-center justify-center shrink-0">
                    <MdPeople size={18} className="text-text-soft" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text">{s.label}</p>
                    <p className="text-xs text-text-soft mt-0.5">{s.desc}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-base font-bold text-text">{s.count}</p>
                    <p className="text-xs text-text-soft">contactos</p>
                  </div>
                  {segId === s.id && <MdCheckCircle size={18} className="text-primary shrink-0" />}
                </div>
              ))}
            </div>
          )}

          {/* Step 2 — Plantilla */}
          {step === 2 && (
            <div className="flex flex-col gap-3">
              {!creandoTpl ? (
                <>
                  <button
                    onClick={() => setCreandoTpl(true)}
                    className="flex items-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 text-xs font-semibold text-text-soft hover:text-primary transition-colors"
                  >
                    <MdAdd size={16} /> Crear nueva plantilla
                  </button>
                  {plantillas
                    .filter((t) => !form.canal || t.canal === form.canal)
                    .map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setTplId(t.id);
                          setNewTpl(null);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition-colors ${tplId === t.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text">{t.nombre}</p>
                            {t.asunto && <p className="text-xs text-text-soft mt-0.5">Asunto: {t.asunto}</p>}
                            <p className="text-xs text-text-soft mt-1.5 leading-relaxed line-clamp-2">{t.cuerpo}</p>
                          </div>
                          {tplId === t.id && <MdCheckCircle size={18} className="text-primary shrink-0" />}
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setCreandoTpl(false)}
                    className="flex items-center gap-1 text-xs text-text-soft hover:text-text w-fit"
                  >
                    <MdArrowBack size={14} /> Volver a plantillas
                  </button>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-soft">Nombre de la plantilla</label>
                    <input
                      className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                      placeholder="Ej: Oferta especial junio"
                      value={tplForm.nombre}
                      onChange={(e) => setTplForm({ ...tplForm, nombre: e.target.value })}
                    />
                  </div>
                  {form.canal === 'email' && (
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-text-soft">Asunto del email</label>
                      <input
                        className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
                        placeholder="Asunto..."
                        value={tplForm.asunto}
                        onChange={(e) => setTplForm({ ...tplForm, asunto: e.target.value })}
                      />
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-text-soft">
                      Cuerpo del mensaje{' '}
                      <span className="font-normal text-text-soft/70">
                        (usa {'{{' + 'nombre}}'}, {'{{' + 'poliza}}'}, {'{{' + 'fecha}}'})
                      </span>
                    </label>
                    <textarea
                      rows={4}
                      className="px-3 py-2.5 text-sm rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary resize-none"
                      placeholder="Escribe el mensaje..."
                      value={tplForm.cuerpo}
                      onChange={(e) => setTplForm({ ...tplForm, cuerpo: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={handleSaveTpl}
                    disabled={!tplForm.nombre || !tplForm.cuerpo}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <MdCheck size={14} /> Guardar plantilla
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Step 3 — Programación */}
          {step === 3 && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div
                  onClick={() => setProgramada(false)}
                  className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${!programada ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <MdSend size={18} className="text-emerald-600" />
                  </div>
                  <p className="text-sm font-bold text-text">Enviar ahora</p>
                  <p className="text-xs text-text-soft">La campaña se activa inmediatamente al crear.</p>
                  {!programada && <MdCheck size={14} className="text-primary" />}
                </div>
                <div
                  onClick={() => setProgramada(true)}
                  className={`flex flex-col gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${programada ? 'border-primary bg-primary/5' : 'border-border hover:bg-bg-soft'}`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                    <MdSchedule size={18} className="text-blue-600" />
                  </div>
                  <p className="text-sm font-bold text-text">Programar envío</p>
                  <p className="text-xs text-text-soft">La campaña se activa en la fecha de inicio definida.</p>
                  {programada && <MdCheck size={14} className="text-primary" />}
                </div>
              </div>
              {programada && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                  <MdSchedule size={14} className="text-blue-500 mt-0.5 shrink-0" />
                  <p className="text-xs text-blue-700">
                    La campaña se enviará automáticamente el <span className="font-semibold">{form.inicio || '—'}</span>
                    .
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4 — Confirmar */}
          {step === 4 && (
            <div className="flex flex-col gap-4">
              {canal && <div className={`h-1 w-full ${canal.bar} rounded-full`} />}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Nombre', val: form.nombre },
                  { label: 'Canal', val: canal?.label },
                  { label: 'Segmento', val: seg?.label },
                  { label: 'Contactos', val: seg ? `${seg.count} (excluye opt-out)` : '—' },
                  { label: 'Inicio', val: form.inicio || '—' },
                  { label: 'Fin', val: form.fin || '—' },
                  { label: 'Presupuesto', val: form.presupuesto ? fmt(parseFloat(form.presupuesto)) : '—' },
                  { label: 'Modo', val: programada ? 'Programado' : 'Envío inmediato' },
                ].map(({ label, val }) => (
                  <div key={label} className="bg-bg-soft rounded-xl p-3">
                    <p className="text-xs text-text-soft">{label}</p>
                    <p className="text-xs font-semibold text-text mt-0.5">{val || '—'}</p>
                  </div>
                ))}
              </div>
              {tpl && (
                <div className="bg-bg-soft rounded-xl p-3">
                  <p className="text-xs text-text-soft mb-1">Plantilla</p>
                  <p className="text-xs font-semibold text-text">{tpl.nombre}</p>
                  <p className="text-xs text-text-soft mt-1 leading-relaxed">{tpl.cuerpo}</p>
                </div>
              )}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50 border border-blue-200">
                <MdPersonOff size={14} className="text-blue-500 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-700">
                  Los clientes con opt-out serán excluidos automáticamente antes del envío.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-5 border-t border-border">
          <button
            onClick={() => (step === 0 ? onClose() : setStep(step - 1))}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
          >
            <MdArrowBack size={14} /> {step === 0 ? 'Cancelar' : 'Anterior'}
          </button>
          {step < STEPS.length - 1 ? (
            <button
              disabled={!canNext()}
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente <MdArrowForward size={14} />
            </button>
          ) : (
            <button
              onClick={handleCrear}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
            >
              <MdCampaign size={14} /> Lanzar campaña
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Tarjeta campaña ─── */
function CampanaCard({ c, plantillas, onPausar, onReanudar, onCancelar, onEnviar }) {
  const canal = getCanal(c.canal);
  const seg = getSeg(c.segmentoId);
  const CanalIcon = canal?.icon;
  const [expanded, setExpanded] = useState(false);
  const total = c.enviados;

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden hover:shadow-md transition-shadow">
      <div className={`h-1 w-full ${canal?.bar}`} />
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${canal?.bg}`}>
            <CanalIcon size={20} className={canal?.text} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{c.nombre}</p>
              <Badge estado={c.estado} />
              {c.programada && c.estado === 'programada' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                  <MdSchedule size={11} /> Programada
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {c.id} · {canal?.label} · {seg?.label}
            </p>
            <p className="text-xs text-text-soft mt-0.5 flex items-center gap-1">
              <MdCalendarToday size={11} /> {c.inicio} → {c.fin}
              <span className="mx-1.5">·</span>
              <MdAttachMoney size={11} />
              {fmt(c.presupuesto)}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {c.estado === 'activa' && (
              <button
                onClick={() => onPausar(c.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
              >
                <MdPause size={13} /> Pausar
              </button>
            )}
            {c.estado === 'pausada' && (
              <button
                onClick={() => onReanudar(c.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdPlayArrow size={13} /> Reanudar
              </button>
            )}
            {c.estado === 'programada' && (
              <button
                onClick={() => onEnviar(c.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdSend size={13} /> Enviar ahora
              </button>
            )}
            {(c.estado === 'activa' || c.estado === 'pausada' || c.estado === 'programada') && (
              <button
                onClick={() => onCancelar(c.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-rose-500 text-xs font-medium transition-colors"
              >
                <MdCancel size={13} /> Cancelar
              </button>
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
            >
              <MdBarChart size={13} /> Métricas
            </button>
          </div>
        </div>

        {/* métricas en tiempo real */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-4 gap-3 mb-4">
              {[
                { label: 'Enviados', val: c.enviados, color: 'text-text' },
                { label: 'Entregados', val: c.entregados, color: 'text-blue-600' },
                { label: 'Abiertos', val: c.abiertos, color: 'text-violet-600' },
                { label: 'Clics', val: c.clics, color: 'text-emerald-600' },
              ].map(({ label, val, color }) => (
                <div key={label} className="bg-bg-soft rounded-xl p-3">
                  <p className="text-xs text-text-soft">{label}</p>
                  <p className={`text-xl font-bold mt-0.5 tabular-nums ${color}`}>{val.toLocaleString()}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <MetricBar
                label="Tasa de entrega"
                val={c.entregados}
                total={c.enviados}
                color="bg-blue-400"
                icon={MdSend}
              />
              <MetricBar
                label="Tasa de apertura"
                val={c.abiertos}
                total={c.entregados}
                color="bg-violet-400"
                icon={MdMarkEmailRead}
              />
              <MetricBar
                label="Tasa de clics"
                val={c.clics}
                total={c.abiertos}
                color="bg-emerald-400"
                icon={MdAdsClick}
              />
            </div>
            {c.optout > 0 && (
              <div className="flex items-center gap-2 mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200">
                <MdPersonOff size={14} className="text-rose-500 shrink-0" />
                <p className="text-xs text-rose-700">
                  <span className="font-semibold">{c.optout} contactos</span> excluidos por opt-out automáticamente.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Página principal ─── */
export default function CampanasPage() {
  const [campanas, setCampanas] = useState(CAMPANAS_INIT);
  const [plantillas, setPlantillas] = useState(PLANTILLAS_INIT);
  const [showNueva, setShowNueva] = useState(false);
  const [busq, setBusq] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const newId = () => `CMP-${String(campanas.length + 1).padStart(3, '0')}`;

  const handleCrear = (data) => {
    setCampanas([{ ...data, id: newId(), inicio: data.inicio || '—', fin: data.fin || '—' }, ...campanas]);
    setShowNueva(false);
    showToast('Campaña lanzada correctamente');
  };

  const cambiarEstado = (id, estado) => setCampanas(campanas.map((c) => (c.id === id ? { ...c, estado } : c)));

  const filtradas = campanas.filter((c) => {
    const matchB =
      c.nombre.toLowerCase().includes(busq.toLowerCase()) || c.id.toLowerCase().includes(busq.toLowerCase());
    const matchE = filtroEstado === 'todos' || c.estado === filtroEstado;
    return matchB && matchE;
  });

  const contadores = Object.fromEntries(
    Object.keys(ESTADOS).map((k) => [k, campanas.filter((c) => c.estado === k).length])
  );
  const totalEnviados = campanas.reduce((a, c) => a + c.enviados, 0);
  const totalAbiertos = campanas.reduce((a, c) => a + c.abiertos, 0);
  const totalClics = campanas.reduce((a, c) => a + c.clics, 0);

  return (
    <div className="py-4 flex flex-col gap-8 pb-8">
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-text text-bg text-xs font-medium px-4 py-2.5 rounded-xl z-50 shadow-lg">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-text">Campañas</p>
          <p className="text-xs text-text-soft mt-0.5">
            {campanas.length} campañas · {campanas.filter((c) => c.estado === 'activa').length} activas
          </p>
        </div>
        <button
          onClick={() => setShowNueva(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={16} /> Nueva campaña
        </button>
      </div>

      {/* KPIs globales */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            label: 'Total enviados',
            val: totalEnviados.toLocaleString(),
            icon: MdSend,
            bg: 'bg-bg-soft',
            text: 'text-text',
          },
          {
            label: 'Entregados',
            val: campanas.reduce((a, c) => a + c.entregados, 0).toLocaleString(),
            icon: MdTrendingUp,
            bg: 'bg-blue-50',
            text: 'text-blue-600',
          },
          {
            label: 'Abiertos',
            val: totalAbiertos.toLocaleString(),
            icon: MdMarkEmailRead,
            bg: 'bg-violet-50',
            text: 'text-violet-600',
          },
          {
            label: 'Clics totales',
            val: totalClics.toLocaleString(),
            icon: MdAdsClick,
            bg: 'bg-emerald-50',
            text: 'text-emerald-600',
          },
        ].map(({ label, val, icon: Icon, bg, text }) => (
          <div key={label} className={`rounded-2xl border border-border p-5 flex flex-col gap-2 ${bg}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-text-soft">{label}</p>
              <Icon size={16} className={text} />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${text}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-bg-soft border border-border rounded-xl p-1">
          {['todos', ...Object.keys(ESTADOS)].map((e) => (
            <button
              key={e}
              onClick={() => setFiltroEstado(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${filtroEstado === e ? 'bg-bg text-text shadow-sm border border-border' : 'text-text-soft hover:text-text'}`}
            >
              {e === 'todos' ? `Todos (${campanas.length})` : `${ESTADOS[e].label} (${contadores[e] ?? 0})`}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <MdSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <input
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border border-border bg-bg-soft focus:outline-none focus:border-primary"
            placeholder="Buscar campaña..."
            value={busq}
            onChange={(e) => setBusq(e.target.value)}
          />
        </div>
      </div>

      {/* Listado */}
      <div className="flex flex-col gap-3">
        {filtradas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2 text-text-soft">
            <MdCampaign size={32} />
            <p className="text-sm font-semibold text-text">Sin campañas</p>
            <p className="text-xs">Prueba con otro filtro o crea una nueva</p>
          </div>
        ) : (
          filtradas.map((c) => (
            <CampanaCard
              key={c.id}
              c={c}
              plantillas={plantillas}
              onPausar={(id) => {
                cambiarEstado(id, 'pausada');
                showToast('Campaña pausada');
              }}
              onReanudar={(id) => {
                cambiarEstado(id, 'activa');
                showToast('Campaña reanudada');
              }}
              onCancelar={(id) => {
                cambiarEstado(id, 'cancelada');
                showToast('Campaña cancelada');
              }}
              onEnviar={(id) => {
                cambiarEstado(id, 'activa');
                showToast('Campaña enviada inmediatamente');
              }}
            />
          ))
        )}
      </div>

      {showNueva && (
        <NuevaCampanaModal
          plantillas={plantillas}
          onClose={() => setShowNueva(false)}
          onCrear={handleCrear}
          onNuevaTpl={(t) => setPlantillas((prev) => [...prev, t])}
        />
      )}
    </div>
  );
}
