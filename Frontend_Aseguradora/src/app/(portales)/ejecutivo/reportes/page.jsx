'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MdInsertChart, MdDescription, MdReportProblem, MdGroups, MdFileDownload } from 'react-icons/md';
import { apiGet, apiDownloadFile } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_COLORS = ['#21c2b7', '#00b5e2', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981', '#ec4899', '#6366f1'];

function formatearMoneda(v) {
  return `S/ ${Number(v || 0).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function InformesPage() {
  const [resumen, setResumen] = useState(null);
  const [produccion, setProduccion] = useState(null);
  const [comercial, setComercial] = useState(null);
  const [siniestralidad, setSiniestralidad] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      apiGet('/ejecutivo/resumen').catch(() => null),
      apiGet('/ejecutivo/produccion').catch(() => null),
      apiGet('/ejecutivo/comercial').catch(() => null),
      apiGet('/ejecutivo/siniestralidad').catch(() => null),
    ]).then(([r, p, c, s]) => {
      setResumen(r);
      setProduccion(p);
      setComercial(c);
      setSiniestralidad(s);
      setCargando(false);
    }).catch((e) => {
      setError(e.mensaje || 'Error al cargar');
      setCargando(false);
    });
  }, []);

  if (cargando) return <div className="p-6 text-sm text-text-soft">Generando informes...</div>;
  if (error) return <div className="p-6 text-sm text-rose-600">{error}</div>;

  const descargar = async (tipo) => {
    try {
      await apiDownloadFile(`/ejecutivo/reportes/${tipo}/exportar`, `reporte-${tipo}.csv`);
    } catch (e) {
      toast.error(e.mensaje || 'No se pudo descargar');
    }
  };

  return (
    <div className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xl font-bold text-text">Informes ejecutivos</p>
          <p className="text-xs text-text-soft">Resumen consolidado de los principales indicadores del negocio.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <BotonExport label="Mensual" tipo="resumen" onClick={descargar} />
          <BotonExport label="Producción" tipo="produccion" onClick={descargar} />
          <BotonExport label="Comercial" tipo="comercial" onClick={descargar} />
          <BotonExport label="Siniestros" tipo="siniestralidad" onClick={descargar} />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Pólizas activas" valor={resumen?.polizas_activas ?? 0} color="text-primary" />
        <KpiCard label="Siniestros pendientes" valor={resumen?.siniestros_pendientes ?? 0} color="text-warning-text" />
        <KpiCard label="Clientes" valor={resumen?.clientes_totales ?? 0} color="text-info-text" />
        <KpiCard label="Recaudación mes" valor={formatearMoneda(resumen?.recaudacion_mes)} color="text-success-text" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card titulo="Producción por tipo" icon={MdDescription}>
          {produccion?.por_tipo && produccion.por_tipo.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={produccion.por_tipo} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <XAxis dataKey="tipo" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [v, 'Pólizas']} contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                  <Bar dataKey="cantidad" radius={[6, 6, 0, 0]}>
                    {(produccion.por_tipo || []).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              <Row label="Total de pólizas" valor={produccion?.total_polizas ?? '-'} />
              <Row label="Pólizas activas" valor={produccion?.activas ?? '-'} />
              <Row label="Prima activa total" valor={formatearMoneda(produccion?.prima_total_activa)} />
            </div>
          )}
        </Card>

        <Card titulo="Siniestralidad" icon={MdReportProblem}>
          {siniestralidad?.por_tipo && siniestralidad.por_tipo.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={siniestralidad.por_tipo} dataKey="cantidad" nameKey="tipo" cx="50%" cy="50%" outerRadius={90} label={({ tipo, percent }) => `${tipo} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                    {(siniestralidad.por_tipo || []).map((_, i) => (
                      <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Tooltip formatter={(v) => [v, 'Siniestros']} contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              <Row label="Total siniestros" valor={siniestralidad?.total_siniestros ?? '-'} />
              <Row label="Índice siniestralidad" valor={`${siniestralidad?.indice_siniestralidad ?? 0}%`} />
              <Row label="Monto reclamado" valor={formatearMoneda(siniestralidad?.monto_reclamado)} />
              <Row label="Monto liquidado" valor={formatearMoneda(siniestralidad?.monto_liquidado)} />
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card titulo="Comercial" icon={MdGroups}>
          {comercial ? (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-2">
                <MiniKpi label="Leads" valor={comercial.leads_total ?? 0} />
                <MiniKpi label="Ganados" valor={comercial.leads_ganados ?? 0} />
                <MiniKpi label="Conversión" valor={`${comercial.tasa_conversion ?? 0}%`} />
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[
                    { nombre: 'Comisiones pagadas', monto: Number(comercial.comisiones_pagadas || 0) },
                    { nombre: 'Comisiones pendientes', monto: Number(comercial.comisiones_pendientes || 0) },
                  ]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [formatearMoneda(v), 'Monto']} contentStyle={{ fontSize: 12, borderRadius: 12 }} />
                    <Bar dataKey="monto" radius={[6, 6, 0, 0]}>
                      <Cell fill="#10b981" />
                      <Cell fill="#f59e0b" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-soft">Sin datos comerciales</p>
          )}
        </Card>

        <Card titulo="Resumen general" icon={MdInsertChart}>
          <div className="flex flex-col divide-y divide-border">
            <Row label="Pólizas activas" valor={resumen?.polizas_activas ?? '-'} />
            <Row label="Siniestros pendientes" valor={resumen?.siniestros_pendientes ?? '-'} />
            <Row label="Clientes registrados" valor={resumen?.clientes_totales ?? '-'} />
            <Row label="Empleados activos" valor={resumen?.empleados_totales ?? '-'} />
            <Row label="Recaudación del mes" valor={formatearMoneda(resumen?.recaudacion_mes)} />
            <Row label="Aprobaciones pendientes" valor={resumen?.aprobaciones_pendientes ?? '-'} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function BotonExport({ label, tipo, onClick }) {
  return (
    <button
      onClick={() => onClick(tipo)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border hover:bg-bg-soft text-xs font-semibold text-text-soft transition-colors"
    >
      <MdFileDownload size={13} /> {label}
    </button>
  );
}

function Card({ titulo, icon: Icon, children }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Icon size={18} className="text-primary" />
        <p className="text-sm font-bold text-text">{titulo}</p>
      </div>
      <div className="flex flex-col divide-y divide-border">{children}</div>
    </div>
  );
}

function KpiCard({ label, valor, color }) {
  return (
    <div className="bg-bg rounded-xl border border-border px-4 py-3">
      <p className={`text-xl font-bold ${color}`}>{valor}</p>
      <p className="text-xs text-text-soft">{label}</p>
    </div>
  );
}

function MiniKpi({ label, valor }) {
  return (
    <div className="bg-bg-soft rounded-xl p-2.5 text-center">
      <p className="text-base font-bold text-text">{valor}</p>
      <p className="text-xs text-text-soft">{label}</p>
    </div>
  );
}

function Row({ label, valor }) {
  return (
    <div className="py-1.5 flex justify-between items-center">
      <p className="text-xs text-text-soft">{label}</p>
      <p className="text-sm font-bold text-text">{valor}</p>
    </div>
  );
}
