import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info, ctx) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    ctx.switchToHttp().getRequest().user = user;
    return user;
  }
}
