import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TeacherResponseDto } from '../../teachers/dto';
import { BatchResponseDto } from '../../batches/dto';
import { MediaResponseDto } from '../../medias/dto';

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
