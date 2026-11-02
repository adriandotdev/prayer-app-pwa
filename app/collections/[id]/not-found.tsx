import { FolderOpen } from "lucide-react";

import { AppButton } from "@/components/app-button";
import { StatePage } from "@/components/layout/state-page";

export default function CollectionNotFound() {
  return (
    <StatePage icon={FolderOpen} title="Collection not found" description="It may have been deleted, or it isn’t yours to open.">
      <AppButton href="/collections" size="lg">
        Back to collections
      </AppButton>
    </StatePage>
  );
}
