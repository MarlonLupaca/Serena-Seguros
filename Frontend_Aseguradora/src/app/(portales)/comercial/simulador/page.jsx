'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdFlight,
  MdBusiness,
  MdCalculate,
  MdRefresh,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdPets,
  MdShield,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';

const TIPO_STYLES = {
  VEHICULAR: { icon: MdDirectionsCar, accentBg: 'bg-primary/10', accentText: 'text-primary' },
  SALUD: { icon: MdHealthAndSafety, accentBg: 'bg-emerald-100', accentText: 'text-emerald-600' },
  VIDA: { icon: MdFavorite, accentBg: 'bg-rose-100', accentText: 'text-rose-500' },
  HOGAR: { icon: MdHome, accentBg: 'bg-amber-100', accentText: 'text-amber-600' },
  VIAJE: { icon: MdFlight, accentBg: 'bg-sky-100', accentText: 'text-sky-600' },
  EMPRESA: { icon: MdBusiness, accentBg: 'bg-violet-100', accentText: 'text-violet-600' },
  MASCOTAS: { icon: MdPets, accentBg: 'bg-orange-100', accentText: 'text-orange-600' },
};

function estiloTipo(tipo) {
  return TIPO_STYLES[tipo] || { icon: MdShield, accentBg: 'bg-bg-soft', accentText: 'text-text-soft' };
}

