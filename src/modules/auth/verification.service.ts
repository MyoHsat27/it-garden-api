import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { ValidateOtpDto } from './dto';
import { User } from '../users/entities';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class VerificationService {
  private readonly logger = new Logger(VerificationService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly cryptoService: CryptoService,
    private readonly notificationService: NotificationsService,
  ) {}

  async sendEmailVerification(user: User): Promise<{ message: string }> {
    const [generatedOtp, hashedOtp] =
      await this.cryptoService.generateAndHashOtp6Figures();

    if (user.isEmailVerified === true) {
      throw new BadRequestException(
        'This email address has already been verified.',
      );
    }

    await this.usersService.update(user.id, {
      verifyEmailToken: hashedOtp,
      verifyEmailExpires: new Date(Date.now() + 3600000),
    });

    await this.notificationService.sendVerificationEmail(
      user.email,
      generatedOtp,
    );

    return { message: 'OTP Code Has Been Sent' };
  }

  async verifyEmailVerification(
    user: any,
    validateOtpDto: ValidateOtpDto,
  ): Promise<{ message: string }> {
    const { otp } = validateOtpDto;

    const validatedUser = await this.getUserAndValidateEmailOtp(user, otp);

    await this.usersService.update(validatedUser.id, {
      isEmailVerified: true,
      verifyEmailToken: null,
      verifyEmailExpires: null,
    });

    return { message: 'Email has been verified' };
  }

  async getUserAndValidateEmailOtp(user: User, otp: string) {
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!user.verifyEmailToken || user.verifyEmailExpires === null) {
      throw new NotFoundException(
        'No pending email verification found. Please request a new OTP.',
      );
    }

    if (new Date(Date.now()) > user.verifyEmailExpires) {
      throw new BadRequestException(
        'Your OTP has expired. Please request a new one.',
      );
    }

    const isOtpValid = await this.cryptoService.validateOtp(
      otp,
      user.verifyEmailToken,
    );

    if (!isOtpValid) {
      throw new UnauthorizedException(
        'The OTP you entered is incorrect. Please try again.',
      );
    }

    return user;
  }
}
