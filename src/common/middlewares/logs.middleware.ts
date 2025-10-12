import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RequestLoggingMiddleware.name);

  private maskSensitiveData(data: any): any {
    if (typeof data !== "object" || data === null) {
      return data;
    }

    const sensitiveFields = [
      "password",
      "authorization",
      "accessToken",
      "refreshToken",
      "tempAuthToken",
      "otp",
    ];
    const maskedData = { ...data };

    for (const field of sensitiveFields) {
      if (maskedData[field]) {
        maskedData[field] = "***";
      }
    }

    return maskedData;
  }

  private shouldLogResponse(req: Request): boolean {
    const excludedRoutes = [{ method: "GET", path: "/api/v3/users/me" }];

    return !excludedRoutes.some(
      (route) =>
        route.method === req.method && req.originalUrl.startsWith(route.path),
    );
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl, headers, body } = req;
    const start = Date.now();
    const requestId = uuidv4();

    (req as any).requestId = requestId;

    const maskedHeaders = this.maskSensitiveData({
      ...headers,
      authorization: headers.authorization ? "***" : undefined,
    });
    const maskedBody = this.maskSensitiveData(body);

    const clientIp =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    this.logger.log(
      `Request ID: ${requestId} - Incoming Request: ${method} ${originalUrl}`,
    );
    this.logger.debug(`Request ID: ${requestId} - Client IP: ${clientIp}`);
    this.logger.debug(
      `Request ID: ${requestId} - Headers: ${JSON.stringify(maskedHeaders)}`,
    );
    this.logger.debug(
      `Request ID: ${requestId} - Body: ${JSON.stringify(maskedBody)}`,
    );

    const originalSend = res.send.bind(res);
    res.send = (body) => {
      const duration = Date.now() - start;
      const { statusCode } = res;

      if (this.shouldLogResponse(req)) {
        let responseBody;
        try {
          responseBody = typeof body === "string" ? JSON.parse(body) : body;
        } catch (error) {
          responseBody = body;
        }

        const maskedResponseBody = this.maskSensitiveData(responseBody);

        setImmediate(() => {
          this.logger.log(
            `Request ID: ${requestId} - Outgoing Response: ${method} ${originalUrl} ${statusCode} - ${duration}ms`,
          );
          if (typeof maskedResponseBody === "string") {
            this.logger.debug(
              `Request ID: ${requestId} - Response: ${maskedResponseBody}`,
            );
          } else {
            this.logger.debug(
              `Request ID: ${requestId} - Response: ${JSON.stringify(maskedResponseBody)}`,
            );
          }

          if (statusCode >= 400) {
            this.logger.error(
              `Request ID: ${requestId} - Error Response: ${method} ${originalUrl} ${statusCode}`,
            );
          }
        });
      }

      return originalSend(body);
    };

    next();
  }
}
