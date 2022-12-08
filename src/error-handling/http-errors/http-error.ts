import { BaseError } from "../base-error";

export interface HttpErrorProps {
  status: number;
  message: string;
  detail?: unknown;
}

export abstract class HttpError extends BaseError {
  public status: number;
  public detail?: unknown;

  constructor(props: HttpErrorProps) {
    super(props.message);
    this.status = props.status;
    this.detail = props.detail;
  }
}
