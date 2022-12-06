import { HttpError } from "./http-error";

export class BadRequestError extends HttpError {
  public static STATUS_CODE = 400;

  constructor({ message, detail }: { message: string; detail?: unknown }) {
    super({ message, detail, status: BadRequestError.STATUS_CODE });
  }
}
