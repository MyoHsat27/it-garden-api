import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString } from 'class-validator';

export class CreateAttendanceSessionDto {
  @ApiProperty()
  @IsInt()
  timetableId: number;

  @ApiProperty({ example: '2025-10-14' })
  @IsDateString()
  date: string;
}
