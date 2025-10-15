import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
} from 'class-validator';
import { SubmissionStatus } from '../enums';

export class CreateSubmissionDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fileUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  grade?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  feedback?: string;

  @ApiProperty({ enum: SubmissionStatus, default: SubmissionStatus.PENDING })
  @IsEnum(SubmissionStatus)
  status: SubmissionStatus;

  @ApiProperty()
  @IsDateString()
  submittedAt: Date;

  @ApiProperty()
  @IsNumber()
  assignmentId: number;

  @ApiProperty()
  @IsNumber()
  enrollmentId: number;
}
