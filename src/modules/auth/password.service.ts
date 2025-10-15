import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import * as crypto from 'crypto';
import { TokenService } from './token.service';
import { ChangePasswordDto } from './dto';
import { UsersService } from '../users/users.service';
import { CryptoHelper } from '../../common';

@Injectable()
export class PasswordService {
  private readonly logger = new Logger(PasswordService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async changePassword(
    userId: number,
    changePasswordDto: ChangePasswordDto,
  ): Promise<void> {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { oldPassword, newPassword } = changePasswordDto;

    const isValidOldPassword = await CryptoHelper.validatePassword(
      oldPassword,
      user.password ?? '',
    );
    if (!isValidOldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    user.password = await CryptoHelper.hashPassword(newPassword);

    await this.usersService.updateCurrentUser(user.id, user);
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
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
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const user = await this.usersService.findByResetToken(resetToken);
    if (
      !user ||
      !user.passwordResetExpires ||
      user.passwordResetExpires < new Date()
    ) {
      throw new BadRequestException(
        'Password reset token is invalid or has expired.',
      );
    }

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
}
