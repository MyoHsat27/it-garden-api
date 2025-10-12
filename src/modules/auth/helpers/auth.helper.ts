import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import * as ms from 'ms';

@Injectable()
export class AuthHelper {
  constructor(private readonly configService: ConfigService) {}

  public setRefreshTokenCookie(res: Response, refreshToken: string): void {
    const refreshTokenTTL = this.configService.get<string>(
      'REFRESH_TOKEN_TTL',
      '7d',
    ) as ms.StringValue;
    const maxAge = ms(refreshTokenTTL);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
      maxAge: maxAge,
    });
  }

  public clearRefreshTokenCookie(res: Response): void {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/v1/auth',
    });
  }
}
