import { z } from "zod";

const matrixSchema = z.array(z.array(z.number()).min(1)).min(1);

export const matricesSchema = z.object({
  matrices: z
    .array(matrixSchema)
    .min(1)
    .refine(
      (matrices) => {
        const firstRows = matrices[0].length;
        const firstCols = matrices[0][0].length;
        return matrices.every(
          (m) => m.length === firstRows && m[0].length === firstCols
        );
      },
      {
        message: "Todas las matrices deben tener las mismas dimensiones",
      }
    ),
});
