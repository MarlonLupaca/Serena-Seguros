import React from 'react';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { usePagination } from '@/hooks/usePagination';

export function Table({ children, className = '' }) {
  return (
    <div className={`bg-bg rounded-2xl border border-border overflow-hidden shadow-sm ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead>
      <tr className={`bg-bg-soft border-b border-border ${className}`}>
        {children}
      </tr>
    </thead>
  );
}

export function TableHead({ children, className = '', align = 'left' }) {
  const alignmentClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <th className={`px-5 py-3 text-xs font-semibold text-text-soft uppercase tracking-wider ${alignmentClass} ${className}`}>
      {children}
    </th>
  );
}

export function TableBody({ children, className = '' }) {
  return (
    <tbody className={`divide-y divide-border/50 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '', onClick }) {
  return (
    <tr 
      onClick={onClick}
      className={`hover:bg-bg-soft/50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

export function TableCell({ children, className = '', align = 'left' }) {
  const alignmentClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return (
    <td className={`px-5 py-3 align-middle ${alignmentClass} ${className}`}>
      {children}
    </td>
  );
}

export function TablePagination({
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  totalItems,
  options = [5, 10, 25, 50],
}) {
  const start = (page - 1) * rowsPerPage + 1;
  const end = Math.min(page * rowsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-bg-soft/40 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-text-soft uppercase tracking-wider hidden sm:block">Mostrar</span>
        <div className="relative">
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="appearance-none bg-bg border border-border text-xs font-bold rounded-xl pl-3 pr-8 py-1.5 outline-none text-text cursor-pointer hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-soft">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
        <span className="text-[10px] font-bold text-text-soft uppercase tracking-wider hidden sm:block">Filas</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xs text-text-soft font-medium">
          {totalItems === 0 ? '0 de 0' : (
            <>
              <span className="text-text font-bold">{start}-{end}</span> de <span className="text-text font-bold">{totalItems}</span>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 bg-bg border border-border rounded-xl p-1 shadow-sm">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1 rounded-lg text-text-soft hover:bg-bg-soft hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <MdChevronLeft size={20} />
          </button>
          <div className="w-[1px] h-4 bg-border/80 mx-0.5"></div>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1 rounded-lg text-text-soft hover:bg-bg-soft hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <MdChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function DataTable({
  data = [],
  columns = [],
  renderRow,
  defaultRowsPerPage = 10,
  className = '',
}) {
  const { paginatedData, page, totalPages, rowsPerPage, setPage, setRowsPerPage, totalItems } = usePagination(data, defaultRowsPerPage);

  return (
    <>
      <Table className={className}>
        <TableHeader>
          {columns.map((col, i) => (
            <TableHead key={i} align={col.align || 'left'}>
              {col.label}
            </TableHead>
          ))}
        </TableHeader>
        <TableBody>
          {paginatedData.map((item, index) => (
            <React.Fragment key={index}>
              {renderRow(item, index)}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
      
      {data.length > 0 && (
        <TablePagination
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onRowsPerPageChange={setRowsPerPage}
          totalItems={totalItems}
        />
      )}
    </>
  );
}
