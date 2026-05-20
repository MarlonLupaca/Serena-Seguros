'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  MdDirectionsCar,
  MdFavorite,
  MdLocalHospital,
  MdShield,
  MdFlight,
  MdHome,
  MdPets,
  MdBusiness,
  MdArrowForward,
  MdArrowBack,
  MdCheckCircle,
} from 'react-icons/md';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const TIPOS = [
  { id: 'VEHICULAR', label: 'Vehicular', icon: MdDirectionsCar },
  { id: 'SOAT', label: 'SOAT', icon: MdShield },
  { id: 'VIDA', label: 'Vida', icon: MdFavorite },
  { id: 'SALUD', label: 'Salud', icon: MdLocalHospital },
  { id: 'VIAJE', label: 'Viajes', icon: MdFlight },
  { id: 'HOGAR', label: 'Hogar', icon: MdHome },
  { id: 'MASCOTAS', label: 'Mascotas', icon: MdPets },
  { id: 'EMPRESA', label: 'Empresas', icon: MdBusiness },
];

const SLUG_TO_TIPO = {
  vehicular: 'VEHICULAR',
  soat: 'SOAT',
  vida: 'VIDA',
  salud: 'SALUD',
  viajes: 'VIAJE',
  hogar: 'HOGAR',
  mascotas: 'MASCOTAS',
  empresas: 'EMPRESA',
};

export default function CotizarPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center"><p className="text-text-soft">Cargando...</p></div>}>
      <CotizarContent />
    </Suspense>
  );
}

