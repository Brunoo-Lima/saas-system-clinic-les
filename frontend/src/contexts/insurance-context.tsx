/* eslint-disable react-hooks/exhaustive-deps */
import type { IInsurance } from '@/@types/IInsurance';
import { usePagination } from '@/hooks/use-pagination';
import { insurancesList } from '@/mocks/insurances-list';
import { createContext, useMemo, useState, type ChangeEvent } from 'react';

interface IInsurancesContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedSpecialty: string | null;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedData: IInsurance[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: number) => void;
}

export const InsurancesContext = createContext<
  IInsurancesContextProps | undefined
>(undefined);

export const InsuranceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );
  const [filteredList, setFilteredList] =
    useState<IInsurance[]>(insurancesList);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    let data = filteredList;

    if (searchTerm) {
      data = data.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedSpecialty) {
      data = data.filter((patient) =>
        patient.specialties.filter((s) => s.name === selectedSpecialty),
      );
    }

    return data;
  }, [selectedSpecialty, searchTerm]);

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

  const handleDelete = (id: number) => {
    setFilteredList((prev) => prev.filter((p) => p.id !== id));
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
    <InsurancesContext.Provider value={contextValue}>
      {children}
    </InsurancesContext.Provider>
  );
};
