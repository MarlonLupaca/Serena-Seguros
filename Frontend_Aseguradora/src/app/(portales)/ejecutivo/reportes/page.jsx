'use client';

import { useEffect, useState } from 'react';
import { MdInsertChart, MdDescription, MdReportProblem, MdGroups, MdAccountBalance, MdFileDownload } from 'react-icons/md';
import { apiGet, apiDownloadFile } from '@/lib/api';

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
      alert(e.mensaje || 'No se pudo descargar');
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

      <Card titulo="Resumen general" icon={MdInsertChart}>
        <Row label="Polizas activas" valor={resumen?.polizas_activas ?? '-'} />
        <Row label="Siniestros pendientes" valor={resumen?.siniestros_pendientes ?? '-'} />
        <Row label="Clientes registrados" valor={resumen?.clientes_totales ?? '-'} />
        <Row label="Empleados activos" valor={resumen?.empleados_totales ?? '-'} />
        <Row label="Recaudacion del mes" valor={formatearMoneda(resumen?.recaudacion_mes)} />
        <Row label="Aprobaciones pendientes" valor={resumen?.aprobaciones_pendientes ?? '-'} />
      </Card>

      <Card titulo="Produccion" icon={MdDescription}>
        <Row label="Total de polizas" valor={produccion?.total_polizas ?? '-'} />
        <Row label="Polizas activas" valor={produccion?.activas ?? '-'} />
        <Row label="Prima activa total" valor={formatearMoneda(produccion?.prima_total_activa)} />
      </Card>

      <Card titulo="Comercial" icon={MdGroups}>
        <Row label="Leads totales" valor={comercial?.leads_total ?? '-'} />
        <Row label="Leads ganados" valor={comercial?.leads_ganados ?? '-'} />
        <Row label="Tasa de conversion" valor={`${comercial?.tasa_conversion ?? 0}%`} />
        <Row label="Comisiones pagadas" valor={formatearMoneda(comercial?.comisiones_pagadas)} />
        <Row label="Comisiones pendientes" valor={formatearMoneda(comercial?.comisiones_pendientes)} />
      </Card>

      <Card titulo="Siniestralidad" icon={MdReportProblem}>
        <Row label="Siniestros registrados" valor={siniestralidad?.total_siniestros ?? '-'} />
        <Row label="Indice de siniestralidad" valor={`${siniestralidad?.indice_siniestralidad ?? 0}%`} />
        <Row label="Monto reclamado" valor={formatearMoneda(siniestralidad?.monto_reclamado)} />
        <Row label="Monto liquidado" valor={formatearMoneda(siniestralidad?.monto_liquidado)} />
      </Card>

      <Card titulo="Notas" icon={MdAccountBalance}>
        <p className="text-xs text-text-soft leading-relaxed">
          Los informes consumen los endpoints <code>/api/v1/ejecutivo/*</code> y se calculan en tiempo real
          al cargar la vista. Los botones de export descargan un CSV con los indicadores actuales.
        </p>
      </Card>
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

function Row({ label, valor }) {
  return (
    <div className="py-1.5 flex justify-between items-center">
      <p className="text-xs text-text-soft">{label}</p>
      <p className="text-sm font-bold text-text">{valor}</p>
    </div>
  );
}
