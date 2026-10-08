import type { ReactNode } from "react";

import { PageTransition } from "@/components/motion/page-transition";

/** Wraps every page in the entrance animation; see PageTransition for why it is keyed by pathname. */
export default function Template({ children }: { children: ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
