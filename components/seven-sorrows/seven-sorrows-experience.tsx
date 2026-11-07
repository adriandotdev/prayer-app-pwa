"use client";

import { useMemo, type ReactNode } from "react";

import { ChapletExperience } from "@/components/practice/chaplet-experience";
import { SorrowTracker } from "@/components/seven-sorrows/sorrow-tracker";
import { buildSevenSorrows } from "@/data/seven-sorrows/sequence";

export function SevenSorrowsExperience({ guide }: { guide?: ReactNode }) {
  const sequence = useMemo(() => buildSevenSorrows(), []);
  return (
    <ChapletExperience
      practice="seven-sorrows"
      sequence={sequence}
      title="Seven Sorrows"
      description="Keep company with Mary through seven sorrows."
      about="A devotion to the seven sorrows of Mary: seven Hail Marys for each sorrow, then three more at the end. It follows her from Simeon’s prophecy to the burial of Jesus, and takes about 20 minutes."
      doneMessage="You have finished the Chaplet of the Seven Sorrows. May Mary’s company in sorrow lead you to the joy of the resurrection."
      guide={guide}
      renderTracker={(props) => <SorrowTracker sequence={sequence} {...props} />}
    />
  );
}
