"use client";

import React, { useState } from 'react';
import { MdSupportAgent, MdSend, MdOutlineReportProblem, MdCheckCircle } from 'react-icons/md';
import { apiPost } from '@/lib/api';

export default function TicketFormAsegurado() {
  const [formData, setFormData] = useState({
    asunto: '',
    descripcion: '',
    categoria: '43', // 43 = Servicio/SOP
    urgencia: '10023', // 10023 = Baja
    impacto: '10003'  // 10003 = Bajo
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
      const data = await apiPost('/soporte/tickets', formData);

      setSuccessMsg(data.message || 'Su ticket ha sido enviado correctamente. Nos pondremos en contacto pronto.');
      setFormData({
        asunto: '',
        descripcion: '',
        categoria: '43',
        urgencia: '10023',
        impacto: '10003'
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
            <p className="text-sm font-bold text-text">Soporte y Ayuda</p>
            <p className="text-xs text-text-soft mt-0.5">Cuéntanos tu problema de forma breve</p>
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">
              ¿Cuál es el problema? (Asunto)
            </label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              required
              placeholder="Ej. Problema al pagar mi póliza..."
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-text-soft block mb-1.5">
              Describe lo que pasó (Detalle)
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Ej. Al momento de ingresar mi tarjeta, recibo un error..."
              className="w-full px-4 py-2.5 rounded-xl text-sm border border-border outline-none bg-bg text-text focus:border-primary transition-colors resize-none"
            ></textarea>
          </div>

          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-text-inverse text-sm font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                <>
                  <MdSend size={16} /> Enviar Reporte
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
