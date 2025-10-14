import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../../../modules/roles/entities';
import { Permission } from '../../../../modules/permissions/entities';

export default class RolePermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);

    const permissionData = [
      { subject: 'user', action: 'manage' },
      { subject: 'role', action: 'manage' },
      { subject: 'permission', action: 'manage' },
      { subject: 'admin', action: 'manage' },
      { subject: 'report', action: 'view' },
    ];

    for (const p of permissionData) {
      const exists = await permRepo.findOne({ where: p });
      if (!exists) await permRepo.save(permRepo.create(p));
    }

    const permissions = await permRepo.find();

    const roles = [
      {
        name: 'superadmin',
        permissions,
      },
      {
        name: 'admin',
        permissions: permissions.filter((p) =>
          ['user', 'report'].includes(p.subject),
        ),
      },
    ];

    for (const r of roles) {
      let role = await roleRepo.findOne({ where: { name: r.name } });
      if (!role) {
        role = roleRepo.create(r);
        await roleRepo.save(role);
      }
    }

    console.log('✅ Roles & Permissions seeded');
  }
}
