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
    <div className="ora-enter flex flex-col items-center rounded-3xl bg-card px-6 py-14 text-center">
      <div className="ora-arch ora-glow mb-6 flex h-20 w-16 items-end justify-center rounded-b-xl bg-accent pb-4 text-gold-foreground dark:text-gold">
        <Icon className="size-7" aria-hidden />
      </div>
      <h2 className="font-display text-3xl">{title}</h2>
      <p className="mt-2 max-w-sm text-base text-muted-foreground">{description}</p>
      {action ? <div className="mt-7">{action}</div> : null}
    </div>
  );
}
