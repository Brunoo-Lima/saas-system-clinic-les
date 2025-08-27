import type { IAgreement } from "@/@types/IAgreement";
import { usePagination } from "@/hooks/use-pagination";
import { agreementsList } from "@/mocks/agreements-list";
import { createContext, useMemo, useState, type ChangeEvent } from "react";

interface IAgreementsContextProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedSpecialty: string | null;
  setSelectedSpecialty: React.Dispatch<React.SetStateAction<string | null>>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  paginatedData: IAgreement[];
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  handlePage: (page: number) => void;
  handleDelete: (id: number) => void;
}

export const AgreementsContext = createContext<
  IAgreementsContextProps | undefined
>(undefined);

export const AgreementsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(
    null
  );
  const [filteredList, setFilteredList] =
    useState<IAgreement[]>(agreementsList);
  const itemsPerPage = 10;

  const filtered = useMemo(() => {
    let data = filteredList;

    if (searchTerm) {
      data = data.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedSpecialty) {
      data = data.filter((patient) =>
        patient.specialties.filter((s) => s.slug === selectedSpecialty)
      );
    }

    return data;
  }, [selectedSpecialty, searchTerm]);

  const { totalPages, page, setPage, paginatedData } = usePagination(
    filtered,
    itemsPerPage
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
    <AgreementsContext.Provider value={contextValue}>
      {children}
    </AgreementsContext.Provider>
  );
};
