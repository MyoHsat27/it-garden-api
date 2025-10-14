import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ConfirmEmailSetupDecorator,
  LoginUsersDecorator,
  LogoutUsersDecorator,
  RefreshTokenDecorator,
  VerifyEmailSetupDecorator,
} from './decorators';
import { Throttle } from '@nestjs/throttler';
import { VerificationService } from './verification.service';
import { ValidateOtpDto } from './dto';
import { AuthHelper } from './helpers';
import { Request, Response } from 'express';
import { JwtAuthGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelper: AuthHelper,
    private readonly verificationService: VerificationService,
  ) {}

  private async handleAuthResponse(
    res: Response,
    authPromise: Promise<{ accessToken: string; refreshToken: string }>,
  ) {
    const tokens = await authPromise;
    this.authHelper.setRefreshTokenCookie(res, tokens.refreshToken);
    return { accessToken: tokens.accessToken };
  }

  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  @LoginUsersDecorator()
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.handleAuthResponse(
      res,
      this.authService.login(req.user as any),
    );
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @LogoutUsersDecorator()
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.authService.logout(req.user as any);
    this.authHelper.clearRefreshTokenCookie(res);
    return { message: 'Logout successful' };
  }

  @Post('refresh-token')
  @UseGuards(RefreshTokenGuard)
  @RefreshTokenDecorator()
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.handleAuthResponse(
      res,
      this.authService.login(req.user as any),
    );
  }

  @Post('verify-email')
  @Throttle({ default: { limit: 1, ttl: 50000 } })
  @UseGuards(JwtAuthGuard)
  @VerifyEmailSetupDecorator()
  @HttpCode(HttpStatus.OK)
  async verifyEmailSetup(@Req() req: any) {
    return await this.verificationService.sendEmailVerification(req.user);
  }

  @Post('confirm-email')
  @UseGuards(JwtAuthGuard)
  @ConfirmEmailSetupDecorator()
  @HttpCode(HttpStatus.OK)
  async confirmEmailSetup(@Req() req: any, @Body() body: ValidateOtpDto) {
    return await this.verificationService.verifyEmailVerification(
      req.user,
      body,
    );
  }
}
