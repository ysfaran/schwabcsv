import { NextFunction, Request, Response } from "express";
import { HttpError } from "../http-errors/http-error";

export const sendError = (
  err: HttpError,
  req: Request,
  res: Response,
  // this parameter is required for express to classify this function as an error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  return res.status(err.status).json({
    status: err.status,
    name: err.name,
    message: err.message,
    detail: err.detail,
  });
};
