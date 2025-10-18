import { Module } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { AssignmentsController } from './assignments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Assignment } from './entities';
import { AssignmentsRepository } from './assignments.repository';
import { LocalStorageStrategy } from '../../infrastructure/storages/strategies';
import { MediasModule } from '../medias/medias.module';
import { BatchesModule } from '../batches/batches.module';
import { StorageModule } from '../../infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment]),
    BatchesModule,
    MediasModule,
    StorageModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsRepository],
  exports: [AssignmentsService],
})
export class AssignmentsModule {}
