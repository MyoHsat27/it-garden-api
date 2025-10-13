import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from 'src/modules/users/entities/user.entity';
import { Learner } from 'src/modules/students/entities/student.entity';
import { Educator } from 'src/modules/educators/entities/educator.entity';
import { Media } from 'src/modules/medias/entities/media.entity';

export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.get<string>('DB_HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('DB_USER', 'root'),
    password: configService.get<string>('DB_PASSWORD', 'secret'),
    database: configService.get<string>('DB_NAME', 'maymyan'),
    autoLoadEntities: true,
    synchronize: configService.get<boolean>('DB_SYNC', false),
    logging: configService.get<boolean>('DB_LOGGING', false),
    migrations: ['dist/db/typeorm/migrations/*.js'],
  }),
  inject: [ConfigService],
};
