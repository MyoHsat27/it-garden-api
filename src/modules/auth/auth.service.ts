import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { CryptoService } from './crypto.service';
import { DataSource, QueryRunner } from 'typeorm';
import { RegisterLearnerDto, RegisterUserDto } from './dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities';
import { LearnersService } from '../learners/learners.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly usersService: UsersService,
    private readonly learnersService: LearnersService,
    private readonly tokenService: TokenService,
    private readonly cryptoService: CryptoService,
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
      newUser.password = await this.cryptoService.hashPassword(dto.password);
      newUser.username = await this.cryptoService.generateUniqueUsername(
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

  async registerLearner(dto: RegisterLearnerDto) {
    const createLearnerProfile = async (
      user: User,
      queryRunner: QueryRunner,
    ) => {
      await this.learnersService.create(
        {
          fullName: dto.fullName,
          user: user,
        },
        queryRunner.manager,
      );
    };

    const newUser = await this._registerUserWithProfile(
      dto,
      createLearnerProfile,
    );

    return this.login(newUser);
  }
  async login(user: User) {
    if (!user) throw new UnauthorizedException('Unauthorized');
    const accessToken = await this.tokenService.createAccessToken(user);
    const refreshToken = await this.tokenService.createRefreshToken(user);

    const hashedRefreshToken = this.cryptoService.hashToken(refreshToken);

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

    const isValidPassword = await this.cryptoService.validatePassword(
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
