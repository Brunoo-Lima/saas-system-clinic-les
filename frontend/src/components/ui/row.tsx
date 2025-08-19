interface IRowProps {
  children: React.ReactNode;
  variant?: "col" | "row";
  className?: string;
}

export const Row = ({ children, variant = "col", className }: IRowProps) => {
  return (
    <div
      className={`${
        variant === "col"
          ? "flex flex-col gap-2"
          : "grid md:grid-cols-2 grid-cols-1 gap-2"
      } ${className}`}
    >
      {children}
    </div>
  );
};
