'use client';

import { useState, useMemo } from 'react';
import {
  MdDirectionsCar,
  MdHome,
  MdFavorite,
  MdShield,
  MdRefresh,
  MdCheckCircle,
  MdInfo,
  MdArrowForward,
  MdStar,
  MdClose,
  MdChevronRight,
} from 'react-icons/md';

// ─── Productos ────────────────────────────────────────────────────────────────

const PRODUCTOS = [
  {
    id: 'vehicular',
    label: 'Vehicular',
    icon: MdDirectionsCar,
    accentBg: 'bg-sky-100',
    accentText: 'text-sky-700',
    accentBorder: 'border-sky-300',
    campos: [
      {
        id: 'marca',
        label: 'Marca del vehículo',
        type: 'select',
        opciones: ['Toyota', 'Hyundai', 'Kia', 'Volkswagen', 'Chevrolet', 'Nissan', 'Honda', 'Otro'],
      },
      {
        id: 'anio',
        label: 'Año del vehículo',
        type: 'select',
        opciones: ['2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017 o anterior'],
      },
      {
        id: 'uso',
        label: 'Uso del vehículo',
        type: 'select',
        opciones: ['Particular', 'Comercial', 'Transporte de personas'],
      },
      {
        id: 'zona',
        label: 'Zona de circulación',
        type: 'select',
        opciones: ['Lima Metropolitana', 'Provincias', 'Ambas'],
      },
      {
        id: 'edad_conductor',
        label: 'Edad del conductor principal',
        type: 'select',
        opciones: ['18-25 años', '26-35 años', '36-50 años', '51+ años'],
      },
    ],
    coberturas: [
      { id: 'basico', label: 'Básico', descripcion: 'Solo daños a terceros', base: 380, tag: null },
      { id: 'estandar', label: 'Estándar', descripcion: 'Terceros + robo parcial', base: 620, tag: 'Popular' },
      { id: 'premium', label: 'Premium', descripcion: 'Todo riesgo + asistencia 24h', base: 980, tag: 'Recomendado' },
    ],
  },
  {
    id: 'hogar',
    label: 'Hogar',
    icon: MdHome,
    accentBg: 'bg-amber-100',
    accentText: 'text-amber-700',
    accentBorder: 'border-amber-300',
    campos: [
      { id: 'tipo', label: 'Tipo de inmueble', type: 'select', opciones: ['Casa', 'Departamento', 'Oficina'] },
      {
        id: 'valor',
        label: 'Valor del inmueble',
        type: 'select',
        opciones: ['Hasta S/ 150,000', 'S/ 150,001 – 300,000', 'S/ 300,001 – 600,000', 'Más de S/ 600,000'],
      },
      {
        id: 'zona',
        label: 'Distrito / Zona',
        type: 'select',
        opciones: ['Lima Centro', 'Lima Norte', 'Lima Sur', 'Lima Este', 'Callao', 'Provincia'],
      },
      {
        id: 'antiguedad',
        label: 'Antigüedad del inmueble',
        type: 'select',
        opciones: ['Menos de 5 años', '5-15 años', '15-30 años', 'Más de 30 años'],
      },
    ],
    coberturas: [
      { id: 'basico', label: 'Básico', descripcion: 'Incendio y sismo', base: 180, tag: null },
      { id: 'estandar', label: 'Estándar', descripcion: 'Incendio, sismo + robo', base: 290, tag: 'Popular' },
      { id: 'premium', label: 'Premium', descripcion: 'Cobertura total + contenido', base: 480, tag: 'Recomendado' },
    ],
  },
  {
    id: 'vida',
    label: 'Vida',
    icon: MdFavorite,
    accentBg: 'bg-rose-100',
    accentText: 'text-rose-600',
    accentBorder: 'border-rose-300',
    campos: [
      {
        id: 'edad',
        label: 'Edad del asegurado',
        type: 'select',
        opciones: ['18-30 años', '31-40 años', '41-50 años', '51-60 años', '61+ años'],
      },
      { id: 'genero', label: 'Género', type: 'select', opciones: ['Masculino', 'Femenino'] },
      {
        id: 'suma',
        label: 'Suma asegurada',
        type: 'select',
        opciones: ['S/ 50,000', 'S/ 100,000', 'S/ 200,000', 'S/ 500,000'],
      },
      { id: 'fumador', label: '¿Fumador?', type: 'select', opciones: ['No fumador', 'Fumador'] },
    ],
    coberturas: [
      { id: 'basico', label: 'Básico', descripcion: 'Fallecimiento por cualquier causa', base: 95, tag: null },
      { id: 'estandar', label: 'Estándar', descripcion: '+ Invalidez total y permanente', base: 160, tag: 'Popular' },
      { id: 'premium', label: 'Premium', descripcion: '+ Enfermedades graves y rentas', base: 285, tag: 'Recomendado' },
    ],
  },
  {
    id: 'salud',
    label: 'Salud',
    icon: MdShield,
    accentBg: 'bg-emerald-100',
    accentText: 'text-emerald-700',
    accentBorder: 'border-emerald-300',
    campos: [
      {
        id: 'edad',
        label: 'Edad del titular',
        type: 'select',
        opciones: ['18-30 años', '31-40 años', '41-50 años', '51-60 años', '61+ años'],
      },
      {
        id: 'beneficiarios',
        label: 'Número de beneficiarios',
        type: 'select',
        opciones: ['Solo titular', '1 adicional', '2 adicionales', '3 o más'],
      },
      {
        id: 'cobertura_geo',
        label: 'Cobertura geográfica',
        type: 'select',
        opciones: ['Nacional', 'Nacional + EE.UU.', 'Internacional'],
      },
      {
        id: 'deducible',
        label: 'Deducible anual',
        type: 'select',
        opciones: ['Sin deducible', 'S/ 500', 'S/ 1,000', 'S/ 2,000'],
      },
    ],
    coberturas: [
      { id: 'basico', label: 'Básico', descripcion: 'Hospitalización y emergencias', base: 210, tag: null },
      { id: 'estandar', label: 'Estándar', descripcion: '+ Consultas y diagnóstico', base: 380, tag: 'Popular' },
      { id: 'premium', label: 'Premium', descripcion: 'Cobertura total sin red', base: 680, tag: 'Recomendado' },
    ],
  },
];

