'use client';

import { useState, useMemo } from 'react';
import {
  MdAdd,
  MdClose,
  MdPeople,
  MdSave,
  MdArrowBack,
  MdAutoAwesome,
  MdTrendingUp,
  MdShield,
  MdHome,
  MdDirectionsCar,
  MdFavorite,
  MdFilterList,
  MdChevronRight,
  MdBookmark,
  MdBookmarkBorder,
  MdSearch,
  MdLocationOn,
  MdAccessTime,
  MdCheckCircle,
  MdCancel,
  MdInfo,
  MdChevronLeft,
} from 'react-icons/md';

// ─── Data ────────────────────────────────────────────────────────────────────

const RAMOS = [
  { value: 'vehicular', label: 'Vehicular', icon: MdDirectionsCar, accentBg: 'bg-sky-100', accentText: 'text-sky-700' },
  { value: 'hogar', label: 'Hogar', icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-700' },
  { value: 'vida', label: 'Vida', icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-600' },
  { value: 'salud', label: 'Salud', icon: MdShield, accentBg: 'bg-emerald-100', accentText: 'text-emerald-700' },
];

const ZONAS = ['Lima Norte', 'Lima Sur', 'Lima Este', 'Lima Centro', 'Callao', 'Provincias'];
const PRODUCTOS = ['Básico', 'Estándar', 'Premium', 'Todo Riesgo'];
const ESTADOS_POLIZA = [
  { value: 'vigente', label: 'Vigente', dot: 'bg-emerald-500' },
  { value: 'por_vencer', label: 'Por vencer', dot: 'bg-amber-500' },
  { value: 'vencida', label: 'Vencida', dot: 'bg-rose-400' },
  { value: 'suspendida', label: 'Suspendida', dot: 'bg-gray-400' },
];
const ANTIGUEDAD_OPCIONES = [
  { value: 'menos_1', label: 'Menos de 1 año' },
  { value: '1_3', label: '1 a 3 años' },
  { value: '3_5', label: '3 a 5 años' },
  { value: 'mas_5', label: 'Más de 5 años' },
];

const SEGMENTOS_GUARDADOS = [
  {
    id: 'S-001',
    nombre: 'Clientes vehicular Lima Norte',
    filtros: { ramos: ['vehicular'], zonas: ['Lima Norte'], productos: [], estados: ['vigente'], antiguedad: [] },
    clientes: 342,
    creadoEn: '12 mar 2025',
    oportunidades: 87,
  },
  {
    id: 'S-002',
    nombre: 'Pólizas por vencer próximo mes',
    filtros: { ramos: [], zonas: [], productos: [], estados: ['por_vencer'], antiguedad: [] },
    clientes: 218,
    creadoEn: '20 abr 2025',
    oportunidades: 218,
  },
  {
    id: 'S-003',
    nombre: 'Clientes premium antiguos',
    filtros: {
      ramos: [],
      zonas: [],
      productos: ['Premium', 'Todo Riesgo'],
      estados: ['vigente'],
      antiguedad: ['mas_5'],
    },
    clientes: 95,
    creadoEn: '5 abr 2025',
    oportunidades: 41,
  },
];

const OPORTUNIDADES_AUTO = [
  {
    id: 'OP-001',
    tipo: 'cross-sell',
    titulo: 'Vehicular → Hogar',
    descripcion: 'Clientes con seguro vehicular vigente sin cobertura de hogar',
    clientes: 523,
    potencial: 'Alto',
    ramo: 'hogar',
  },
  {
    id: 'OP-002',
    tipo: 'up-sell',
    titulo: 'Básico → Premium',
    descripcion: 'Clientes con plan básico con más de 2 años de antigüedad sin siniestros',
    clientes: 189,
    potencial: 'Alto',
    ramo: 'vehicular',
  },
  {
    id: 'OP-003',
    tipo: 'cross-sell',
    titulo: 'Hogar → Vida',
    descripcion: 'Titulares de póliza hogar mayores de 35 años sin seguro de vida',
    clientes: 274,
    potencial: 'Medio',
    ramo: 'vida',
  },
  {
    id: 'OP-004',
    tipo: 'up-sell',
    titulo: 'Estándar → Todo Riesgo',
    descripcion: 'Clientes con plan estándar en zonas de alta siniestralidad',
    clientes: 112,
    potencial: 'Medio',
    ramo: 'vehicular',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const FILTROS_VACIO = { ramos: [], zonas: [], productos: [], estados: [], antiguedad: [] };

function toggleItem(arr, val) {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

function contarClientes(filtros) {
  let base = 1200;
  if (filtros.ramos.length) base = Math.round(base * (0.2 + filtros.ramos.length * 0.15));
  if (filtros.zonas.length) base = Math.round(base * (0.3 + filtros.zonas.length * 0.08));
  if (filtros.productos.length) base = Math.round(base * (0.4 + filtros.productos.length * 0.1));
  if (filtros.estados.length) base = Math.round(base * (0.5 + filtros.estados.length * 0.1));
  if (filtros.antiguedad.length) base = Math.round(base * (0.5 + filtros.antiguedad.length * 0.12));
  return Math.max(base, 0);
}

function hayFiltros(f) {
  return Object.values(f).some((v) => v.length > 0);
}

function resumirFiltros(f) {
  const partes = [];
  if (f.ramos.length) partes.push(f.ramos.map((r) => RAMOS.find((x) => x.value === r)?.label).join(', '));
  if (f.zonas.length) partes.push(f.zonas.join(', '));
  if (f.productos.length) partes.push(f.productos.join(', '));
  if (f.estados.length) partes.push(f.estados.map((e) => ESTADOS_POLIZA.find((x) => x.value === e)?.label).join(', '));
  if (f.antiguedad.length)
    partes.push(f.antiguedad.map((a) => ANTIGUEDAD_OPCIONES.find((x) => x.value === a)?.label).join(', '));
  return partes.join(' · ') || 'Sin filtros';
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function ChipToggle({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
        active ? 'bg-primary border-primary text-text-inverse' : 'border-border bg-bg hover:bg-bg-soft text-text-soft'
      }`}
    >
      {children}
    </button>
  );
}

function SeccionFiltro({ titulo, children, abierto, onToggle }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-bg hover:bg-bg-soft transition-colors"
      >
        <p className="text-xs font-semibold text-text">{titulo}</p>
        <MdChevronLeft size={16} className={`text-text-soft transition-transform ${abierto ? 'rotate-180' : ''}`} />
      </button>
      {abierto && <div className="px-4 py-3 border-t border-border bg-bg flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

function ModalGuardar({ clientes, filtros, onClose, onGuardar }) {
  const [nombre, setNombre] = useState('');
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-bg w-full max-w-sm rounded-2xl border border-border shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-bold text-text">Guardar segmento</p>
          <button onClick={onClose} className="text-text-soft hover:text-text transition-colors">
            <MdClose size={18} />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-3">
          <div className="bg-bg-soft rounded-xl p-3 flex items-center gap-3">
            <MdPeople size={20} className="text-primary shrink-0" />
            <div>
              <p className="text-xs text-text-soft">Clientes en este segmento</p>
              <p className="text-base font-bold text-text">{clientes.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-text-soft">Nombre del segmento</label>
            <input
              className="w-full text-xs rounded-xl border border-border bg-bg-soft px-3 py-2 text-text placeholder:text-text-soft outline-none focus:border-primary transition-colors"
              placeholder="Ej. Clientes vehicular Lima Norte"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoFocus
            />
          </div>
          <p className="text-xs text-text-soft">{resumirFiltros(filtros)}</p>
        </div>
        <div className="px-5 py-4 border-t border-border flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-xs font-medium text-text-soft hover:bg-bg-soft transition-colors"
          >
            Cancelar
          </button>
          <button
            disabled={!nombre.trim()}
            onClick={() => {
              onGuardar(nombre.trim());
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

function OportunidadCard({ op }) {
  const ramo = RAMOS.find((r) => r.value === op.ramo);
  const RamoIcon = ramo?.icon ?? MdShield;
  const esCross = op.tipo === 'cross-sell';
  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`h-1 w-full ${esCross ? 'bg-violet-400' : 'bg-emerald-400'}`} />
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${ramo?.accentBg ?? 'bg-bg-soft'}`}
          >
            <RamoIcon size={18} className={ramo?.accentText ?? 'text-text-soft'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-0.5">
              <p className="text-xs font-bold text-text">{op.titulo}</p>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${esCross ? 'bg-violet-100 text-violet-700' : 'bg-emerald-100 text-emerald-700'}`}
              >
                {esCross ? 'Cross-sell' : 'Up-sell'}
              </span>
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${op.potencial === 'Alto' ? 'bg-amber-100 text-amber-700' : 'bg-bg-soft text-text-soft'}`}
              >
                {op.potencial}
              </span>
            </div>
            <p className="text-xs text-text-soft leading-relaxed">{op.descripcion}</p>
            <div className="flex items-center gap-1 mt-2">
              <MdPeople size={12} className="text-text-soft" />
              <p className="text-xs font-semibold text-text">{op.clientes.toLocaleString()} clientes identificados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SegmentoGuardadoCard({ seg, onCargar }) {
  return (
    <div className="bg-bg rounded-2xl border border-border hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-bg-soft border border-border flex items-center justify-center shrink-0">
              <MdBookmark size={16} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-text truncate">{seg.nombre}</p>
              <p className="text-xs text-text-soft mt-0.5 truncate">{resumirFiltros(seg.filtros)}</p>
            </div>
          </div>
          <button
            onClick={() => onCargar(seg)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors shrink-0"
          >
            Cargar <MdChevronRight size={13} />
          </button>
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1">
            <MdPeople size={12} className="text-text-soft" />
            <p className="text-xs font-semibold text-text">{seg.clientes.toLocaleString()}</p>
            <p className="text-xs text-text-soft">clientes</p>
          </div>
          <div className="flex items-center gap-1">
            <MdAutoAwesome size={12} className="text-violet-500" />
            <p className="text-xs font-semibold text-text">{seg.oportunidades}</p>
            <p className="text-xs text-text-soft">oportunidades</p>
          </div>
          <p className="text-xs text-text-soft ml-auto">{seg.creadoEn}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Page Principal ───────────────────────────────────────────────────────────

const TABS = ['Constructor', 'Guardados', 'Oportunidades'];

export default function SegmentacionPage() {
  const [tab, setTab] = useState('Constructor');
  const [filtros, setFiltros] = useState(FILTROS_VACIO);
  const [seccionesAbiertas, setSeccionesAbiertas] = useState({
    ramos: true,
    zonas: false,
    productos: false,
    estados: false,
    antiguedad: false,
  });
  const [modalGuardar, setModalGuardar] = useState(false);
  const [segmentos, setSegmentos] = useState(SEGMENTOS_GUARDADOS);

  const toggleSeccion = (k) => setSeccionesAbiertas((p) => ({ ...p, [k]: !p[k] }));
  const toggleFiltro = (key, val) => setFiltros((p) => ({ ...p, [key]: toggleItem(p[key], val) }));
  const limpiar = () => setFiltros(FILTROS_VACIO);
  const clientesCount = useMemo(() => contarClientes(filtros), [filtros]);
  const activo = hayFiltros(filtros);

  const handleGuardarSegmento = (nombre) => {
    const nuevo = {
      id: `S-${String(segmentos.length + 1).padStart(3, '0')}`,
      nombre,
      filtros: { ...filtros },
      clientes: clientesCount,
      creadoEn: new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }),
      oportunidades: Math.round(clientesCount * 0.35),
    };
    setSegmentos((p) => [nuevo, ...p]);
    setTab('Guardados');
  };

  const handleCargarSegmento = (seg) => {
    setFiltros({ ...seg.filtros });
    setTab('Constructor');
  };

  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-text">Segmentación</h1>
        <p className="text-xs text-text-soft mt-0.5">Crea y gestiona segmentos de clientes para tus campañas</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-bg-soft border border-border rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-xs font-semibold transition-colors ${
              tab === t ? 'bg-bg text-text shadow-sm border border-border' : 'text-text-soft hover:text-text'
            }`}
          >
            {t}
            {t === 'Oportunidades' && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
                {OPORTUNIDADES_AUTO.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Constructor */}
      {tab === 'Constructor' && (
        <>
          {/* Resultado vivo */}
          <div
            className={`rounded-2xl border overflow-hidden transition-colors ${activo ? 'border-primary bg-primary/5' : 'border-border bg-bg'}`}
          >
            <div className="p-4 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${activo ? 'bg-primary' : 'bg-bg-soft border border-border'}`}
                >
                  <MdPeople size={20} className={activo ? 'text-text-inverse' : 'text-text-soft'} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-text tabular-nums">
                    {activo ? clientesCount.toLocaleString() : '—'}
                  </p>
                  <p className="text-xs text-text-soft">
                    {activo ? 'clientes en este segmento' : 'Aplica filtros para ver clientes'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                {activo && (
                  <button
                    onClick={limpiar}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-medium text-text-soft transition-colors"
                  >
                    <MdClose size={13} /> Limpiar
                  </button>
                )}
                <button
                  disabled={!activo}
                  onClick={() => setModalGuardar(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  <MdSave size={13} /> Guardar segmento
                </button>
              </div>
            </div>
            {activo && (
              <div className="px-4 pb-3">
                <p className="text-xs text-text-soft">{resumirFiltros(filtros)}</p>
              </div>
            )}
          </div>

          {/* Filtros */}
          <div className="flex flex-col gap-2">
            <SeccionFiltro
              titulo="Ramo de seguro"
              abierto={seccionesAbiertas.ramos}
              onToggle={() => toggleSeccion('ramos')}
            >
              {RAMOS.map((r) => {
                const Icon = r.icon;
                return (
                  <ChipToggle
                    key={r.value}
                    active={filtros.ramos.includes(r.value)}
                    onClick={() => toggleFiltro('ramos', r.value)}
                  >
                    <Icon size={12} /> {r.label}
                  </ChipToggle>
                );
              })}
            </SeccionFiltro>

            <SeccionFiltro
              titulo="Zona geográfica"
              abierto={seccionesAbiertas.zonas}
              onToggle={() => toggleSeccion('zonas')}
            >
              {ZONAS.map((z) => (
                <ChipToggle key={z} active={filtros.zonas.includes(z)} onClick={() => toggleFiltro('zonas', z)}>
                  <MdLocationOn size={11} /> {z}
                </ChipToggle>
              ))}
            </SeccionFiltro>

            <SeccionFiltro
              titulo="Producto contratado"
              abierto={seccionesAbiertas.productos}
              onToggle={() => toggleSeccion('productos')}
            >
              {PRODUCTOS.map((p) => (
                <ChipToggle key={p} active={filtros.productos.includes(p)} onClick={() => toggleFiltro('productos', p)}>
                  {p}
                </ChipToggle>
              ))}
            </SeccionFiltro>

            <SeccionFiltro
              titulo="Estado de póliza"
              abierto={seccionesAbiertas.estados}
              onToggle={() => toggleSeccion('estados')}
            >
              {ESTADOS_POLIZA.map((e) => (
                <ChipToggle
                  key={e.value}
                  active={filtros.estados.includes(e.value)}
                  onClick={() => toggleFiltro('estados', e.value)}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${e.dot}`} /> {e.label}
                </ChipToggle>
              ))}
            </SeccionFiltro>

            <SeccionFiltro
              titulo="Antigüedad del cliente"
              abierto={seccionesAbiertas.antiguedad}
              onToggle={() => toggleSeccion('antiguedad')}
            >
              {ANTIGUEDAD_OPCIONES.map((a) => (
                <ChipToggle
                  key={a.value}
                  active={filtros.antiguedad.includes(a.value)}
                  onClick={() => toggleFiltro('antiguedad', a.value)}
                >
                  <MdAccessTime size={11} /> {a.label}
                </ChipToggle>
              ))}
            </SeccionFiltro>
          </div>

          {/* Aviso solo lectura */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-bg-soft border border-border">
            <MdInfo size={14} className="text-text-soft mt-0.5 shrink-0" />
            <p className="text-xs text-text-soft">
              La segmentación es de solo lectura. Los datos de clientes no pueden editarse desde aquí.
            </p>
          </div>
        </>
      )}

      {/* Tab: Guardados */}
      {tab === 'Guardados' && (
        <>
          {segmentos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-12 h-12 rounded-2xl bg-bg-soft border border-border flex items-center justify-center">
                <MdBookmarkBorder size={22} className="text-text-soft" />
              </div>
              <p className="text-sm font-semibold text-text">Sin segmentos guardados</p>
              <p className="text-xs text-text-soft max-w-xs">
                Crea un segmento en el constructor y guárdalo para reutilizarlo en campañas.
              </p>
              <button
                onClick={() => setTab('Constructor')}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-xs font-semibold transition-colors"
              >
                <MdAdd size={15} /> Crear segmento
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {segmentos.map((seg) => (
                <SegmentoGuardadoCard key={seg.id} seg={seg} onCargar={handleCargarSegmento} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Tab: Oportunidades */}
      {tab === 'Oportunidades' && (
        <>
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-violet-50 border border-violet-200">
            <MdAutoAwesome size={15} className="text-violet-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-violet-700 mb-0.5">Oportunidades identificadas automáticamente</p>
              <p className="text-xs text-violet-600">
                El sistema analiza tu cartera y detecta oportunidades de cross-sell y up-sell en tiempo real.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            {OPORTUNIDADES_AUTO.map((op) => (
              <OportunidadCard key={op.id} op={op} />
            ))}
          </div>
        </>
      )}

      {modalGuardar && (
        <ModalGuardar
          clientes={clientesCount}
          filtros={filtros}
          onClose={() => setModalGuardar(false)}
          onGuardar={handleGuardarSegmento}
        />
      )}
    </div>
  );
}
