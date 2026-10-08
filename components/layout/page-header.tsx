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
    <div className="mb-5 flex md:mb-8 items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-medium md:text-5xl">{title}</h1>
        {description ? <p className="mt-2 text-muted-foreground">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}
