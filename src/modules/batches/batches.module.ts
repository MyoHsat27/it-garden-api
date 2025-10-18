import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { Batch } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchesRepository } from './batches.repository';
import { ClassroomsModule } from '../classrooms/classrooms.module';
import { TeachersModule } from '../teachers/teachers.module';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { CoursesModule } from '../courses/courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Batch]),
    ClassroomsModule,
    TeachersModule,
    TimeSlotsModule,
    CoursesModule,
  ],
  controllers: [BatchesController],
  providers: [BatchesService, BatchesRepository],
  exports: [BatchesService, BatchesRepository],
})
export class BatchesModule {}
