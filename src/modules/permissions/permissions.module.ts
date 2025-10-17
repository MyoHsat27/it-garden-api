import { forwardRef, Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities';
import { PermissionsRepository } from './permissions.repository';
import { RolesModule } from '../roles';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    forwardRef(() => RolesModule),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsRepository, PermissionsService],
})
export class PermissionsModule {}
