import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from './crypto.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private readonly REFRESH_TOKEN_SECRET: string;
  private readonly ACCESS_TOKEN_SECRET: string;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly configService: ConfigService,
  ) {
    this.REFRESH_TOKEN_SECRET = this.configService.get<string>(
      'REFRESH_TOKEN_SECRET',
      '',
    );
    this.ACCESS_TOKEN_SECRET = this.configService.get<string>(
      'ACCESS_TOKEN_SECRET',
      '',
    );
  }

  async createAccessToken(user: User): Promise<string> {
    const payload = {
      sub: user.id,
      email: user.email,
      iss: 'https://api.yourapp.com',
      aud: 'your-client-app',
    };
    return this.jwtService.sign(payload, {
      secret: this.ACCESS_TOKEN_SECRET,
    });
  }

  async createRefreshToken(user: User): Promise<string> {
    const refreshTokenPayload = {
      sub: user.id,
      email: user.email,
      iss: 'https://api.yourapp.com',
      aud: 'your-client-app',
    };

    return this.jwtService.sign(refreshTokenPayload, {
      secret: this.REFRESH_TOKEN_SECRET,
    });
  }

  async validateRefreshToken(providedToken: string): Promise<User> {
    const hashedToken = this.cryptoService.hashToken(providedToken);
    const user = await this.usersService.findByRefreshToken(hashedToken);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
