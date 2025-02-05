"use client";
import { Box } from "@chakra-ui/react";
import { createContext, ReactElement, ReactNode, useContext } from "react";
// import { Booking, Cabin } from "../utils/types";
import { generateGridTemplateColumns } from "../_utils/helpers";

type TableContextType = { columns: string[] } | undefined;

const TableContext = createContext<TableContextType>(undefined);

export default function Table({
  columns,
  children,
}: {
  columns: string[];
  children: ReactNode;
}) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div className="overflow-hidden">
        <Box className="overflow-x-scroll no-scrollbar rounded-[var(--border-radius-md)] border border-[var(--color-grey-200)] bg-[var(--color-grey-0)] text-[1.4rem]">
          {children}
        </Box>
      </div>
    </TableContext.Provider>
  );
}

export function useTable() {
  const context = useContext(TableContext);
  if (!context)
    throw new Error("Cannot use table context outside its provider");

  return context;
}

export function Header({ headers }: { headers: string[] | ReactNode[] }) {
  const { columns } = useTable();

  return (
    <header
      style={{
        display: "grid",
        gridTemplateColumns: generateGridTemplateColumns(columns),
      }}
      className="min-w-[100%] w-fit gap-[2.4rem] py-[1.6rem] px-[2.4rem] bg-[var(--color-grey-50)] border-b-[var(--color-grey-100)]"
    >
      {headers.map((header, index) => (
        <div key={index} className="uppercase font-semibold">
          {header}
        </div>
      ))}
    </header>
  );
}

export function Body<T>({
  data,
  render,
  children,
}: {
  data?: T[] | null;
  render?: (item: T) => ReactNode;
  children?: ReactNode;
}) {
  return (
    <Box className="no-scrollbar min-w-[100%] w-fit">
      {data?.map(render || (() => null)) || children}
    </Box>
  );
}

export function Footer({ children }: { children: ReactElement | string }) {
  return <footer>{children}</footer>;
}
