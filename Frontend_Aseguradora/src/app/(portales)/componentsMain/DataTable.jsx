import React from 'react';

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
