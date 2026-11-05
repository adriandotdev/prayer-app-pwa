/** What a server action that does not redirect reports back, so the caller can toast a failure. */
export type ActionResult = { ok: true } | { ok: false; message: string };

export const OK: ActionResult = { ok: true };
export const FAILED: ActionResult = { ok: false, message: "That didn't work. Please try again." };

/** True when the database refused an insert because the user hit a per-user row cap (see the row_caps migration). */
export function isRowLimitError(error: { message?: string } | null | undefined): boolean {
  return !!error?.message?.includes("row_limit_reached");
}

/** Message for a failed save: says so when a limit was hit, otherwise the generic retry text. */
export function saveErrorMessage(error: { message?: string } | null | undefined, noun: string, fallback: string): string {
  return isRowLimitError(error) ? `You've reached the limit for ${noun}. Delete one you no longer need to add another.` : fallback;
}
