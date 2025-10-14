import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../../../modules/users/entities';
import { faker } from '@faker-js/faker';
import { UserRole } from '../../../../modules/users/enums';
import * as bcrypt from 'bcrypt';

export const UserFactory = setSeederFactory(User, async () => {
  const user = new User();
  user.username = faker.internet.username().toLowerCase();
  user.email = faker.internet.email();
  user.password = await bcrypt.hash('secret', 10);
  user.userRole = UserRole.ADMIN;
  user.isEmailVerified = true;
  return user;
});
