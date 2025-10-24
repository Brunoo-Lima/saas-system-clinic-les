import type { IDoctor } from '@/@types/IDoctor';
import { usePagination } from '@/hooks/use-pagination';
import { useGetDoctors } from '@/services/doctor-service';
import { createContext, useState, useMemo, type ChangeEvent } from 'react';

interface IDoctorContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedGender: string | null;
  setSelectedGender: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSpecialty: string | null;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedData: IDoctor[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: string) => void;
}

export const DoctorContext = createContext<IDoctorContextProps | undefined>(
  undefined,
);

export const DoctorProvider = ({ children }: { children: React.ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );
  const itemsPerPage = 6;

  const { data: doctors = [] } = useGetDoctors();

  const filtered = useMemo(() => {
    let data = doctors;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (doctor: IDoctor) =>
          doctor.name.toLowerCase().includes(term) ||
          doctor.crm.toLowerCase().includes(term) ||
          doctor.user?.email?.toLowerCase().includes(term) ||
          doctor.cpf?.includes(searchTerm),
      );
    }

    if (selectedGender) {
      data = data.filter((doctor: IDoctor) => doctor.sex === selectedGender);
    }

    if (selectedSpecialty) {
      data = data.filter((doctor: IDoctor) =>
        doctor.specialties.some(
          (specialty) =>
            specialty.name.toLowerCase() === selectedSpecialty.toLowerCase(),
        ),
      );
    }

    return data;
  }, [selectedGender, selectedSpecialty, searchTerm, doctors]);

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
    console.log('Delete doctor:', id);
  };

  const contextValue = {
    searchTerm,
    setSearchTerm,
    handleSearch,
    selectedGender,
    setSelectedGender,
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
    <DoctorContext.Provider value={contextValue}>
      {children}
    </DoctorContext.Provider>
  );
};
