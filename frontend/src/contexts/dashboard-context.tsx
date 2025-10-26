import { createContext, useState } from 'react';

interface IDashboardContextProps {
  from: Date;
  to: Date;
  setFrom: (date: Date) => void;
  setTo: (date: Date) => void;
}

export const DashboardContext = createContext<
  IDashboardContextProps | undefined
>(undefined);

interface IDashboardProviderProps {
  children: React.ReactNode;
}

export const DashboardProvider = ({ children }: IDashboardProviderProps) => {
  const [from, setFrom] = useState<Date>(new Date());
  const [to, setTo] = useState<Date>(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date;
  });

  const contextValue = {
    from,
    to,
    setFrom,
    setTo,
  };

  return (
    <DashboardContext.Provider value={contextValue}>
      {children}
    </DashboardContext.Provider>
  );
};
