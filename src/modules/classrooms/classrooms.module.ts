import { Module } from '@nestjs/common';
import { ClassroomsService } from './classrooms.service';
import { ClassroomsController } from './classrooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from './entities';
import { ClassroomsRepository } from './classrooms.repository';
import { Timetable } from '../timetables/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom, Timetable])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomsRepository],
  exports: [ClassroomsService, ClassroomsRepository],
})
export class ClassroomsModule {}
