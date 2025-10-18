import { randomBytes, scrypt as _scrypt, createHash } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

export class CryptoHelper {
  static async hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return `${salt}.${hash.toString('hex')}`;
  }

  static async validatePassword(
    password: string,
    storedPassword: string,
  ): Promise<boolean> {
    if (!password || !storedPassword) return false;

    const [salt, storedHash] = storedPassword.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }

  static hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  static async generateAndHashOtp6Figures(): Promise<[string, string]> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = randomBytes(8).toString('hex');
    const hashedOtp = (await scrypt(otp, salt, 32)) as Buffer;
    return [otp, `${salt}.${hashedOtp.toString('hex')}`];
  }

  static async validateOtp(otp: string, storedOtp: string): Promise<boolean> {
    const [salt, storedHash] = storedOtp.split('.');
    const hash = (await scrypt(otp, salt, 32)) as Buffer;
    return storedHash === hash.toString('hex');
  }
}
