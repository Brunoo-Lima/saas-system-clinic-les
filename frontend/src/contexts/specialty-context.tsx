import type { ISpecialty } from '@/@types/ISpecialty';
import { usePagination } from '@/hooks/use-pagination';
import { useGetClinic } from '@/services/clinic-service';
import { useGetSpecialties } from '@/services/specialty-service';
import { createContext, useState, useMemo, type ChangeEvent } from 'react';

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
  handleDelete: (id: string) => void;
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

  const { data: clinic } = useGetClinic();

  const { data: specialties = [] } = useGetSpecialties({
    clinicId: clinic?.id || '',
    limit: itemsPerPage,
    offset: 0,
  });

  const filtered = useMemo(() => {
    let data = specialties;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter((specialty) =>
        specialty.name.toLowerCase().includes(term),
      );
    }

    if (selectedSpecialty) {
      data = data.filter(
        (specialty) =>
          specialty.name.toLowerCase() === selectedSpecialty.toLowerCase(),
      );
    }

    return data;
  }, [selectedSpecialty, searchTerm, specialties]);

  const { totalPages, page, setPage, paginatedData } = usePagination(
    filtered,
    itemsPerPage,
  );

  const handlePage = (page: number) => {
    setPage(page);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleDelete = (id: string) => {
    // Implementar lógica de delete se necessário
    console.log('Delete specialty:', id);
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
