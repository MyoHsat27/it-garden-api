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
import { VerificationService } from './verification.service';
import { ChangePasswordDto, ValidateOtpDto } from './dto';
import { AuthHelper } from './helpers';
import { Request, Response } from 'express';
import { JwtAuthGuard, LocalAuthGuard, RefreshTokenGuard } from './guards';
import { PasswordService } from './password.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly authHelper: AuthHelper,
    private readonly verificationService: VerificationService,
    private readonly passwordService: PasswordService,
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

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgetPassword(@Body() dto: ForgotPasswordDto) {
    return await this.passwordService.forgotPassword(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.handleAuthResponse(
      res,
      this.passwordService.resetPassword(dto),
    );
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(@Req() req: Request, @Body() dto: ChangePasswordDto) {
    return await this.passwordService.changePassword(req.user as any, dto);
  }

  @Post('verify-email')
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
