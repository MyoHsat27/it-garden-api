import { Injectable, LoggerService, Scope, Inject } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { Request, Response } from "express";

@Injectable({ scope: Scope.REQUEST })
export class AppLogger implements LoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly loggerService: LoggerService,
  ) {}

  setContext(context: string) {
    this.context = context;
  }

  log(message: string, meta?: Record<string, any>): void {
    this.loggerService.log(message, { ...meta, context: this.context });
  }

  error(message: string, trace?: string, meta?: Record<string, any>): void {
    this.loggerService.error(message, {
      stack: trace,
      ...meta,
      context: this.context,
    });
  }

  warn(message: string, meta?: Record<string, any>): void {
    this.loggerService.warn(message, { ...meta, context: this.context });
  }

  debug(message: string, meta?: Record<string, any>): void {
    this.loggerService.debug!(message, { ...meta, context: this.context });
  }

  verbose(message: string, meta?: Record<string, any>): void {
    this.loggerService.verbose!(message, { ...meta, context: this.context });
  }

  httpLog(request: Request, response: Response, meta?: Record<string, any>) {
    const { method, originalUrl, ip, headers } = request;
    const { statusCode } = response;
    const contentLength = response.get("content-length");
    const userAgent = headers["user-agent"] || "";

    this.loggerService.log("HTTP Request", {
      context: "HTTP",
      method,
      url: originalUrl,
      statusCode,
      clientIp: ip,
      userAgent,
      contentLength,
      ...meta,
    });
  }
}
