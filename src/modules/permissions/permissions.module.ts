import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Permission])],
  controllers: [PermissionsController],
  providers: [
    {
      provide: 'PERMISSION_REPOSITORY',
      useFactory: (repo: Repository<Permission>) => repo,
      inject: [getRepositoryToken(Permission)],
    },
    PermissionsService,
  ],
  exports: ['PERMISSION_REPOSITORY', PermissionsService],
})
export class PermissionsModule {}
