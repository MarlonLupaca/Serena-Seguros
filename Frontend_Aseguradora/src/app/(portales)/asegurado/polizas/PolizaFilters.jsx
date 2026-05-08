import { MdSearch, MdFilterList } from 'react-icons/md';

export default function PolizaFilters({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  filtroTipo,
  setFiltroTipo,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <MdSearch size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
        <input
          placeholder="Buscar por número o nombre del seguro..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none bg-bg text-text border border-border focus:border-primary transition-colors"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <div className="relative">
          <MdFilterList size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-soft" />
          <select
            className="pl-8 pr-3 py-2.5 rounded-xl text-sm outline-none bg-bg text-text border border-border focus:border-primary transition-colors appearance-none"
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option value="todos">Todos los estados</option>
            <option value="ACTIVA">Activa</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="VENCIDA">Vencida</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
        <select
          className="px-3 py-2.5 rounded-xl text-sm outline-none bg-bg text-text border border-border focus:border-primary transition-colors appearance-none"
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
        >
          <option value="todos">Todos los tipos</option>
          <option value="VEHICULAR">Vehicular</option>
          <option value="SALUD">Salud</option>
          <option value="VIDA">Vida</option>
          <option value="HOGAR">Hogar</option>
          <option value="VIAJE">Viaje</option>
          <option value="EMPRESA">Empresa</option>
        </select>
      </div>
    </div>
  );
}
