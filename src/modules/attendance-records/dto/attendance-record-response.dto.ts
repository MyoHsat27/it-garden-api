import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { AttendanceRecordStatus } from '../enums/attendance-record-status.enum';

export class AttendanceRecordResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  enrollmentId: number;

  @ApiProperty()
  @Expose()
  timetableId: number;

  @ApiProperty()
  @Expose()
  studentName: string;

  @ApiProperty()
  @Expose()
  date: string;

  @ApiProperty()
  @Expose()
  present: boolean;

  @ApiProperty({
    example: AttendanceRecordStatus.SCHEDULED,
    enum: AttendanceRecordStatus,
  })
  @Expose()
  status: AttendanceRecordStatus;

  @ApiProperty()
  @Expose()
  expiredAt: string;

  @ApiProperty()
  @Expose()
  token: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
