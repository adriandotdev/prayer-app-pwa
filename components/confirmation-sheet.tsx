"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { Dialog } from "radix-ui";
import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { useFormStatus } from "react-dom";

import { AppButton } from "@/components/app-button";
import { cn } from "@/lib/utils";

const DISMISS_DISTANCE = 80;
const DISMISS_VELOCITY = 500;
const DESKTOP_QUERY = "(min-width: 768px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Matches Tailwind's md breakpoint, where the sheet becomes a centered panel. */
function useIsDesktop() {
  return useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false,
  );
}

const RISE = {
  type: "spring",
  damping: 34,
  stiffness: 380,
  mass: 0.9,
} as const;

type ConfirmationSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  /** Shown on the confirm button while submitting. */
  pendingLabel?: string;
  variant?: "default" | "destructive";
  /** External pending state (e.g. a client-side transition). Form submissions are tracked automatically. */
  isPending?: boolean;
  /** Server action (or URL) submitted by the confirm button. Omit to use onConfirm. */
  action?: string | ((formData: FormData) => void | Promise<void>);
  /** Hidden inputs sent with the form action. */
  fields?: Record<string, string>;
  /** Used instead of a form when there is no server action. */
  onConfirm?: () => void;
  /** Optional extra content between the description and the actions. */
  children?: ReactNode;
};

/** Reports the enclosing form's pending state upward and renders the confirm button. */
function ConfirmButton({
  label,
  pendingLabel,
  variant,
  externalPending,
  onPendingChange,
  onClick,
}: {
  label: string;
  pendingLabel: string;
  variant: "primary" | "destructive";
  externalPending: boolean;
  onPendingChange: (pending: boolean) => void;
  onClick?: () => void;
}) {
  const { pending } = useFormStatus();
  useEffect(() => {
    onPendingChange(pending);
  }, [pending, onPendingChange]);

  const busy = pending || externalPending;
  return (
    <AppButton
      type={onClick ? "button" : "submit"}
      variant={variant}
      onClick={onClick}
      disabled={busy}
      aria-disabled={busy}
      className="w-full sm:flex-1"
    >
      {busy ? (
        <>
          <span
            aria-hidden
            className="size-2 animate-pulse rounded-full bg-current"
          />
          {pendingLabel}
        </>
      ) : (
        label
      )}
    </AppButton>
  );
}

export function ConfirmationSheet({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  pendingLabel = "Working…",
  variant = "default",
  isPending = false,
  action,
  fields,
  onConfirm,
  children,
}: ConfirmationSheetProps) {
  const [formPending, setFormPending] = useState(false);
  const busy = isPending || formPending;
  const reduceMotion = useReducedMotion();
  const isDesktop = useIsDesktop();
  const dragControls = useDragControls();

  const handleOpenChange = useCallback(
    (next: boolean) => {
      if (!next && busy) return; // never dismiss mid-submit
      onOpenChange(next);
    },
    [busy, onOpenChange],
  );

  function onDragEnd(_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    if (info.offset.y > DISMISS_DISTANCE || info.velocity.y > DISMISS_VELOCITY)
      handleOpenChange(false);
  }

  const confirmVariant = variant === "destructive" ? "destructive" : "primary";
  const confirm = (
    <ConfirmButton
      label={confirmLabel}
      pendingLabel={pendingLabel}
      variant={confirmVariant}
      externalPending={isPending}
      onPendingChange={setFormPending}
      onClick={action ? undefined : onConfirm}
    />
  );

  const actions = (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      {/* Safer action first, destructive last. */}
      <Dialog.Close asChild>
        <AppButton
          variant="outline"
          disabled={busy}
          className="w-full sm:flex-1"
        >
          {cancelLabel}
        </AppButton>
      </Dialog.Close>
      {confirm}
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-60 bg-foreground/40 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: reduceMotion ? 0 : 0.18,
                  ease: "easeOut",
                }}
              />
            </Dialog.Overlay>
            {/* Layout wrapper only: clicks on it fall through to the overlay, so backdrop dismissal still works. */}
            <div className="pointer-events-none fixed inset-0 z-61 flex items-end justify-center md:items-center md:p-6">
              <Dialog.Content
                asChild
                forceMount
                aria-busy={busy}
                onEscapeKeyDown={(e) => busy && e.preventDefault()}
                onPointerDownOutside={(e) => busy && e.preventDefault()}
                onInteractOutside={(e) => busy && e.preventDefault()}
              >
                <motion.div
                  initial={
                    reduceMotion
                      ? { opacity: 0 }
                      : isDesktop
                        ? { opacity: 0, y: 12, scale: 0.97 }
                        : { y: "100%" }
                  }
                  animate={
                    reduceMotion
                      ? { opacity: 1 }
                      : isDesktop
                        ? {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              duration: 0.22,
                              ease: [0.22, 1, 0.36, 1],
                            },
                          }
                        : { y: 0, transition: RISE }
                  }
                  exit={
                    reduceMotion
                      ? { opacity: 0, transition: { duration: 0 } }
                      : isDesktop
                        ? {
                            opacity: 0,
                            y: 8,
                            scale: 0.98,
                            transition: { duration: 0.15 },
                          }
                        : {
                            y: "100%",
                            transition: { duration: 0.2, ease: [0.4, 0, 1, 1] },
                          }
                  }
                  drag={busy || reduceMotion || isDesktop ? false : "y"}
                  dragListener={false}
                  dragControls={dragControls}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={{ top: 0, bottom: 0.6 }}
                  onDragEnd={onDragEnd}
                  className={cn(
                    "pointer-events-auto relative w-full outline-none md:max-w-md",
                    "rounded-t-3xl border border-b-0 border-border bg-card text-card-foreground shadow-[0_-12px_40px_-12px] shadow-foreground/20",
                    "px-6 pt-3 pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))]",
                    "md:rounded-3xl md:border-b md:px-8 md:pt-8 md:pb-8 md:shadow-[0_24px_60px_-20px] md:shadow-foreground/25",
                    "before:pointer-events-none before:absolute before:inset-x-10 before:top-0 before:h-px before:bg-linear-to-r before:from-transparent before:via-gold/60 before:to-transparent",
                  )}
                >
                  <div
                    aria-hidden
                    onPointerDown={(e) => dragControls.start(e)}
                    className="-mx-6 flex h-8 cursor-grab touch-none items-start justify-center pt-1 md:hidden"
                  >
                    <span className="h-1 w-10 rounded-full bg-muted-foreground/30" />
                  </div>

                  <Dialog.Title className="font-heading text-3xl leading-tight font-medium tracking-tight">
                    {title}
                  </Dialog.Title>
                  <Dialog.Description className="mt-2 text-base leading-relaxed text-muted-foreground">
                    {description}
                  </Dialog.Description>
                  {children ? <div className="mt-4">{children}</div> : null}

                  {action ? (
                    <form action={action}>
                      {fields
                        ? Object.entries(fields).map(([name, value]) => (
                            <input
                              key={name}
                              type="hidden"
                              name={name}
                              value={value}
                            />
                          ))
                        : null}
                      {actions}
                    </form>
                  ) : (
                    actions
                  )}
                </motion.div>
              </Dialog.Content>
            </div>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
