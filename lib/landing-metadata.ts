import { pageMetadata } from "@/lib/seo";
import { HOME_DESCRIPTION } from "@/lib/site";

/** Title, description and canonical ("/") for the signed-out landing page. */
export const landingMetadata = () =>
  pageMetadata({
    title: "Ora",
    absoluteTitle: "Ora: Pray the Rosary Online, Free Catholic Prayer App",
    description: HOME_DESCRIPTION,
    path: "/",
  });
