"use client";

import { useEffect } from "react";

import { flushPendingRosaries } from "@/lib/rosary/pending";

/** Sends Rosaries finished offline to the server when the app opens or comes back online. */
export function RosarySync() {
  useEffect(() => {
    void flushPendingRosaries();
    const onOnline = () => void flushPendingRosaries();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);
  return null;
}
