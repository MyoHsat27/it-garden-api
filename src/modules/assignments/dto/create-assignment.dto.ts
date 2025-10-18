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
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  dueDate: Date;

  @ApiProperty()
  @IsString()
  batchId: string;
}
