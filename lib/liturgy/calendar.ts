import type { Season } from "@/lib/theme/liturgical-season";
import { dayNumber, easterDayNumber, fromDayNumber, weekdayOf } from "./dates";
import { SANCTORAL, sanctoralRank, type SanctoralEntry } from "./sanctoral";

/**
 * The universal (General Roman) calendar for any date, computed rather than stored.
 * English names, Ordinary Form. Epiphany is Jan 6, Ascension and Corpus Christi are the Thursdays.
 * No national or diocesan calendars, no optional memorials, and no readings.
 */

export type LiturgicalTime = "advent" | "christmas" | "ordinary" | "lent" | "triduum" | "easter";
export type CelebrationKind = "solemnity" | "feast" | "memorial" | "commemoration" | "sunday" | "weekday" | "triduum";

export interface LiturgicalDay {
  /** Local date, YYYY-MM-DD. */
  date: string;
  time: LiturgicalTime;
  timeName: string;
  /** Week of the season (Sunday starts the week); null in Christmas time and the Triduum. */
  week: number | null;
  title: string;
  kind: CelebrationKind;
  /** Position in the Table of Liturgical Days: 1 is highest, 12 lowest. */
  rank: number;
  color: Season;
  /** Sunday readings cycle, A to C, from the Advent that began the liturgical year. */
  sundayCycle: "A" | "B" | "C";
  /** Weekday readings cycle, only in Ordinary Time (odd civil years are I). */
  weekdayCycle: "I" | "II" | null;
}

interface Temporal {
  time: LiturgicalTime;
  week: number | null;
  title: string;
  kind: CelebrationKind;
  rank: number;
  color: Season;
}

