import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as path from 'path';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USER', 'root'),
    password: configService.get<string>('DB_PASS', 'secret'),
    database: configService.get<string>('DB_NAME', 'maymyan'),
    entities: [path.resolve(__dirname, '..') + '/**/*.entity{.ts,.js}'],
    synchronize: configService.get<string>('DB_SYNC') === 'true',
    logging: configService.get<string>('DB_LOGGING') === 'true',
    migrations: ['dist/db/typeorm/migrations/*.js'],
  }),
  inject: [ConfigService],
};
