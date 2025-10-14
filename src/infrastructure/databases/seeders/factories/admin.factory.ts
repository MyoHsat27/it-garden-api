import { setSeederFactory } from 'typeorm-extension';
import { faker } from '@faker-js/faker';
import { Admin } from '../../../../modules/admins/entities';
import { AdminStatus } from '../../../../modules/admins/enums';

export const AdminFactory = setSeederFactory(Admin, () => {
  const admin = new Admin();
  admin.fullName = faker.person.fullName();
  admin.phone = faker.phone.number();
  admin.address = faker.location.streetAddress();
  admin.status = AdminStatus.ACTIVE;
  return admin;
});
