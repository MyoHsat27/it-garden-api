import { Module } from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { SubmissionsController } from './submissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Submission } from './entities';
import { SubmissionsRepository } from './submissions.respository';
import { AssignmentsModule } from '../assignments/assignments.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { MediasModule } from '../medias/medias.module';
import { StorageModule } from '../../infrastructure';

@Module({
  imports: [
    TypeOrmModule.forFeature([Submission]),
    AssignmentsModule,
    EnrollmentsModule,
    MediasModule,
    StorageModule,
  ],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, SubmissionsRepository],
  exports: [SubmissionsService, SubmissionsRepository],
})
export class SubmissionsModule {}
