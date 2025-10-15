import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './password.service';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { VerificationService } from './verification.service';
import { JwtStrategy, LocalStrategy, RefreshTokenStrategy } from './strategies';
import { AuthHelper } from './helpers';
import { TeachersModule } from '../teachers/teachers.module';
import { AdminsModule } from '../admins/admins.module';
import { UsersModule } from '../users/users.module';
import { StudentsModule } from '../students/students.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ session: false }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('ACCESS_TOKEN_SECRET'),
        signOptions: { expiresIn: configService.get('ACCESS_TOKEN_TTL') },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    TeachersModule,
    StudentsModule,
    AdminsModule,
    NotificationsModule,
  ],
  controllers: [AuthController],
  providers: [
    // Services
    AuthService,
    PasswordService,
    TokenService,
    VerificationService,

    // Helpers
    AuthHelper,

    // Strategies
    JwtStrategy,
    LocalStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
