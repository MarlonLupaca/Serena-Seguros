'use client';

import { useState, useMemo } from 'react';
import {
  MdCategory,
  MdAdd,
  MdSearch,
  MdArrowBack,
  MdChevronRight,
  MdEdit,
  MdCheck,
  MdClose,
  MdHistory,
  MdTune,
  MdLock,
  MdSend,
  MdVerified,
  MdWarningAmber,
  MdInfo,
  MdShield,
  MdDirectionsCar,
  MdHealthAndSafety,
  MdHome,
  MdFlight,
  MdBusiness,
  MdStar,
  MdCheckCircle,
  MdSchedule,
  MdAttachMoney,
  MdPercent,
  MdDragIndicator,
  MdChevronLeft,
} from 'react-icons/md';

// ─── DATA ─────────────────────────────────────────────────────────────────────
const RAMOS = [
  {
    id: 'RAM-01',
    nombre: 'Vehículos',
    icon: MdDirectionsCar,
    accentBg: 'bg-blue-50',
    accentText: 'text-blue-600',
    accentBar: 'bg-blue-500',
  },
  {
    id: 'RAM-02',
    nombre: 'Salud',
    icon: MdHealthAndSafety,
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600',
    accentBar: 'bg-emerald-500',
  },
  {
    id: 'RAM-03',
    nombre: 'Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-600',
    accentBar: 'bg-amber-400',
  },
  {
    id: 'RAM-04',
    nombre: 'Viaje',
    icon: MdFlight,
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-600',
    accentBar: 'bg-violet-500',
  },
  {
    id: 'RAM-05',
    nombre: 'Empresarial',
    icon: MdBusiness,
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-600',
    accentBar: 'bg-rose-500',
  },
];

