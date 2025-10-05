import { useState } from 'react';

export const usePagination = (data: any[], itemsPerPage: number) => {
  const [page, setPage] = useState<number>(1);

  const totalPages =
    data.length === 0 ? 1 : Math.ceil(data.length / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedData = data.slice(startIndex, endIndex);

  return { page, totalPages, paginatedData, setPage };
};
