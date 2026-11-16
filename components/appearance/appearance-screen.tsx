"use client";

import { Check, Minus, Monitor, Moon, Plus, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useId, useState, useSyncExternalStore } from "react";

import { AppButton } from "@/components/app-button";
import { SeasonPreview, type PreviewMode } from "@/components/appearance/season-preview";
import { LEADING_RANGE, SCALE_RANGE, clampToRange } from "@/lib/reader/preferences";
import { useReaderPrefs } from "@/lib/reader/use-reader-prefs";
import { useWakeLockSupported } from "@/lib/reader/use-wake-lock";
import { syncShareSeasons } from "@/lib/shares/actions";
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

const READING_THEME_OPTIONS = [
  { value: "auto", label: "Match app" },
  { value: "sepia", label: "Sepia" },
  { value: "night", label: "Night" },
] as const;

function Stepper({
  label,
  display,
  canDecrease,
  canIncrease,
  onDecrease,
  onIncrease,
}: {
  label: string;
  display: string;
  canDecrease: boolean;
  canIncrease: boolean;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  const labelId = useId();
  const button =
    "ora-press flex size-12 items-center justify-center rounded-full bg-secondary text-foreground transition-colors duration-200 hover:bg-accent disabled:opacity-40";
  return (
    <div className="flex items-center justify-between gap-4">
      <span id={labelId} className="font-medium">
        {label}
      </span>
      <div role="group" aria-labelledby={labelId} className="flex items-center gap-3">
        <button type="button" className={button} onClick={onDecrease} disabled={!canDecrease} aria-label={`Decrease ${label.toLowerCase()}`}>
          <Minus className="size-4" aria-hidden />
        </button>
        <span aria-live="polite" className="w-12 text-center text-sm tabular-nums">
          {display}
        </span>
        <button type="button" className={button} onClick={onIncrease} disabled={!canIncrease} aria-label={`Increase ${label.toLowerCase()}`}>
          <Plus className="size-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Reading preferences apply as soon as they change; there is no Apply step. */
function ReadingSettings() {
  const { prefs, update } = useReaderPrefs();
  const wakeLockSupported = useWakeLockSupported();
  const step = (value: number, delta: number, range: typeof SCALE_RANGE | typeof LEADING_RANGE) =>
    clampToRange(value + delta, range);

  return (
    <section aria-labelledby="reading-heading" className="mt-10">
      <h2 id="reading-heading" className="mb-4 font-heading text-3xl">
        Reading
      </h2>
      <div className="flex flex-col gap-5">
        <Segmented
          label="Reading theme"
          options={READING_THEME_OPTIONS}
          value={prefs.theme}
          onChange={(theme) => update({ theme })}
        />
        <Stepper
          label="Text size"
          display={`${Math.round(prefs.scale * 100)}%`}
          canDecrease={prefs.scale > SCALE_RANGE.min}
          canIncrease={prefs.scale < SCALE_RANGE.max}
          onDecrease={() => update({ scale: step(prefs.scale, -SCALE_RANGE.step, SCALE_RANGE) })}
          onIncrease={() => update({ scale: step(prefs.scale, SCALE_RANGE.step, SCALE_RANGE) })}
        />
        <Stepper
          label="Line spacing"
          display={prefs.leading.toFixed(2)}
          canDecrease={prefs.leading > LEADING_RANGE.min}
          canIncrease={prefs.leading < LEADING_RANGE.max}
          onDecrease={() => update({ leading: step(prefs.leading, -LEADING_RANGE.step, LEADING_RANGE) })}
          onIncrease={() => update({ leading: step(prefs.leading, LEADING_RANGE.step, LEADING_RANGE) })}
        />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p id="keep-awake-label" className="font-medium">
              Keep screen awake
            </p>
            <p id="keep-awake-hint" className="text-sm text-muted-foreground">
              {wakeLockSupported ? "While a prayer is open." : "Not supported by this browser."}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={prefs.keepAwake}
            aria-labelledby="keep-awake-label"
            aria-describedby="keep-awake-hint"
            disabled={!wakeLockSupported}
            onClick={() => update({ keepAwake: !prefs.keepAwake })}
            className={cn(
              "relative h-8 w-14 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-40",
              prefs.keepAwake ? "bg-primary" : "bg-secondary",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "absolute top-1 left-1 size-6 rounded-full bg-background shadow transition-transform duration-200 motion-reduce:transition-none",
                prefs.keepAwake && "translate-x-6",
              )}
            />
          </button>
        </div>
        <div className="reader-surface rounded-3xl bg-card p-5">
          <p className="prayer-text">Hail Mary, full of grace, the Lord is with thee.</p>
        </div>
      </div>
    </section>
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
    // Links already shared follow the new colours.
    void syncShareSeasons(selected)
      .then((r) => console.info("[share-sync]", r))
      .catch((e) => console.error("[share-sync] failed", e));
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

        <ReadingSettings />
      </div>
    </div>
  );
}
