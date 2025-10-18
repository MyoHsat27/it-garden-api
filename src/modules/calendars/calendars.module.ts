import { Module } from '@nestjs/common';
import { CalendarsService } from './calendars.service';
import { CalendarsController } from './calendars.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Timetable } from '../timetables/entities';
import { Exam } from '../exams/entities';
import { Assignment } from '../assignments/entities';
import { Enrollment } from '../enrollments/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([Timetable, Exam, Assignment, Enrollment]),
  ],
  controllers: [CalendarsController],
  providers: [CalendarsService],
  exports: [CalendarsService],
})
export class CalendarsModule {}
