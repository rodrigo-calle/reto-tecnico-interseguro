import * as z from "zod";

export const matrixSchema = z.array(z.array(z.number())).nonempty();
