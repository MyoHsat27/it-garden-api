import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CourseResponseDto } from '../../courses/dto';
import { TeacherResponseDto } from '../../teachers/dto';
import { ClassroomResponseDto } from '../../classrooms/dto';
import { TimetableResponseDto } from '../../timetables/dto';

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
  status: string;

  @ApiProperty()
  @Expose()
  startDate: string;

  @ApiProperty()
  @Expose()
  endDate: string;

  @ApiProperty({ description: 'Number of spots left in the batch' })
  @Expose()
  spotsLeft: number;

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

  @ApiProperty({ type: () => ClassroomResponseDto })
  @Expose()
  @Type(() => ClassroomResponseDto)
  classroom: ClassroomResponseDto;

  @ApiProperty({ type: () => [TimetableResponseDto] })
  @Expose()
  @Type(() => TimetableResponseDto)
  timetables: TimetableResponseDto[];
}
