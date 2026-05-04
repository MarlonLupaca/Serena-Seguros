'use client';

import { useState } from 'react';
import {
  MdBusiness,
  MdLocationOn,
  MdStar,
  MdStarBorder,
  MdCheck,
  MdClose,
  MdAdd,
  MdSearch,
  MdFilterList,
  MdAutoAwesome,
  MdAssignment,
  MdReceipt,
  MdPayment,
  MdVerified,
  MdWarningAmber,
  MdArrowBack,
  MdEdit,
  MdUploadFile,
  MdPhone,
  MdEmail,
  MdBadge,
  MdChevronRight,
  MdThumbUp,
  MdThumbDown,
  MdAttachMoney,
  MdDownload,
  MdSend,
} from 'react-icons/md';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

// ─── DATA ────────────────────────────────────────────────────────────────────
const ESPECIALIDADES = ['Hojalatería', 'Mecánica', 'Vidrios', 'Electricidad', 'Grúas', 'Peritaje'];
const ZONAS = ['Lima Norte', 'Lima Sur', 'Lima Este', 'Lima Oeste', 'Callao', 'Miraflores'];
const ESTADOS_FACTURA = { pendiente: 'Pendiente', validada: 'Validada', aprobada: 'Aprobada', rechazada: 'Rechazada' };

const PROVEEDORES_MOCK = [
  {
    id: 'PRV-001',
    nombre: 'Taller Automotriz San Miguel',
    especialidades: ['Hojalatería', 'Mecánica'],
    zonas: ['Lima Oeste', 'Callao'],
    tarifaHora: 85,
    tarifaBase: 150,
    contacto: { telefono: '987-654-321', email: 'contacto@smmotors.pe' },
    documentos: ['RUC activo', 'Contrato firmado', 'Seguro RC'],
    calificacion: 4.6,
    totalServicios: 142,
    estado: 'activo',
    desempeno: [
      { indicador: 'Puntualidad', valor: 90 },
      { indicador: 'Calidad', valor: 88 },
      { indicador: 'Comunicación', valor: 75 },
      { indicador: 'Precio', valor: 85 },
      { indicador: 'Resolución', valor: 92 },
    ],
  },
  {
    id: 'PRV-002',
    nombre: 'Vidrios & Más Perú',
    especialidades: ['Vidrios'],
    zonas: ['Miraflores', 'Lima Oeste'],
    tarifaHora: 70,
    tarifaBase: 120,
    contacto: { telefono: '912-345-678', email: 'ops@vidriosmas.pe' },
    documentos: ['RUC activo', 'Contrato firmado'],
    calificacion: 4.2,
    totalServicios: 89,
    estado: 'activo',
    desempeno: [
      { indicador: 'Puntualidad', valor: 78 },
      { indicador: 'Calidad', valor: 95 },
      { indicador: 'Comunicación', valor: 80 },
      { indicador: 'Precio', valor: 90 },
      { indicador: 'Resolución', valor: 70 },
    ],
  },
  {
    id: 'PRV-003',
    nombre: 'Electro Auto Lima',
    especialidades: ['Electricidad', 'Mecánica'],
    zonas: ['Lima Norte', 'Lima Este'],
    tarifaHora: 95,
    tarifaBase: 200,
    contacto: { telefono: '956-789-012', email: 'admin@electroauto.pe' },
    documentos: ['RUC activo', 'Contrato firmado', 'Seguro RC', 'Cert. técnico'],
    calificacion: 4.8,
    totalServicios: 204,
    estado: 'activo',
    desempeno: [
      { indicador: 'Puntualidad', valor: 95 },
      { indicador: 'Calidad', valor: 97 },
      { indicador: 'Comunicación', valor: 88 },
      { indicador: 'Precio', valor: 70 },
      { indicador: 'Resolución', valor: 96 },
    ],
  },
  {
    id: 'PRV-004',
    nombre: 'Grúas Rápidas del Sur',
    especialidades: ['Grúas'],
    zonas: ['Lima Sur', 'Callao'],
    tarifaHora: 110,
    tarifaBase: 300,
    contacto: { telefono: '934-567-890', email: 'gruas@rapidas.pe' },
    documentos: ['RUC activo'],
    calificacion: 3.9,
    totalServicios: 56,
    estado: 'inactivo',
    desempeno: [
      { indicador: 'Puntualidad', valor: 65 },
      { indicador: 'Calidad', valor: 72 },
      { indicador: 'Comunicación', valor: 60 },
      { indicador: 'Precio', valor: 55 },
      { indicador: 'Resolución', valor: 68 },
    ],
  },
];

