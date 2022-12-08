import { BaseError } from "./base-error";
import { ValidationError as ExpressValidationError } from "express-validator";

export interface ValidationErrorProps {
  message?: string;
  errors: ExpressValidationError[];
}

export class ValidationError extends BaseError {
  public errors: ExpressValidationError[];

  constructor({
    message = "A validation error occurred",
    errors,
  }: ValidationErrorProps) {
    super(message);
    this.errors = errors;
  }
}
