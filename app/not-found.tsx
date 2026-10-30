import { Compass } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

export default function NotFound() {
  return (
    <StatePage icon={Compass} title="Page not found" description="We couldn’t find what you were looking for.">
      <AppButton href="/" size="lg">
        Return home
      </AppButton>
    </StatePage>
  );
}