const SINIESTRO_SUGERENCIA = {
  id: 'SIN-2024-0892',
  tipo: 'Choque frontal',
  zona: 'Lima Oeste',
  especialidadRequerida: 'Hojalatería',
};

const ORDENES_MOCK = [
  {
    id: 'ORD-001',
    siniestro: 'SIN-2024-0891',
    proveedor: 'Taller Automotriz San Miguel',
    monto: 'S/ 850.00',
    estado: 'enviada',
    fecha: '20/04/2025',
    factura: null,
  },
  {
    id: 'ORD-002',
    siniestro: 'SIN-2024-0880',
    proveedor: 'Vidrios & Más Perú',
    monto: 'S/ 420.00',
    estado: 'facturada',
    fecha: '18/04/2025',
    factura: {
      numero: 'F001-00892',
      monto: 'S/ 420.00',
      estadoValidacion: 'validada',
    },
  },
  {
    id: 'ORD-003',
    siniestro: 'SIN-2024-0871',
    proveedor: 'Electro Auto Lima',
    monto: 'S/ 1,200.00',
    estado: 'pagada',
    fecha: '15/04/2025',
    factura: {
      numero: 'E001-00345',
      monto: 'S/ 1,200.00',
      estadoValidacion: 'aprobada',
    },
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function Estrellas({ valor }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) =>
        i <= Math.round(valor) ? (
          <MdStar key={i} size={13} className="text-amber-400" />
        ) : (
          <MdStarBorder key={i} size={13} className="text-text-soft" />
        )
      )}
      <span className="text-xs text-text-soft ml-1">{valor.toFixed(1)}</span>
    </span>
  );
}

