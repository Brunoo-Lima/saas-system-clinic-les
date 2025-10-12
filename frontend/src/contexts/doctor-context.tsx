import type { IDoctor } from '@/@types/IDoctor';
import { usePagination } from '@/hooks/use-pagination';
import { useGetDoctors } from '@/services/doctor-service';
import { createContext, useState, type ChangeEvent } from 'react';

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
  handleDelete: (id: number) => void;
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

  const { data: filtered = [] } = useGetDoctors();

  // const filtered = useMemo(() => {
  //   let data = filteredList;

  //   if (searchTerm) {
  //     data = data.filter((doctor) =>
  //       doctor.name.toLowerCase().includes(searchTerm.toLowerCase()),
  //     );
  //   }

  //   if (selectedGender) {
  //     data = data.filter((doctor) => doctor.sex === selectedGender);
  //   }

  //   if (selectedSpecialty) {
  //     data = data.filter((doctor) =>
  //       doctor.specialties.some(
  //         (s) => s.specialty.toLowerCase() === selectedSpecialty.toLowerCase(),
  //       ),
  //     );
  //   }

  //   return data;
  // }, [selectedGender, selectedSpecialty, searchTerm, filteredList]);

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

  const handleDelete = (_id: number) => {
    // setFilteredList((prev) => prev.filter((p) => p.id !== id));
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
