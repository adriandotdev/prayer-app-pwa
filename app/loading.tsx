import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div role="status" aria-label="Loading" className="space-y-4">
      <Skeleton className="h-12 w-2/3" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="mt-8 h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
