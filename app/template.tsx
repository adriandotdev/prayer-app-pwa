import type { ReactNode } from "react";

/** A template remounts on every navigation (not on search-param changes), so each page eases in. */
export default function Template({ children }: { children: ReactNode }) {
  return <div className="ora-enter">{children}</div>;
}