// ─── Motor de tarifas ─────────────────────────────────────────────────────────

function calcularPrima(producto, campos, cobertura) {
  let prima = cobertura.base;
  // Factores simples por campo
  Object.entries(campos).forEach(([key, val]) => {
    if (!val) return;
    if (val.includes('2017') || val.includes('30 años') || val.includes('61+') || val.includes('Fumador'))
      prima *= 1.18;
    if (val.includes('Comercial') || val.includes('Internacional') || val.includes('500,000')) prima *= 1.25;
    if (val.includes('18-25') || val.includes('Sin deducible')) prima *= 1.12;
    if (val.includes('2024') || val.includes('No fumador') || val.includes('S/ 2,000')) prima *= 0.93;
    if (val.includes('18-30') || val.includes('Provincias') || val.includes('Particular')) prima *= 0.97;
  });
  return Math.round(prima);
}

// ─── Componentes ──────────────────────────────────────────────────────────────

function SelectField({ label, opciones, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-soft">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-bg-soft border border-border rounded-xl pl-3 pr-8 py-2.5 text-xs text-text outline-none focus:border-primary transition-colors cursor-pointer"
        >
          <option value="">Seleccionar…</option>
          {opciones.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <MdChevronRight
          size={14}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-soft pointer-events-none"
        />
      </div>
    </div>
  );
}

function CoberturaCard({ cob, prima, seleccionada, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 min-w-0 flex flex-col gap-1.5 p-3.5 rounded-xl border text-left transition-all ${
        seleccionada ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-bg hover:bg-bg-soft'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <div>
          <p className="text-xs font-bold text-text">{cob.label}</p>
          {cob.tag && (
            <span
              className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-full mt-0.5 ${
                cob.tag === 'Recomendado'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-bg-soft text-text-soft border border-border'
              }`}
            >
              {cob.tag}
            </span>
          )}
        </div>
        {seleccionada && <MdCheckCircle size={14} className="text-primary shrink-0 mt-0.5" />}
      </div>
      <p className="text-[11px] text-text-soft leading-snug">{cob.descripcion}</p>
      <p className="text-sm font-bold text-text mt-1">
        S/ {prima.toLocaleString()}
        <span className="text-xs font-normal text-text-soft"> /año</span>
      </p>
    </button>
  );
}

function ResultadoPanel({ producto, coberturaId, primas, campos, onReset }) {
  const cob = producto.coberturas.find((c) => c.id === coberturaId);
  const prima = primas[coberturaId];
  const mensual = Math.round(prima / 12);
  const Icon = producto.icon;

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden">
      <div className={`h-1 w-full bg-primary`} />
      <div className="p-5">
        {/* Cabecera resultado */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${producto.accentBg}`}>
              <Icon size={20} className={producto.accentText} />
            </div>
            <div>
              <p className="text-xs font-bold text-text">
                {producto.label} · {cob.label}
              </p>
              <p className="text-xs text-text-soft mt-0.5">{cob.descripcion}</p>
            </div>
          </div>
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-text-soft hover:text-text transition-colors shrink-0"
          >
            <MdRefresh size={14} /> Nueva
          </button>
        </div>

        {/* Prima */}
        <div className="bg-bg-soft rounded-xl p-4 flex items-center justify-between gap-4 flex-wrap mb-4">
          <div>
            <p className="text-xs text-text-soft mb-0.5">Prima anual estimada</p>
            <p className="text-3xl font-bold text-text tabular-nums">S/ {prima.toLocaleString()}</p>
            <p className="text-xs text-text-soft mt-0.5">≈ S/ {mensual.toLocaleString()} / mes</p>
          </div>
          <div className="h-12 w-px bg-border hidden sm:block" />
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              <MdCheckCircle size={13} className="text-emerald-500" />
              <p className="text-xs text-text-soft">Cálculo inmediato</p>
            </div>
            <div className="flex items-center gap-1.5">
              <MdCheckCircle size={13} className="text-emerald-500" />
              <p className="text-xs text-text-soft">Sin registro en el sistema</p>
            </div>
            <div className="flex items-center gap-1.5">
              <MdCheckCircle size={13} className="text-emerald-500" />
              <p className="text-xs text-text-soft">Valores referenciales</p>
            </div>
          </div>
        </div>

        {/* Comparar coberturas */}
        <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-2">Comparar opciones</p>
        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
          {producto.coberturas.map((c) => (
            <CoberturaCard
              key={c.id}
              cob={c}
              prima={primas[c.id]}
              seleccionada={c.id === coberturaId}
              onClick={() => {}}
            />
          ))}
        </div>

        {/* Resumen datos ingresados */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs font-semibold text-text-soft uppercase tracking-wide mb-2">Datos de la simulación</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {producto.campos.map((campo) =>
              campos[campo.id] ? (
                <div key={campo.id} className="flex flex-col">
                  <span className="text-[10px] text-text-soft">{campo.label}</span>
                  <span className="text-xs font-medium text-text truncate">{campos[campo.id]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Aviso */}
        <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-bg-soft border border-border">
          <MdInfo size={13} className="text-text-soft shrink-0 mt-0.5" />
          <p className="text-[11px] text-text-soft leading-relaxed">
            Prima estimada con fines orientativos. El valor final puede variar según inspección e historial del
            asegurado.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SimuladorPage() {
  const [productoId, setProductoId] = useState(null);
  const [campos, setCampos] = useState({});
  const [coberturaId, setCoberturaId] = useState('estandar');
  const [resultado, setResultado] = useState(null);

  const producto = PRODUCTOS.find((p) => p.id === productoId);

  const camposCompletos = useMemo(() => {
    if (!producto) return false;
    return producto.campos.every((c) => campos[c.id]);
  }, [producto, campos]);

  const primas = useMemo(() => {
    if (!producto) return {};
    return Object.fromEntries(producto.coberturas.map((c) => [c.id, calcularPrima(producto, campos, c)]));
  }, [producto, campos]);

  const handleSelectProducto = (id) => {
    setProductoId(id);
    setCampos({});
    setCoberturaId('estandar');
    setResultado(null);
  };

  const handleSimular = () => {
    setResultado({ productoId, campos: { ...campos }, coberturaId });
  };

  const handleReset = () => {
    setResultado(null);
    setCampos({});
    setCoberturaId('estandar');
  };

  // ── Vista resultado ──
  if (resultado) {
    const prod = PRODUCTOS.find((p) => p.id === resultado.productoId);
    const primasResult = Object.fromEntries(
      prod.coberturas.map((c) => [c.id, calcularPrima(prod, resultado.campos, c)])
    );
    return (
      <div className="py-4 flex flex-col gap-4 pb-8">
        <div>
          <h1 className="text-base font-bold text-text">Simulador de prima</h1>
          <p className="text-xs text-text-soft mt-0.5">Resultado de tu simulación</p>
        </div>
        <ResultadoPanel
          producto={prod}
          coberturaId={resultado.coberturaId}
          primas={primasResult}
          campos={resultado.campos}
          onReset={handleReset}
        />
      </div>
    );
  }

  // ── Vista formulario ──
  return (
    <div className="py-4 flex flex-col gap-4 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-base font-bold text-text">Simulador de prima</h1>
        <p className="text-xs text-text-soft mt-0.5">Sin registro en el sistema · Solo orientativo</p>
      </div>

      {/* Paso 1: Producto */}
      <div className="bg-bg rounded-2xl border border-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-border">
          <p className="text-xs font-semibold text-text">1 · Selecciona el producto</p>
        </div>
        <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRODUCTOS.map((p) => {
            const Icon = p.icon;
            const sel = productoId === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProducto(p.id)}
                className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border transition-all ${
                  sel ? `${p.accentBorder} ${p.accentBg} shadow-sm` : 'border-border hover:bg-bg-soft'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${sel ? 'bg-white/60' : 'bg-bg-soft border border-border'}`}
                >
                  <Icon size={18} className={sel ? p.accentText : 'text-text-soft'} />
                </div>
                <p className={`text-xs font-semibold ${sel ? p.accentText : 'text-text-soft'}`}>{p.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Paso 2: Datos */}
      {producto && (
        <div className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
            <p className="text-xs font-semibold text-text">2 · Completa los datos</p>
            <button
              onClick={() => {
                setCampos({});
                setCoberturaId('estandar');
              }}
              className="text-xs text-text-soft hover:text-text transition-colors flex items-center gap-1"
            >
              <MdRefresh size={13} /> Limpiar
            </button>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {producto.campos.map((campo) => (
              <SelectField
                key={campo.id}
                label={campo.label}
                opciones={campo.opciones}
                value={campos[campo.id] ?? ''}
                onChange={(v) => setCampos((p) => ({ ...p, [campo.id]: v }))}
              />
            ))}
          </div>
        </div>
      )}

      {/* Paso 3: Cobertura */}
      {producto && camposCompletos && (
        <div className="bg-bg rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border">
            <p className="text-xs font-semibold text-text">3 · Elige la cobertura</p>
          </div>
          <div className="p-4 flex gap-2 flex-wrap sm:flex-nowrap">
            {producto.coberturas.map((c) => (
              <CoberturaCard
                key={c.id}
                cob={c}
                prima={primas[c.id]}
                seleccionada={coberturaId === c.id}
                onClick={() => setCoberturaId(c.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      {producto && (
        <button
          disabled={!camposCompletos}
          onClick={handleSimular}
          className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-40"
        >
          Ver prima estimada <MdArrowForward size={16} />
        </button>
      )}

      {/* Aviso */}
      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-bg-soft border border-border">
        <MdInfo size={13} className="text-text-soft mt-0.5 shrink-0" />
        <p className="text-xs text-text-soft">
          Esta simulación no genera registros en el sistema. Los valores son referenciales y pueden variar en la
          cotización formal.
        </p>
      </div>
    </div>
  );
}
