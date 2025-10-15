import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

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
    description: 'Teacher IDs assigned to this batch',
    required: false,
    example: [1],
  })
  @IsArray()
  @IsNumber({}, { each: true })
  teacherIds: number[];
}
