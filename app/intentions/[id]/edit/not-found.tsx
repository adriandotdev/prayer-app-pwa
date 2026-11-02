import { HandHeart } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

export default function IntentionNotFound() {
  return (
    <StatePage icon={HandHeart} title="Intention not found" description="It may have been deleted, or it isn’t yours to open.">
      <AppButton href="/intentions" size="lg">
        Back to intentions
      </AppButton>
    </StatePage>
  );
}
