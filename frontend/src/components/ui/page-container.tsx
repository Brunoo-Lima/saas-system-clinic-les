export const PageContainer = ({ children }: { children: React.ReactNode }) => {
  return <section className="w-full space-y-6 p-6">{children}</section>;
};

export const PageHeader = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`${className} flex w-full sm:items-center sm:justify-between sm:flex-row flex-col gap-y-4 justify-start items-start`}
    >
      {children}
    </div>
  );
};

export const PageHeaderContent = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <div className="w-full space-y-1">{children}</div>;
};

export const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return <h1 className="text-2xl font-bold">{children}</h1>;
};

export const PageDescription = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <p className="text-muted-foreground text-sm">{children}</p>;
};

export const PageActions = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>;
};

export const PageContent = ({
  children,
  classNameCustom,
}: {
  children: React.ReactNode;
  classNameCustom?: string;
}) => {
  return <div className={`${classNameCustom} space-y-6`}>{children}</div>;
};
