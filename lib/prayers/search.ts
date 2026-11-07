/** Letters, digits, apostrophes and hyphens only, so a term can't carry LIKE or filter syntax. */
export function searchTerms(search: string): string[] {
  return search
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}'’-]/gu, ""))
    .filter(Boolean)
    .slice(0, 6);
}
