import type { ReactNode } from "react";

interface ListHeaderProps {
  title: string;
  subtitle: string;
  children?: ReactNode;
}

const ListHeader = ({ title, subtitle, children }: ListHeaderProps) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex min-w-0 flex-col">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children ? (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0 sm:justify-end">
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default ListHeader;
