import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
};

/** A full-page notice (not found, offline, error): the chapel window with one icon, then a calm sentence and one way out. */
export function StatePage({ icon: Icon, title, description, children }: Props) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center py-10 text-center md:py-20">
      <div className="ora-arch ora-enter flex h-36 w-28 items-end justify-center rounded-b-2xl bg-primary pb-8 text-gold dark:bg-card">
        <Icon className="size-9" strokeWidth={1.5} aria-hidden />
      </div>
      <h1 className="ora-enter mt-8 text-5xl leading-[1.02] [animation-delay:120ms]">{title}</h1>
      <p className="ora-enter mt-4 max-w-sm text-lg text-muted-foreground [animation-delay:200ms]">{description}</p>
      {children ? <div className="ora-enter mt-8 flex flex-col items-stretch gap-3 [animation-delay:280ms] sm:flex-row">{children}</div> : null}
    </div>
  );
}
