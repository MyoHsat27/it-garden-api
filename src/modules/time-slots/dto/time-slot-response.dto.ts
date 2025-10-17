import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class TimeSlotResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  dayOfWeek: number;

  @ApiProperty()
  @Expose()
  startTime: string;

  @ApiProperty()
  @Expose()
  endTime: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
