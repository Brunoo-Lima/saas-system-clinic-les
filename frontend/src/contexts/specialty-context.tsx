import type { ISpecialty } from '@/@types/ISpecialty';
import { usePagination } from '@/hooks/use-pagination';
import { specialtyList } from '@/mocks/specialty-list';
import { useGetSpecialties } from '@/services/specialty-service';
import { createContext, useMemo, useState, type ChangeEvent } from 'react';

interface ISpecialtyContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedSpecialty: string | null;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedData: ISpecialty[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: number) => void;
}

export const SpecialtyContext = createContext<
  ISpecialtyContextProps | undefined
>(undefined);

export const SpecialtyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );
  const itemsPerPage = 10;

  const { data: filteredList = [] } = useGetSpecialties({
    limit: itemsPerPage,
    offset: 0,
  });

  const { totalPages, page, setPage, paginatedData } = usePagination(
    filteredList,
    itemsPerPage,
  );

  const handlePage = (page: number) => {
    setPage(page);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDelete = (id: number) => {
    // setFilteredList((prev) => prev.filter((p) => p.id !== id));
  };

  const contextValue = {
    searchTerm,
    setSearchTerm,
    handleSearch,
    selectedSpecialty,
    setSelectedSpecialty,
    paginatedData,
    page,
    setPage,
    totalPages,
    handlePage,
    handleDelete,
  };

  return (
    <SpecialtyContext.Provider value={contextValue}>
      {children}
    </SpecialtyContext.Provider>
  );
};
