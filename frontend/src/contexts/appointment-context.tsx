import { usePagination } from '@/hooks/use-pagination';
import {
  useGetAppointments,
  type IAppointmentReturn,
} from '@/services/appointment-service';
import { createContext, useState, useMemo, type ChangeEvent } from 'react';

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
  paginatedData: IAppointmentReturn[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: string) => void;
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

  const { data: appointments = [] } = useGetAppointments();

  const filtered = useMemo(() => {
    let data = appointments;

    // Filtro por busca (paciente ou médico)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (appointment) =>
          appointment.patient.name.toLowerCase().includes(term) ||
          appointment.doctor.name.toLowerCase().includes(term) ||
          appointment.patient.email.toLowerCase().includes(term) ||
          appointment.patient.phone.includes(searchTerm) ||
          appointment.patient.cpf.includes(searchTerm),
      );
    }

    // Filtro por gênero do paciente
    if (selectedGender) {
      data = data.filter(
        (appointment) => appointment.patient.sex === selectedGender,
      );
    }

    // Filtro por especialidade
    if (selectedSpecialty) {
      data = data.filter(
        (appointment) =>
          appointment.specialties?.name.toLowerCase() ===
          selectedSpecialty.toLowerCase(),
      );
    }

    return data;
  }, [selectedGender, selectedSpecialty, searchTerm, appointments]);

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
    console.log('Delete appointment:', id);
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
