/**
 * The day's readings on the USCCB site. Ora does not copy lectionary text (it is copyrighted),
 * so the app links out. `iso` is a `YYYY-MM-DD` local date.
 */
export function usccbReadingsUrl(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `https://bible.usccb.org/bible/readings/${month}${day}${year.slice(-2)}.cfm`;
}
