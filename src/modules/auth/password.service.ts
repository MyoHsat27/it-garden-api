import { ChangePasswordDto } from './dto/change-password.dto';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { TokenService } from './token.service';
import { UsersService } from '../users/users.service';
import { CryptoHelper } from '../../common';
import { NotificationsService } from '../notifications/notifications.service';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/entities';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailProducer } from '../../infrastructure/queues/email';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly emailProducer: EmailProducer,
  ) {}

  async changePassword(
    user: User,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const logger = new Logger('TEST');
    const existingUser = await this.usersService.findById(user.id);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword } = changePasswordDto;

    const isValidOldPassword = await CryptoHelper.validatePassword(
      oldPassword,
      existingUser.password ?? '',
    );
    if (!isValidOldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }
    logger.log(changePasswordDto);
    existingUser.password = await CryptoHelper.hashPassword(newPassword);

    await this.usersService.updateCurrentUser(existingUser.id, existingUser);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new NotFoundException(
        'User with this email address was not found.',
      );
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000);

    await this.usersService.updateCurrentUser(user.id, {
      passwordResetCode: resetToken,
      passwordResetExpires: resetTokenExpiry,
    });

    await this.sendForgotPasswordEmail(user.email, resetToken);

    return { message: 'Password reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const { resetToken, newPassword } = dto;
    const user = await this.usersService.findByResetToken(resetToken);
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    )
      throw new BadRequestException(
        'Password reset token is invalid or has expired.',
      );

    user.password = await CryptoHelper.hashPassword(newPassword);
    user.passwordResetCode = null;
    user.passwordResetExpires = null;

    await this.usersService.updateCurrentUser(user.id, user);

    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    return {
      accessToken,
      refreshToken,
    };
  }

  async sendForgotPasswordEmail(to: string, token: string): Promise<void> {
    await this.emailProducer.sendForgotPasswordEmail(to, token);
  }
}
