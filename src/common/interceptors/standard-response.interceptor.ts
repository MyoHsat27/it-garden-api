import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Response, Request } from "express";
import { IPaginationMeta, IStandardResponse } from "../interfaces";

@Injectable()
export class StandardResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const http = ctx.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();
    const requestId = (request as any).requestId || "N/A";

    return next.handle().pipe(
      map((data: unknown) => {
        const statusCode = response.statusCode || HttpStatus.OK;
        const isSuccessful = statusCode >= 200 && statusCode < 300;

        const standardResponse: IStandardResponse<typeof data> = {
          status: isSuccessful ? "success" : "error",
          statusCode,
          data: isSuccessful ? (data ?? null) : null,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.originalUrl,
            method: request.method,
          },
        };

        if (isSuccessful && this.isPaginated(data)) {
          standardResponse.data = data.items;
          if (!standardResponse.meta) {
            standardResponse.meta = {
              timestamp: new Date().toISOString(),
              path: request.originalUrl,
              method: request.method,
            };
          }
          standardResponse.meta.pagination = this.extractPaginationMeta(data);
        }

        if (!isSuccessful && data) {
          standardResponse.error = this.normalizeError(data);
        }

        return standardResponse;
      }),
    );
  }

  private isPaginated(data: unknown): data is { items: any[]; meta: any } {
    return (
      typeof data === "object" &&
      data !== null &&
      "items" in data &&
      Array.isArray((data as any).items) &&
      "meta" in data
    );
  }

  private extractPaginationMeta(data: {
    meta: IPaginationMeta;
  }): IPaginationMeta {
    const meta = data.meta;
    return {
      page: meta.page,
      limit: meta.limit,
      totalItems: meta.totalItems,
      totalPages: Math.ceil(meta.totalItems / meta.limit),
      hasPreviousPage: meta.page > 1,
      hasNextPage: meta.page < Math.ceil(meta.totalItems / meta.limit),
    };
  }

  private normalizeError(error: unknown): {
    message: string;
    code?: string;
    details?: unknown;
  } {
    if (typeof error === "string") {
      return { message: error };
    }

    if (error instanceof Error) {
      return {
        message: error.message,
        code:
          typeof (error as { code?: string }).code === "string"
            ? (error as { code?: string }).code
            : undefined,
        details:
          "details" in error
            ? (error as { details?: unknown }).details
            : undefined,
      };
    }

    if (typeof error === "object" && error !== null) {
      const errObj = error as Record<string, unknown>;
      return {
        message:
          typeof errObj.message === "string" ? errObj.message : "Unknown error",
        code: typeof errObj.code === "string" ? errObj.code : undefined,
        details: errObj.details,
      };
    }

    return { message: "Unknown error occurred" };
  }
}
