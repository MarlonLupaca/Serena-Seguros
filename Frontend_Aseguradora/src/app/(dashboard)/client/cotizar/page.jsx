'use client';

import { useState } from 'react';
import {
  MdDirectionsCar,
  MdHealthAndSafety,
  MdFavorite,
  MdHome,
  MdArrowForward,
  MdArrowBack,
  MdCheck,
  MdInfo,
  MdSave,
  MdRefresh,
  MdUploadFile,
  MdCheckCircle,
  MdPerson,
  MdCalendarToday,
  MdLocationOn,
  MdShield,
} from 'react-icons/md';

const TIPOS = [
  { id: 'auto', label: 'Auto', icon: MdDirectionsCar, desc: 'Protege tu vehículo' },
  { id: 'salud', label: 'Salud', icon: MdHealthAndSafety, desc: 'Cuida tu bienestar' },
  { id: 'vida', label: 'Vida', icon: MdFavorite, desc: 'Protege tu familia' },
  { id: 'hogar', label: 'Hogar', icon: MdHome, desc: 'Asegura tu vivienda' },
];

const STEPS = ['Tipo', 'Datos', 'Cobertura', 'Cotización', 'Contratación'];

const COBERTURAS = {
  auto: [
    { id: 'basica', label: 'Básica', precio: 45, desc: 'Responsabilidad civil + robo total' },
    { id: 'estandar', label: 'Estándar', precio: 75, desc: 'Básica + daños propios + asistencia 24h' },
    { id: 'full', label: 'Full', precio: 110, desc: 'Todo incluido + gastos médicos + auto de reemplazo' },
  ],
  salud: [
    { id: 'individual', label: 'Individual', precio: 89, desc: 'Cobertura para una persona' },
    { id: 'familiar', label: 'Familiar', precio: 149, desc: 'Titular + cónyuge + hijos hasta 25 años' },
    { id: 'premium', label: 'Premium', precio: 210, desc: 'Familiar + internacional + dental' },
  ],
  vida: [
    { id: 'esencial', label: 'Esencial', precio: 35, desc: 'Capital asegurado S/100k' },
    { id: 'plus', label: 'Plus', precio: 60, desc: 'Capital S/200k + invalidez' },
    { id: 'platinum', label: 'Platinum', precio: 95, desc: 'Capital S/500k + enfermedades graves + ahorro' },
  ],
  hogar: [
    { id: 'basica', label: 'Básica', precio: 28, desc: 'Incendio + robo' },
    { id: 'estandar', label: 'Estándar', precio: 48, desc: 'Básica + fenómenos naturales' },
    { id: 'total', label: 'Total', precio: 72, desc: 'Estándar + responsabilidad civil + asistencia técnica' },
  ],
};

const EXTRAS = [
  { id: 'asistencia', label: 'Asistencia vial premium', precio: 8 },
  { id: 'reemplazo', label: 'Vehículo de reemplazo', precio: 12 },
  { id: 'medico', label: 'Gastos médicos ampliados', precio: 10 },
  { id: 'juridica', label: 'Asistencia jurídica', precio: 6 },
];

const DEDUCIBLE_OPTS = [
  { val: 0, label: 'Sin deducible', descuento: 0 },
  { val: 500, label: 'S/ 500', descuento: 5 },
  { val: 1000, label: 'S/ 1,000', descuento: 10 },
  { val: 2000, label: 'S/ 2,000', descuento: 15 },
];

function Tooltip({ text }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        type="button"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="text-text-soft hover:text-primary transition-colors"
      >
        <MdInfo size={15} />
      </button>
      {show && (
        <span className="absolute left-5 -top-1 z-20 w-48 bg-text text-text-inverse text-xs rounded-xl px-3 py-2 shadow-lg">
          {text}
        </span>
      )}
    </span>
  );
}

