import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString, IsBoolean } from 'class-validator';

export class CreateAttendanceRecordDto {
  @ApiProperty()
  @IsInt()
  enrollmentId: number;

  @ApiProperty()
  @IsInt()
  timetableId: number;

  @ApiProperty({ example: '2025-10-14' })
  @IsDateString()
  date: string;

  @ApiProperty()
  @IsBoolean()
  present: boolean;
}
