import Image from "next/image";

import { cn } from "@/lib/utils";

/** The Ora mark: navy ring on light themes, gold ring on dark. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <>
      <Image
        src="/brand/ora-mark-light.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
        className={cn("size-8 dark:hidden", className)}
      />
      <Image
        src="/brand/ora-mark-gold.svg"
        alt=""
        width={32}
        height={32}
        unoptimized
        className={cn("hidden size-8 dark:block", className)}
      />
    </>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-display font-medium tracking-tight", className)}>
      <LogoMark />
      Ora
    </span>
  );
}
