import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { DataSource, QueryRunner } from 'typeorm';
import { RegisterUserDto } from './dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';
import { StudentsService } from '../students/students.service';
import { TeachersService } from '../teachers/teachers.service';
import { AdminsService } from '../admins/admins.service';
import { CryptoHelper } from '../../common';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly studentsService: StudentsService,
    private readonly teachersService: TeachersService,
    private readonly adminsService: AdminsService,
    private readonly tokenService: TokenService,
  ) {}

  private async _registerUserWithProfile(
    dto: RegisterUserDto,
    createProfile: (user: User, queryRunner: QueryRunner) => Promise<void>,
  ): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const existingUser = await this.usersService.findByEmail(dto.email);
      if (existingUser) {
        throw new ConflictException('Email is already in use.');
      }

      const newUser = new User();
      newUser.email = dto.email.toLowerCase();
      newUser.password = await CryptoHelper.hashPassword(dto.password);
      newUser.username = await this.usersService.generateUniqueUsername(
        dto.fullName,
      );
      const savedUser = await queryRunner.manager.save(newUser);

      await createProfile(savedUser, queryRunner);

      await queryRunner.commitTransaction();

      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async login(user: User) {
    if (!user) throw new UnauthorizedException('Unauthorized');
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    const hashedRefreshToken = CryptoHelper.hashToken(refreshToken);

    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('No user found with this email address.');
    }

    const isValidPassword = await CryptoHelper.validatePassword(
      password,
      user.password || '',
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return user;
  }

  async logout(user: User): Promise<{ message: string }> {
    await this.usersService.updateCurrentUser(user.id, { refreshToken: null });
    return {
      message: 'Logout successful.',
    };
  }
}
