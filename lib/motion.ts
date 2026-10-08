/** Same values as the --ease-ora token and enter timings in globals.css, for motion/react. */
export const EASE_ORA = [0.22, 1, 0.36, 1] as const;

export const DURATION = { quick: 0.15, base: 0.24, slow: 0.4 } as const;

/** Phone sheet spring; desktop uses EASE_ORA fades instead. */
export const RISE_SPRING = { type: "spring", damping: 34, stiffness: 380, mass: 0.9 } as const;
