import { HttpStatus } from "@nestjs/common";

export interface IPaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface IStandardResponse<T> {
  status: "success" | "error";
  statusCode: HttpStatus;
  data: T | null;
  meta?: {
    timestamp: string;
    path?: string;
    method?: string;
    pagination?: IPaginationMeta;
    [key: string]: unknown;
  };
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };
}