function formatearMoneda(v) {
  if (v == null || isNaN(v)) return '—';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function SimuladorPage() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [productoId, setProductoId] = useState(null);
  const [categoriaExpandida, setCategoriaExpandida] = useState(null);
  const [edad, setEdad] = useState('30');
  const [montoAsegurado, setMontoAsegurado] = useState('100000');
  const [meses, setMeses] = useState('12');

  useEffect(() => {
    apiGet('/productos?estado=ACTIVO')
      .then((data) => {
        setProductos(data || []);
        if (data && data[0]) {
          setProductoId(data[0].id_producto);
          setCategoriaExpandida(data[0].tipo_seguro);
        }
      })
      .catch((e) => setError(e.mensaje || 'No se pudieron cargar los productos'))
      .finally(() => setCargando(false));
  }, []);

  const productosPorTipo = useMemo(() => {
    const groups = {};
    for (const p of productos) {
      if (!groups[p.tipo_seguro]) groups[p.tipo_seguro] = [];
      groups[p.tipo_seguro].push(p);
    }
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [productos]);

  const producto = productos.find((p) => p.id_producto === productoId);

  const calculo = useMemo(() => {
    if (!producto) return null;
    const primaBase = Number(producto.prima_base || 0);
    const tasa = Number(producto.tasas || 0);
    const edadNum = Number(edad || 0);
    const montoNum = Number(montoAsegurado || 0);
    const mesesNum = Number(meses || 1);

    const edadMin = producto.restricciones_edad || 0;
    const aplicaEdad = edadNum >= edadMin;
    if (!aplicaEdad) {
      return {
        cumple: false,
        motivo: `La edad mínima para este producto es ${edadMin} años.`,
      };
    }

    const recargoEdad = edadNum > 60 ? 0.25 : edadNum > 50 ? 0.15 : edadNum > 40 ? 0.05 : 0;
    const factorMonto = montoNum / 100000;
    const primaMensual = primaBase * (1 + recargoEdad) * Math.max(factorMonto, 1) + (montoNum * tasa) / 1200;
    const total = primaMensual * mesesNum;
    return {
      cumple: true,
      primaBase,
      tasa,
      recargoEdad,
      primaMensual,
      total,
    };
  }, [producto, edad, montoAsegurado, meses]);

  return (
    <div className="py-4 flex flex-col gap-5 pb-8">
      <div>
        <h1 className="text-base font-bold text-text">Simulador de prima</h1>
        <p className="text-xs text-text-soft mt-0.5">
          Calcula la prima estimada para presentarle una propuesta al cliente.
        </p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-sm text-red-600 text-center">{error}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Parámetros</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-text-soft block mb-1.5">Edad del cliente</label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-text-soft block mb-1.5">Plazo (meses)</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={meses}
                  onChange={(e) => setMeses(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors"
                />
              </div>
              <div className="col-span-2">
                <label className="text-xs font-medium text-text-soft block mb-1.5">Monto asegurado (S/)</label>
                <input
                  type="number"
                  min="0"
                  value={montoAsegurado}
                  onChange={(e) => setMontoAsegurado(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft focus:border-primary transition-colors"
                />
              </div>
            </div>

            <div className="h-px bg-border my-1" />

            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">Categoría y Producto</label>
              <div className="flex flex-col gap-2">
                {productosPorTipo.map(([tipo, prods]) => {
                  const t = estiloTipo(tipo);
                  const Icon = t.icon;
                  const isExpanded = categoriaExpandida === tipo;
                  return (
                    <div key={tipo} className="border border-border rounded-xl overflow-hidden bg-bg">
                      <button
                        onClick={() => setCategoriaExpandida(isExpanded ? null : tipo)}
                        className="w-full flex items-center justify-between p-3 hover:bg-bg-soft transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.accentBg}`}>
                            <Icon size={16} className={t.accentText} />
                          </div>
                          <span className="text-sm font-bold text-text uppercase">{tipo}</span>
                          <span className="text-[10px] font-bold text-text-soft px-2 py-0.5 bg-border/50 rounded-full">
                            {prods.length} prod.
                          </span>
                        </div>
                        {isExpanded ? (
                          <MdKeyboardArrowUp size={20} className="text-text-soft" />
                        ) : (
                          <MdKeyboardArrowDown size={20} className="text-text-soft" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-3 border-t border-border bg-bg-soft/50 grid grid-cols-1 gap-2">
                          {prods.map((p) => {
                            const sel = productoId === p.id_producto;
                            return (
                              <button
                                key={p.id_producto}
                                onClick={() => setProductoId(p.id_producto)}
                                className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                                  sel
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-border bg-bg hover:border-primary/30'
                                }`}
                              >
                                <p className={`text-xs font-semibold truncate ${sel ? 'text-primary' : 'text-text'}`}>
                                  {p.nombre}
                                </p>
                                {sel && <div className="w-2 h-2 rounded-full bg-primary" />}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                setEdad('30');
                setMontoAsegurado('100000');
                setMeses('12');
              }}
              className="flex items-center gap-1.5 self-start px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-text-soft text-xs font-medium transition-colors"
            >
              <MdRefresh size={13} /> Restablecer datos
            </button>
          </div>

          <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <MdCalculate size={18} className="text-primary" />
              <p className="text-xs font-semibold uppercase tracking-wide text-text-soft">Resultado</p>
            </div>

            {!producto ? (
              <p className="text-sm text-text-soft text-center py-6">Selecciona un producto.</p>
            ) : !calculo?.cumple ? (
              <div className="p-3 text-xs bg-red-50 text-red-600 rounded-xl border border-red-100 font-medium">
                {calculo?.motivo || 'No cumple los requisitos para este producto.'}
              </div>
            ) : (
              <>
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex flex-col items-center gap-1">
                  <p className="text-xs text-text-soft">Prima estimada mensual</p>
                  <p className="text-3xl font-bold text-primary">{formatearMoneda(calculo.primaMensual)}</p>
                  <p className="text-xs text-text-soft mt-2">Total a {meses} meses</p>
                  <p className="text-base font-semibold text-text">{formatearMoneda(calculo.total)}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Linea label="Prima base" val={formatearMoneda(calculo.primaBase)} />
                  <Linea label="Tasa producto" val={`${calculo.tasa}%`} />
                  <Linea
                    label="Recargo por edad"
                    val={calculo.recargoEdad > 0 ? `+${(calculo.recargoEdad * 100).toFixed(0)}%` : 'Sin recargo'}
                  />
                  <Linea label="Producto" val={producto.nombre} />
                </div>
                <p className="text-xs text-text-soft leading-relaxed">
                  Este cálculo es referencial. La prima final se confirma al emitir la póliza con la información
                  completa del cliente.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Linea({ label, val }) {
  return (
    <div className="flex justify-between text-xs py-1.5 border-b border-border last:border-0">
      <span className="text-text-soft">{label}</span>
      <span className="font-medium text-text">{val}</span>
    </div>
  );
}