const PRODUCTOS_MOCK = [
  {
    id: 'PRD-001',
    ramo: 'RAM-01',
    nombre: 'Auto Clásico',
    descripcion: 'Cobertura todo riesgo para vehículos particulares.',
    estado: 'activo',
    version: 3,
    versionActiva: 3,
    coberturas: ['Daños propios', 'Responsabilidad civil', 'Robo total', 'Asistencia en carretera', 'Vidrios'],
    exclusiones: ['Daños por guerra', 'Conducción bajo efectos de alcohol', 'Uso comercial no declarado'],
    variables: [
      { id: 'v1', nombre: 'Tasa base', tipo: 'porcentaje', valor: 2.5, min: 0.5, max: 10 },
      { id: 'v2', nombre: 'Factor antigüedad', tipo: 'multiplicador', valor: 1.15, min: 1.0, max: 2.5 },
      { id: 'v3', nombre: 'Deducible mínimo', tipo: 'monto', valor: 500, min: 100, max: 5000 },
      { id: 'v4', nombre: 'Descuento bono', tipo: 'porcentaje', valor: 5.0, min: 0, max: 20 },
    ],
    versiones: [
      { version: 1, fecha: '01/01/2023', autor: 'Admin', nota: 'Lanzamiento inicial', estado: 'histórico' },
      {
        version: 2,
        fecha: '15/06/2023',
        autor: 'Ejecutivo A',
        nota: 'Ajuste tasa base por inflación',
        estado: 'histórico',
      },
      { version: 3, fecha: '10/01/2025', autor: 'Ejecutivo B', nota: 'Ampliación cobertura vidrios', estado: 'activo' },
    ],
    borradores: [],
  },
  {
    id: 'PRD-002',
    ramo: 'RAM-01',
    nombre: 'Moto Segura',
    descripcion: 'Protección completa para motocicletas.',
    estado: 'activo',
    version: 1,
    versionActiva: 1,
    coberturas: ['Responsabilidad civil', 'Accidentes personales', 'Robo parcial'],
    exclusiones: ['Carreras y competencias', 'Transporte de carga'],
    variables: [
      { id: 'v1', nombre: 'Tasa base', tipo: 'porcentaje', valor: 3.8, min: 1.0, max: 12 },
      { id: 'v2', nombre: 'Factor cilindrada', tipo: 'multiplicador', valor: 1.2, min: 1.0, max: 2.0 },
    ],
    versiones: [{ version: 1, fecha: '01/03/2024', autor: 'Admin', nota: 'Lanzamiento inicial', estado: 'activo' }],
    borradores: [
      {
        id: 'BOR-001',
        fecha: '20/04/2025',
        autor: 'Operador A',
        nota: 'Propuesta aumento tasa base a 4.2%',
        estado: 'pendiente_aprobacion',
      },
    ],
  },
  {
    id: 'PRD-003',
    ramo: 'RAM-02',
    nombre: 'Salud Total',
    descripcion: 'Cobertura integral hospitalaria y ambulatoria.',
    estado: 'activo',
    version: 2,
    versionActiva: 2,
    coberturas: [
      'Hospitalización',
      'Cirugías',
      'Consultas ambulatorias',
      'Medicamentos',
      'Emergencias internacionales',
    ],
    exclusiones: ['Enfermedades preexistentes no declaradas', 'Tratamientos estéticos', 'Infertilidad'],
    variables: [
      { id: 'v1', nombre: 'Prima base anual', tipo: 'monto', valor: 1200, min: 600, max: 5000 },
      { id: 'v2', nombre: 'Factor edad', tipo: 'multiplicador', valor: 1.3, min: 1.0, max: 3.0 },
      { id: 'v3', nombre: 'Coaseguro', tipo: 'porcentaje', valor: 20, min: 0, max: 50 },
    ],
    versiones: [
      { version: 1, fecha: '01/01/2024', autor: 'Admin', nota: 'Lanzamiento', estado: 'histórico' },
      {
        version: 2,
        fecha: '01/01/2025',
        autor: 'Ejecutivo A',
        nota: 'Incorporación emergencias internacionales',
        estado: 'activo',
      },
    ],
    borradores: [],
  },
  {
    id: 'PRD-004',
    ramo: 'RAM-03',
    nombre: 'Hogar Plus',
    descripcion: 'Protección estructural y contenido del hogar.',
    estado: 'borrador',
    version: 0,
    versionActiva: 0,
    coberturas: ['Incendio', 'Robo', 'Daños por agua', 'Responsabilidad civil familiar'],
    exclusiones: ['Terremotos (cobertura adicional)', 'Bienes de alto valor sin declarar'],
    variables: [
      { id: 'v1', nombre: 'Tasa base', tipo: 'porcentaje', valor: 0.8, min: 0.2, max: 3.0 },
      { id: 'v2', nombre: 'Suma asegurada máx.', tipo: 'monto', valor: 200000, min: 10000, max: 1000000 },
    ],
    versiones: [],
    borradores: [],
  },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
  const map = {
    activo: { cls: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500', label: 'Activo' },
    borrador: { cls: 'bg-amber-100 text-amber-700', dot: 'bg-amber-400', label: 'Borrador' },
    inactivo: { cls: 'bg-bg-soft text-text-soft border border-border', dot: 'bg-text-soft', label: 'Inactivo' },
    histórico: { cls: 'bg-bg-soft text-text-soft', dot: 'bg-text-soft', label: 'Histórico' },
    pendiente_aprobacion: { cls: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500', label: 'Pendiente aprobación' },
  };
  const { cls, dot, label } = map[estado] || map.inactivo;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
      {label}
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

function IconTipoVar({ tipo }) {
  if (tipo === 'porcentaje') return <MdPercent size={12} className="text-text-soft" />;
  if (tipo === 'monto') return <MdAttachMoney size={12} className="text-text-soft" />;
  return <MdTune size={12} className="text-text-soft" />;
}

// ─── CATÁLOGO ─────────────────────────────────────────────────────────────────
function Catalogo({ productos, onSelect, onNuevo }) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroRamo, setFiltroRamo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [expandidos, setExpandidos] = useState({});

  const filtrados = useMemo(
    () =>
      productos.filter((p) => {
        const q = busqueda.toLowerCase();
        return (
          (!q || p.nombre.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)) &&
          (!filtroRamo || p.ramo === filtroRamo) &&
          (!filtroEstado || p.estado === filtroEstado)
        );
      }),
    [productos, busqueda, filtroRamo, filtroEstado]
  );

  const porRamo = useMemo(() => {
    const g = {};
    filtrados.forEach((p) => {
      if (!g[p.ramo]) g[p.ramo] = [];
      g[p.ramo].push(p);
    });
    return g;
  }, [filtrados]);

  const toggle = (ramo) => setExpandidos((e) => ({ ...e, [ramo]: e[ramo] === false ? true : false }));

  return (
    <div className="flex flex-col gap-4">
      {/* Barra */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex gap-2 flex-1 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <MdSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              type="text"
              placeholder="Buscar producto o ID..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-border rounded-xl bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <select
            value={filtroRamo}
            onChange={(e) => setFiltroRamo(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todos los ramos</option>
            {RAMOS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.nombre}
              </option>
            ))}
          </select>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg text-text focus:outline-none"
          >
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="borrador">Borrador</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <button
          onClick={onNuevo}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold shrink-0"
        >
          <MdAdd size={15} /> Nuevo producto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { label: 'Total productos', val: productos.length },
          { label: 'Activos', val: productos.filter((p) => p.estado === 'activo').length, color: 'text-emerald-600' },
          {
            label: 'Borradores',
            val: productos.filter((p) => p.estado === 'borrador').length,
            color: 'text-amber-600',
          },
          {
            label: 'Con cambios pendientes',
            val: productos.filter((p) => p.borradores.length > 0).length,
            color: 'text-violet-600',
          },
        ].map(({ label, val, color }) => (
          <div key={label} className="bg-bg-soft rounded-xl p-3 border border-border">
            <p className="text-xs text-text-soft">{label}</p>
            <p className={`text-lg font-bold mt-0.5 ${color || 'text-text'}`}>{val}</p>
          </div>
        ))}
      </div>

      {/* Árbol por ramo */}
      <div className="flex flex-col gap-3">
        {Object.entries(porRamo).map(([ramoId, prods]) => {
          const ramo = RAMOS.find((r) => r.id === ramoId);
          if (!ramo) return null;
          const RamoIcon = ramo.icon;
          const abierto = expandidos[ramoId] !== false;

          return (
            <div key={ramoId} className="bg-bg rounded-2xl border border-border overflow-hidden">
              <div className={`h-1 w-full ${ramo.accentBar}`} />
              <button
                onClick={() => toggle(ramoId)}
                className="w-full flex items-center gap-3 p-4 hover:bg-bg-soft transition-colors text-left"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${ramo.accentBg}`}>
                  <RamoIcon size={18} className={ramo.accentText} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-text">Ramo: {ramo.nombre}</p>
                  <p className="text-xs text-text-soft">
                    {prods.length} producto{prods.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {prods.some((p) => p.borradores.length > 0) && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">
                    Cambios pendientes
                  </span>
                )}
                {abierto ? (
                  <MdChevronLeft size={18} className="text-text-soft shrink-0" />
                ) : (
                  <MdChevronRight size={18} className="text-text-soft shrink-0" />
                )}
              </button>

              {abierto && (
                <div className="border-t border-border">
                  {prods.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => onSelect(p)}
                      className={`flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-bg-soft transition-colors ${idx < prods.length - 1 ? 'border-b border-border' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-bg-soft border border-border flex items-center justify-center shrink-0">
                        <MdShield size={15} className="text-text-soft" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-xs font-bold text-text">{p.nombre}</p>
                          <EstadoBadge estado={p.estado} />
                          {p.borradores.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                              <MdSchedule size={11} /> Borrador pendiente
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-soft mt-0.5">
                          {p.id} · {p.coberturas.length} coberturas · v{p.versionActiva || '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs text-text-soft hidden sm:block">{p.variables.length} variables</span>
                        <MdChevronRight size={15} className="text-text-soft" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {Object.keys(porRamo).length === 0 && (
          <div className="py-16 flex flex-col items-center gap-2 text-center">
            <MdCategory size={32} className="text-text-soft" />
            <p className="text-sm font-semibold text-text-soft">No se encontraron productos</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── DETALLE PRODUCTO ─────────────────────────────────────────────────────────
function DetalleProducto({ producto, onBack, onActualizar }) {
  const [subTab, setSubTab] = useState('coberturas');
  const ramo = RAMOS.find((r) => r.id === producto.ramo);
  const RamoIcon = ramo?.icon || MdShield;

  const SUB_TABS = [
    { id: 'coberturas', label: 'Coberturas', icon: MdShield },
    { id: 'tarifas', label: 'Motor de tarifas', icon: MdTune },
    { id: 'versiones', label: 'Versiones', icon: MdHistory },
    {
      id: 'borradores',
      label: `Borradores${producto.borradores.length > 0 ? ` (${producto.borradores.length})` : ''}`,
      icon: MdEdit,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text w-fit">
        <MdArrowBack size={15} /> Volver al catálogo
      </button>

      {/* Header */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className={`h-1 w-full ${ramo?.accentBar || 'bg-primary'}`} />
        <div className="p-5">
          <div className="flex items-start gap-3 flex-wrap">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${ramo?.accentBg || 'bg-bg-soft'}`}
            >
              <RamoIcon size={22} className={ramo?.accentText || 'text-text-soft'} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-bold text-text">{producto.nombre}</p>
                <EstadoBadge estado={producto.estado} />
              </div>
              <p className="text-xs text-text-soft mt-0.5">
                {producto.id} · Ramo: {ramo?.nombre}
              </p>
              <p className="text-xs text-text-soft mt-1">{producto.descripcion}</p>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <p className="text-xs text-text-soft">Versión activa</p>
              <p className="text-xl font-bold text-text">v{producto.versionActiva || '—'}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { label: 'Coberturas', val: producto.coberturas.length },
              { label: 'Exclusiones', val: producto.exclusiones.length },
              { label: 'Variables tarifa', val: producto.variables.length },
            ].map(({ label, val }) => (
              <div key={label} className="bg-bg-soft rounded-xl p-2.5">
                <p className="text-xs text-text-soft">{label}</p>
                <p className="text-sm font-bold text-text mt-0.5">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <TabBar tabs={SUB_TABS} active={subTab} onChange={setSubTab} />

      {subTab === 'coberturas' && <SubCoberturas producto={producto} onActualizar={onActualizar} />}
      {subTab === 'tarifas' && <SubTarifas producto={producto} onActualizar={onActualizar} />}
      {subTab === 'versiones' && <SubVersiones producto={producto} />}
      {subTab === 'borradores' && <SubBorradores producto={producto} onActualizar={onActualizar} />}
    </div>
  );
}

// ─── SUB: COBERTURAS ──────────────────────────────────────────────────────────
function SubCoberturas({ producto, onActualizar }) {
  const [nuevaCobertura, setNuevaCobertura] = useState('');
  const [nuevaExclusion, setNuevaExclusion] = useState('');

  const agregarCobertura = () => {
    if (!nuevaCobertura.trim()) return;
    onActualizar(producto.id, { coberturas: [...producto.coberturas, nuevaCobertura.trim()] });
    setNuevaCobertura('');
  };

  const agregarExclusion = () => {
    if (!nuevaExclusion.trim()) return;
    onActualizar(producto.id, { exclusiones: [...producto.exclusiones, nuevaExclusion.trim()] });
    setNuevaExclusion('');
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {/* Coberturas */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-emerald-500" />
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3 flex items-center gap-1.5">
            <MdCheckCircle size={13} className="text-emerald-500" /> Coberturas incluidas
          </p>
          <div className="flex flex-col gap-1.5">
            {producto.coberturas.map((c, i) => (
              <div key={i} className="flex items-center gap-2 py-1.5 border-b border-border last:border-0">
                <MdCheck size={13} className="text-emerald-500 shrink-0" />
                <p className="text-xs text-text flex-1">{c}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Nueva cobertura..."
              value={nuevaCobertura}
              onChange={(e) => setNuevaCobertura(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarCobertura()}
              className="flex-1 text-xs border border-border rounded-xl px-3 py-1.5 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={agregarCobertura}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
            >
              <MdAdd size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Exclusiones */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-rose-400" />
        <div className="p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-3 flex items-center gap-1.5">
            <MdClose size={13} className="text-rose-500" /> Exclusiones
          </p>
          <div className="flex flex-col gap-1.5">
            {producto.exclusiones.map((e, i) => (
              <div key={i} className="flex items-start gap-2 py-1.5 border-b border-border last:border-0">
                <MdClose size={13} className="text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs text-text flex-1">{e}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Nueva exclusión..."
              value={nuevaExclusion}
              onChange={(e) => setNuevaExclusion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && agregarExclusion()}
              className="flex-1 text-xs border border-border rounded-xl px-3 py-1.5 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={agregarExclusion}
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
            >
              <MdAdd size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUB: TARIFAS ─────────────────────────────────────────────────────────────
function SubTarifas({ producto, onActualizar }) {
  const [vars, setVars] = useState(producto.variables.map((v) => ({ ...v })));
  const [nota, setNota] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cambios, setCambios] = useState(false);

  const actualizar = (id, nuevoValor) => {
    setVars((prev) => prev.map((v) => (v.id === id ? { ...v, valor: parseFloat(nuevoValor) } : v)));
    setCambios(true);
    setEnviado(false);
  };

  const proponer = () => {
    const nuevoBorrador = {
      id: 'BOR-' + Date.now().toString().slice(-4),
      fecha: new Date().toLocaleDateString('es-PE'),
      autor: 'Operador actual',
      nota: nota || 'Propuesta de cambio de tarifa',
      estado: 'pendiente_aprobacion',
      variables: vars,
    };
    onActualizar(producto.id, { borradores: [...producto.borradores, nuevoBorrador] });
    setEnviado(true);
    setCambios(false);
    setNota('');
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
        <MdLock size={15} className="text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-amber-700">Cambios requieren aprobación ejecutiva</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Los ajustes de tarifa quedan en borrador hasta que el Portal Ejecutivo los apruebe. Las pólizas existentes
            no se ven afectadas.
          </p>
        </div>
      </div>

      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <p className="text-xs font-bold text-text flex items-center gap-2">
            <MdTune size={14} /> Variables del motor de tarifas
          </p>
          <p className="text-xs text-text-soft">Versión activa v{producto.versionActiva}</p>
        </div>
        <div className="flex flex-col">
          {vars.map((v, idx) => (
            <div key={v.id} className={`p-4 ${idx < vars.length - 1 ? 'border-b border-border' : ''}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <MdDragIndicator size={14} className="text-text-soft" />
                  <p className="text-xs font-semibold text-text">{v.nombre}</p>
                  <span className="flex items-center gap-0.5 text-xs text-text-soft">
                    <IconTipoVar tipo={v.tipo} /> {v.tipo}
                  </span>
                </div>
                <span className="text-sm font-bold text-text tabular-nums">
                  {v.tipo === 'porcentaje'
                    ? `${v.valor}%`
                    : v.tipo === 'monto'
                      ? `S/ ${v.valor.toLocaleString()}`
                      : `×${v.valor}`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-soft w-16 shrink-0">
                  {v.tipo === 'monto' ? `S/ ${v.min}` : v.min}
                </span>
                <input
                  type="range"
                  min={v.min}
                  max={v.max}
                  step={v.tipo === 'monto' ? 100 : 0.05}
                  value={v.valor}
                  onChange={(e) => actualizar(v.id, e.target.value)}
                  className="flex-1 accent-primary"
                />
                <span className="text-xs text-text-soft w-16 text-right shrink-0">
                  {v.tipo === 'monto' ? `S/ ${v.max.toLocaleString()}` : v.max}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proponer cambio */}
      {enviado ? (
        <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-xl p-3.5 border border-emerald-200">
          <MdVerified size={15} /> Borrador enviado a aprobación ejecutiva.
        </div>
      ) : (
        <div className="bg-bg rounded-2xl border border-border p-4 flex flex-col gap-3">
          <p className="text-xs font-semibold text-text">Proponer cambio de tarifa</p>
          <input
            type="text"
            placeholder="Nota para el ejecutivo (ej. Ajuste por inflación Q1 2025)..."
            value={nota}
            onChange={(e) => setNota(e.target.value)}
            className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={proponer}
            disabled={!cambios}
            className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold disabled:opacity-40"
          >
            <MdSend size={13} /> Enviar propuesta a aprobación
          </button>
        </div>
      )}
    </div>
  );
}

// ─── SUB: VERSIONES ───────────────────────────────────────────────────────────
function SubVersiones({ producto }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-bg-soft border border-border">
        <MdInfo size={15} className="text-text-soft mt-0.5 shrink-0" />
        <p className="text-xs text-text-soft">
          Las pólizas emitidas en cada versión conservan las condiciones vigentes al momento de su emisión. Una nueva
          versión no modifica contratos anteriores.
        </p>
      </div>

      {producto.versiones.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-xs text-text-soft">Este producto aún no tiene versiones activas.</p>
        </div>
      ) : (
        <div className="bg-bg rounded-2xl border border-border overflow-hidden">
          {[...producto.versiones].reverse().map((v, idx) => (
            <div
              key={v.version}
              className={`flex items-start gap-3 p-4 ${idx < producto.versiones.length - 1 ? 'border-b border-border' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${v.estado === 'activo' ? 'bg-primary text-text-inverse' : 'bg-bg-soft text-text-soft border border-border'}`}
              >
                {v.version}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-xs font-semibold text-text">{v.nota}</p>
                  <EstadoBadge estado={v.estado} />
                </div>
                <p className="text-xs text-text-soft mt-0.5">
                  {v.autor} · {v.fecha}
                </p>
              </div>
              {v.estado === 'activo' && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold shrink-0">
                  Vigente
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── SUB: BORRADORES ─────────────────────────────────────────────────────────
function SubBorradores({ producto, onActualizar }) {
  const eliminarBorrador = (id) => {
    onActualizar(producto.id, { borradores: producto.borradores.filter((b) => b.id !== id) });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start gap-2 p-3.5 rounded-xl bg-violet-50 border border-violet-200">
        <MdLock size={15} className="text-violet-600 mt-0.5 shrink-0" />
        <p className="text-xs text-violet-700">
          Los borradores de tarifa requieren aprobación del Portal Ejecutivo antes de activarse. No puedes activarlos
          desde aquí.
        </p>
      </div>

      {producto.borradores.length === 0 ? (
        <div className="py-10 flex flex-col items-center gap-2 text-center">
          <MdEdit size={28} className="text-text-soft" />
          <p className="text-xs text-text-soft">No hay borradores pendientes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {producto.borradores.map((b) => (
            <div key={b.id} className="bg-bg rounded-2xl border border-border overflow-hidden">
              <div className="h-1 w-full bg-violet-400" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-text">{b.id}</p>
                      <EstadoBadge estado={b.estado} />
                    </div>
                    <p className="text-xs text-text-soft mt-0.5">
                      {b.autor} · {b.fecha}
                    </p>
                    <p className="text-xs text-text mt-1 italic">"{b.nota}"</p>
                  </div>
                  <button
                    onClick={() => eliminarBorrador(b.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border hover:bg-rose-50 hover:border-rose-200 text-xs text-text-soft hover:text-rose-600 transition-colors"
                  >
                    <MdClose size={13} /> Retirar borrador
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── NUEVO PRODUCTO ───────────────────────────────────────────────────────────
function NuevoProducto({ onBack, onCrear }) {
  const [form, setForm] = useState({ nombre: '', ramo: '', descripcion: '' });
  const [guardado, setGuardado] = useState(false);

  const crear = () => {
    if (!form.nombre || !form.ramo) return;
    onCrear(form);
    setGuardado(true);
  };

  if (guardado)
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
            <p className="text-sm font-bold text-text">Producto creado como borrador</p>
            <p className="text-xs text-text-soft">
              Completa las coberturas y variables de tarifa antes de solicitar activación.
            </p>
            <button
              onClick={onBack}
              className="mt-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold"
            >
              Ver catálogo
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-text-soft hover:text-text w-fit">
        <MdArrowBack size={15} /> Volver al catálogo
      </button>
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="h-1 w-full bg-primary" />
        <div className="p-5 flex flex-col gap-5">
          <p className="text-sm font-bold text-text">Nuevo producto</p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-soft">Nombre del producto *</label>
              <input
                type="text"
                placeholder="Ej. Auto Premium"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-soft">Ramo *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {RAMOS.map((r) => {
                  const RIcon = r.icon;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setForm({ ...form, ramo: r.id })}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-colors ${
                        form.ramo === r.id
                          ? 'bg-primary text-text-inverse border-primary'
                          : 'border-border text-text-soft hover:bg-bg-soft'
                      }`}
                    >
                      <RIcon size={15} /> {r.nombre}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-text-soft">Descripción</label>
              <textarea
                placeholder="Descripción breve del producto..."
                value={form.descripcion}
                onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                rows={3}
                className="text-xs border border-border rounded-xl px-3 py-2 bg-bg focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 rounded-xl bg-bg-soft border border-border">
            <MdInfo size={14} className="text-text-soft mt-0.5 shrink-0" />
            <p className="text-xs text-text-soft">
              El producto se creará como <strong>borrador</strong>. Podrás configurar coberturas y variables antes de
              solicitar activación al Portal Ejecutivo.
            </p>
          </div>

          <button
            onClick={crear}
            disabled={!form.nombre || !form.ramo}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold disabled:opacity-40"
          >
            <MdAdd size={16} /> Crear producto en borrador
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function ProductosPage() {
  const [productos, setProductos] = useState(PRODUCTOS_MOCK);
  const [vista, setVista] = useState('catalogo');
  const [productoActivo, setProductoActivo] = useState(null);

  const handleActualizar = (id, cambios) => {
    setProductos((p) => p.map((prod) => (prod.id === id ? { ...prod, ...cambios } : prod)));
    if (productoActivo?.id === id) setProductoActivo((p) => ({ ...p, ...cambios }));
  };

  const handleCrear = (form) => {
    const ramo = RAMOS.find((r) => r.id === form.ramo);
    const nuevo = {
      id: 'PRD-' + String(productos.length + 1).padStart(3, '0'),
      ramo: form.ramo,
      nombre: form.nombre,
      descripcion: form.descripcion,
      estado: 'borrador',
      version: 0,
      versionActiva: 0,
      coberturas: [],
      exclusiones: [],
      variables: [],
      versiones: [],
      borradores: [],
    };
    setProductos((p) => [...p, nuevo]);
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {vista === 'catalogo' && (
        <>
          <div>
            <h1 className="text-lg font-bold text-text">Catálogo de Productos</h1>
            <p className="text-xs text-text-soft mt-0.5">
              Ramos, coberturas, motor de tarifas y versionado de productos
            </p>
          </div>
          <Catalogo
            productos={productos}
            onSelect={(p) => {
              setProductoActivo(p);
              setVista('detalle');
            }}
            onNuevo={() => setVista('nuevo')}
          />
        </>
      )}
      {vista === 'detalle' && productoActivo && (
        <DetalleProducto
          producto={productos.find((p) => p.id === productoActivo.id) || productoActivo}
          onBack={() => {
            setVista('catalogo');
            setProductoActivo(null);
          }}
          onActualizar={handleActualizar}
        />
      )}
      {vista === 'nuevo' && <NuevoProducto onBack={() => setVista('catalogo')} onCrear={handleCrear} />}
    </div>
  );
}
