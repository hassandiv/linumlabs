import { HttpCode, AppErrorArgs } from '../ts-models/app-error';

export class AppError extends Error {
  public readonly httpCode: HttpCode;
  public readonly description: string;
  public readonly errors: any[];
  public readonly isOperational: boolean = true;

  constructor(args: AppErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, AppError.prototype);

    this.httpCode = args.httpCode;
    this.errors = args.errors!;
    this.description = args.description!;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
