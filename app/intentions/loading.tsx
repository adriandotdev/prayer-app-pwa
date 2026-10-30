/** Mirrors the real page (header, section heading, cards) so nothing shifts when the list arrives. */
export default function Loading() {
  return (
    <div role="status" aria-label="Loading intentions" className="ora-fade [animation-delay:150ms]">
      <div className="mb-7 md:mb-10">
        <div className="h-10 w-56 animate-pulse rounded-xl bg-muted md:h-14" aria-hidden />
        <div className="mt-3 h-5 w-64 max-w-full animate-pulse rounded-lg bg-muted" aria-hidden />
      </div>
      <div className="mb-4 h-8 w-40 animate-pulse rounded-lg bg-muted" aria-hidden />
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4" aria-hidden>
        {[0, 1, 2].map((n) => (
          <div key={n} className="flex flex-col gap-4 rounded-3xl bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-10 animate-pulse rounded-t-full rounded-b-lg bg-muted" />
              <div className="h-4 w-28 animate-pulse rounded-lg bg-muted" />
            </div>
            <div className="h-5 w-full animate-pulse rounded-lg bg-muted" />
            <div className="h-5 w-2/3 animate-pulse rounded-lg bg-muted" />
            <div className="h-11 w-40 animate-pulse rounded-full bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
