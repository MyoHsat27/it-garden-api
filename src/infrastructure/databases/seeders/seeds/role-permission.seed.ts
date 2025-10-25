import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Role } from '../../../../modules/roles/entities';
import { Permission } from '../../../../modules/permissions/entities';

export default class RolePermissionSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepo = dataSource.getRepository(Role);
    const permRepo = dataSource.getRepository(Permission);

    const permissionData = [
      { subject: 'dashboard', action: 'view' },
      { subject: 'students', action: 'view' },
      { subject: 'students', action: 'create' },
      { subject: 'students', action: 'update' },
      { subject: 'students', action: 'delete' },
      { subject: 'enrollments', action: 'view' },
      { subject: 'enrollments', action: 'create' },
      { subject: 'enrollments', action: 'add-payment' },
      { subject: 'teachers', action: 'view' },
      { subject: 'teachers', action: 'create' },
      { subject: 'teachers', action: 'update' },
      { subject: 'teachers', action: 'delete' },
      { subject: 'admins', action: 'view' },
      { subject: 'admins', action: 'create' },
      { subject: 'admins', action: 'update' },
      { subject: 'admins', action: 'delete' },
      { subject: 'roles-permissions', action: 'view' },
      { subject: 'roles-permissions', action: 'create' },
      { subject: 'roles-permissions', action: 'update' },
      { subject: 'roles-permissions', action: 'delete' },
      { subject: 'batches', action: 'view' },
      { subject: 'batches', action: 'create' },
      { subject: 'batches', action: 'update' },
      { subject: 'batches', action: 'delete' },
      { subject: 'courses', action: 'view' },
      { subject: 'courses', action: 'create' },
      { subject: 'courses', action: 'update' },
      { subject: 'courses', action: 'delete' },
      { subject: 'classrooms', action: 'view' },
      { subject: 'classrooms', action: 'create' },
      { subject: 'classrooms', action: 'update' },
      { subject: 'classrooms', action: 'delete' },
      { subject: 'timeslots', action: 'view' },
      { subject: 'timeslots', action: 'create' },
      { subject: 'timeslots', action: 'update' },
      { subject: 'timeslots', action: 'delete' },
      { subject: 'timetables', action: 'view' },
      { subject: 'payments', action: 'view' },
      { subject: 'announcements', action: 'view' },
      { subject: 'announcements', action: 'create' },
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
