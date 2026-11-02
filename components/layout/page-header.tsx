import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4 md:mb-10">
      <div className="min-w-0">
        <h1 className="text-[2.5rem] leading-[1.02] font-medium tracking-[-0.02em] break-words md:text-6xl">{title}</h1>
        {description ? <p className="mt-3 max-w-prose text-base text-muted-foreground md:text-lg">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
