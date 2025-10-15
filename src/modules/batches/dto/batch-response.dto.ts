import { ApiProperty } from '@nestjs/swagger';
import { Course } from '../../courses/entities/course.entity';
import { Teacher } from '../../teachers/entities/teacher.entity';

export class BatchResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: () => Course })
  course: Course;

  @ApiProperty({ type: () => [Teacher] })
  teachers: Teacher[];
}
