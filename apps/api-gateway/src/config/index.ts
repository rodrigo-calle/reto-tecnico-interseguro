import * as z from "zod";
import "dotenv/config";

const envsSchema = z.object({
  PORT: z.coerce.number().default(6000),
  AUTH_SERVICE_URL: z.string({ message: "Auth service url is not defined" }),
  STATS_SERVICE_URL: z.string({ message: "Stats service url is not defined" }),
  QR_SERVICE_URL: z.string({ message: "QR service url is not defined" }),
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
