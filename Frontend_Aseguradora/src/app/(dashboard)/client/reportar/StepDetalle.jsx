import { MdCalendarToday, MdAccessTime, MdLocationOn, MdNotes, MdPeople } from 'react-icons/md';

export default function StepDetalle({ form, onChange, errors }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-text mb-1">Cuéntanos qué pasó</p>
        <p className="text-xs text-text-soft">Completa los datos del evento para agilizar tu caso.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
            <MdCalendarToday size={13} /> Fecha del evento *
          </label>
          <input
            type="date"
            max={new Date().toISOString().slice(0, 10)}
            value={form.fecha}
            onChange={(e) => onChange('fecha', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors ${errors.fecha ? 'border-rose-400' : 'border-border focus:border-primary'}`}
          />
          {errors.fecha && <p className="text-xs text-rose-500 mt-1">{errors.fecha}</p>}
        </div>
        <div>
          <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
            <MdAccessTime size={13} /> Hora aproximada *
          </label>
          <input
            type="time"
            value={form.hora}
            onChange={(e) => onChange('hora', e.target.value)}
            className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors ${errors.hora ? 'border-rose-400' : 'border-border focus:border-primary'}`}
          />
          {errors.hora && <p className="text-xs text-rose-500 mt-1">{errors.hora}</p>}
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
          <MdLocationOn size={13} /> Lugar del incidente *
        </label>
        <input
          type="text"
          value={form.lugar}
          onChange={(e) => onChange('lugar', e.target.value)}
          placeholder="Ej. Av. Javier Prado 1280, Miraflores"
          className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors ${errors.lugar ? 'border-rose-400' : 'border-border focus:border-primary'}`}
        />
        {errors.lugar && <p className="text-xs text-rose-500 mt-1">{errors.lugar}</p>}
        <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
          <MdLocationOn size={13} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary">
            Ingresa la dirección lo más precisa posible: calle, número, distrito y ciudad.
          </p>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
          <MdNotes size={13} /> Descripción de lo ocurrido *
          <span className="text-text-soft/60 font-normal">(mín. 30 caracteres)</span>
        </label>
        <textarea
          value={form.desc}
          onChange={(e) => onChange('desc', e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Describe brevemente cómo ocurrió el siniestro, qué bienes fueron afectados y si hubo lesionados…"
          className={`w-full px-3 py-2 rounded-xl text-sm border outline-none bg-bg text-text transition-colors resize-none ${errors.desc ? 'border-rose-400' : 'border-border focus:border-primary'}`}
        />
        <div className="flex items-center justify-between mt-1">
          {errors.desc ? <p className="text-xs text-rose-500">{errors.desc}</p> : <span />}
          <p className={`text-xs ml-auto ${form.desc.length > 450 ? 'text-amber-600' : 'text-text-soft'}`}>
            {form.desc.length}/500
          </p>
        </div>
      </div>
      <div>
        <label className="flex items-center gap-1.5 text-xs text-text-soft mb-1.5">
          <MdPeople size={13} /> Personas involucradas
          <span className="text-text-soft/60 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={form.personas}
          onChange={(e) => onChange('personas', e.target.value)}
          placeholder="Nombres, relación o número de personas"
          className="w-full px-3 py-2 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
        />
        <div className="flex items-start gap-1.5 mt-2 p-2.5 rounded-xl bg-primary/5 border border-primary/15">
          <MdPeople size={13} className="text-primary mt-0.5 shrink-0" />
          <p className="text-xs text-primary">
            Si hay terceros involucrados, incluye sus datos básicos para facilitar el proceso.
          </p>
        </div>
      </div>
    </div>
  );
}
