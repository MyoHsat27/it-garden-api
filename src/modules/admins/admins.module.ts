import { forwardRef, Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities';
import { AdminsRepository } from './admins.repository';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin]),
    UsersModule,
    forwardRef(() => RolesModule),
  ],
  controllers: [AdminsController],
  providers: [AdminsService, AdminsRepository],
  exports: [AdminsService, AdminsRepository],
})
export class AdminsModule {}
