import { toast } from "@/lib/toast";

/**
 * Wraps a server action that does not redirect so the form can toast once it resolves.
 * The message may depend on what was submitted.
 */
export function withToast(action: (formData: FormData) => Promise<void>, message: string | ((formData: FormData) => string)) {
  return async (formData: FormData) => {
    await action(formData);
    toast.success(typeof message === "function" ? message(formData) : message);
  };
}
