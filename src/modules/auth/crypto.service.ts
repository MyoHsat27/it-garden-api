import { Injectable, Logger } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt, createHash } from 'crypto';
import { promisify } from 'util';
import { UsersService } from '../users/users.service';
import { slugifyString } from '@common';

const scrypt = promisify(_scrypt);

@Injectable()
export class CryptoService {
  private readonly logger = new Logger(CryptoService.name);

  constructor(private readonly usersService: UsersService) {}

  async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    if (!password || !storedPassword) {
      return false;
    }
    const [salt, storedHash] = storedPassword.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }

  hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  async generateAndHashOtp6Figures(): Promise<[string, string]> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = randomBytes(8).toString('hex');
    const hashedOtp = (await scrypt(otp, salt, 32)) as Buffer;
    return [otp, `${salt}.${hashedOtp.toString('hex')}`];
  }

  async validateOtp(otp: string, storedOtp: string): Promise<boolean> {
    const [salt, storedHash] = storedOtp.split('.');
    const hash = (await scrypt(otp, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }

  async generateUniqueUsername(fullName: string): Promise<string> {
    let username = slugifyString(fullName);

    let existingUser = await this.usersService.findByUsername(username);

    while (existingUser) {
      const randomSuffix = randomBytes(2).toString('hex');
      const newUsername = `${username}_${randomSuffix}`;

      existingUser = await this.usersService.findByUsername(newUsername);

      if (!existingUser) {
        username = newUsername;
      }
    }

    return username;
  }
}
