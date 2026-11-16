"use client";

import { useMemo, type ReactNode } from "react";

import { ChapletExperience } from "@/components/practice/chaplet-experience";
import { StationTracker } from "@/components/stations-of-the-cross/station-tracker";
import { buildStationsOfTheCross } from "@/data/stations-of-the-cross/sequence";

export function StationsOfTheCrossExperience({ guide }: { guide?: ReactNode }) {
  const sequence = useMemo(() => buildStationsOfTheCross(), []);
  return (
    <ChapletExperience
      practice="stations-of-the-cross"
      sequence={sequence}
      title="Stations of the Cross"
      description="Walk the road of the cross with Jesus."
      about="Fourteen stops along the way of the cross, from the condemnation of Jesus to his burial. At each station you say a short versicle and prayer, then an Our Father, a Hail Mary and a Glory Be. It takes about 30 minutes."
      doneMessage="You have walked the Stations of the Cross. By his holy Cross, Christ has redeemed the world."
      guide={guide}
      renderTracker={(props) => <StationTracker sequence={sequence} {...props} />}
    />
  );
}
