import { Field, inputCls } from './FormHelpers';
import { MdPerson, MdCalendarToday, MdLocationOn } from 'react-icons/md';

export default function StepDatos({ data, set }) {
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
