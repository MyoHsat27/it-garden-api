import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppLogger } from './app-logger.service';

@Injectable()
export class LoggerContextMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  public use(req: Request, res: Response, next: NextFunction): void {
    const start = Date.now();

    this.logger.log('Incoming request', {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      body: this.sanitizeRequestBody(
        req.body as Record<string, unknown> | undefined,
      ),
    });

    res.on('finish', () => {
      const duration = Date.now() - start;

      this.logger.httpLog(req, res, {
        duration: `${duration}ms`,
      });
    });

    next();
  }

  private sanitizeRequestBody(
    body: Record<string, unknown> | undefined,
  ): Record<string, unknown> | undefined {
    if (!body) return body;

    const sensitiveFields = ['password', 'token', 'authorization'];

    return Object.keys(body).reduce((acc: Record<string, unknown>, key) => {
      acc[key] = sensitiveFields.includes(key) ? '***REDACTED***' : body[key];
      return acc;
    }, {});
  }
}
