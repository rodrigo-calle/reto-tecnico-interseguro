import * as z from "zod";
import "dotenv/config";

const envsSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string({ message: "Database url is not defined" }),
  JWT_SECRET: z.string({ message: "JWT secret is not defined" }),
  TOKEN_EXPIRES_IN: z.coerce.number({
    message: "Token expires in is not defined",
  }),
});

type Envs = z.infer<typeof envsSchema>;

export const loadEnvs = (): Envs => {
  try {
    const envs = process.env;
    const parsedEnvs = envsSchema.parse(envs);
    if (!parsedEnvs) {
      throw new Error("Invalid envs");
    }
    return parsedEnvs;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.message);
    }
    throw error;
  }
};

const getEnvs = () => {
  return loadEnvs();
};

export const envs = getEnvs();
