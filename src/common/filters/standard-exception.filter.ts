import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class StandardExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = (request as any).requestId || "N/A";

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorPayload: Record<string, unknown> = {
      message: "Internal server error",
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      errorPayload =
        typeof exceptionResponse === "object"
          ? (exceptionResponse as Record<string, unknown>)
          : { message: exceptionResponse };
    } else if (exception instanceof Error) {
      errorPayload = { message: exception.message };
    }

    response.status(status).json({
      status: "error",
      statusCode: status,
      data: null,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.originalUrl,
        method: request.method,
        requestId,
      },
      error: errorPayload,
    });
  }
}
