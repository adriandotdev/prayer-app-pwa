/** What a server action that does not redirect reports back, so the caller can toast a failure. */
export type ActionResult = { ok: true } | { ok: false; message: string };

export const OK: ActionResult = { ok: true };
export const FAILED: ActionResult = { ok: false, message: "That didn't work. Please try again." };
