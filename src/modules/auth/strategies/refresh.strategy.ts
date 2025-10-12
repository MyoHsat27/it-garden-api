import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import { TokenService } from "../token.service";

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["refresh_token"];
  }
  return token;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  "refresh",
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        const secret = configService.get<string>("REFRESH_TOKEN_SECRET");
        done(null, secret);
      },
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<any> {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token not found");
    }

    return await this.tokenService.validateRefreshToken(refreshToken);
  }
}
