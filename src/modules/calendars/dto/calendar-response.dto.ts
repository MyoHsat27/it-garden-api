import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { EventType } from '../entities/calendar.entity';

export class CalendarResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  start: Date;

  @ApiProperty({ required: false })
  @Expose()
  end?: Date;

  @ApiProperty({ enum: EventType })
  @Expose()
  type: EventType;

  @ApiProperty()
  @Expose()
  batchName: string;

  @ApiProperty()
  @Expose()
  courseName: string;

  @ApiProperty()
  @Expose()
  teacherName: string;

  @ApiProperty()
  @Expose()
  classroom: string;
}
