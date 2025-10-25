import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MediaResponseDto } from '../../medias/dto';
import { SubmissionStatus } from '../enums';
import { AssignmentResponseDto } from '../../assignments/dto';
import { EnrollmentResponseDto } from '../../enrollments/dto';

export class SubmissionResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  grade: string;

  @ApiProperty()
  @Expose()
  feedback: string;

  @ApiProperty()
  @Expose()
  status: SubmissionStatus;

  @ApiProperty()
  @Expose()
  submittedAt: string;

  @ApiProperty({ type: () => AssignmentResponseDto })
  @Expose()
  @Type(() => AssignmentResponseDto)
  assignment: AssignmentResponseDto;

  @ApiProperty()
  @Expose()
  @Type(() => EnrollmentResponseDto)
  enrollment: EnrollmentResponseDto;

  @ApiProperty()
  @Expose()
  @Type(() => MediaResponseDto)
  media: MediaResponseDto;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
