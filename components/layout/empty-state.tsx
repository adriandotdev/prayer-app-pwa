import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="ora-enter flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-14 text-center">
      <div className="ora-glow mb-4 flex size-12 items-center justify-center rounded-full bg-accent text-gold-foreground dark:text-gold">
        <Icon className="size-6" aria-hidden />
      </div>
      <h2 className="font-display text-2xl">{title}</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
