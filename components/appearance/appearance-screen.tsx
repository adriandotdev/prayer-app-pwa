"use client";

import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useSyncExternalStore } from "react";

import { AppButton } from "@/components/app-button";
import { SeasonPreview, type PreviewMode } from "@/components/appearance/season-preview";
import { toast } from "@/lib/toast";
import { SEASONS, SEASON_INFO, type SeasonChoice } from "@/lib/theme/season";
import { useSeason } from "@/lib/theme/use-season";
import { cn } from "@/lib/utils";

const MODES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const ORA_SWATCH = "linear-gradient(135deg, #1f2d52 50%, #c9a24b 50%)";

const noopSubscribe = () => () => {};

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string; icon?: typeof Sun }[];
  value: T | undefined;
  onChange: (value: T) => void;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-xl bg-muted p-1">
      {options.map(({ value: v, label: text, icon: Icon }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors active:scale-[0.98]",
            value === v ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground",
          )}
        >
          {Icon ? <Icon className="size-4" aria-hidden /> : null}
          {text}
        </button>
      ))}
    </div>
  );
}

export function AppearanceScreen() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const { choice: saved, today, setChoice } = useSeason();

  // Until something is picked, the preview shows what is saved and the app's current mode.
  const [picked, setPicked] = useState<SeasonChoice | null>(null);
  const [pickedMode, setPickedMode] = useState<PreviewMode | null>(null);
  const selected = picked ?? saved;
  const previewMode: PreviewMode = pickedMode ?? (resolvedTheme === "dark" ? "dark" : "light");

  const previewSeason = selected === "auto" ? today : selected;
  const previewLabel =
    selected === "default" ? "Ora" : SEASON_INFO[previewSeason as keyof typeof SEASON_INFO].name;

  const todayInfo = SEASON_INFO[today];
  const options: { value: SeasonChoice; name: string; detail: string; swatch: string; border?: boolean }[] = [
    { value: "default", name: "Ora (default)", detail: "Ivory, deep blue and gold", swatch: ORA_SWATCH },
    {
      value: "auto",
      name: "Follow the liturgical year",
      detail: mounted ? `Today: ${todayInfo.occasion} · ${todayInfo.name}` : "Changes with the Church's calendar",
      swatch: SEASON_INFO[today].swatch,
    },
    ...SEASONS.map((s) => ({
      value: s as SeasonChoice,
      name: SEASON_INFO[s].name,
      detail: `${SEASON_INFO[s].when} · ${SEASON_INFO[s].meaning}`,
      swatch: SEASON_INFO[s].swatch,
      border: s === "white",
    })),
  ];

  function apply() {
    setChoice(selected);
    setPicked(null);
    toast.success(selected === "default" ? "Ora colors applied" : `${previewLabel} season applied`);
  }

  return (
    <div className="md:grid md:grid-cols-[minmax(0,1fr)_21rem] md:items-start md:gap-x-10">
      <section aria-labelledby="mode-heading" className="mb-6 md:col-start-1 md:row-start-1">
        <h2 id="mode-heading" className="mb-2 text-lg font-medium">
          Mode
        </h2>
        <Segmented label="Light or dark mode" options={MODES} value={mounted ? theme : undefined} onChange={setTheme} />
      </section>

      {/* On phones the preview sits above the list, so a pick is visible without scrolling back up. */}
      <section aria-labelledby="preview-heading" className="mb-6 md:sticky md:top-6 md:col-start-2 md:row-span-2 md:row-start-1 md:mb-0">
        <div className="mb-2 flex items-center justify-between gap-3">
          <h2 id="preview-heading" className="text-lg font-medium">
            Preview
          </h2>
          <div className="w-44">
            <Segmented
              label="Preview day or night"
              options={[
                { value: "light", label: "Day" },
                { value: "dark", label: "Night" },
              ]}
              value={previewMode}
              onChange={setPickedMode}
            />
          </div>
        </div>
        <div className="mx-auto max-w-sm">
          <SeasonPreview season={previewSeason} mode={previewMode} label={previewLabel} />
        </div>
      </section>

      <section aria-labelledby="season-heading" className="md:col-start-1 md:row-start-2">
        <h2 id="season-heading" className="mb-2 text-lg font-medium">
          Season
        </h2>
        <div role="radiogroup" aria-label="Season colors" className="flex flex-col gap-2">
          {options.map((o) => {
            const on = selected === o.value;
            return (
              <button
                key={o.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setPicked(o.value)}
                className={cn(
                  "flex min-h-14 w-full items-center gap-3 rounded-xl border bg-card px-4 py-3 text-left transition-colors active:bg-accent",
                  on ? "border-primary ring-1 ring-primary" : "border-border",
                )}
              >
                <span
                  aria-hidden
                  style={{ background: o.swatch }}
                  className={cn("size-8 shrink-0 rounded-full", o.border && "ring-1 ring-border")}
                />
                <span className="min-w-0 flex-1">
                  <span className="block font-medium">{o.name}</span>
                  <span className="block text-sm text-muted-foreground">{o.detail}</span>
                </span>
                {on ? <Check className="size-5 shrink-0 text-primary" aria-hidden /> : null}
              </button>
            );
          })}
        </div>
      </section>

      <div className="sticky bottom-(--bottom-nav-height) z-20 -mx-4 mt-6 border-t border-border bg-background/95 px-4 py-3 backdrop-blur md:static md:col-start-1 md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <AppButton size="lg" className="w-full md:w-auto" disabled={selected === saved} onClick={apply}>
          Apply
        </AppButton>
      </div>
    </div>
  );
}
