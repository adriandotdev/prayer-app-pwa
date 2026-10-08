import { z } from "zod";

export const collectionSchema = z.object({
  name: z.string().trim().min(1, "Give your collection a name.").max(100, "Keep the name under 100 characters."),
});
