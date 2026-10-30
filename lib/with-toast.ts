import type { ActionResult } from "@/lib/action-result";
import { toast } from "@/lib/toast";

/**
 * Wraps a server action that does not redirect so the form can toast once it resolves: the message
 * on success, or the action's own message when it reports a failure. The message may depend on what
 * was submitted.
 */
export function withToast(
  action: (formData: FormData) => Promise<ActionResult>,
  message: string | ((formData: FormData) => string),
) {
  return async (formData: FormData) => {
    const result = await action(formData);
    if (!result.ok) toast.error(result.message);
    else toast.success(typeof message === "function" ? message(formData) : message);
  };
}