const TIME_NAMES: Record<LiturgicalTime, string> = {
  advent: "Advent",
  christmas: "Christmas Time",
  ordinary: "Ordinary Time",
  lent: "Lent",
  triduum: "Easter Triduum",
  easter: "Easter Time",
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const ORDINALS = ["", "First", "Second", "Third", "Fourth", "Fifth", "Sixth", "Seventh", "Eighth", "Ninth", "Tenth", "Eleventh", "Twelfth", "Thirteenth", "Fourteenth", "Fifteenth", "Sixteenth", "Seventeenth", "Eighteenth", "Nineteenth"];

function ordinal(n: number): string {
  if (n < 20) return ORDINALS[n];
  const tens = n < 30 ? "Twenty" : "Thirty";
  return n % 10 === 0 ? `${tens.slice(0, -1)}ieth` : `${tens}-${ORDINALS[n % 10].toLowerCase()}`;
}

interface Anchors {
  easter: number;
  ashWednesday: number;
  palmSunday: number;
  pentecost: number;
  advent1: number;
  christKing: number;
  /** Baptism of the Lord: the Sunday after Jan 6 of this civil year. */
  baptism: number;
  holyFamily: number;
}

const anchorCache = new Map<number, Anchors>();

function anchors(year: number): Anchors {
  let a = anchorCache.get(year);
  if (a) return a;
  const easter = easterDayNumber(year);
  const nov27 = dayNumber(year, 11, 27);
  const advent1 = nov27 + ((7 - weekdayOf(nov27)) % 7);
  const jan6 = dayNumber(year, 1, 6);
  const christmas = dayNumber(year, 12, 25);
  const christmasWeekday = weekdayOf(christmas);
  a = {
    easter,
    ashWednesday: easter - 46,
    palmSunday: easter - 7,
    pentecost: easter + 49,
    advent1,
    christKing: advent1 - 7,
    baptism: jan6 + (7 - weekdayOf(jan6)),
    // The Sunday in the Christmas octave, or Dec 30 when Christmas itself is a Sunday.
    holyFamily: christmasWeekday === 0 ? dayNumber(year, 12, 30) : christmas + (7 - christmasWeekday),
  };
  anchorCache.set(year, a);
  return a;
}

/** The day as the season and the weekly cycle make it, before any saint's day is considered. */
function temporal(n: number): Temporal {
  const { year, month, day, weekday: dow } = fromDayNumber(n);
  const a = anchors(year);
  const dayName = WEEKDAYS[dow];

  if (n >= a.advent1) {
    if (month === 12 && day >= 25) return christmasTime(n, month, day, dow, a);
    const week = Math.floor((n - a.advent1) / 7) + 1;
    const base = { time: "advent", week, color: "violet" } as const;
    if (dow === 0) {
      return { ...base, title: `${ordinal(week)} Sunday of Advent`, kind: "sunday", rank: 2, color: week === 3 ? "rose" : "violet" };
    }
    if (month === 12 && day >= 17) return { ...base, title: `December ${day}`, kind: "weekday", rank: 9 };
    return { ...base, title: `${dayName} of the ${ordinal(week)} Week of Advent`, kind: "weekday", rank: 12 };
  }
  if (n <= a.baptism) return christmasTime(n, month, day, dow, a);

  if (n < a.ashWednesday) {
    const week = 1 + Math.floor((n - dow - a.baptism) / 7);
    return dow === 0
      ? { time: "ordinary", week, title: `${ordinal(week)} Sunday in Ordinary Time`, kind: "sunday", rank: 6, color: "green" }
      : { time: "ordinary", week, title: `${dayName} of the ${ordinal(week)} Week in Ordinary Time`, kind: "weekday", rank: 12, color: "green" };
  }

  if (n < a.easter) return lentOrTriduum(n, dow, dayName, a);
  if (n <= a.pentecost) return easterTime(n, dow, dayName, a);
  return ordinaryTimeAfterPentecost(n, dow, dayName, a);
}

function christmasTime(n: number, month: number, day: number, dow: number, a: Anchors): Temporal {
  const base = { time: "christmas", week: null, color: "white" } as const;
  if (month === 12) {
    if (day === 25) return { ...base, title: "The Nativity of the Lord (Christmas)", kind: "solemnity", rank: 2 };
    if (n === a.holyFamily) return { ...base, title: "The Holy Family of Jesus, Mary and Joseph", kind: "feast", rank: 5 };
    return { ...base, title: `${ordinal(day - 24)} Day in the Octave of Christmas`, kind: "weekday", rank: 9 };
  }
  if (n === a.baptism) return { ...base, title: "The Baptism of the Lord", kind: "feast", rank: 5 };
  if (dow === 0 && day >= 2 && day <= 5) return { ...base, title: "Second Sunday of Christmas", kind: "sunday", rank: 6 };
  if (day === 1) return { ...base, title: "Octave Day of Christmas", kind: "weekday", rank: 9 };
  if (day <= 6) return { ...base, title: `January ${day}`, kind: "weekday", rank: 12 };
  return { ...base, title: `${WEEKDAYS[dow]} after Epiphany`, kind: "weekday", rank: 12 };
}

function lentOrTriduum(n: number, dow: number, dayName: string, a: Anchors): Temporal {
  const off = n - a.easter;
  const lent = { time: "lent", week: null, color: "violet" } as const;
  if (off === -46) return { ...lent, title: "Ash Wednesday", kind: "weekday", rank: 2 };
  if (off >= -45 && off <= -43) return { ...lent, title: `${dayName} after Ash Wednesday`, kind: "weekday", rank: 9 };
  if (off === -7) return { ...lent, week: 6, title: "Palm Sunday of the Passion of the Lord", kind: "sunday", rank: 2, color: "red" };
  if (off >= -6 && off <= -4) return { ...lent, week: 6, title: `${dayName} of Holy Week`, kind: "weekday", rank: 2 };
  if (off === -3) return { time: "triduum", week: null, title: "Holy Thursday: Mass of the Lord's Supper", kind: "triduum", rank: 1, color: "white" };
  if (off === -2) return { time: "triduum", week: null, title: "Good Friday of the Lord's Passion", kind: "triduum", rank: 1, color: "red" };
  if (off === -1) return { time: "triduum", week: null, title: "Holy Saturday", kind: "triduum", rank: 1, color: "violet" };
  const week = Math.floor((n - (a.ashWednesday + 4)) / 7) + 1;
  if (dow === 0) {
    const laetare = week === 4;
    return { ...lent, week, title: `${ordinal(week)} Sunday of Lent${laetare ? " (Laetare Sunday)" : ""}`, kind: "sunday", rank: 2, color: laetare ? "rose" : "violet" };
  }
  return { ...lent, week, title: `${dayName} of the ${ordinal(week)} Week of Lent`, kind: "weekday", rank: 9 };
}

function easterTime(n: number, dow: number, dayName: string, a: Anchors): Temporal {
  const off = n - a.easter;
  const easter = { time: "easter", color: "white" } as const;
  if (off === 0) return { ...easter, week: 1, title: "Easter Sunday of the Resurrection of the Lord", kind: "solemnity", rank: 2 };
  if (off <= 6) return { ...easter, week: 1, title: `${dayName} within the Octave of Easter`, kind: "solemnity", rank: 2 };
  if (off === 39) return { ...easter, week: 6, title: "The Ascension of the Lord", kind: "solemnity", rank: 2 };
  if (off === 49) return { ...easter, week: 7, title: "Pentecost Sunday", kind: "solemnity", rank: 2, color: "red" };
  const week = Math.floor(off / 7) + 1;
  if (dow === 0) {
    const suffix = off === 7 ? " (Sunday of Divine Mercy)" : "";
    return { ...easter, week, title: `${ordinal(week)} Sunday of Easter${suffix}`, kind: "sunday", rank: 2 };
  }
  return { ...easter, week, title: `${dayName} of the ${ordinal(week)} Week of Easter`, kind: "weekday", rank: 12 };
}

function ordinaryTimeAfterPentecost(n: number, dow: number, dayName: string, a: Anchors): Temporal {
  // The last Sunday, Christ the King, is always the 34th; count back from it.
  const week = 34 - (a.christKing - (n - dow)) / 7;
  const ordinary = { time: "ordinary", week } as const;
  const off = n - a.easter;
  if (n === a.christKing) return { ...ordinary, title: "Our Lord Jesus Christ, King of the Universe", kind: "solemnity", rank: 3, color: "white" };
  if (off === 56) return { ...ordinary, title: "The Most Holy Trinity", kind: "solemnity", rank: 3, color: "white" };
  if (off === 60) return { ...ordinary, title: "The Most Holy Body and Blood of Christ (Corpus Christi)", kind: "solemnity", rank: 3, color: "white" };
  if (off === 68) return { ...ordinary, title: "The Most Sacred Heart of Jesus", kind: "solemnity", rank: 3, color: "white" };
  if (off === 69) return { ...ordinary, title: "The Immaculate Heart of the Blessed Virgin Mary", kind: "memorial", rank: 10, color: "white" };
  if (off === 50) return { ...ordinary, title: "The Blessed Virgin Mary, Mother of the Church", kind: "memorial", rank: 10, color: "white" };
  return dow === 0
    ? { ...ordinary, title: `${ordinal(week)} Sunday in Ordinary Time`, kind: "sunday", rank: 6, color: "green" }
    : { ...ordinary, title: `${dayName} of the ${ordinal(week)} Week in Ordinary Time`, kind: "weekday", rank: 12, color: "green" };
}

const sanctoralCache = new Map<number, Map<number, SanctoralEntry>>();

/**
 * Fixed celebrations placed on their day in one civil year. A solemnity that lands on a day of rank 2
 * or higher (a Sunday of Advent, Lent or Easter, Holy Week, the Easter octave) or on another solemnity
 * moves to the next free day. Joseph moves to the Saturday before Palm Sunday when it falls in Holy
 * Week, the Annunciation to the Monday after the Easter octave, and the Nativity of John the Baptist
 * moves back a day when it meets the Sacred Heart.
 */
function sanctoralFor(year: number): Map<number, SanctoralEntry> {
  const cached = sanctoralCache.get(year);
  if (cached) return cached;
  const a = anchors(year);
  const placed = new Map<number, SanctoralEntry>();
  const solemnities: [number, SanctoralEntry][] = [];

  for (const entry of SANCTORAL) {
    const n = dayNumber(year, entry.month, entry.day);
    if (entry.kind === "solemnity") solemnities.push([n, entry]);
    else placed.set(n, entry);
  }

  for (const [natural, entry] of solemnities) {
    let n = natural;
    if (entry.id === "joseph" && n >= a.palmSunday && n < a.easter) n = a.palmSunday - 1;
    if (entry.id === "annunciation" && n >= a.palmSunday && n <= a.easter + 7) n = a.easter + 8;
    const step = entry.id === "john-baptist" ? -1 : 1;
    while (temporal(n).rank <= 3 || placed.get(n)?.kind === "solemnity") {
      n += step;
    }
    placed.set(n, entry);
  }

  sanctoralCache.set(year, placed);
  return placed;
}

const pad = (n: number) => String(n).padStart(2, "0");

function liturgicalDayFor(n: number): LiturgicalDay {
  const { year, month, day } = fromDayNumber(n);
  const a = anchors(year);
  const t = temporal(n);
  const s = sanctoralFor(year).get(n);

  // Ranks compare as in the Table of Liturgical Days; on a tie the day of the season keeps its place.
  const winner = s && sanctoralRank(s) < t.rank ? s : null;
  const civilYearOfAdvent = n >= a.advent1 ? year : year - 1;

  return {
    date: `${year}-${pad(month)}-${pad(day)}`,
    time: t.time,
    timeName: TIME_NAMES[t.time],
    week: t.week,
    title: winner ? winner.name : t.title,
    kind: winner ? winner.kind : t.kind,
    rank: winner ? sanctoralRank(winner) : t.rank,
    color: winner ? winner.color : t.color,
    sundayCycle: (["A", "B", "C"] as const)[civilYearOfAdvent % 3],
    weekdayCycle: t.time === "ordinary" ? (year % 2 === 1 ? "I" : "II") : null,
  };
}

/** The liturgical day for a local calendar date. */
export function liturgicalDay(date: Date): LiturgicalDay {
  return liturgicalDayFor(dayNumber(date.getFullYear(), date.getMonth() + 1, date.getDate()));
}
