import { z } from "zod";

export const intentionSchema = z.object({
  text: z.string().trim().min(1, "Write your intention.").max(2000, "Keep the intention under 2000 characters."),
});
