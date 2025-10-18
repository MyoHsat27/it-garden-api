import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TimetableSessionStatus } from '../enums/timetable-session-status.enum';

export class TimetableSessionDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  timetableId: number;

  @ApiProperty()
  @Expose()
  batchId: number;

  @ApiProperty()
  @Expose()
  batchName: string;

  @ApiProperty()
  @Expose()
  courseName: string;

  @ApiProperty()
  @Expose()
  teacherName: string;

  @ApiProperty()
  @Expose()
  classroomName?: string;

  @ApiProperty({ example: '2025-10-07' })
  @Expose()
  date: string;

  @ApiProperty({ example: '09:00:00' })
  @Expose()
  startTime: string;

  @ApiProperty({ example: '11:00:00' })
  @Expose()
  endTime: string;

  @ApiProperty()
  @Expose()
  status: TimetableSessionStatus;

  @ApiProperty()
  @Expose()
  attendanceSummary?: string;
}
