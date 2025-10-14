import { Seeder, SeederFactoryManager, runSeeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import AdminSeeder from './admin.seed';
import RolePermissionSeeder from './role-permission.seed';

export class MainSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    await runSeeder(dataSource, RolePermissionSeeder);

    await runSeeder(dataSource, AdminSeeder);
  }
}
