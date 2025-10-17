import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseResponseDto {
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
  duration: string;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
