import { Heart } from "lucide-react";
import Image from "next/image";

import { AppButton } from "@/components/app-button";
import { NAV_ITEMS } from "@/lib/nav";
import { cn } from "@/lib/utils";

export type PreviewMode = "light" | "dark";

const FAVORITES = [
  { title: "Hail Mary", note: "Marian prayer" },
  { title: "Glory Be", note: "Doxology" },
];

/**
 * A mock of the Ora home screen in any palette, independent of the app's own light/dark mode.
 *
 * Isolation: the wrapper sets data-preview-season / data-preview-mode, which redefine the whole token
 * set on this element (see app/seasons.css). The app's `dark:` variant matches anything under `.dark`,
 * so nothing in here may use `dark:`; the logo is picked by `mode` instead of the LogoMark component.
 */
export function SeasonPreview({
  season,
  mode,
  label,
  className,
}: {
  season: string;
  mode: PreviewMode;
  label: string;
  className?: string;
}) {
  return (
    <div
      data-preview-season={season}
      data-preview-mode={mode}
      role="img"
      aria-label={`Preview of the ${label} theme in ${mode === "dark" ? "night" : "day"} mode`}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-background text-foreground transition-colors duration-300 motion-reduce:transition-none",
        className,
      )}
    >
      {/* Decorative mock: inert keeps its buttons and links out of the tab order. */}
      <div inert className="pointer-events-none flex flex-col">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="inline-flex items-center gap-2 font-display text-xl font-medium tracking-tight">
            <Image
              src={mode === "dark" ? "/brand/ora-mark-gold.svg" : "/brand/ora-mark-light.svg"}
              alt=""
              width={28}
              height={28}
              unoptimized
              className="size-7"
            />
            Ora
          </span>
          <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-medium text-accent-foreground">{label}</span>
        </div>

        <div className="flex flex-col gap-4 p-4">
          <div className="rounded-xl border border-border bg-card p-4 text-card-foreground transition-colors duration-300 motion-reduce:transition-none">
            <p className="font-heading text-lg font-medium">Holy Rosary · Decade 3 of 5</p>
            <div className="my-3 flex gap-1.5" aria-hidden>
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className={cn("size-4 rounded-full", i < 6 ? "bg-gold" : "border border-border bg-muted")}
                />
              ))}
            </div>
            <AppButton className="w-full" tabIndex={-1}>
              Continue praying
            </AppButton>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Favorites</p>
            {FAVORITES.map((f) => (
              <div key={f.title} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
                <Heart className="size-4 shrink-0 fill-gold text-gold" aria-hidden />
                <div className="min-w-0">
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-5 border-t border-border bg-card px-1 py-2">
          {NAV_ITEMS.map(({ href, label: name, icon: Icon }) => {
            const active = href === "/rosary";
            return (
              <li
                key={href}
                className={cn(
                  "flex flex-col items-center gap-1 text-[11px] leading-none",
                  active ? "font-semibold text-primary" : "font-medium text-muted-foreground",
                )}
              >
                <span className={cn("flex h-7 w-11 items-center justify-center rounded-full", active && "bg-accent")}>
                  <Icon className="size-5" strokeWidth={active ? 2.3 : 1.9} aria-hidden />
                </span>
                {name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
