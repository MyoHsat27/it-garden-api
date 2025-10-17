import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CourseResponseDto } from '../../courses/dto';
import { TeacherResponseDto } from '../../teachers/dto';

export class BatchResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: () => CourseResponseDto })
  @Expose()
  @Type(() => CourseResponseDto)
  course: CourseResponseDto;

  @ApiProperty({ type: () => TeacherResponseDto })
  @Expose()
  @Type(() => TeacherResponseDto)
  teacher: TeacherResponseDto;
}
