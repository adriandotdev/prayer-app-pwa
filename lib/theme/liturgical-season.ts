export const SEASONS = ["violet", "rose", "white", "gold", "green", "red", "black"] as const;
export type Season = (typeof SEASONS)[number];

/**
 * Liturgical colour for a local date. Rules, first match wins:
 * - Nov 2 (All Souls) → black
 * - Advent (Sunday Nov 27–Dec 3) to Dec 24 → violet; 3rd Sunday (Gaudete) → rose
 * - Dec 25 → gold; Dec 26 to the Baptism of the Lord (first Sunday after Jan 6) → white
 * - Ash Wednesday (Easter−46) to Holy Saturday → violet; Laetare (Easter−21) → rose;
 *   Palm Sunday (Easter−7) and Good Friday (Easter−2) → red
 * - Easter Sunday → gold; Easter Monday to the day before Pentecost → white
 * - Pentecost (Easter+49) → red
 * - Everything else (Ordinary Time) → green
 *
 * Self-contained on purpose: the root layout inlines this function's source into a <head> script so
 * the colour is set before first paint. Keep it free of imports and outer references.
 */
export function seasonForDate(date: Date): Season {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const dom = date.getDate();
  // Whole local days since the epoch, immune to DST (each date is read as a UTC midnight).
  const dayNumber = (d: Date) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
  const today = dayNumber(date);

  if (month === 11 && dom === 2) return "black";

  // Advent: the Sunday on or after Nov 27, so always within Nov 27–Dec 3.
  const nov27 = new Date(year, 10, 27);
  const advent1 = dayNumber(nov27) + ((7 - nov27.getDay()) % 7);
  if (today >= advent1 && (month === 11 || (month === 12 && dom <= 24))) {
    return today === advent1 + 14 ? "rose" : "violet";
  }
  if (month === 12 && dom === 25) return "gold";
  if (month === 12 && dom >= 26) return "white";

  // The Christmas season runs into January, through the first Sunday after Jan 6.
  if (month === 1) {
    const jan6 = new Date(year, 0, 6);
    if (today <= dayNumber(jan6) + (7 - jan6.getDay())) return "white";
  }

  // Easter via the Anonymous Gregorian (Meeus/Jones/Butcher) algorithm.
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const l = (32 + 2 * (b % 4) + 2 * Math.floor(c / 4) - h - (c % 4)) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const easterMonth = Math.floor((h + l - 7 * m + 114) / 31);
  const easterDay = ((h + l - 7 * m + 114) % 31) + 1;
  const offset = today - dayNumber(new Date(year, easterMonth - 1, easterDay));

  if (offset >= -46 && offset <= -1) {
    if (offset === -21) return "rose";
    if (offset === -7 || offset === -2) return "red";
    return "violet";
  }
  if (offset === 0) return "gold";
  if (offset > 0 && offset < 49) return "white";
  if (offset === 49) return "red";
  return "green";
}
