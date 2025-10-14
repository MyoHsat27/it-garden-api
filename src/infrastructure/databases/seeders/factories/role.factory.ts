import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Role } from '../../../../modules/roles/entities';

export const RoleFactory = setSeederFactory(Role, () => {
  const role = new Role();
  role.name = faker.helpers.arrayElement(['admin', 'teacher', 'student']);
  return role;
});
