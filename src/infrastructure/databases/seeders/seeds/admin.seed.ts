import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { User } from '../../../../modules/users/entities';
import { Admin } from '../../../../modules/admins/entities';
import { Role } from '../../../../modules/roles/entities';
import { CryptoHelper } from '../../../../common';

export default class AdminSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    const userRepo = dataSource.getRepository(User);
    const adminRepo = dataSource.getRepository(Admin);
    const roleRepo = dataSource.getRepository(Role);

    const email = 'superadmin@example.com';
    const existingUser = await userRepo.findOne({ where: { email } });
    if (existingUser) return console.log('⚠️ SuperAdmin already exists');

    const userFactory = factoryManager.get(User);
    const adminFactory = factoryManager.get(Admin);

    const user = await userFactory.make({
      username: 'superadmin',
      email,
      password: await CryptoHelper.hashPassword('yngWIE500'),
      isEmailVerified: true,
    });
    await userRepo.save(user);

    const admin = await adminFactory.make({
      fullName: 'Super Admin',
      user,
      role: await roleRepo.findOneByOrFail({ name: 'superadmin' }),
    });

    await adminRepo.save(admin);

    console.log('✅ SuperAdmin user & admin profile created');
  }
}
