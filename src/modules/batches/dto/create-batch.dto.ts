import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  ArrayMinSize,
  ValidateNested,
  IsDateString,
} from 'class-validator';

class CreateBatchTimetableDto {
  @ApiProperty({
    description: 'Day of the week (0=Sunday, 6=Saturday)',
    example: 1,
  })
  @IsNumber()
  dayOfWeek: number;

  @ApiProperty({ description: 'Time slot ID for this class', example: 2 })
  @IsNumber()
  timeSlotId: number;
}

export class CreateBatchDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Course ID this batch belongs to', example: 1 })
  @IsNumber()
  courseId: number;

  @ApiProperty({
    description: 'Teacher ID assigned to this batch',
    example: 1,
  })
  @IsNumber()
  teacherId: number;

  @ApiProperty({
    description: 'Classroom ID assigned to this batch',
    example: 3,
  })
  @IsNumber()
  classroomId: number;

  @ApiProperty({
    description: 'Weekly timetable entries for this batch',
    type: [CreateBatchTimetableDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBatchTimetableDto)
  timetables: CreateBatchTimetableDto[];

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2025-12-31' })
  @IsDateString()
  endDate: string;
}
