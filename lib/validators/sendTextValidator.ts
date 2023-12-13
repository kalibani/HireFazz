import { z } from "zod";

export const SendMessageValidator = z.object({
  text: z.string(),
});
