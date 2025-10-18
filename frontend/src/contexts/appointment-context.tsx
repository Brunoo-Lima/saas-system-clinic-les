import type { IAppointment } from '@/@types/IAppointment';
import { usePagination } from '@/hooks/use-pagination';
import { useGetAppointments } from '@/services/appointment-service';
import { createContext, useState, type ChangeEvent } from 'react';

interface IAppointmentContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedGender: string | null;
  setSelectedGender: React.Dispatch<React.SetStateAction<string | null>>;
  selectedSpecialty: string | null;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedData: IAppointment[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: number) => void;
}

export const AppointmentContext = createContext<
  IAppointmentContextProps | undefined
>(undefined);

export const AppointmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null,
  );
  const itemsPerPage = 6;

  const { data: filtered = [] } = useGetAppointments();

  // const filtered = useMemo(() => {
  //   let data = filteredList;

  //   if (searchTerm) {
  //     data = data.filter((Appointment) =>
  //       Appointment.name.toLowerCase().includes(searchTerm.toLowerCase()),
  //     );
  //   }

  //   if (selectedGender) {
  //     data = data.filter((Appointment) => Appointment.sex === selectedGender);
  //   }

  //   if (selectedSpecialty) {
  //     data = data.filter((Appointment) =>
  //       Appointment.specialties.some(
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
    <AppointmentContext.Provider value={contextValue}>
      {children}
    </AppointmentContext.Provider>
  );
};
