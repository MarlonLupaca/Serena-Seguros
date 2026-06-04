import { useState, useMemo, useEffect } from 'react';

export function usePagination(data = [], defaultRowsPerPage = 10) {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);

  // Si la data cambia drásticamente (ej. por un filtro de búsqueda)
  // aseguramos que no nos quedemos en una página vacía.
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));
    if (page > totalPages) {
      setPage(1);
    }
  }, [data.length, page, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return data.slice(start, end);
  }, [data, page, rowsPerPage]);

  const totalPages = Math.max(1, Math.ceil(data.length / rowsPerPage));

  return {
    paginatedData,
    page,
    totalPages,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    totalItems: data.length,
  };
}
