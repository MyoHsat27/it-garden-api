import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TeacherResponseDto } from '../../teachers/dto';
import { BatchResponseDto } from '../../batches/dto';
import { MediaResponseDto } from '../../medias/dto';
import { SubmissionResponseDto } from '../../submissions/dto';

export class AssignmentResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  startDate: string;

  @ApiProperty()
  @Expose()
  dueDate: string;

  @ApiProperty()
  @Expose()
  @Type(() => BatchResponseDto)
  batch: BatchResponseDto;

  @ApiProperty({ type: () => SubmissionResponseDto })
  @Expose()
  @Type(() => SubmissionResponseDto)
  submissions: SubmissionResponseDto;

  @ApiProperty()
  @Expose()
  @Type(() => MediaResponseDto)
  media: MediaResponseDto;

  @ApiProperty()
  @Expose()
  totalRequiredSubmissions: number;

  @ApiProperty()
  @Expose()
  currentSubmissionCount: number;

  @ApiProperty()
  @Expose()
  pendingSubmissionCount: number;

  @ApiProperty()
  @Expose()
  gradedSubmissionCount: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
