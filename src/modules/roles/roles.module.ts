import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities';
import { Repository } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RolesController],
  providers: [
    {
      provide: 'ROLE_REPOSITORY',
      useFactory: (repo: Repository<Role>) => repo,
      inject: [getRepositoryToken(Role)],
    },
    RolesService,
  ],
  exports: ['ROLE_REPOSITORY', RolesService],
})
export class RolesModule {}
