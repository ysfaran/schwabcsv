import { HttpError } from "./http-error";

export class InternalServerError extends HttpError {
  public static STATUS_CODE = 500;

  constructor({ message, detail }: { message: string; detail?: unknown }) {
    super({ message, detail, status: InternalServerError.STATUS_CODE });
  }
}
