import { z } from "zod";

export const acceptMessageSchema = z.object({
  iAcceptMessages: z.boolean(),
});
