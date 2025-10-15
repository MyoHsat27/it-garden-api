import { Module } from '@nestjs/common';
import { AttendanceRecordsService } from './attendance-records.service';
import { AttendanceRecordsController } from './attendance-records.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceRecord } from './entities';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { TimetablesModule } from '../timetables/timetables.module';
import { AttendanceRecordsRepository } from './attendance-records.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendanceRecord]),
    EnrollmentsModule,
    TimetablesModule,
  ],
  controllers: [AttendanceRecordsController],
  providers: [AttendanceRecordsService, AttendanceRecordsRepository],
  exports: [AttendanceRecordsService, AttendanceRecordsRepository],
})
export class AttendanceRecordsModule {}
