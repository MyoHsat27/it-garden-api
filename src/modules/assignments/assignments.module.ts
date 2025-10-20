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
import { Submission } from '../submissions/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Assignment, Submission]),
    BatchesModule,
    MediasModule,
    StorageModule,
  ],
  controllers: [AssignmentsController],
  providers: [AssignmentsService, AssignmentsRepository],
  exports: [AssignmentsService, AssignmentsRepository],
})
export class AssignmentsModule {}
