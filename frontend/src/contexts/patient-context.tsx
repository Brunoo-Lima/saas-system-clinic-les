import type { IPatient } from '@/@types/IPatient';
import { usePagination } from '@/hooks/use-pagination';
import { useGetAllPatients } from '@/services/patient-service';
import { createContext, useState, useMemo, type ChangeEvent } from 'react';

interface IPatientContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedGender: string | null;
  setSelectedGender: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedData: IPatient[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: number) => void;
}

export const PatientContext = createContext<IPatientContextProps | undefined>(
  undefined,
);

export const PatientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const itemsPerPage = 10;

  const { data: patients = [] } = useGetAllPatients({
    limit: itemsPerPage,
    offset: 0,
  });

  const filtered = useMemo(() => {
    let data = patients;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (patient) =>
          patient.name.toLowerCase().includes(term) ||
          patient.cpf.includes(searchTerm) ||
          patient.phone.includes(searchTerm) ||
          patient.user?.email?.toLowerCase().includes(term),
      );
    }

    if (selectedGender) {
      data = data.filter((patient) => patient.sex === selectedGender);
    }

    return data;
  }, [selectedGender, searchTerm, patients]);

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
    // Implementar lógica de delete se necessário
    console.log('Delete patient:', id);
  };

  const contextValue = {
    searchTerm,
    setSearchTerm,
    handleSearch,
    selectedGender,
    setSelectedGender,
    paginatedData,
    page,
    setPage,
    totalPages,
    handlePage,
    handleDelete,
  };

  return (
    <PatientContext.Provider value={contextValue}>
      {children}
    </PatientContext.Provider>
  );
};
