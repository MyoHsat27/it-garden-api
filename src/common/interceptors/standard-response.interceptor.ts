import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpStatus,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response, Request } from 'express';
import { IPaginationMeta, IStandardResponse } from '../interfaces';
import { PaginatedResponseDto } from '../dtos';

@Injectable()
export class StandardResponseInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const http = ctx.switchToHttp();
    const response = http.getResponse<Response>();
    const request = http.getRequest<Request>();

    return next.handle().pipe(
      map((data: unknown) => {
        const statusCode = response.statusCode || HttpStatus.OK;
        const isSuccessful = statusCode >= 200 && statusCode < 300;

        const standardResponse: IStandardResponse<typeof data> = {
          status: isSuccessful ? 'success' : 'error',
          statusCode,
          data: null,
          meta: {
            timestamp: new Date().toISOString(),
            path: request.originalUrl,
            method: request.method,
          },
        };

        if (isSuccessful && this.isPaginatedResponse(data)) {
          const pagination = this.extractPaginationMeta(data);
          standardResponse.data = data.data;
          standardResponse.meta.pagination = pagination;
        } else if (isSuccessful) {
          standardResponse.data = data ?? null;
        } else {
          standardResponse.error = this.normalizeError(data);
        }

        if (!isSuccessful && data) {
          standardResponse.error = this.normalizeError(data);
        }

        return standardResponse;
      }),
    );
  }

  private isPaginatedResponse(
    data: unknown,
  ): data is PaginatedResponseDto<any> {
    return (
      typeof data === 'object' &&
      data !== null &&
      'data' in data &&
      'totalItems' in data &&
      'page' in data &&
      'limit' in data
    );
  }

  private extractPaginationMeta(
    data: PaginatedResponseDto<any>,
  ): IPaginationMeta {
    return {
      page: data.page,
      limit: data.limit,
      totalItems: data.totalItems,
      totalPages: data.totalPages,
      hasPreviousPage: data.hasPreviousPage,
      hasNextPage: data.hasNextPage,
    };
  }

  private normalizeError(error: unknown): {
    message: string;
    code?: string;
    details?: unknown;
  } {
    if (typeof error === 'string') return { message: error };

    if (error instanceof Error) return { message: error.message };

    if (typeof error === 'object' && error !== null) {
      const e = error as Record<string, unknown>;
      return {
        message: (e.message as string) || 'Unknown error',
        code: e.code as string,
      };
    }

    return { message: 'Unknown error' };
  }
}
