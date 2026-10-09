import type { ReactNode } from "react";
import { ArrowLeft, ArrowLeftIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  actions?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  back = false,
  onBack,
  actions,
}: PageHeaderProps) {
  const navigate = useNavigate();
  const showBack = back || onBack != null;

  return (
    <header className="flex flex-col px-4 gap-2">
      <div className="px-2">
        {showBack ? (
          <Button
            type="button"
            variant="link"
            size="icon"
            className={"cursor-pointer text-primary"}
            aria-label="Volver"
            onClick={onBack ?? (() => navigate(-1))}
          >
            <ArrowLeft />
            Volver
          </Button>
        ) : null}
      </div>

      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-heading text-xl font-semibold tracking-tight">
            {title}
          </h1>
          {subtitle ? (
            <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>
    </header>
  );
}
