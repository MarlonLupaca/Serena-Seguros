"use client";

import React, { useState } from 'react';
import { MdSupportAgent, MdSend, MdOutlineReportProblem, MdCheckCircle } from 'react-icons/md';
import { apiPost } from '@/lib/api';

export default function TicketFormEmpleado() {
  const [formData, setFormData] = useState({
    categoria: '',
    asunto: '',
    descripcion: '',
    justificacionNegocio: '',
    urgencia: '',
    impacto: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        categoria: formData.categoria,
        asunto: formData.asunto,
        descripcion: formData.descripcion,
        justificacion_negocio: formData.justificacionNegocio,
        urgencia: formData.urgencia,
        impacto: formData.impacto
      };

      const data = await apiPost('/soporte/tickets', payload);

      setSuccessMsg(data.message || 'Ticket de soporte creado correctamente.');
      setFormData({
        categoria: '',
        asunto: '',
        descripcion: '',
        justificacionNegocio: '',
        urgencia: '',
        impacto: ''
      });
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-bg rounded-2xl border border-border overflow-hidden shadow-sm">
      <div className="h-1 w-full bg-primary/20" />
      <div className="p-5 border-b border-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MdSupportAgent size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-text">Soporte Interno (TI)</p>
            <p className="text-xs text-text-soft mt-0.5">Mesa de ayuda para empleados</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        {successMsg && (
          <div className="mb-5 p-3 text-sm bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-medium flex items-center gap-2">
            <MdCheckCircle size={18} className="shrink-0" />
            {successMsg}
          </div>
        )}

        {errorMsg && (
          <div className="mb-5 p-3 text-sm bg-red-50 text-red-500 rounded-xl border border-red-100 font-medium flex items-center gap-2">
            <MdOutlineReportProblem size={18} className="shrink-0" />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="" disabled>Seleccione...</option>
                <option value="43">Servicio / Soporte (SOP)</option>
                <option value="42">Solicitud de Información (INF)</option>
                <option value="44">Gestión de Accesos (ACC)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Asunto
              </label>
              <input
                type="text"
                name="asunto"
                value={formData.asunto}
                onChange={handleChange}
                required
                placeholder="Ej. Acceso a BD Producción"
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">
              Descripción Detallada
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="3"
              placeholder="Detalle de la incidencia o solicitud..."
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors resize-none"
            ></textarea>
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5 flex items-center justify-between">
              <span>Justificación de Negocio</span>
              <span className="text-red-500 font-normal">Obligatorio *</span>
            </label>
            <textarea
              name="justificacionNegocio"
              value={formData.justificacionNegocio}
              onChange={handleChange}
              required
              rows="2"
              placeholder="Explica la necesidad de negocio para esta solicitud (Mínimo privilegio)"
              className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg-soft text-text focus:border-primary transition-colors resize-none"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Urgencia
              </label>
              <select
                name="urgencia"
                value={formData.urgencia}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="" disabled>Seleccione urgencia</option>
                <option value="10021">Alta</option>
                <option value="10022">Media</option>
                <option value="10023">Baja</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-text-soft block mb-1.5">
                Impacto
              </label>
              <select
                name="impacto"
                value={formData.impacto}
                onChange={handleChange}
                required
                className="w-full px-3 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors appearance-none"
              >
                <option value="" disabled>Seleccione impacto</option>
                <option value="10001">Alto</option>
                <option value="10002">Medio</option>
                <option value="10003">Bajo</option>
              </select>
            </div>
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? 'Procesando...' : <><MdSend size={16} /> Crear Ticket</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
