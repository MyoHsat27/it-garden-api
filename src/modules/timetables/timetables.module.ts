import { Module } from '@nestjs/common';
import { TimetablesService } from './timetables.service';
import { TimetablesController } from './timetables.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from './entities';
import { TimetablesRepository } from './timetables.repository';
import { TimeSlotsModule } from '../time-slots/time-slots.module';
import { BatchesModule } from '../batches/batches.module';
import { TeachersModule } from '../teachers/teachers.module';
import { ClassroomsModule } from '../classrooms/classrooms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timetable]),
    TimeSlotsModule,
    BatchesModule,
    TeachersModule,
    ClassroomsModule,
  ],
  controllers: [TimetablesController],
  providers: [TimetablesService, TimetablesRepository],
  exports: [TimetablesService, TimetablesRepository],
})
export class TimetablesModule {}
