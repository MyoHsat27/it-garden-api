import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BatchResponseDto } from '../../batches/dto';
import { MediaResponseDto } from '../../medias/dto';
import { SubmissionResponseDto } from '../../submissions/dto';

export class StudentAssignmentResponseDto {
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
  status: 'PENDING' | 'SUBMITTED';

  @ApiProperty()
  @Expose()
  courseName: string;

  @ApiProperty()
  @Expose()
  batchName: string;

  @ApiProperty()
  @Expose()
  teacherName: string;

  @ApiProperty({ type: () => SubmissionResponseDto, nullable: true })
  @Expose()
  @Type(() => SubmissionResponseDto)
  submission?: SubmissionResponseDto | null;

  @ApiProperty({ type: () => MediaResponseDto, nullable: true })
  @Expose()
  @Type(() => MediaResponseDto)
  media?: MediaResponseDto | null;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
