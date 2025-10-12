import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from "@nestjs/common";
import { TokenExpiredError } from "jsonwebtoken";

@Catch(TokenExpiredError)
export class JwtExpiredFilter implements ExceptionFilter {
  catch(exception: TokenExpiredError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = HttpStatus.UNAUTHORIZED;

    response.status(status).json({
      statusCode: status,
      message: "JWT token has expired!",
    });
  }
}
