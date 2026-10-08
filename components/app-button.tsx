import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "destructive";
type Size = "md" | "lg" | "icon";

const BASE =
  "inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl font-medium " +
  "transition-colors active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring " +
  "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-5 [&_svg]:shrink-0";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-primary-foreground hover:bg-primary/90",
  outline: "border border-border bg-background text-foreground hover:bg-secondary",
  ghost: "text-foreground hover:bg-secondary",
  destructive: "bg-destructive text-background hover:bg-destructive/90",
};

// Touch targets: never below 44px, primary actions 52–56px.
const SIZES: Record<Size, string> = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-6 text-lg",
  icon: "size-11 px-0",
};

type Common = { variant?: Variant; size?: Size };

type Pending = {
  /** Shows the pulsing dot and disables the button while an async action runs. */
  pending?: boolean;
  /** Replaces the children while pending. */
  pendingLabel?: ReactNode;
};

type AppButtonProps =
  | (Common & Pending & ComponentProps<"button"> & { href?: undefined })
  | (Common & Omit<ComponentProps<typeof Link>, "href"> & { href: string });

export function AppButton({ variant = "primary", size = "md", className, ...props }: AppButtonProps) {
  const classes = cn(BASE, VARIANTS[variant], SIZES[size], className);
  if ("href" in props && props.href !== undefined) {
    return <Link {...props} className={classes} />;
  }
  const { type = "button", pending, pendingLabel, children, disabled, ...rest } = props as ComponentProps<"button"> & Pending;
  return (
    <button type={type} {...rest} disabled={disabled || pending} aria-busy={pending || undefined} className={classes}>
      {pending ? (
        <>
          <span aria-hidden className="size-2 animate-pulse rounded-full bg-current" />
          {pendingLabel !== undefined ? pendingLabel : children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
