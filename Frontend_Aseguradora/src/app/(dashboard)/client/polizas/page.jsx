'use client';
import { useState } from 'react';
import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdArrowForward,
  MdCheck,
  MdSearch,
  MdDownload,
  MdRefresh,
  MdPayment,
  MdWarning,
  MdClose,
  MdDescription,
  MdHistory,
  MdPeople,
  MdShield,
  MdChevronRight,
  MdFilterList,
} from 'react-icons/md';

const POLIZAS = [
  {
    id: 'POL-2024-00182',
    tipo: 'auto',
    label: 'Seguro de Auto',
    icon: MdDirectionsCar,
    accentBg: 'bg-primary/10',
    accentText: 'text-primary',
    estado: 'activa',
    inicio: '01/01/2024',
    fin: '31/12/2024',
    renovacion: '15/12/2024',
    monto: 'S/ 35,000',
    plan: 'Full',
    cobertura: 'Choques, robo total/parcial, daños a terceros, asistencia 24h, gastos médicos a ocupantes.',
    exclusiones: 'Conducción bajo efectos de alcohol, daños por guerra o catástrofe nuclear.',
    beneficiarios: null,
    bien: 'Toyota Corolla 2020 – ABC-123',
    documentos: ['Póliza PDF', 'Condiciones generales', 'SOAT'],
    historial: [
      { fecha: '10/03/2024', tipo: 'Pago', detalle: 'Cuota mensual abonada – S/ 110' },
      { fecha: '10/02/2024', tipo: 'Pago', detalle: 'Cuota mensual abonada – S/ 110' },
      { fecha: '01/01/2024', tipo: 'Emisión', detalle: 'Póliza emitida correctamente' },
    ],
  },
  {
    id: 'POL-2023-00891',
    tipo: 'salud',
    label: 'Seguro de Salud',
    icon: MdHealthAndSafety,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-600',
    estado: 'activa',
    inicio: '15/06/2023',
    fin: '14/06/2024',
    renovacion: '01/06/2024',
    monto: 'S/ 200,000',
    plan: 'Familiar',
    cobertura: 'Hospitalización, cirugías, maternidad, pediatría, telemedicina, medicamentos con descuento.',
    exclusiones: 'Enfermedades preexistentes no declaradas, tratamientos estéticos.',
    beneficiarios: ['María Pérez (cónyuge)', 'Lucía Pérez (hija, 8 años)'],
    bien: null,
    documentos: ['Póliza PDF', 'Carnet de afiliación', 'Guía de clínicas'],
    historial: [
      { fecha: '01/04/2024', tipo: 'Uso', detalle: 'Consulta médica – Clínica San Felipe' },
      { fecha: '10/03/2024', tipo: 'Pago', detalle: 'Cuota mensual abonada – S/ 149' },
      { fecha: '15/06/2023', tipo: 'Emisión', detalle: 'Póliza emitida correctamente' },
    ],
  },
  {
    id: 'POL-2022-00345',
    tipo: 'vida',
    label: 'Seguro de Vida',
    icon: MdFavorite,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-500',
    estado: 'vencida',
    inicio: '01/03/2022',
    fin: '28/02/2023',
    renovacion: '—',
    monto: 'S/ 200,000',
    plan: 'Plus',
    cobertura: 'Capital asegurado S/200k, invalidez total, enfermedades graves.',
    exclusiones: 'Suicidio dentro de los primeros 2 años, actividades de alto riesgo no declaradas.',
    beneficiarios: ['María Pérez (cónyuge, 60%)', 'Luis Pérez (hijo, 40%)'],
    bien: null,
    documentos: ['Póliza PDF', 'Condiciones generales'],
    historial: [
      { fecha: '28/02/2023', tipo: 'Vencimiento', detalle: 'Póliza vencida sin renovación' },
      { fecha: '01/03/2022', tipo: 'Emisión', detalle: 'Póliza emitida correctamente' },
    ],
  },
  {
    id: 'POL-2024-00510',
    tipo: 'hogar',
    label: 'Seguro de Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-600',
    estado: 'en proceso',
    inicio: '—',
    fin: '—',
    renovacion: '—',
    monto: 'S/ 250,000',
    plan: 'Estándar',
    cobertura: 'Incendio, robo de contenido, fenómenos naturales.',
    exclusiones: 'Daños por mal uso, humedad crónica.',
    beneficiarios: null,
    bien: 'Departamento – Av. Javier Prado 1280, Miraflores',
    documentos: [],
    historial: [
      { fecha: '12/04/2024', tipo: 'Proceso', detalle: 'Documentos en revisión por el área técnica' },
      { fecha: '10/04/2024', tipo: 'Solicitud', detalle: 'Solicitud de contratación recibida' },
    ],
  },
];

