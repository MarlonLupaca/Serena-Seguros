'use client';

import { useState, useMemo } from 'react';
import {
  MdFolderOpen,
  MdUploadFile,
  MdSearch,
  MdCheck,
  MdClose,
  MdHistory,
  MdSettings,
  MdArrowBack,
  MdChevronRight,
  MdPictureAsPdf,
  MdImage,
  MdDescription,
  MdVisibilityOff,
  MdVerified,
  MdWarningAmber,
  MdAdd,
  MdPerson,
  MdPolicy,
  MdGavel,
  MdFilterList,
  MdCalendarToday,
  MdLock,
  MdCheckCircle,
  MdCancel,
  MdMoreVert,
  MdDownload,
  MdInfo,
  MdChevronLeft,
} from 'react-icons/md';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const TIPOS_DOC = [
  'DNI / Identificación',
  'Póliza',
  'Endoso',
  'Parte policial',
  'Fotos del siniestro',
  'Factura',
  'Comprobante de pago',
  'Informe pericial',
  'Orden de servicio',
  'Contrato',
  'SOAT',
  'Tarjeta de propiedad',
];

const CLIENTES = ['García López, Juan', 'Martínez Ríos, Ana', 'Fernández Chávez, Luis', 'Torres Vega, María'];

const DOCS_MOCK = [
  {
    id: 'DOC-001',
    nombre: 'DNI-JGL.pdf',
    tipo: 'DNI / Identificación',
    cliente: 'García López, Juan',
    poliza: 'POL-2024-0041',
    siniestro: null,
    fecha: '10/01/2025',
    estado: 'aprobado',
    activo: true,
    subidoPor: 'Operador A',
    versiones: [{ version: 1, fecha: '10/01/2025', subidoPor: 'Operador A', nota: 'Documento inicial' }],
  },
  {
    id: 'DOC-002',
    nombre: 'Poliza-AUTO-0041.pdf',
    tipo: 'Póliza',
    cliente: 'García López, Juan',
    poliza: 'POL-2024-0041',
    siniestro: null,
    fecha: '10/01/2025',
    estado: 'aprobado',
    activo: true,
    subidoPor: 'Operador A',
    versiones: [
      { version: 1, fecha: '10/01/2025', subidoPor: 'Operador A', nota: 'Emisión inicial' },
      { version: 2, fecha: '15/02/2025', subidoPor: 'Operador B', nota: 'Actualización cobertura' },
    ],
  },
  {
    id: 'DOC-003',
    nombre: 'Parte-Policial-SIN892.pdf',
    tipo: 'Parte policial',
    cliente: 'García López, Juan',
    poliza: 'POL-2024-0041',
    siniestro: 'SIN-2024-0892',
    fecha: '20/04/2025',
    estado: 'pendiente',
    activo: true,
    subidoPor: 'Operador C',
    versiones: [{ version: 1, fecha: '20/04/2025', subidoPor: 'Operador C', nota: 'Parte recibido del cliente' }],
  },
  {
    id: 'DOC-004',
    nombre: 'Fotos-SIN892-01.jpg',
    tipo: 'Fotos del siniestro',
    cliente: 'García López, Juan',
    poliza: 'POL-2024-0041',
    siniestro: 'SIN-2024-0892',
    fecha: '20/04/2025',
    estado: 'rechazado',
    activo: true,
    subidoPor: 'Operador C',
    motivoRechazo: 'Imagen ilegible, resolución insuficiente.',
    versiones: [{ version: 1, fecha: '20/04/2025', subidoPor: 'Operador C', nota: 'Primera subida' }],
  },
  {
    id: 'DOC-005',
    nombre: 'DNI-AMR.pdf',
    tipo: 'DNI / Identificación',
    cliente: 'Martínez Ríos, Ana',
    poliza: 'POL-2024-0078',
    siniestro: null,
    fecha: '05/03/2025',
    estado: 'aprobado',
    activo: true,
    subidoPor: 'Operador A',
    versiones: [{ version: 1, fecha: '05/03/2025', subidoPor: 'Operador A', nota: 'Documento inicial' }],
  },
  {
    id: 'DOC-006',
    nombre: 'Informe-Pericial-SIN901.pdf',
    tipo: 'Informe pericial',
    cliente: 'Martínez Ríos, Ana',
    poliza: 'POL-2024-0078',
    siniestro: 'SIN-2024-0901',
    fecha: '22/04/2025',
    estado: 'pendiente',
    activo: false,
    subidoPor: 'Operador B',
    versiones: [{ version: 1, fecha: '22/04/2025', subidoPor: 'Operador B', nota: 'Pendiente revisión' }],
  },
];

