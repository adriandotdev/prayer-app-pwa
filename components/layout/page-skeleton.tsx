import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  /** Announced once to screen readers; the shapes themselves are hidden. */
  label: string;
  variant?: "list" | "cards" | "form";
};

/** Header plus placeholder rows, cards or fields, sized like the real pages so nothing shifts on arrival. */
export function PageSkeleton({ label, variant = "list" }: Props) {
  return (
    <div role="status" aria-label={label} className="ora-fade [animation-delay:150ms]">
      <div aria-hidden>
        <div className="mb-7 md:mb-10">
          <Skeleton className="h-10 w-56 rounded-xl md:h-14" />
          <Skeleton className="mt-3 h-5 w-64 max-w-full rounded-lg" />
        </div>
        {variant === "list" && (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-20 rounded-3xl" />
            ))}
          </div>
        )}
        {variant === "cards" && (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:gap-4">
            {[0, 1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-32 rounded-3xl" />
            ))}
          </div>
        )}
        {variant === "form" && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-5 w-32 rounded-lg" />
            <Skeleton className="h-14 rounded-2xl" />
            <Skeleton className="h-14 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
}
