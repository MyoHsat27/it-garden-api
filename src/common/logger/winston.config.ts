import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  WinstonModuleOptions,
  WinstonModuleOptionsFactory,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class WinstonConfigService implements WinstonModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  createWinstonModuleOptions(): WinstonModuleOptions {
    const env = this.configService.get<string>('NODE_ENV') || 'production';
    const logDir = path.join(process.cwd(), 'logs');

    if (env === 'production' && !fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }

    const transports: winston.transport[] = [];

    if (env === 'production') {
      transports.push(
        new winston.transports.File({
          filename: path.join(logDir, 'error.log'),
          level: 'error',
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'warn.log'),
          level: 'warn',
        }),
        new winston.transports.File({
          filename: path.join(logDir, 'info.log'),
          level: 'info',
        }),
      );
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            nestWinstonModuleUtilities.format.nestLike('MayMyan', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
      );
    }

    return { transports };
  }
}
