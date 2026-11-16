import { GUIDES, type Practice } from "@/components/seo/practice-guide";

/** The numbered steps of a practice, taken from the same text the practice page shows so the two never drift. */
export function PracticeSteps({ practice }: { practice: Practice }) {
  return (
    <ol className="space-y-5">
      {GUIDES[practice].steps.map((s, i) => (
        <li key={s.name} className="grid grid-cols-[2rem_1fr] gap-x-4">
          <span
            aria-hidden
            className="flex size-8 items-center justify-center rounded-full bg-secondary font-sans text-sm font-medium text-secondary-foreground tabular-nums"
          >
            {i + 1}
          </span>
          <div className="pt-0.5">
            <h3 className="font-sans text-base font-medium leading-snug">{s.name}</h3>
            <p className="prayer-text mt-1">{s.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
