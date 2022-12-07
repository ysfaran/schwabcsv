import { NextFunction, Request, Response } from "express";
import { InvalidCSVURLError } from "../../evaluation/evaluation-service";
import { BadRequestError } from "../http-errors/bad-request-error";
import { HttpError } from "../http-errors/http-error";
import { InternalServerError } from "../http-errors/internal-server-error";
import { ValidationError } from "../validation-error";

export const mapToHttpError = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }

  switch (true) {
    case err instanceof HttpError:
      return next(err);
    case err instanceof InvalidCSVURLError:
      return next(
        new BadRequestError({
          message: err.message,
          detail: { type: "InvalidCSVURLError" },
        })
      );
    case err instanceof ValidationError:
      return next(
        new BadRequestError({
          message: err.message,
          detail: {
            type: "ValidationError",
            errors: (err as ValidationError).errors,
          },
        })
      );
    default:
      return next(
        new InternalServerError({ message: "An unexpected error occured" })
      );
  }
};