function CotizarContent() {
  const searchParams = useSearchParams();
  const tipoParam = searchParams.get('tipo');

  const [paso, setPaso] = useState(1);
  const [tipoSeleccionado, setTipoSeleccionado] = useState('');
  const [edad, setEdad] = useState('');
  const [monto, setMonto] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tipoParam) {
      const mapped = SLUG_TO_TIPO[tipoParam] || tipoParam.toUpperCase();
      if (TIPOS.some((t) => t.id === mapped)) {
        setTipoSeleccionado(mapped);
        setPaso(2);
      }
    }
  }, [tipoParam]);

  const simular = async () => {
    if (!edad || !monto) {
      setError('Completa la edad y el monto asegurado.');
      return;
    }
    setError('');
    setCargando(true);
    try {
      const res = await fetch(`${API}/cotizar/simular`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_interes: tipoSeleccionado,
          edad: parseInt(edad),
          monto_asegurado: parseFloat(monto),
          ubicacion: ubicacion || null,
        }),
      });
      if (!res.ok) throw new Error('Error al simular');
      const data = await res.json();
      setPlanes(data.planes || []);
      setPaso(3);
    } catch {
      setError('No pudimos procesar tu cotizacion. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const tipoInfo = TIPOS.find((t) => t.id === tipoSeleccionado);

  return (
    <section className="py-20 px-6 min-h-[70vh]">
      <div className="max-w-4xl mx-auto">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((p) => (
            <div key={p} className="flex items-center gap-2">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  paso >= p ? 'bg-primary text-white' : 'bg-bg-soft text-text-soft'
                }`}
              >
                {paso > p ? <MdCheckCircle size={20} /> : p}
              </div>
              {p < 3 && (
                <div className={`w-16 h-0.5 rounded-full ${paso > p ? 'bg-primary' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Paso 1: Tipo de seguro */}
        {paso === 1 && (
          <div>
            <h1 className="text-3xl md:text-[42px] font-extrabold tracking-tight text-text text-center">
              Que tipo de seguro necesitas?
            </h1>
            <p className="mt-3 text-text-soft text-center text-lg">
              Selecciona una categoria para comenzar tu cotizacion.
            </p>
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {TIPOS.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTipoSeleccionado(t.id);
                      setPaso(2);
                    }}
                    className="flex flex-col items-center gap-3 p-6 rounded-2xl border border-border bg-white hover:border-primary/40 hover:shadow-[0_12px_32px_rgba(11,60,93,0.08)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <Icon size={36} className="text-primary" />
                    <span className="font-bold text-sm text-text">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Paso 2: Datos basicos */}
        {paso === 2 && (
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setPaso(1)}
              className="flex items-center gap-1 text-sm text-text-soft hover:text-primary mb-6 transition-colors"
            >
              <MdArrowBack size={18} /> Cambiar tipo de seguro
            </button>

            {tipoInfo && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-6">
                <tipoInfo.icon size={18} />
                {tipoInfo.label}
              </div>
            )}

            <h2 className="text-3xl font-extrabold tracking-tight text-text">
              Cuentanos sobre ti
            </h2>
            <p className="mt-2 text-text-soft">
              Con estos datos calcularemos una cotizacion personalizada.
            </p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">Edad</label>
                <input
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  placeholder="30"
                  min="0"
                  max="120"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Monto asegurado (S/)
                </label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="50000"
                  min="0"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-text mb-1.5">
                  Ubicacion <span className="text-text-soft font-normal">(opcional)</span>
                </label>
                <input
                  type="text"
                  value={ubicacion}
                  onChange={(e) => setUbicacion(e.target.value)}
                  placeholder="Lima, Arequipa, etc."
                  className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}

              <button
                onClick={simular}
                disabled={cargando}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {cargando ? 'Calculando...' : 'Ver planes disponibles'}
                {!cargando && <MdArrowForward size={18} />}
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Resultados */}
        {paso === 3 && (
          <div>
            <button
              onClick={() => setPaso(2)}
              className="flex items-center gap-1 text-sm text-text-soft hover:text-primary mb-6 transition-colors"
            >
              <MdArrowBack size={18} /> Modificar datos
            </button>

            <h2 className="text-3xl font-extrabold tracking-tight text-text text-center">
              Tu cotizacion personalizada
            </h2>
            <p className="mt-2 text-text-soft text-center">
              Estos son los planes disponibles para ti. Los precios son referenciales.
            </p>

            <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              {planes.map((plan) => {
                const destacado = plan.nivel === 'PREMIUM';
                return (
                  <div
                    key={plan.nivel}
                    className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-300 ${
                      destacado
                        ? 'border-primary bg-primary/[0.03] shadow-[0_20px_48px_rgba(33,194,183,0.12)]'
                        : 'border-border bg-white hover:shadow-[0_12px_32px_rgba(11,60,93,0.08)]'
                    }`}
                  >
                    {destacado && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full bg-primary text-white">
                        Recomendado
                      </span>
                    )}
                    <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                      {plan.nivel}
                    </p>
                    <p className="font-extrabold text-xl text-text">{plan.nombre}</p>
                    <div className="mt-4">
                      <p className="text-xs text-text-soft">Prima mensual</p>
                      <p className="text-3xl font-extrabold text-text">
                        S/{Number(plan.prima_mensual).toFixed(2)}
                      </p>
                      <p className="text-xs text-text-soft mt-1">
                        Prima anual: S/{Number(plan.prima_anual).toFixed(2)}
                      </p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-text-soft mb-1">
                        Deducible: S/{Number(plan.deducible).toFixed(2)}
                      </p>
                    </div>
                    <ul className="mt-4 space-y-2 grow">
                      {plan.beneficios.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-text-soft">
                          <MdCheckCircle size={16} className="text-primary shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href="/register"
                      className={`mt-6 flex items-center justify-center gap-2 font-bold text-[15px] px-6 py-3.5 rounded-2xl transition-all hover:-translate-y-0.5 ${
                        destacado
                          ? 'bg-primary text-white'
                          : 'bg-bg-soft text-primary hover:bg-primary/10'
                      }`}
                    >
                      Contratar <MdArrowForward size={16} />
                    </Link>
                  </div>
                );
              })}
            </div>

            <div className="mt-12 text-center p-8 bg-bg-soft rounded-2xl">
              <p className="text-lg font-bold text-text">Te interesa alguno de estos planes?</p>
              <p className="mt-2 text-text-soft">
                Registrate para continuar con el proceso de contratacion y recibir una propuesta formal.
              </p>
              <div className="mt-6 flex justify-center gap-4 flex-wrap">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
                >
                  Registrarme <MdArrowForward size={18} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 border border-text text-text font-bold text-[15px] px-8 py-4 rounded-2xl hover:-translate-y-0.5 transition-all"
                >
                  Ya tengo cuenta
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