function Field({ label, tooltip, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-text flex items-center">
        {label}
        {tooltip && <Tooltip text={tooltip} />}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  'w-full px-3 py-2.5 rounded-xl text-sm outline-none bg-bg-soft text-text border border-border focus:border-primary transition-colors';

// ─── Pasos ──────────────────────────────────────────────────────
function StepTipo({ data, set }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-soft">¿Qué tipo de seguro deseas cotizar?</p>
      <div className="grid grid-cols-2 gap-3">
        {TIPOS.map((t) => {
          const Icon = t.icon;
          const sel = data.tipo === t.id;
          return (
            <button
              key={t.id}
              onClick={() => set({ tipo: t.id })}
              className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${sel ? 'bg-primary' : 'bg-bg-soft'}`}
              >
                <Icon size={24} className={sel ? 'text-text-inverse' : 'text-text-soft'} />
              </div>
              <span className={`text-sm font-semibold ${sel ? 'text-primary' : 'text-text'}`}>{t.label}</span>
              <span className="text-xs text-text-soft">{t.desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function StepDatos({ data, set }) {
  const u = (k, v) => set({ datos: { ...data.datos, [k]: v } });
  const d = data.datos || {};
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-text-soft">Cuéntanos sobre ti para personalizar tu cotización.</p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nombre completo">
          <div className="relative">
            <MdPerson size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              className={`${inputCls} pl-8`}
              placeholder="Juan Pérez"
              value={d.nombre || ''}
              onChange={(e) => u('nombre', e.target.value)}
            />
          </div>
        </Field>
        <Field label="Edad" tooltip="Afecta el cálculo del riesgo y el precio final.">
          <div className="relative">
            <MdCalendarToday size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <input
              type="number"
              min={18}
              max={80}
              className={`${inputCls} pl-8`}
              placeholder="30"
              value={d.edad || ''}
              onChange={(e) => u('edad', e.target.value)}
            />
          </div>
        </Field>
        <Field label="Género">
          <select className={inputCls} value={d.genero || ''} onChange={(e) => u('genero', e.target.value)}>
            <option value="">Seleccionar</option>
            <option>Masculino</option>
            <option>Femenino</option>
            <option>Prefiero no indicar</option>
          </select>
        </Field>
        <Field label="Departamento">
          <div className="relative">
            <MdLocationOn size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
            <select className={`${inputCls} pl-8`} value={d.depto || ''} onChange={(e) => u('depto', e.target.value)}>
              <option value="">Seleccionar</option>
              {['Lima', 'Arequipa', 'Cusco', 'Piura', 'La Libertad', 'Otros'].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </div>
        </Field>
      </div>

      {data.tipo === 'auto' && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-text-soft">Datos del vehículo</p>
          <Field label="Marca">
            <select className={inputCls} value={d.marca || ''} onChange={(e) => u('marca', e.target.value)}>
              <option value="">Seleccionar</option>
              {['Toyota', 'Hyundai', 'Kia', 'Chevrolet', 'Nissan', 'Otro'].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </Field>
          <Field label="Año">
            <input
              type="number"
              className={inputCls}
              placeholder="2020"
              value={d.anio || ''}
              onChange={(e) => u('anio', e.target.value)}
            />
          </Field>
          <Field label="Uso del vehículo">
            <select className={inputCls} value={d.uso || ''} onChange={(e) => u('uso', e.target.value)}>
              <option value="">Seleccionar</option>
              <option>Particular</option>
              <option>Taxi / Uber</option>
              <option>Empresa</option>
            </select>
          </Field>
          <Field label="Valor del vehículo (S/)">
            <input
              type="number"
              className={inputCls}
              placeholder="35000"
              value={d.valor || ''}
              onChange={(e) => u('valor', e.target.value)}
            />
          </Field>
        </div>
      )}
      {data.tipo === 'salud' && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-text-soft">
            Información de salud
          </p>
          <Field label="¿Fumas?" tooltip="Influye en el cálculo de la prima.">
            <select className={inputCls} value={d.fuma || ''} onChange={(e) => u('fuma', e.target.value)}>
              <option value="">Seleccionar</option>
              <option>No</option>
              <option>Sí</option>
            </select>
          </Field>
          <Field label="¿Tienes enfermedades preexistentes?">
            <select className={inputCls} value={d.preex || ''} onChange={(e) => u('preex', e.target.value)}>
              <option value="">Seleccionar</option>
              <option>No</option>
              <option>Sí</option>
            </select>
          </Field>
        </div>
      )}
      {data.tipo === 'vida' && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-text-soft">
            Información de cobertura
          </p>
          <Field label="Monto asegurado (S/)" tooltip="Capital que recibirán tus beneficiarios.">
            <input
              type="number"
              className={inputCls}
              placeholder="100000"
              value={d.monto || ''}
              onChange={(e) => u('monto', e.target.value)}
            />
          </Field>
          <Field label="N° de beneficiarios">
            <input
              type="number"
              min={1}
              max={10}
              className={inputCls}
              placeholder="2"
              value={d.benef || ''}
              onChange={(e) => u('benef', e.target.value)}
            />
          </Field>
        </div>
      )}
      {data.tipo === 'hogar' && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <p className="col-span-2 text-xs font-semibold uppercase tracking-wide text-text-soft">Datos del inmueble</p>
          <Field label="Tipo de inmueble">
            <select className={inputCls} value={d.inmueble || ''} onChange={(e) => u('inmueble', e.target.value)}>
              <option value="">Seleccionar</option>
              <option>Casa</option>
              <option>Departamento</option>
            </select>
          </Field>
          <Field label="Valor del inmueble (S/)">
            <input
              type="number"
              className={inputCls}
              placeholder="250000"
              value={d.valorInmueble || ''}
              onChange={(e) => u('valorInmueble', e.target.value)}
            />
          </Field>
        </div>
      )}
    </div>
  );
}

function StepCobertura({ data, set }) {
  const opts = COBERTURAS[data.tipo] || [];
  const u = (k, v) => set({ cobertura: { ...(data.cobertura || {}), [k]: v } });
  const cob = data.cobertura || {};
  const toggleExtra = (id) => {
    const curr = cob.extras || [];
    u('extras', curr.includes(id) ? curr.filter((x) => x !== id) : [...curr, id]);
  };
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-text-soft">Elige el nivel de cobertura que mejor se adapte a ti.</p>
      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft">Plan</span>
        {opts.map((o) => {
          const sel = cob.plan === o.id;
          return (
            <button
              key={o.id}
              onClick={() => u('plan', o.id)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${sel ? 'border-primary' : 'border-border'}`}
                >
                  {sel && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
                <div className="text-left">
                  <p className={`text-sm font-semibold ${sel ? 'text-primary' : 'text-text'}`}>{o.label}</p>
                  <p className="text-xs text-text-soft">{o.desc}</p>
                </div>
              </div>
              <span className={`text-base font-bold ${sel ? 'text-primary' : 'text-text'}`}>
                S/ {o.precio}
                <span className="text-xs font-normal text-text-soft">/mes</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft flex items-center">
          Deducible{' '}
          <Tooltip text="Monto que pagas tú antes de que el seguro cubra el siniestro. A mayor deducible, menor prima." />
        </span>
        <div className="grid grid-cols-2 gap-2">
          {DEDUCIBLE_OPTS.map((d) => {
            const sel = cob.deducible === d.val;
            return (
              <button
                key={d.val}
                onClick={() => u('deducible', d.val)}
                className={`p-3 rounded-xl border-2 text-left transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
              >
                <p className={`text-sm font-semibold ${sel ? 'text-primary' : 'text-text'}`}>{d.label}</p>
                {d.descuento > 0 && <p className="text-xs text-emerald-600">-{d.descuento}% en prima</p>}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft">Coberturas adicionales</span>
        {EXTRAS.map((e) => {
          const sel = (cob.extras || []).includes(e.id);
          return (
            <button
              key={e.id}
              onClick={() => toggleExtra(e.id)}
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${sel ? 'border-primary bg-primary/5' : 'border-border bg-bg hover:bg-bg-soft'}`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded flex items-center justify-center border ${sel ? 'bg-primary border-primary' : 'border-border'}`}
                >
                  {sel && <MdCheck size={12} className="text-white" />}
                </div>
                <span className={`text-sm ${sel ? 'text-primary font-medium' : 'text-text-soft'}`}>{e.label}</span>
              </div>
              <span className="text-xs font-semibold text-text-soft">+S/ {e.precio}/mes</span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-text-soft">Frecuencia de pago</span>
        <div className="flex gap-2">
          {[
            ['mensual', 'Mensual', 0],
            ['semestral', 'Semestral', 5],
            ['anual', 'Anual', 10],
          ].map(([v, l, desc]) => {
            const sel = (cob.periodo || 'mensual') === v;
            return (
              <button
                key={v}
                onClick={() => u('periodo', v)}
                className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${sel ? 'border-primary bg-primary/5 text-primary' : 'border-border text-text-soft hover:bg-bg-soft'}`}
              >
                {l}
                {desc > 0 && <span className="block text-xs text-emerald-600">-{desc}%</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StepCotizacion({ data, onRecalcular }) {
  const opts = COBERTURAS[data.tipo] || [];
  const cob = data.cobertura || {};
  const planObj = opts.find((o) => o.id === cob.plan) || opts[0];
  const dedObj = DEDUCIBLE_OPTS.find((d) => d.val === cob.deducible) || DEDUCIBLE_OPTS[0];
  const extras = (cob.extras || []).map((id) => EXTRAS.find((e) => e.id === id)).filter(Boolean);
  const extraTotal = extras.reduce((s, e) => s + e.precio, 0);
  const basePrecio = planObj?.precio || 0;
  const descDed = dedObj.descuento;
  const descPer = cob.periodo === 'anual' ? 10 : cob.periodo === 'semestral' ? 5 : 0;
  const subtotal = basePrecio + extraTotal;
  const descuento = Math.round((subtotal * (descDed + descPer)) / 100);
  const total = subtotal - descuento;
  const tipoLabel = TIPOS.find((t) => t.id === data.tipo)?.label || '';

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-text-soft">
        Aquí tienes tu cotización personalizada. Puedes ajustar parámetros y recalcular.
      </p>
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Seguro de {tipoLabel}</p>
            <p className="text-2xl font-bold text-text mt-0.5">
              S/ {total}
              <span className="text-sm font-normal text-text-soft">/mes</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <MdShield size={24} className="text-text-inverse" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5 pt-3 border-t border-primary/20 text-sm">
          <div className="flex justify-between text-text-soft">
            <span>Plan {planObj?.label}</span>
            <span className="font-medium text-text">S/ {basePrecio}</span>
          </div>
          {extras.map((e) => (
            <div key={e.id} className="flex justify-between text-text-soft">
              <span>{e.label}</span>
              <span className="font-medium text-text">+S/ {e.precio}</span>
            </div>
          ))}
          {descuento > 0 && (
            <div className="flex justify-between text-emerald-600">
              <span>Descuentos aplicados</span>
              <span className="font-medium">-S/ {descuento}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-text pt-1 border-t border-primary/20">
            <span>Total mensual</span>
            <span>S/ {total}</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-text-soft mb-2">Coberturas incluidas</p>
        <ul className="flex flex-col gap-1.5">
          {(planObj?.desc || '').split('+').map((c, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-soft">
              <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
              {c.trim()}
            </li>
          ))}
          {extras.map((e) => (
            <li key={e.id} className="flex items-start gap-2 text-sm text-text-soft">
              <MdCheck size={16} className="text-primary mt-0.5 shrink-0" />
              {e.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          ['Deducible', dedObj.label],
          ['Pago', cob.periodo === 'anual' ? 'Anual' : cob.periodo === 'semestral' ? 'Semestral' : 'Mensual'],
          ['Vigencia', '12 meses'],
          ['Inicio', 'Al contratar'],
        ].map(([k, v]) => (
          <div key={k} className="bg-bg-soft rounded-xl p-3 flex flex-col gap-0.5">
            <span className="text-text-soft">{k}</span>
            <span className="font-semibold text-text">{v}</span>
          </div>
        ))}
      </div>

      <button
        onClick={onRecalcular}
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border text-sm font-medium text-text-soft hover:bg-bg-soft hover:text-text transition-colors"
      >
        <MdRefresh size={16} /> Recalcular cotización
      </button>
    </div>
  );
}

function StepContratacion({ data }) {
  const [docs, setDocs] = useState({});
  const [confirmado, setConfirmado] = useState(false);
  const reqs =
    data.tipo === 'auto'
      ? [
          'DNI / Carnet de extranjería',
          'Tarjeta de propiedad del vehículo',
          'Fotos del vehículo (frente, posterior, laterales)',
        ]
      : data.tipo === 'salud'
        ? ['DNI / Carnet de extranjería', 'Declaración de salud firmada']
        : data.tipo === 'vida'
          ? ['DNI / Carnet de extranjería', 'Datos de beneficiarios']
          : ['DNI / Carnet de extranjería', 'Título de propiedad o contrato de alquiler'];

  return (
    <div className="flex flex-col gap-5">
      {!confirmado ? (
        <>
          <p className="text-sm text-text-soft">
            Casi listo. Sube los documentos requeridos para completar tu contratación.
          </p>
          <div className="flex flex-col gap-3">
            {reqs.map((r) => (
              <div
                key={r}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all ${docs[r] ? 'border-primary bg-primary/5' : 'border-border bg-bg'}`}
              >
                <div className="flex items-center gap-3">
                  {docs[r] ? (
                    <MdCheckCircle size={20} className="text-primary shrink-0" />
                  ) : (
                    <MdUploadFile size={20} className="text-text-soft shrink-0" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${docs[r] ? 'text-primary' : 'text-text'}`}>{r}</p>
                    {docs[r] && <p className="text-xs text-text-soft">{docs[r]}</p>}
                  </div>
                </div>
                <label className="cursor-pointer text-xs font-semibold text-primary hover:text-primary-hover transition-colors">
                  {docs[r] ? 'Cambiar' : 'Subir'}
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files[0]) setDocs((prev) => ({ ...prev, [r]: e.target.files[0].name }));
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          <div className="bg-bg-soft rounded-xl p-4 flex gap-3 text-sm text-text-soft border border-border">
            <MdInfo size={18} className="text-primary shrink-0 mt-0.5" />
            <p>Todos los documentos son tratados de forma confidencial y solo se usan para validar tu póliza.</p>
          </div>
          <button
            onClick={() => Object.keys(docs).length === reqs.length && setConfirmado(true)}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-colors ${Object.keys(docs).length === reqs.length ? 'bg-primary hover:bg-primary-hover text-text-inverse' : 'bg-bg-soft text-text-soft cursor-not-allowed border border-border'}`}
          >
            Confirmar contratación
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center text-center gap-4 py-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <MdCheckCircle size={36} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text mb-1">¡Cotización contratada!</h3>
            <p className="text-sm text-text-soft max-w-xs">
              Hemos recibido tu solicitud. En las próximas 24 horas recibirás tu póliza en el correo registrado.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors">
              Ver mis pólizas
            </button>
            <button className="w-full py-2.5 rounded-xl border border-border text-text-soft hover:bg-bg-soft text-sm transition-colors">
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────
export default function Cotizar() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    tipo: null,
    datos: {},
    cobertura: { periodo: 'mensual', deducible: 0, extras: [] },
  });
  const set = (patch) => setData((prev) => ({ ...prev, ...patch }));

  const canNext = () => {
    if (step === 0) return !!data.tipo;
    if (step === 1) return !!(data.datos?.nombre && data.datos?.edad);
    if (step === 2) return !!data.cobertura?.plan;
    return true;
  };

  const STEP_COMPONENTS = [
    <StepTipo data={data} set={set} />,
    <StepDatos data={data} set={set} />,
    <StepCobertura data={data} set={set} />,
    <StepCotizacion data={data} onRecalcular={() => setStep(2)} />,
    <StepContratacion data={data} />,
  ];

  return (
    <div className="min-h-screen bg-transparent flex flex-col px-8">
      {/* Header */}
      <div className="py-5">
        <p className="text-xl font-bold text-text">Cotizar</p>
        <p className="text-sm text-text-soft mt-0.5">Obtén tu precio personalizado en minutos.</p>
      </div>

      {/* Stepper */}
      <div className="bg-bg border border-border rounded-2xl px-6 py-4 mb-6">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i < step
                      ? 'bg-primary text-text-inverse'
                      : i === step
                        ? 'bg-primary text-text-inverse ring-4 ring-primary/20'
                        : 'bg-bg-soft border border-border text-text-soft'
                  }`}
                >
                  {i < step ? <MdCheck size={14} /> : i + 1}
                </div>
                <span
                  className={`text-xs hidden sm:block whitespace-nowrap ${i === step ? 'text-primary font-semibold' : 'text-text-soft'}`}
                >
                  {s}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full flex flex-col gap-6">
        <div className="bg-bg rounded-2xl border border-border p-6">{STEP_COMPONENTS[step]}</div>

        {/* Navegación */}
        {step < 4 && (
          <div className="flex items-center justify-between pb-8">
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-soft hover:bg-bg hover:text-text transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <MdArrowBack size={16} /> Anterior
            </button>
            <div className="flex items-center gap-2">
              {step === 3 && (
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-text-soft hover:bg-bg transition-colors">
                  <MdSave size={16} /> Guardar
                </button>
              )}
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === 3 ? 'Contratar' : 'Continuar'} <MdArrowForward size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
