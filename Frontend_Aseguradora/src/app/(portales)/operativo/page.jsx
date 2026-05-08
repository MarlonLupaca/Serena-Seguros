'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MdBadge,
  MdAccountBalanceWallet,
  MdCalculate,
  MdPriceCheck,
  MdDomain,
  MdAttachMoney,
  MdChevronRight,
  MdWarning,
} from 'react-icons/md';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/lib/AuthContext';

function formatearMoneda(v) {
  if (v == null) return 'S/ 0';
  return `S/ ${Number(v).toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function OperativoDashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [tesoreria, setTesoreria] = useState(null);
  const [cobranza, setCobranza] = useState(null);
  const [presupuestos, setPresupuestos] = useState([]);
  const [activos, setActivos] = useState([]);
  const [comisiones, setComisiones] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet('/empleados').catch(() => []),
      apiGet('/tesoreria/resumen').catch(() => null),
      apiGet('/cobranza/resumen').catch(() => null),
      apiGet('/presupuestos').catch(() => []),
      apiGet('/activos').catch(() => []),
      apiGet('/comisiones').catch(() => []),
    ]).then(([e, t, c, p, a, com]) => {
      setEmpleados(e || []);
      setTesoreria(t);
      setCobranza(c);
      setPresupuestos(p || []);
      setActivos(a || []);
      setComisiones(com || []);
      setCargando(false);
    });
  }, []);

  const sobreconsumo = presupuestos.filter((p) => p.porcentaje_uso >= 90);
  const comisionesPendientes = comisiones.filter((c) => c.estado_pago === 'PENDIENTE');
  const totalComisionesPendientes = comisionesPendientes.reduce((acc, c) => acc + Number(c.monto_generado || 0), 0);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <p className="text-xs text-text-soft">Hola</p>
        <p className="text-xl font-bold text-text">{user ? `${user.nombres} ${user.apellidos}` : 'Operativo'}</p>
      </div>

      {cargando ? (
        <div className="bg-bg rounded-2xl border border-border p-12 text-center text-sm text-text-soft">Cargando...</div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Kpi label="Empleados" val={empleados.length} icon={MdBadge} bg="bg-primary/10" color="text-primary" onClick={() => router.push('/operativo/empleados')} />
            <Kpi label="Activos internos" val={activos.length} icon={MdDomain} bg="bg-emerald-100" color="text-emerald-600" onClick={() => router.push('/operativo/activos')} />
            <Kpi label="Balance caja" val={formatearMoneda(tesoreria?.balance)} icon={MdAccountBalanceWallet} bg={Number(tesoreria?.balance ?? 0) >= 0 ? 'bg-emerald-100' : 'bg-rose-100'} color={Number(tesoreria?.balance ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'} onClick={() => router.push('/operativo/tesoreria')} />
            <Kpi label="Por cobrar" val={formatearMoneda(cobranza?.por_cobrar)} icon={MdPriceCheck} bg="bg-amber-100" color="text-amber-600" onClick={() => router.push('/operativo/cobranza')} />
          </div>

          {sobreconsumo.length > 0 && (
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
              <MdWarning size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold text-amber-700">{sobreconsumo.length} área(s) por encima del 90% de su presupuesto</p>
                <p className="text-xs text-amber-700">{sobreconsumo.map((p) => `${p.area} (${p.porcentaje_uso}%)`).join(', ')}</p>
              </div>
              <button onClick={() => router.push('/operativo/presupuesto')} className="text-xs font-semibold text-amber-700 hover:underline shrink-0">Ver detalle</button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card title="Presupuesto por área" subtitle={`${presupuestos.length} áreas configuradas`} icon={MdCalculate} onClick={() => router.push('/operativo/presupuesto')}>
              {presupuestos.slice(0, 4).map((p) => (
                <div key={p.id_presupuesto} className="border-t border-border pt-2 first:border-0 first:pt-0">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-text">{p.area}</span>
                    <span className="text-text-soft">{p.porcentaje_uso}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-soft rounded-full mt-1 overflow-hidden">
                    <div className={`h-full rounded-full ${p.porcentaje_uso >= 100 ? 'bg-rose-500' : p.porcentaje_uso >= 80 ? 'bg-amber-500' : 'bg-primary'}`} style={{ width: `${Math.min(100, p.porcentaje_uso)}%` }} />
                  </div>
                </div>
              ))}
            </Card>

            <Card title="Comisiones pendientes" subtitle={`${comisionesPendientes.length} por pagar`} icon={MdAttachMoney} onClick={() => router.push('/operativo/comisiones')}>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-amber-600">{formatearMoneda(totalComisionesPendientes)}</p>
                <p className="text-xs text-text-soft mt-1">Total a pagar a agentes</p>
              </div>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function Kpi({ label, val, icon: Icon, bg, color, onClick }) {
  return (
    <div onClick={onClick} className="bg-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${bg}`}><Icon size={17} className={color} /></div>
      <div><p className={`text-xl font-bold leading-tight ${color}`}>{val}</p><p className="text-xs text-text-soft">{label}</p></div>
    </div>
  );
}

function Card({ title, subtitle, icon: Icon, onClick, children }) {
  return (
    <div className="bg-bg rounded-2xl border border-border p-5 cursor-pointer hover:shadow-md transition-shadow flex flex-col gap-3" onClick={onClick}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon size={20} className="text-primary" /></div>
        <div className="flex-1">
          <p className="text-sm font-bold text-text">{title}</p>
          <p className="text-xs text-text-soft">{subtitle}</p>
        </div>
        <MdChevronRight size={16} className="text-text-soft" />
      </div>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
