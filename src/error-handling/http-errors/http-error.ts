import { BaseError } from "../base-error";

export interface HttpErrorProps {
  status: number;
  message: string;
  detail?: any;
}

export abstract class HttpError extends BaseError {
  public status: number;
  public detail?: any;

  constructor(props: HttpErrorProps) {
    super(props.message);
    this.status = props.status;
    this.detail = props.detail;
  }
}
