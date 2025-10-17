import { forwardRef, Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities';
import { RolesRepository } from './roles.repository';
import { PermissionsModule } from '../permissions/permissions.module';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    forwardRef(() => PermissionsModule),
    forwardRef(() => AdminsModule),
  ],
  controllers: [RolesController],
  providers: [RolesService, RolesRepository],
  exports: [RolesRepository, RolesService],
})
export class RolesModule {}
