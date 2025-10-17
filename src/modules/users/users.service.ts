import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities';
import { UpdateUserDto } from './dto';
import { UserRole } from './enums';
import { CryptoHelper, slugifyString } from '../../common';
import { randomBytes } from 'crypto';

export type GoogleProfile = {
  email: string;
  googleId: string;
  isEmailVerified: boolean;
  provider: string;
};

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ email });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ username });
  }

  async findByResetToken(passwordResetCode: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ passwordResetCode });
  }

  async findByRefreshToken(hashedRefreshToken: string): Promise<User | null> {
    return await this.userRepo.findOneBy({ refreshToken: hashedRefreshToken });
  }

  async findById(id: number): Promise<User | null> {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['studentProfile', 'teacherProfile', 'adminProfile'],
    });
    return user;
  }

  async create(dto: {
    username: string;
    email: string;
    password: string;
    userRole: UserRole;
  }) {
    const hashed = await CryptoHelper.hashPassword(dto.password);
    const user = this.userRepo.create({
      ...dto,
      password: hashed,
    });
    return await this.userRepo.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<any> {
    return await this.userRepo.update(id, updateData);
  }

  async updateCurrentUser(
    id: number,
    attrs: Partial<UpdateUserDto>,
  ): Promise<User> {
    const user = await this.userRepo.preload({ id, ...attrs });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userRepo.save(user);

    return user;
  }

  async remove(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return await this.userRepo.remove(user);
  }

  async generateUniqueUsername(fullName: string): Promise<string> {
    let username = slugifyString(fullName);

    let existingUser = await this.findByUsername(username);

    while (existingUser) {
      const randomSuffix = randomBytes(2).toString('hex');
      const newUsername = `${username}_${randomSuffix}`;

      existingUser = await this.findByUsername(newUsername);

      if (!existingUser) {
        username = newUsername;
      }
    }

    return username;
  }
}
