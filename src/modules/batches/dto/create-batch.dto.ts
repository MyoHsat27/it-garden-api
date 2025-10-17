import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';

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
}
