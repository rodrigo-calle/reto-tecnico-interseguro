import * as z from "zod";

export const registerSchema = z.object({
  username: z.string(),
  password: z.string(),
});
