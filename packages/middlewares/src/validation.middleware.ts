import { Request, Response, NextFunction, RequestHandler } from "express";
import { AnyZodObject, ZodError } from "zod";

export function validate(schema: AnyZodObject): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const formattedErrors = result.error.errors.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }));

      res.status(400).json({
        status: "error",
        errors: formattedErrors,
      });
      return;
    }

    req.body = result.data;
    next();
  };
}
