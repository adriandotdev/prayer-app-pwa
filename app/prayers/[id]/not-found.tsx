import { BookOpen } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

export default function PrayerNotFound() {
  return (
    <StatePage icon={BookOpen} title="Prayer not found" description="It may have been deleted, or it isn’t yours to open.">
      <AppButton href="/prayers" size="lg">
        Back to prayers
      </AppButton>
    </StatePage>
  );
}