const ESTADO_STYLES = {
  activa: { dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700', label: 'Activa' },
  vencida: { dot: 'bg-rose-400', badge: 'bg-rose-100 text-rose-600', label: 'Vencida' },
  'en proceso': { dot: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'En proceso' },
};

function DetalleModal({ poliza, onClose }) {
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
              <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-border" />
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

export default function Polizas() {
  const [detalle, setDetalle] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  const filtradas = POLIZAS.filter((p) => {
    const matchEstado = filtroEstado === 'todos' || p.estado === filtroEstado;
    const matchTipo = filtroTipo === 'todos' || p.tipo === filtroTipo;
    const matchBusq =
      busqueda === '' ||
      p.label.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.id.toLowerCase().includes(busqueda.toLowerCase());
    return matchEstado && matchTipo && matchBusq;
  });

  const counts = {
    total: POLIZAS.length,
    activas: POLIZAS.filter((p) => p.estado === 'activa').length,
    vencidas: POLIZAS.filter((p) => p.estado === 'vencida').length,
    proceso: POLIZAS.filter((p) => p.estado === 'en proceso').length,
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5">
        <p className="text-xl font-bold text-text">Mis pólizas</p>
        <p className="text-sm text-text-soft mt-0.5">Gestiona y consulta todas tus pólizas contratadas.</p>
      </div>

      <div className="flex-1 w-full flex flex-col gap-6 pb-8">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total pólizas', val: counts.total, color: 'text-text' },
            { label: 'Activas', val: counts.activas, color: 'text-emerald-600' },
            { label: 'Vencidas', val: counts.vencidas, color: 'text-rose-500' },
            { label: 'En proceso', val: counts.proceso, color: 'text-amber-600' },
          ].map((k) => (
            <div key={k.label} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <MdShield size={18} className="text-primary" />
              </div>
              <div>
                <p className={`text-xl font-bold leading-tight ${k.color}`}>{k.val}</p>
                <p className="text-xs text-text-soft">{k.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              placeholder="Buscar por nombre o número de póliza…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none bg-bg text-text border border-border focus:border-primary transition-colors"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <MdFilterList size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
              <select
                className="pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none bg-bg text-text border border-border focus:border-primary transition-colors appearance-none"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
              >
                <option value="todos">Todos los estados</option>
                <option value="activa">Activa</option>
                <option value="vencida">Vencida</option>
                <option value="en proceso">En proceso</option>
              </select>
            </div>
            <select
              className="px-3 py-2.5 rounded-xl text-sm outline-none bg-bg text-text border border-border focus:border-primary transition-colors appearance-none"
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
            >
              <option value="todos">Todos los tipos</option>
              <option value="auto">Auto</option>
              <option value="salud">Salud</option>
              <option value="vida">Vida</option>
              <option value="hogar">Hogar</option>
            </select>
          </div>
        </div>

        {/* Lista */}
        {filtradas.length === 0 ? (
          <div className="bg-bg rounded-2xl border border-border p-12 text-center">
            <MdShield size={36} className="text-text-soft mx-auto mb-3 opacity-40" />
            <p className="text-sm font-medium text-text">No se encontraron pólizas</p>
            <p className="text-xs text-text-soft mt-1">Prueba cambiando los filtros</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtradas.map((p) => {
              const Icon = p.icon;
              const est = ESTADO_STYLES[p.estado];
              return (
                <div
                  key={p.id}
                  className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className={`h-1 w-full ${p.accentBg}`} />
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${p.accentBg}`}>
                        <Icon size={22} className={p.accentText} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-text">{p.label}</span>
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${est.badge}`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${est.dot}`} />
                            {est.label}
                          </span>
                        </div>
                        <p className="text-xs text-text-soft mt-0.5">
                          {p.id} · Plan {p.plan}
                        </p>
                        {p.bien && <p className="text-xs text-text-soft mt-0.5 truncate">{p.bien}</p>}
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs text-text-soft shrink-0 flex-wrap sm:flex-nowrap">
                      <div className="text-center">
                        <p className="text-text-soft">Vencimiento</p>
                        <p className="font-semibold text-text mt-0.5">{p.fin}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-text-soft">Monto</p>
                        <p className="font-semibold text-text mt-0.5">{p.monto}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {p.estado === 'activa' && (
                        <>
                          <button
                            title="Pagar"
                            className="p-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft hover:text-primary transition-colors"
                          >
                            <MdPayment size={16} />
                          </button>
                          <button
                            title="Reportar siniestro"
                            className="p-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft hover:text-rose-500 transition-colors"
                          >
                            <MdWarning size={16} />
                          </button>
                        </>
                      )}
                      {p.estado === 'vencida' && (
                        <button
                          title="Renovar"
                          className="p-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft hover:text-primary transition-colors"
                        >
                          <MdRefresh size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => setDetalle(p)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
                      >
                        Ver detalle <MdChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {detalle && <DetalleModal poliza={detalle} onClose={() => setDetalle(null)} />}
    </div>
  );
}
