import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, Min } from 'class-validator';

export class CreateTimetableDto {
  @ApiProperty()
  @IsInt()
  @Min(1)
  batchId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  teacherId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  classroomId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  timeSlotId: number;
}