function Badge({ color, children }) {
  const map = {
    green: 'bg-emerald-100 text-emerald-700',
    red: 'bg-rose-100 text-rose-600',
    amber: 'bg-amber-100 text-amber-700',
    blue: 'bg-blue-100 text-blue-700',
    gray: 'bg-bg-soft text-text-soft',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${map[color] || map.gray}`}
    >
      {children}
    </span>
  );
}

function TabBar({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 border-b border-border mb-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors -mb-px ${
            active === t.id ? 'border-primary text-primary' : 'border-transparent text-text-soft hover:text-text'
          }`}
        >
          <t.icon size={14} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── VISTA: LISTADO PROVEEDORES ───────────────────────────────────────────────
function ListaProveedores({ onSelect, onNuevo }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroZona, setFiltroZona] = useState('');
  const [filtroEsp, setFiltroEsp] = useState('');

  const filtrados = PROVEEDORES_MOCK.filter((p) => {
    const q = busqueda.toLowerCase();
    const matchQ = !q || p.nombre.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchZ = !filtroZona || p.zonas.includes(filtroZona);
    const matchE = !filtroEsp || p.especialidades.includes(filtroEsp);
    return matchQ && matchZ && matchE;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Barra de acciones */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              type="text"
              placeholder="Buscar proveedor..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-xl bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={filtroZona}
            onChange={(e) => setFiltroZona(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todas las zonas</option>
            {ZONAS.map((z) => (
              <option key={z}>{z}</option>
            ))}
          </select>
          <select
            value={filtroEsp}
            onChange={(e) => setFiltroEsp(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todas las especialidades</option>
            {ESPECIALIDADES.map((e) => (
              <option key={e}>{e}</option>
            ))}
          </select>
        </div>
        <button
          onClick={onNuevo}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors shrink-0"
        >
          <MdAdd size={15} /> Nuevo proveedor
        </button>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3">
        {filtrados.map((p) => (
          <div
            key={p.id}
            onClick={() => onSelect(p)}
            className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden cursor-pointer"
          >
            <div className={`h-1 w-full ${p.estado === 'activo' ? 'bg-emerald-500' : 'bg-rose-400'}`} />
            <div className="p-5">
              <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MdBusiness size={22} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-text">{p.nombre}</p>
                    <Badge color={p.estado === 'activo' ? 'green' : 'red'}>
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${p.estado === 'activo' ? 'bg-emerald-500' : 'bg-rose-400'}`}
                      />
                      {p.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                    {p.documentos.length < 3 && (
                      <Badge color="amber">
                        <MdWarningAmber size={11} /> Docs incompletos
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-text-soft mt-0.5">{p.id}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {p.especialidades.map((e) => (
                      <span
                        key={e}
                        className="text-xs px-2 py-0.5 rounded-lg bg-bg-soft text-text-soft border border-border"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-text-soft">
                      <MdLocationOn size={12} /> {p.zonas.join(', ')}
                    </span>
                    <span className="text-text-soft text-xs">·</span>
                    <span className="text-xs text-text-soft">{p.totalServicios} servicios</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Estrellas valor={p.calificacion} />
                  <p className="text-xs text-text-soft">S/ {p.tarifaHora}/hr</p>
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs transition-colors">
                    Ver detalle <MdChevronRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VISTA: DETALLE PROVEEDOR ─────────────────────────────────────────────────
function DetalleProveedor({ proveedor, onBack }) {
  const [calificando, setCalificando] = useState(false);
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [enviado, setEnviado] = useState(false);

  const enviarCalificacion = () => {
    setEnviado(true);
    setCalificando(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text transition-colors w-fit"
      >
        <MdArrowBack size={15} /> Volver a proveedores
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${proveedor.estado === 'activo' ? 'bg-emerald-500' : 'bg-rose-400'}`} />
        <div className="p-5 border-b border-border">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MdBusiness size={26} className="text-blue-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-text">{proveedor.nombre}</p>
                  <Badge color={proveedor.estado === 'activo' ? 'green' : 'red'}>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${proveedor.estado === 'activo' ? 'bg-emerald-500' : 'bg-rose-400'}`}
                    />
                    {proveedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>
                <p className="text-xs text-text-soft mt-0.5">{proveedor.id}</p>
                <Estrellas valor={proveedor.calificacion} />
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors">
              <MdEdit size={13} /> Editar
            </button>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {[
              { label: 'Tarifa hora', val: `S/ ${proveedor.tarifaHora}` },
              { label: 'Tarifa base', val: `S/ ${proveedor.tarifaBase}` },
              { label: 'Servicios', val: proveedor.totalServicios },
              { label: 'Calificación', val: `${proveedor.calificacion}/5.0` },
            ].map(({ label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <p className="text-xs text-text-soft">{label}</p>
                <p className="text-xs font-bold text-text mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto & Docs */}
        <div className="p-5 border-b border-border grid sm:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Contacto</p>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-text">
                <MdPhone size={13} className="text-text-soft" /> {proveedor.contacto.telefono}
              </div>
              <div className="flex items-center gap-2 text-xs text-text">
                <MdEmail size={13} className="text-text-soft" /> {proveedor.contacto.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-text">
                <MdLocationOn size={13} className="text-text-soft" /> {proveedor.zonas.join(' · ')}
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Documentos</p>
            <div className="flex flex-col gap-1.5">
              {['RUC activo', 'Contrato firmado', 'Seguro RC', 'Cert. técnico'].map((doc) => {
                const tiene = proveedor.documentos.includes(doc);
                return (
                  <div
                    key={doc}
                    className="flex items-center justify-between text-xs py-1 border-b border-border last:border-0"
                  >
                    <span className="flex items-center gap-1.5 text-text">
                      <MdBadge size={12} className="text-text-soft" /> {doc}
                    </span>
                    {tiene ? (
                      <MdVerified size={13} className="text-emerald-500" />
                    ) : (
                      <span className="flex items-center gap-1 text-amber-600">
                        <MdWarningAmber size={12} /> Pendiente
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
            <button className="mt-3 flex items-center gap-1.5 text-xs text-primary hover:underline">
              <MdUploadFile size={13} /> Subir documento
            </button>
          </div>
        </div>

        {/* Radar desempeño */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Desempeño histórico</p>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={proveedor.desempeno}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="indicador" tick={{ fontSize: 10 }} />
              <Radar dataKey="valor" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
              <Tooltip formatter={(v) => [`${v}%`, '']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Calificación */}
        <div className="p-5">
          {enviado ? (
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              <MdVerified size={15} /> Calificación enviada exitosamente. ¡Gracias!
            </div>
          ) : calificando ? (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold text-text">Calificar desempeño</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button key={i} onClick={() => setCalificacion(i)}>
                    {i <= calificacion ? (
                      <MdStar size={22} className="text-amber-400" />
                    ) : (
                      <MdStarBorder size={22} className="text-text-soft" />
                    )}
                  </button>
                ))}
              </div>
              <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Comentario opcional..."
                rows={2}
                className="text-xs border border-border rounded-xl p-3 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={enviarCalificacion}
                  disabled={!calificacion}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <MdSend size={13} /> Enviar calificación
                </button>
                <button
                  onClick={() => setCalificando(false)}
                  className="px-4 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setCalificando(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdStar size={13} /> Calificar proveedor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── VISTA: REGISTRO NUEVO PROVEEDOR ─────────────────────────────────────────
function NuevoProveedor({ onBack }) {
  const [form, setForm] = useState({
    nombre: '',
    ruc: '',
    telefono: '',
    email: '',
    especialidades: [],
    zonas: [],
    tarifaHora: '',
    tarifaBase: '',
  });
  const [guardado, setGuardado] = useState(false);

  const toggle = (arr, val) => (arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);

  const guardar = () => setGuardado(true);

  if (guardado) {
    return (
      <div className="flex flex-col gap-4">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text w-fit">
          <MdArrowBack size={15} /> Volver
        </button>
        <div className="bg-bg rounded-2xl border border-emerald-200 overflow-hidden">
          <div className="h-1 w-full bg-emerald-500" />
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <MdVerified size={28} className="text-emerald-500" />
            </div>
            <p className="text-sm font-bold text-text">Proveedor registrado exitosamente</p>
            <p className="text-xs text-text-soft">
              El proveedor ha sido guardado y está listo para recibir órdenes de servicio.
            </p>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold"
            >
              Ver lista de proveedores
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text w-fit">
        <MdArrowBack size={15} /> Volver a proveedores
      </button>
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-primary" />
        <div className="p-5 flex flex-col gap-5">
          <p className="text-sm font-bold text-text">Registrar nuevo proveedor</p>

          {/* Datos básicos */}
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: 'Nombre / razón social', key: 'nombre', placeholder: 'Ej. Taller San Juan SAC' },
              { label: 'RUC', key: 'ruc', placeholder: '20512345678' },
              { label: 'Teléfono', key: 'telefono', placeholder: '987-000-000' },
              { label: 'Correo electrónico', key: 'email', placeholder: 'contacto@empresa.pe' },
              { label: 'Tarifa por hora (S/)', key: 'tarifaHora', placeholder: '85' },
              { label: 'Tarifa base (S/)', key: 'tarifaBase', placeholder: '150' },
            ].map(({ label, key, placeholder }) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-text-soft">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            ))}
          </div>

          {/* Especialidades */}
          <div>
            <label className="text-xs font-semibold text-text-soft block mb-2">Especialidades</label>
            <div className="flex flex-wrap gap-2">
              {ESPECIALIDADES.map((e) => (
                <button
                  key={e}
                  onClick={() => setForm({ ...form, especialidades: toggle(form.especialidades, e) })}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                    form.especialidades.includes(e)
                      ? 'bg-primary text-text-inverse border-primary'
                      : 'border-border text-text-soft hover:bg-bg-soft'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Zonas */}
          <div>
            <label className="text-xs font-semibold text-text-soft block mb-2">Zonas de cobertura</label>
            <div className="flex flex-wrap gap-2">
              {ZONAS.map((z) => (
                <button
                  key={z}
                  onClick={() => setForm({ ...form, zonas: toggle(form.zonas, z) })}
                  className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                    form.zonas.includes(z)
                      ? 'bg-primary text-text-inverse border-primary'
                      : 'border-border text-text-soft hover:bg-bg-soft'
                  }`}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Documentos */}
          <div>
            <label className="text-xs font-semibold text-text-soft block mb-2">Documentos contractuales</label>
            <div className="flex flex-col gap-2">
              {['RUC activo', 'Contrato firmado', 'Seguro RC', 'Cert. técnico'].map((doc) => (
                <div key={doc} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                  <span className="text-xs text-text">{doc}</span>
                  <button className="flex items-center gap-1.5 text-xs text-primary hover:underline">
                    <MdUploadFile size={13} /> Subir
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={guardar}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors"
          >
            <MdVerified size={16} /> Registrar proveedor
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── VISTA: SUGERENCIA + ORDEN DE SERVICIO ────────────────────────────────────
function OrdenesServicio() {
  const [etapa, setEtapa] = useState('sugerencia'); // sugerencia | seleccion | orden | enviada
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [ordenGenerada, setOrdenGenerada] = useState(false);

  const sugerido = PROVEEDORES_MOCK.find(
    (p) =>
      p.zonas.includes(SINIESTRO_SUGERENCIA.zona) &&
      p.especialidades.includes(SINIESTRO_SUGERENCIA.especialidadRequerida)
  );

  const generarOrden = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setEtapa('orden');
  };

  const enviarOrden = () => setOrdenGenerada(true);

  return (
    <div className="flex flex-col gap-4">
      {/* Siniestro activo */}
      <div className="bg-bg-soft rounded-2xl border border-border p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <MdWarningAmber size={18} className="text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-text">Siniestro activo: {SINIESTRO_SUGERENCIA.id}</p>
          <p className="text-xs text-text-soft">
            {SINIESTRO_SUGERENCIA.tipo} · {SINIESTRO_SUGERENCIA.zona} · Requiere:{' '}
            {SINIESTRO_SUGERENCIA.especialidadRequerida}
          </p>
        </div>
      </div>

      {/* Sugerencia IA */}
      {etapa === 'sugerencia' && sugerido && (
        <div className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="h-1 w-full bg-blue-500" />
          <div className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <MdAutoAwesome size={15} className="text-blue-500" />
              <p className="text-xs font-bold text-text">Proveedor sugerido por el sistema</p>
              <Badge color="blue">IA</Badge>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MdBusiness size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-text">{sugerido.nombre}</p>
                <p className="text-xs text-text-soft">
                  {sugerido.id} · {sugerido.especialidades.join(', ')}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <Estrellas valor={sugerido.calificacion} />
                  <span className="text-xs text-text-soft">
                    S/ {sugerido.tarifaHora}/hr · {sugerido.totalServicios} servicios
                  </span>
                </div>
                <p className="text-xs text-text-soft mt-1">
                  <MdLocationOn size={11} className="inline mr-0.5" />
                  {sugerido.zonas.join(', ')}
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => generarOrden(sugerido)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdCheck size={14} /> Aceptar sugerencia
              </button>
              <button
                onClick={() => setEtapa('seleccion')}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft transition-colors"
              >
                Seleccionar otro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selección manual */}
      {etapa === 'seleccion' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-text-soft">Seleccionar proveedor manualmente</p>
          {PROVEEDORES_MOCK.filter((p) => p.estado === 'activo').map((p) => (
            <div
              key={p.id}
              onClick={() => generarOrden(p)}
              className="bg-bg rounded-2xl border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer p-4 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <MdBusiness size={18} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text">{p.nombre}</p>
                <p className="text-xs text-text-soft">
                  {p.especialidades.join(', ')} · {p.zonas.join(', ')}
                </p>
                <Estrellas valor={p.calificacion} />
              </div>
              <MdChevronRight size={16} className="text-text-soft" />
            </div>
          ))}
        </div>
      )}

      {/* Orden generada */}
      {etapa === 'orden' && proveedorSeleccionado && (
        <div className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="h-1 w-full bg-emerald-500" />
          <div className="p-5">
            <p className="text-xs font-bold text-text mb-4 flex items-center gap-2">
              <MdAssignment size={14} /> Orden de servicio generada
            </p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'N° Orden', val: 'ORD-' + Date.now().toString().slice(-5) },
                { label: 'Siniestro', val: SINIESTRO_SUGERENCIA.id },
                { label: 'Proveedor', val: proveedorSeleccionado.nombre },
                { label: 'Tipo de servicio', val: SINIESTRO_SUGERENCIA.especialidadRequerida },
                { label: 'Zona', val: SINIESTRO_SUGERENCIA.zona },
                { label: 'Tarifa acordada', val: `S/ ${proveedorSeleccionado.tarifaBase}.00` },
                { label: 'Fecha', val: new Date().toLocaleDateString('es-PE') },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
                  <span className="text-text-soft">{label}</span>
                  <span className="font-semibold text-text">{val}</span>
                </div>
              ))}
            </div>
            {!ordenGenerada ? (
              <button
                onClick={enviarOrden}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors"
              >
                <MdSend size={16} /> Enviar orden al proveedor
              </button>
            ) : (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
                <MdVerified size={15} /> Orden enviada exitosamente al proveedor vía correo y SMS.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Órdenes existentes */}
      <div className="flex flex-col gap-3 mt-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Órdenes recientes</p>
        {ORDENES_MOCK.map((o) => (
          <div key={o.id} className="bg-bg rounded-2xl border border-border p-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <p className="text-xs font-bold text-text">
                  {o.id} · {o.siniestro}
                </p>
                <p className="text-xs text-text-soft">{o.proveedor}</p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-text">{o.monto}</p>
                <Badge color={o.estado === 'pagada' ? 'green' : o.estado === 'enviada' ? 'blue' : 'amber'}>
                  {o.estado}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── VISTA: FACTURACIÓN ───────────────────────────────────────────────────────
function Facturacion() {
  const [ordenes, setOrdenes] = useState(ORDENES_MOCK);
  const [facturaInput, setFacturaInput] = useState({});

  const recibirFactura = (id) => {
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              estado: 'facturada',
              factura: { numero: 'F001-0099' + id.slice(-1), monto: o.monto, estadoValidacion: 'pendiente' },
            }
          : o
      )
    );
  };

  const validarFactura = (id) => {
    setOrdenes((prev) =>
      prev.map((o) => (o.id === id ? { ...o, factura: { ...o.factura, estadoValidacion: 'validada' } } : o))
    );
  };

  const aprobarFactura = (id) => {
    setOrdenes((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, estado: 'pagada', factura: { ...o.factura, estadoValidacion: 'aprobada' } } : o
      )
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {ordenes.map((o) => (
        <div key={o.id} className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div
            className={`h-1 w-full ${o.estado === 'pagada' ? 'bg-emerald-500' : o.estado === 'facturada' ? 'bg-blue-500' : 'bg-amber-400'}`}
          />
          <div className="p-5">
            <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
              <div>
                <p className="text-xs font-bold text-text">
                  {o.id} · {o.siniestro}
                </p>
                <p className="text-xs text-text-soft">
                  {o.proveedor} · {o.fecha}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-text">{o.monto}</p>
                <Badge color={o.estado === 'pagada' ? 'green' : o.estado === 'facturada' ? 'blue' : 'amber'}>
                  {o.estado}
                </Badge>
              </div>
            </div>

            {/* Factura */}
            {o.factura ? (
              <div className="bg-bg-soft rounded-xl p-3 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-soft flex items-center gap-1">
                    <MdReceipt size={12} /> {o.factura.numero}
                  </span>
                  <span className="font-semibold text-text">{o.factura.monto}</span>
                </div>
                <div className="flex items-center justify-between">
                  <Badge
                    color={
                      o.factura.estadoValidacion === 'aprobada'
                        ? 'green'
                        : o.factura.estadoValidacion === 'validada'
                          ? 'blue'
                          : o.factura.estadoValidacion === 'rechazada'
                            ? 'red'
                            : 'amber'
                    }
                  >
                    {ESTADOS_FACTURA[o.factura.estadoValidacion]}
                  </Badge>
                  <div className="flex gap-2">
                    {o.factura.estadoValidacion === 'pendiente' && (
                      <>
                        <button
                          onClick={() => validarFactura(o.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                        >
                          <MdCheck size={12} /> Validar
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-rose-300 text-rose-600 text-xs font-semibold hover:bg-rose-50">
                          <MdClose size={12} /> Rechazar
                        </button>
                      </>
                    )}
                    {o.factura.estadoValidacion === 'validada' && (
                      <button
                        onClick={() => aprobarFactura(o.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold"
                      >
                        <MdPayment size={12} /> Aprobar y pagar
                      </button>
                    )}
                    {o.factura.estadoValidacion === 'aprobada' && (
                      <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border hover:bg-bg-soft text-xs text-text-soft">
                        <MdDownload size={12} /> Comprobante
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : o.estado === 'enviada' ? (
              <button
                onClick={() => recibirFactura(o.id)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft transition-colors"
              >
                <MdUploadFile size={13} /> Registrar factura recibida
              </button>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'proveedores', label: 'Proveedores', icon: MdBusiness },
  { id: 'ordenes', label: 'Órdenes', icon: MdAssignment },
  { id: 'facturacion', label: 'Facturación', icon: MdReceipt },
];

export default function ProveedoresPage() {
  const [tab, setTab] = useState('proveedores');
  const [vista, setVista] = useState('lista'); // lista | detalle | nuevo
  const [proveedorActivo, setProveedorActivo] = useState(null);

  const handleSelect = (p) => {
    setProveedorActivo(p);
    setVista('detalle');
  };

  const handleNuevo = () => setVista('nuevo');
  const handleBack = () => {
    setVista('lista');
    setProveedorActivo(null);
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      <div>
        <h1 className="text-lg font-bold text-text">Gestión de Proveedores</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Registro, asignación, facturación y calificación de proveedores de servicio
        </p>
      </div>

      <TabBar
        tabs={TABS}
        active={tab}
        onChange={(t) => {
          setTab(t);
          setVista('lista');
        }}
      />

      {tab === 'proveedores' &&
        (vista === 'lista' ? (
          <ListaProveedores onSelect={handleSelect} onNuevo={handleNuevo} />
        ) : vista === 'detalle' ? (
          <DetalleProveedor proveedor={proveedorActivo} onBack={handleBack} />
        ) : (
          <NuevoProveedor onBack={handleBack} />
        ))}

      {tab === 'ordenes' && <OrdenesServicio />}
      {tab === 'facturacion' && <Facturacion />}
    </div>
  );
}
