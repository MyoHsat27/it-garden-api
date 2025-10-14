import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import * as path from 'path';
import { config } from 'dotenv';
import { MainSeeder } from './seeds/main.seeder';
import { UserFactory } from './factories/user.factory';
import { AdminFactory } from './factories/admin.factory';
import { RoleFactory } from './factories/role.factory';

config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'secret',
  database: process.env.DB_NAME || 'it_garden',
  synchronize: false,
  logging: false,
  entities: [path.join(__dirname, '../../../**/*.entity{.ts,.js}')],
  migrations: [path.join(__dirname, '../migrations/*{.ts,.js}')],
  seeds: [MainSeeder],
  factories: [RoleFactory, UserFactory, AdminFactory],
};

export const AppDataSource = new DataSource(options);
