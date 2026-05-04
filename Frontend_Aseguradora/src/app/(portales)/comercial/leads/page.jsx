'use client';

import { useState } from 'react';
import {
  MdAdd,
  MdClose,
  MdPerson,
  MdPhone,
  MdEmail,
  MdCampaign,
  MdAutoAwesome,
  MdHandshake,
  MdMoreVert,
  MdPersonAdd,
  MdBlock,
  MdSearch,
  MdFilterList,
  MdWhatsapp,
  MdLanguage,
  MdShare,
  MdPhoneCallback,
  MdArrowBack,
  MdChevronLeft,
} from 'react-icons/md';

const ESTADOS = {
  nuevo: { label: 'Nuevo', badge: 'bg-sky-100 text-sky-700', dot: 'bg-sky-500' },
  contactado: { label: 'Contactado', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500' },
  en_cotizacion: { label: 'En cotización', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  convertido: { label: 'Convertido', badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  descartado: { label: 'Descartado', badge: 'bg-rose-100 text-rose-600', dot: 'bg-rose-400' },
};

const CANALES = [
  { value: 'web', label: 'Formulario web', icon: MdLanguage },
  { value: 'whatsapp', label: 'WhatsApp', icon: MdWhatsapp },
  { value: 'referido', label: 'Referido', icon: MdShare },
  { value: 'llamada', label: 'Llamada entrante', icon: MdPhoneCallback },
  { value: 'campaña', label: 'Campaña', icon: MdCampaign },
];

const COMERCIALES = ['Ana Ríos', 'Carlos Vega', 'Lucía Paredes', 'Diego Mora'];

const MOTIVOS_DESCARTE = ['Sin presupuesto', 'No califica', 'Ya tiene seguro', 'Sin respuesta', 'Desistió', 'Otro'];

const LEADS_INICIALES = [
  {
    id: 'L-001',
    nombre: 'Roberto Sánchez',
    telefono: '+51 987 654 321',
    email: 'roberto@gmail.com',
    canal: 'web',
    estado: 'nuevo',
    origen: 'manual',
    comercial: 'Ana Ríos',
    fecha: '25 abr 2025',
    producto: 'Seguro Vehicular',
  },
  {
    id: 'L-002',
    nombre: 'María Flores',
    telefono: '+51 912 345 678',
    email: 'mflores@empresa.pe',
    canal: 'campaña',
    estado: 'en_cotizacion',
    origen: 'automatico',
    comercial: 'Carlos Vega',
    fecha: '24 abr 2025',
    producto: 'Seguro de Vida',
    campaña: 'Campaña Abril 2025',
  },
  {
    id: 'L-003',
    nombre: 'Jorge Castillo',
    telefono: '+51 956 789 012',
    email: 'jcastillo@hotmail.com',
    canal: 'whatsapp',
    estado: 'contactado',
    origen: 'manual',
    comercial: 'Lucía Paredes',
    fecha: '23 abr 2025',
    producto: 'Seguro Hogar',
  },
  {
    id: 'L-004',
    nombre: 'Carmen Delgado',
    telefono: '+51 934 567 890',
    email: 'carmen.d@gmail.com',
    canal: 'referido',
    estado: 'convertido',
    origen: 'manual',
    comercial: 'Diego Mora',
    fecha: '20 abr 2025',
    producto: 'Seguro Vehicular',
  },
  {
    id: 'L-005',
    nombre: 'Luis Herrera',
    telefono: '+51 978 123 456',
    email: 'lherrera@corp.com',
    canal: 'campaña',
    estado: 'descartado',
    origen: 'automatico',
    comercial: 'Ana Ríos',
    fecha: '18 abr 2025',
    producto: 'Seguro de Vida',
    campaña: 'Campaña Marzo 2025',
    motivoDescarte: 'Sin presupuesto',
  },
];

// ─── Modal Nuevo Lead ───────────────────────────────────────────────────────
function ModalNuevoLead({ onClose, onGuardar }) {
  const [form, setForm] = useState({
    nombre: '',
    telefono: '',
    email: '',
    canal: '',
    producto: '',
    comercial: '',
  });
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-bg w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Registrar nuevo lead</p>
          <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          <Field label="Nombre completo">
            <input
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors"
              placeholder="Ej. Roberto Sánchez"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
            />
          </Field>
          <Field label="Teléfono">
            <input
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors"
              placeholder="+51 999 999 999"
              value={form.telefono}
              onChange={(e) => set('telefono', e.target.value)}
            />
          </Field>
          <Field label="Correo electrónico">
            <input
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </Field>
          <Field label="Canal de origen">
            <select
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text outline-none focus:border-primary transition-colors"
              value={form.canal}
              onChange={(e) => set('canal', e.target.value)}
            >
              <option value="">Seleccionar canal</option>
              {CANALES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Producto de interés">
            <input
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors"
              placeholder="Ej. Seguro Vehicular"
              value={form.producto}
              onChange={(e) => set('producto', e.target.value)}
            />
          </Field>
          <Field label="Asignar comercial">
            <select
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text outline-none focus:border-primary transition-colors"
              value={form.comercial}
              onChange={(e) => set('comercial', e.target.value)}
            >
              <option value="">Seleccionar comercial</option>
              {COMERCIALES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              onGuardar(form);
              onClose();
            }}
            disabled={!form.nombre || !form.canal}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Registrar lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Descartar ────────────────────────────────────────────────────────
function ModalDescartar({ lead, onClose, onConfirmar }) {
  const [motivo, setMotivo] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Descartar lead</p>
          <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <p className="text-xs text-text-soft">
            Indica el motivo para descartar a <span className="font-semibold text-text">{lead.nombre}</span>.
          </p>
          <div className="flex flex-col gap-1.5">
            {MOTIVOS_DESCARTE.map((m) => (
              <button
                key={m}
                onClick={() => setMotivo(m)}
                className={`text-left px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  motivo === m
                    ? 'border-rose-400 bg-rose-50 text-rose-700'
                    : 'border-border hover:bg-bg-soft text-text-soft'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!motivo}
            onClick={() => {
              onConfirmar(motivo);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Descartar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal Reasignar ────────────────────────────────────────────────────────
function ModalReasignar({ lead, onClose, onConfirmar }) {
  const [comercial, setComercial] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Reasignar lead</p>
          <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <p className="text-xs text-text-soft">
            Selecciona el comercial al que deseas asignar a{' '}
            <span className="font-semibold text-text">{lead.nombre}</span>.
          </p>
          <div className="flex flex-col gap-1.5">
            {COMERCIALES.filter((c) => c !== lead.comercial).map((c) => (
              <button
                key={c}
                onClick={() => setComercial(c)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-xs font-medium transition-colors ${
                  comercial === c
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:bg-bg-soft text-text-soft'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-bg-soft border border-border flex items-center justify-center text-[10px] font-bold text-text-soft">
                  {c
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!comercial}
            onClick={() => {
              onConfirmar(comercial);
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Reasignar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detalle Lead ───────────────────────────────────────────────────────────
function DetalleLead({ lead, onBack, onCambiarEstado, onDescartar, onReasignar }) {
  const est = ESTADOS[lead.estado];
  const canal = CANALES.find((c) => c.value === lead.canal);
  const CanalIcon = canal?.icon ?? MdLanguage;

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a leads
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-primary" />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-bg-soft border border-border flex items-center justify-center text-sm font-bold text-text-soft">
                {lead.nombre
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{lead.nombre}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                    {est.label}
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  {lead.id} · {lead.producto}
                </p>
              </div>
            </div>
            {lead.origen === 'automatico' && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                <MdAutoAwesome size={11} /> Automático
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { icon: MdPhone, label: 'Teléfono', val: lead.telefono },
              { icon: MdEmail, label: 'Correo', val: lead.email },
              { icon: CanalIcon, label: 'Canal', val: canal?.label ?? lead.canal },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <div className="flex items-center gap-1 mb-0.5">
                  <Icon size={11} className="text-text-soft" />
                  <p className="text-xs text-text-soft">{label}</p>
                </div>
                <p className="text-xs font-semibold text-text truncate">{val}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-col gap-1.5">
            {[
              { label: 'Comercial asignado', val: lead.comercial },
              { label: 'Fecha de ingreso', val: lead.fecha },
              ...(lead.campaña ? [{ label: 'Campaña origen', val: lead.campaña }] : []),
              ...(lead.motivoDescarte ? [{ label: 'Motivo de descarte', val: lead.motivoDescarte }] : []),
            ].map(({ label, val }) => (
              <div
                key={label}
                className="flex justify-between items-center text-xs py-1.5 border-b border-border last:border-0"
              >
                <span className="text-text-soft">{label}</span>
                <span className="font-medium text-text">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Actualizar estado</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(ESTADOS).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => (key === 'descartado' ? onDescartar() : onCambiarEstado(key))}
                disabled={lead.estado === key}
                className={`inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  lead.estado === key
                    ? cfg.badge + ' border-transparent cursor-default'
                    : 'border-border hover:bg-bg-soft text-text-soft'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </button>
            ))}
          </div>

          <button
            onClick={onReasignar}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors w-fit"
          >
            <MdPersonAdd size={14} /> Reasignar a otro comercial
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Card Lead ──────────────────────────────────────────────────────────────
function LeadCard({ lead, onSelect, onCambiarEstado, onDescartar, onReasignar }) {
  const est = ESTADOS[lead.estado];
  const canal = CANALES.find((c) => c.value === lead.canal);
  const CanalIcon = canal?.icon ?? MdLanguage;
  const [menu, setMenu] = useState(false);

  return (
    <div
      className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
      onClick={() => onSelect(lead)}
    >
      <div className="h-1 w-full bg-primary" />
      <div className="p-5">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="w-11 h-11 rounded-xl bg-bg-soft border border-border flex items-center justify-center text-sm font-bold text-text-soft shrink-0">
            {lead.nombre
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm font-bold text-text">{lead.nombre}</p>
              <span
                className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${est.badge}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                {est.label}
              </span>
              {lead.origen === 'automatico' && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  <MdAutoAwesome size={11} /> Auto
                </span>
              )}
            </div>
            <p className="text-xs text-text-soft mt-0.5">
              {lead.id} · {lead.producto}
            </p>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <span className="flex items-center gap-1 text-xs text-text-soft">
                <MdPhone size={11} /> {lead.telefono}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-soft">
                <CanalIcon size={11} /> {canal?.label ?? lead.canal}
              </span>
              <span className="flex items-center gap-1 text-xs text-text-soft">
                <MdPerson size={11} /> {lead.comercial}
              </span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs text-text-soft">{lead.fecha}</p>
            <div className="flex gap-2">
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenu((p) => !p);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
                >
                  <MdMoreVert size={13} />
                </button>
                {menu && (
                  <div className="absolute right-0 top-full mt-1 w-44 bg-bg border border-border rounded-xl shadow-lg z-10 overflow-hidden">
                    {Object.entries(ESTADOS)
                      .filter(([k]) => k !== lead.estado && k !== 'descartado')
                      .map(([key, cfg]) => (
                        <button
                          key={key}
                          onClick={() => {
                            onCambiarEstado(lead, key);
                            setMenu(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-soft hover:bg-bg-soft transition-colors"
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                          Marcar como {cfg.label}
                        </button>
                      ))}
                    <div className="border-t border-border" />
                    <button
                      onClick={() => {
                        onReasignar(lead);
                        setMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-text-soft hover:bg-bg-soft transition-colors"
                    >
                      <MdPersonAdd size={12} /> Reasignar
                    </button>
                    <button
                      onClick={() => {
                        onDescartar(lead);
                        setMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <MdBlock size={12} /> Descartar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Helper ─────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-soft">{label}</label>
      {children}
    </div>
  );
}

// ─── Stats Bar ───────────────────────────────────────────────────────────────
function StatsBar({ leads }) {
  const total = leads.length;
  const counts = Object.keys(ESTADOS).reduce((acc, k) => {
    acc[k] = leads.filter((l) => l.estado === k).length;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
      {Object.entries(ESTADOS).map(([key, cfg]) => (
        <div key={key} className="bg-bg rounded-xl border border-border p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <p className="text-xs text-text-soft">{cfg.label}</p>
          </div>
          <p className="text-lg font-bold text-text">{counts[key]}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Page Principal ──────────────────────────────────────────────────────────
export default function LeadsPage() {
  const [leads, setLeads] = useState(LEADS_INICIALES);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroOrigen, setFiltroOrigen] = useState('todos');
  const [modalNuevo, setModalNuevo] = useState(false);
  const [leadSeleccionado, setLeadSeleccionado] = useState(null);
  const [modalDescartar, setModalDescartar] = useState(null);
  const [modalReasignar, setModalReasignar] = useState(null);

  const leadsFiltrados = leads.filter((l) => {
    const matchBusqueda =
      l.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.email.toLowerCase().includes(busqueda.toLowerCase()) ||
      l.telefono.includes(busqueda);
    const matchEstado = filtroEstado === 'todos' || l.estado === filtroEstado;
    const matchOrigen = filtroOrigen === 'todos' || l.origen === filtroOrigen;
    return matchBusqueda && matchEstado && matchOrigen;
  });

  const handleGuardarLead = (form) => {
    const nuevo = {
      ...form,
      id: `L-${String(leads.length + 1).padStart(3, '0')}`,
      estado: 'nuevo',
      origen: 'manual',
      fecha: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    setLeads((p) => [nuevo, ...p]);
  };

  const handleCambiarEstado = (lead, nuevoEstado) => {
    setLeads((p) => p.map((l) => (l.id === lead.id ? { ...l, estado: nuevoEstado, motivoDescarte: undefined } : l)));
    if (leadSeleccionado?.id === lead.id) setLeadSeleccionado((p) => ({ ...p, estado: nuevoEstado }));
  };

  const handleDescartar = (lead, motivo) => {
    setLeads((p) => p.map((l) => (l.id === lead.id ? { ...l, estado: 'descartado', motivoDescarte: motivo } : l)));
    if (leadSeleccionado?.id === lead.id)
      setLeadSeleccionado((p) => ({ ...p, estado: 'descartado', motivoDescarte: motivo }));
  };

  const handleReasignar = (lead, comercial) => {
    setLeads((p) => p.map((l) => (l.id === lead.id ? { ...l, comercial } : l)));
    if (leadSeleccionado?.id === lead.id) setLeadSeleccionado((p) => ({ ...p, comercial }));
  };

  if (leadSeleccionado) {
    const leadActual = leads.find((l) => l.id === leadSeleccionado.id) ?? leadSeleccionado;
    return (
      <div className="py-4 flex flex-col gap-4 pb-8">
        <DetalleLead
          lead={leadActual}
          onBack={() => setLeadSeleccionado(null)}
          onCambiarEstado={(estado) => handleCambiarEstado(leadActual, estado)}
          onDescartar={() => setModalDescartar(leadActual)}
          onReasignar={() => setModalReasignar(leadActual)}
        />
        {modalDescartar && (
          <ModalDescartar
            lead={modalDescartar}
            onClose={() => setModalDescartar(null)}
            onConfirmar={(motivo) => handleDescartar(modalDescartar, motivo)}
          />
        )}
        {modalReasignar && (
          <ModalReasignar
            lead={modalReasignar}
            onClose={() => setModalReasignar(null)}
            onConfirmar={(comercial) => handleReasignar(modalReasignar, comercial)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-base font-bold text-text">Leads</h1>
          <p className="text-xs text-text-soft mt-0.5">{leads.length} leads en total</p>
        </div>
        <button
          onClick={() => setModalNuevo(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
        >
          <MdAdd size={15} /> Registrar lead
        </button>
      </div>

      {/* Stats */}
      <StatsBar leads={leads} />

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-bg border border-border rounded-xl px-3 py-2">
          <MdSearch size={14} className="text-text-soft shrink-0" />
          <input
            className="flex-1 text-xs text-text placeholder:text-text-soft outline-none bg-transparent"
            placeholder="Buscar por nombre, correo o teléfono..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-bg border border-border rounded-xl pl-3 pr-7 py-2 text-xs text-text outline-none cursor-pointer"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            {Object.entries(ESTADOS).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
          <MdChevronLeft
            size={13}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-soft pointer-events-none"
          />
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-bg border border-border rounded-xl pl-3 pr-7 py-2 text-xs text-text outline-none cursor-pointer"
            value={filtroOrigen}
            onChange={(e) => setFiltroOrigen(e.target.value)}
          >
            <option value="todos">Todos los orígenes</option>
            <option value="manual">Manual</option>
            <option value="automatico">Automático</option>
          </select>
          <MdChevronLeft
            size={13}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-text-soft pointer-events-none"
          />
        </div>
      </div>

      {/* Lista */}
      {leadsFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
            <MdHandshake size={22} className="text-text-soft" />
          </div>
          <p className="text-sm font-semibold text-text">Sin leads</p>
          <p className="text-xs text-text-soft max-w-xs">No hay leads que coincidan con los filtros aplicados.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {leadsFiltrados.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onSelect={setLeadSeleccionado}
              onCambiarEstado={handleCambiarEstado}
              onDescartar={(l) => setModalDescartar(l)}
              onReasignar={(l) => setModalReasignar(l)}
            />
          ))}
        </div>
      )}

      {/* Modales */}
      {modalNuevo && <ModalNuevoLead onClose={() => setModalNuevo(false)} onGuardar={handleGuardarLead} />}
      {modalDescartar && (
        <ModalDescartar
          lead={modalDescartar}
          onClose={() => setModalDescartar(null)}
          onConfirmar={(motivo) => handleDescartar(modalDescartar, motivo)}
        />
      )}
      {modalReasignar && (
        <ModalReasignar
          lead={modalReasignar}
          onClose={() => setModalReasignar(null)}
          onConfirmar={(comercial) => handleReasignar(modalReasignar, comercial)}
        />
      )}
    </div>
  );
}
