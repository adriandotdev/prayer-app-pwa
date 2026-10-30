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
    <div role="radiogroup" aria-label={label} className="grid auto-cols-fr grid-flow-col gap-1 rounded-full bg-secondary p-1">
      {options.map(({ value: v, label: text, icon: Icon }) => (
        <button
          key={v}
          type="button"
          role="radio"
          aria-checked={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "flex min-h-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-medium transition-colors duration-200 active:scale-[0.98]",
            value === v ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
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
  const options: { value: SeasonChoice; name: string; title: string; detail: string; swatch: string; border?: boolean }[] = [
    { value: "default", name: "Ora", title: "Ora", detail: "Ivory, deep blue and gold", swatch: ORA_SWATCH },
    {
      value: "auto",
      name: "Liturgical year",
      title: "Follow the liturgical year",
      detail: mounted ? `Today: ${todayInfo.occasion} · ${todayInfo.name}` : "Changes with the Church's calendar",
      swatch: SEASON_INFO[today].swatch,
    },
    ...SEASONS.map((s) => ({
      value: s as SeasonChoice,
      name: SEASON_INFO[s].name,
      title: SEASON_INFO[s].name,
      detail: `${SEASON_INFO[s].when} · ${SEASON_INFO[s].meaning}`,
      swatch: SEASON_INFO[s].swatch,
      border: s === "white",
    })),
  ];
  const current = options.find((o) => o.value === selected) ?? options[0];
  const stageTint = selected === "default" ? "#c9a24b" : previewSeason in SEASON_INFO ? SEASON_INFO[previewSeason as keyof typeof SEASON_INFO].swatch : "#c9a24b";

  function apply() {
    setChoice(selected);
    setPicked(null);
    toast.success(selected === "default" ? "Ora colors applied" : `${previewLabel} season applied`);
  }

  return (
    <div className="md:grid md:grid-cols-[minmax(0,1fr)_22rem] md:items-start md:gap-x-12 lg:grid-cols-[minmax(0,1fr)_26rem]">
      {/* On phones the preview sits above the controls, so a pick is visible without scrolling back up. */}
      <section
        aria-labelledby="preview-heading"
        className="mb-8 md:sticky md:top-8 md:col-start-2 md:row-start-1 md:mb-0"
      >
        <h2 id="preview-heading" className="sr-only">
          Preview
        </h2>
        <div
          style={{ backgroundColor: `color-mix(in oklab, ${stageTint} 20%, var(--card))` }}
          className="rounded-[2rem] px-4 pt-5 pb-4 transition-colors duration-500 md:px-6 md:pt-7 md:pb-5 motion-reduce:transition-none"
        >
          {/* A phone bezel: one step of ink around the mock, so the preview reads as the app itself. */}
          <div className="mx-auto max-w-[15rem] rounded-[2.4rem] bg-foreground/90 p-2 md:max-w-none lg:max-w-[18.5rem]">
            <SeasonPreview season={previewSeason} mode={previewMode} label={previewLabel} className="rounded-[1.9rem] border-0" />
          </div>
          <div className="mx-auto mt-4 w-48 md:mt-5">
            <Segmented
              label="Preview day or night"
              options={[
                { value: "light", label: "Day", icon: Sun },
                { value: "dark", label: "Night", icon: Moon },
              ]}
              value={previewMode}
              onChange={setPickedMode}
            />
          </div>
        </div>
      </section>

      <div className="md:col-start-1 md:row-start-1">
        <section aria-labelledby="mode-heading" className="mb-10">
          <h2 id="mode-heading" className="mb-4 font-heading text-3xl">
            Mode
          </h2>
          <Segmented label="Light or dark mode" options={MODES} value={mounted ? theme : undefined} onChange={setTheme} />
        </section>

        <section aria-labelledby="season-heading">
          <h2 id="season-heading" className="mb-4 font-heading text-3xl">
            Season
          </h2>
          <div role="radiogroup" aria-label="Season colors" className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {options.map((o) => {
              const on = selected === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  aria-label={o.title}
                  onClick={() => setPicked(o.value)}
                  className={cn(
                    "ora-press relative flex min-h-28 flex-col items-start justify-between gap-4 rounded-3xl p-4 text-left transition-colors duration-200 sm:min-h-32 sm:p-5",
                    on ? "bg-accent ring-2 ring-primary" : "bg-card hover:bg-secondary",
                  )}
                >
                  <span
                    aria-hidden
                    style={{ background: o.swatch }}
                    className={cn("size-9 shrink-0 rounded-full sm:size-10", o.border && "ring-1 ring-border")}
                  />
                  <span aria-hidden className="text-sm leading-tight font-medium sm:text-base">
                    {o.name}
                  </span>
                  {on ? (
                    <span className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground sm:top-4 sm:right-4">
                      <Check className="size-3.5" strokeWidth={3} aria-hidden />
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
          <p aria-live="polite" className="mt-5 min-h-[3.25rem] text-sm text-muted-foreground sm:text-base">
            <span className="block font-medium text-foreground">{current.title}</span>
            {current.detail}
          </p>
        </section>

        <div className="sticky bottom-(--bottom-nav-height) z-20 -mx-4 mt-6 bg-background px-4 py-3 md:bottom-6 md:static md:mx-0 md:mt-8 md:bg-transparent md:p-0">
          <AppButton size="lg" className="w-full md:w-auto md:min-w-48" disabled={selected === saved} onClick={apply}>
            {selected === saved ? "Applied" : "Apply"}
          </AppButton>
        </div>
      </div>
    </div>
  );
}