const OBLIGATORIOS_CONFIG = {
  'Alta de póliza': ['DNI / Identificación', 'Contrato', 'SOAT', 'Tarjeta de propiedad'],
  'Apertura de siniestro': ['Parte policial', 'Fotos del siniestro', 'SOAT'],
  'Cierre de siniestro': ['Informe pericial', 'Orden de servicio', 'Factura', 'Comprobante de pago'],
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function iconDoc(nombre) {
  const ext = nombre.split('.').pop().toLowerCase();
  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) return <MdImage size={18} className="text-blue-500" />;
  if (ext === 'pdf') return <MdPictureAsPdf size={18} className="text-rose-500" />;
  return <MdDescription size={18} className="text-text-soft" />;
}

function EstadoBadge({ estado, activo }) {
  if (!activo)
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-bg-soft text-text-soft border border-border">
        <MdVisibilityOff size={11} /> Desactivado
      </span>
    );
  const map = {
    aprobado: 'bg-emerald-100 text-emerald-700',
    pendiente: 'bg-amber-100 text-amber-700',
    rechazado: 'bg-rose-100 text-rose-600',
  };
  const icons = {
    aprobado: <MdCheckCircle size={11} />,
    pendiente: <MdWarningAmber size={11} />,
    rechazado: <MdCancel size={11} />,
  };
  const labels = { aprobado: 'Aprobado', pendiente: 'Pendiente', rechazado: 'Rechazado' };
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${map[estado]}`}>
      {icons[estado]} {labels[estado]}
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
          <t.icon size={14} /> {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── UPLOAD MODAL ─────────────────────────────────────────────────────────────
function ModalSubida({ onClose, onSubir }) {
  const [form, setForm] = useState({ tipo: '', cliente: '', poliza: '', siniestro: '', nota: '' });
  const [archivo, setArchivo] = useState(null);
  const [exito, setExito] = useState(false);

  const subir = () => {
    if (!form.tipo || !form.cliente) return;
    onSubir({ ...form, archivo });
    setExito(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-bg rounded-2xl border border-border w-full max-w-md overflow-hidden shadow-xl">
        <div className="h-1 w-full bg-primary" />
        <div className="p-5">
          {exito ? (
            <div className="flex flex-col items-center gap-3 py-6 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <MdVerified size={28} className="text-emerald-500" />
              </div>
              <p className="text-sm font-bold text-text">Documento subido exitosamente</p>
              <p className="text-xs text-text-soft">El documento quedó registrado y está en revisión.</p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold"
              >
                Cerrar
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold text-text flex items-center gap-2">
                  <MdUploadFile size={15} /> Subir documento
                </p>
                <button onClick={onClose} className="text-text-soft hover:text-text">
                  <MdClose size={18} />
                </button>
              </div>

              {/* Drop zone */}
              <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center gap-2 mb-4 cursor-pointer hover:border-primary hover:bg-bg-soft transition-colors">
                <MdUploadFile size={28} className="text-text-soft" />
                <p className="text-xs font-semibold text-text">{archivo ? archivo : 'Selecciona un archivo'}</p>
                <p className="text-xs text-text-soft">PDF, JPG, PNG — máx. 10MB</p>
                <button
                  onClick={() => setArchivo('documento_ejemplo.pdf')}
                  className="text-xs text-primary hover:underline"
                >
                  Simular selección
                </button>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-soft">Tipo de documento *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                    className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Seleccionar...</option>
                    {TIPOS_DOC.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-soft">Cliente *</label>
                  <select
                    value={form.cliente}
                    onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                    className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">Seleccionar...</option>
                    {CLIENTES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-soft">Póliza</label>
                    <input
                      type="text"
                      placeholder="POL-2024-0041"
                      value={form.poliza}
                      onChange={(e) => setForm({ ...form, poliza: e.target.value })}
                      className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-text-soft">Siniestro</label>
                    <input
                      type="text"
                      placeholder="SIN-2024-..."
                      value={form.siniestro}
                      onChange={(e) => setForm({ ...form, siniestro: e.target.value })}
                      className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-text-soft">Nota interna</label>
                  <input
                    type="text"
                    placeholder="Ej. Documento original enviado por cliente"
                    value={form.nota}
                    onChange={(e) => setForm({ ...form, nota: e.target.value })}
                    className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>

              <button
                onClick={subir}
                disabled={!form.tipo || !form.cliente}
                className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-40"
              >
                <MdUploadFile size={16} /> Subir documento
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DETALLE DOCUMENTO ────────────────────────────────────────────────────────
function DetalleDocumento({ doc, onBack, onActualizar }) {
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [accion, setAccion] = useState(null); // 'aprobar' | 'rechazar' | 'desactivar'
  const [confirmado, setConfirmado] = useState(false);

  const ejecutar = () => {
    if (accion === 'aprobar') onActualizar(doc.id, { estado: 'aprobado' });
    if (accion === 'rechazar') onActualizar(doc.id, { estado: 'rechazado', motivoRechazo });
    if (accion === 'desactivar') onActualizar(doc.id, { activo: false });
    setConfirmado(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text w-fit">
        <MdArrowBack size={15} /> Volver al repositorio
      </button>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div
          className={`h-1 w-full ${doc.estado === 'aprobado' ? 'bg-emerald-500' : doc.estado === 'rechazado' ? 'bg-rose-400' : 'bg-amber-400'}`}
        />
        <div className="p-5 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-bg-soft border border-border flex items-center justify-center shrink-0">
              {iconDoc(doc.nombre)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text truncate">{doc.nombre}</p>
              <p className="text-xs text-text-soft mt-0.5">{doc.tipo}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                <EstadoBadge estado={doc.estado} activo={doc.activo} />
              </div>
            </div>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft">
              <MdDownload size={13} /> Descargar
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
            {[
              { label: 'Cliente', val: doc.cliente },
              { label: 'Póliza', val: doc.poliza || '—' },
              { label: 'Siniestro', val: doc.siniestro || '—' },
              { label: 'Subido por', val: doc.subidoPor },
              { label: 'Fecha', val: doc.fecha },
              { label: 'Versiones', val: doc.versiones.length },
            ].map(({ label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <p className="text-xs text-text-soft">{label}</p>
                <p className="text-xs font-bold text-text mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>

          {doc.estado === 'rechazado' && doc.motivoRechazo && (
            <div className="mt-3 flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200">
              <MdCancel size={14} className="text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-bold text-rose-700">Motivo de rechazo</p>
                <p className="text-xs text-rose-600 mt-0.5">{doc.motivoRechazo}</p>
              </div>
            </div>
          )}
        </div>

        {/* Historial de versiones */}
        <div className="p-5 border-b border-border">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3 flex items-center gap-1.5">
            <MdHistory size={13} /> Historial de versiones
          </p>
          <div className="flex flex-col gap-2">
            {[...doc.versiones].reverse().map((v) => (
              <div key={v.version} className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
                <div className="w-6 h-6 rounded-full bg-bg-soft border border-border flex items-center justify-center shrink-0 text-xs font-bold text-text-soft">
                  {v.version}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-text">{v.nota}</p>
                  <p className="text-xs text-text-soft mt-0.5">
                    {v.subidoPor} · {v.fecha}
                  </p>
                </div>
                {v.version === doc.versiones.length && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">Actual</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Acciones de validación */}
        {doc.activo && !confirmado && (
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3">Acciones</p>
            {accion === 'rechazar' ? (
              <div className="flex flex-col gap-3">
                <textarea
                  value={motivoRechazo}
                  onChange={(e) => setMotivoRechazo(e.target.value)}
                  placeholder="Indica el motivo del rechazo..."
                  rows={2}
                  className="text-xs border border-border rounded-xl p-3 bg-bg focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={ejecutar}
                    disabled={!motivoRechazo}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold disabled:opacity-40"
                  >
                    <MdCancel size={13} /> Confirmar rechazo
                  </button>
                  <button
                    onClick={() => setAccion(null)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : accion === 'desactivar' ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <MdLock size={14} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700">
                    El documento quedará desactivado. Esta acción no puede deshacerse y el documento no se eliminará del
                    sistema.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={ejecutar}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                  >
                    <MdVisibilityOff size={13} /> Desactivar documento
                  </button>
                  <button
                    onClick={() => setAccion(null)}
                    className="px-4 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {doc.estado !== 'aprobado' && (
                  <button
                    onClick={() => {
                      setAccion('aprobar');
                      ejecutar();
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                  >
                    <MdCheck size={13} /> Aprobar
                  </button>
                )}
                {doc.estado !== 'rechazado' && (
                  <button
                    onClick={() => setAccion('rechazar')}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
                  >
                    <MdClose size={13} /> Rechazar
                  </button>
                )}
                <button
                  onClick={() => setAccion('desactivar')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs text-text-soft"
                >
                  <MdVisibilityOff size={13} /> Desactivar
                </button>
              </div>
            )}
          </div>
        )}

        {confirmado && (
          <div className="p-5">
            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3 border border-emerald-200">
              <MdVerified size={15} /> Acción aplicada correctamente.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── REPOSITORIO ──────────────────────────────────────────────────────────────
function Repositorio({ docs, onSelect, onSubir }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroCliente, setFiltroCliente] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [expandidos, setExpandidos] = useState({});

  const filtrados = useMemo(
    () =>
      docs.filter((d) => {
        const q = busqueda.toLowerCase();
        return (
          (!q ||
            d.nombre.toLowerCase().includes(q) ||
            d.cliente.toLowerCase().includes(q) ||
            (d.poliza || '').toLowerCase().includes(q) ||
            (d.siniestro || '').toLowerCase().includes(q)) &&
          (!filtroCliente || d.cliente === filtroCliente) &&
          (!filtroTipo || d.tipo === filtroTipo) &&
          (!filtroEstado || d.estado === filtroEstado)
        );
      }),
    [docs, busqueda, filtroCliente, filtroTipo, filtroEstado]
  );

  // Agrupar por cliente
  const porCliente = useMemo(() => {
    const grupos = {};
    filtrados.forEach((d) => {
      if (!grupos[d.cliente]) grupos[d.cliente] = [];
      grupos[d.cliente].push(d);
    });
    return grupos;
  }, [filtrados]);

  const toggleGrupo = (cliente) => setExpandidos((p) => ({ ...p, [cliente]: !p[cliente] }));

  return (
    <div className="flex flex-col gap-4">
      {/* Acciones */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              type="text"
              placeholder="Buscar por nombre, cliente, póliza o siniestro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-xl bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todos los clientes</option>
            {CLIENTES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todos los tipos</option>
            {TIPOS_DOC.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="aprobado">Aprobado</option>
            <option value="pendiente">Pendiente</option>
            <option value="rechazado">Rechazado</option>
          </select>
        </div>
        <button
          onClick={onSubir}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold shrink-0"
        >
          <MdAdd size={15} /> Subir documento
        </button>
      </div>

      {/* Stats rápidos */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total', val: docs.length, color: 'text-text' },
          { label: 'Aprobados', val: docs.filter((d) => d.estado === 'aprobado').length, color: 'text-emerald-600' },
          { label: 'Pendientes', val: docs.filter((d) => d.estado === 'pendiente').length, color: 'text-amber-600' },
          { label: 'Rechazados', val: docs.filter((d) => d.estado === 'rechazado').length, color: 'text-rose-600' },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-bg-soft rounded-xl p-3 border border-border">
            <p className="text-xs text-text-soft">{label}</p>
            <p className={`text-lg font-bold mt-0.5 ${color}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Árbol por cliente */}
      <div className="flex flex-col gap-3">
        {Object.entries(porCliente).map(([cliente, docsCliente]) => {
          const abierto = expandidos[cliente] !== false; // abierto por defecto
          return (
            <div key={cliente} className="bg-bg rounded-2xl border border-border overflow-hidden">
              <button
                onClick={() => toggleGrupo(cliente)}
                className="w-full flex items-center gap-3 p-4 hover:bg-bg-soft transition-colors text-left"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                  <MdPerson size={16} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text">{cliente}</p>
                  <p className="text-xs text-text-soft">{docsCliente.length} documentos</p>
                </div>
                <div className="flex gap-1.5 mr-2">
                  {docsCliente.filter((d) => d.estado === 'pendiente').length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">
                      {docsCliente.filter((d) => d.estado === 'pendiente').length} pend.
                    </span>
                  )}
                  {docsCliente.filter((d) => d.estado === 'rechazado').length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium">
                      {docsCliente.filter((d) => d.estado === 'rechazado').length} rech.
                    </span>
                  )}
                </div>
                {abierto ? (
                  <MdChevronLeft size={18} className="text-text-soft shrink-0" />
                ) : (
                  <MdChevronRight size={18} className="text-text-soft shrink-0" />
                )}
              </button>

              {abierto && (
                <div className="border-t border-border">
                  {docsCliente.map((d, idx) => (
                    <div
                      key={d.id}
                      onClick={() => onSelect(d)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-bg-soft transition-colors ${idx < docsCliente.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-bg-soft border border-border flex items-center justify-center shrink-0">
                        {iconDoc(d.nombre)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p
                            className={`text-xs font-semibold ${!d.activo ? 'line-through text-text-soft' : 'text-text'}`}
                          >
                            {d.nombre}
                          </p>
                          <EstadoBadge estado={d.estado} activo={d.activo} />
                        </div>
                        <p className="text-xs text-text-soft mt-0.5">
                          {d.tipo}
                          {d.poliza && (
                            <>
                              {' '}
                              ·{' '}
                              <span className="inline-flex items-center gap-0.5">
                                <MdPolicy size={10} className="inline" /> {d.poliza}
                              </span>
                            </>
                          )}
                          {d.siniestro && (
                            <>
                              {' '}
                              ·{' '}
                              <span className="inline-flex items-center gap-0.5">
                                <MdGavel size={10} className="inline" /> {d.siniestro}
                              </span>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-text-soft hidden sm:block">
                          <MdCalendarToday size={10} className="inline mr-0.5" />
                          {d.fecha}
                        </span>
                        {d.versiones.length > 1 && (
                          <span className="text-xs px-1.5 py-0.5 rounded-full bg-bg-soft text-text-soft border border-border">
                            v{d.versiones.length}
                          </span>
                        )}
                        <MdChevronRight size={15} className="text-text-soft" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(porCliente).length === 0 && (
          <div className="py-12 flex flex-col items-center gap-2 text-center">
            <MdFolderOpen size={32} className="text-text-soft" />
            <p className="text-sm font-semibold text-text-soft">No se encontraron documentos</p>
            <p className="text-xs text-text-soft">Ajusta los filtros o sube un nuevo documento</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── CONFIGURACIÓN OBLIGATORIOS ───────────────────────────────────────────────
function ConfigObligatorios() {
  const [config, setConfig] = useState(OBLIGATORIOS_CONFIG);
  const [operacion, setOperacion] = useState('Alta de póliza');
  const [guardado, setGuardado] = useState(false);

  const toggle = (tipo) => {
    setConfig((prev) => {
      const actual = prev[operacion] || [];
      return {
        ...prev,
        [operacion]: actual.includes(tipo) ? actual.filter((t) => t !== tipo) : [...actual, tipo],
      };
    });
    setGuardado(false);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-bg-soft rounded-2xl border border-border p-4 flex items-start gap-3">
        <MdInfo size={16} className="text-blue-500 mt-0.5 shrink-0" />
        <p className="text-xs text-text-soft">
          Define qué documentos son obligatorios para cada tipo de operación. El sistema alertará cuando falten
          documentos requeridos.
        </p>
      </div>

      {/* Selector de operación */}
      <div className="flex flex-wrap gap-2">
        {Object.keys(config).map((op) => (
          <button
            key={op}
            onClick={() => setOperacion(op)}
            className={`text-xs px-4 py-2 rounded-xl border font-semibold transition-colors ${
              operacion === op
                ? 'bg-primary text-text-inverse border-primary'
                : 'border-border text-text-soft hover:bg-bg-soft'
            }`}
          >
            {op}
          </button>
        ))}
      </div>

      {/* Lista de tipos */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <p className="text-xs font-bold text-text">{operacion}</p>
          <p className="text-xs text-text-soft mt-0.5">
            {(config[operacion] || []).length} documentos obligatorios configurados
          </p>
        </div>
        <div className="flex flex-col">
          {TIPOS_DOC.map((tipo, idx) => {
            const activo = (config[operacion] || []).includes(tipo);
            return (
              <div
                key={tipo}
                className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-bg-soft transition-colors ${idx < TIPOS_DOC.length - 1 ? 'border-b border-border' : ''}`}
                onClick={() => toggle(tipo)}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${activo ? 'bg-primary border-primary' : 'border-border bg-bg'}`}
                  >
                    {activo && <MdCheck size={11} className="text-text-inverse" />}
                  </div>
                  <span className="text-xs text-text">{tipo}</span>
                </div>
                {activo && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Obligatorio
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setGuardado(true)}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold"
      >
        {guardado ? (
          <>
            <MdVerified size={16} /> Configuración guardada
          </>
        ) : (
          <>
            <MdCheck size={16} /> Guardar configuración
          </>
        )}
      </button>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'repositorio', label: 'Repositorio', icon: MdFolderOpen },
  { id: 'config', label: 'Documentos obligatorios', icon: MdSettings },
];

export default function DocumentosPage() {
  const [tab, setTab] = useState('repositorio');
  const [docs, setDocs] = useState(DOCS_MOCK);
  const [docActivo, setDocActivo] = useState(null);
  const [modalSubida, setModalSubida] = useState(false);

  const handleSubir = (nuevo) => {
    const doc = {
      id: 'DOC-' + String(docs.length + 1).padStart(3, '0'),
      nombre: nuevo.archivo || 'documento_nuevo.pdf',
      tipo: nuevo.tipo,
      cliente: nuevo.cliente,
      poliza: nuevo.poliza || null,
      siniestro: nuevo.siniestro || null,
      fecha: new Date().toLocaleDateString('es-PE'),
      estado: 'pendiente',
      activo: true,
      subidoPor: 'Operador actual',
      versiones: [
        {
          version: 1,
          fecha: new Date().toLocaleDateString('es-PE'),
          subidoPor: 'Operador actual',
          nota: nuevo.nota || 'Subida inicial',
        },
      ],
    };
    setDocs((p) => [...p, doc]);
  };

  const handleActualizar = (id, cambios) => {
    setDocs((p) => p.map((d) => (d.id === id ? { ...d, ...cambios } : d)));
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {modalSubida && <ModalSubida onClose={() => setModalSubida(false)} onSubir={handleSubir} />}

      {docActivo ? (
        <DetalleDocumento
          doc={docs.find((d) => d.id === docActivo) || docs[0]}
          onBack={() => setDocActivo(null)}
          onActualizar={handleActualizar}
        />
      ) : (
        <>
          <div>
            <h1 className="text-lg font-bold text-text">Repositorio de Documentos</h1>
            <p className="text-xs text-text-soft mt-0.5">
              Gestión central de documentos por cliente, póliza y siniestro
            </p>
          </div>

          <TabBar tabs={TABS} active={tab} onChange={setTab} />

          {tab === 'repositorio' && (
            <Repositorio docs={docs} onSelect={(d) => setDocActivo(d.id)} onSubir={() => setModalSubida(true)} />
          )}
          {tab === 'config' && <ConfigObligatorios />}
        </>
      )}
    </div>
  );
}
