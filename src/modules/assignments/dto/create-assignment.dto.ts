import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateAssignmentDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  attachmentUrl?: string;

  @ApiProperty()
  @IsNumber()
  teacherId: number;

  @ApiProperty()
  @IsNumber()
  batchId: number;
}
