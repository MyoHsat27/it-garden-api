import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { TeacherResponseDto } from '../../teachers/dto';
import { ClassroomResponseDto } from '../../classrooms/dto';
import { TimeSlotResponseDto } from '../../time-slots/dto';
import { BatchResponseDto } from '../../batches/dto';

export class TimetableResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  dayOfWeek: number;

  @ApiProperty({ type: () => BatchResponseDto })
  @Expose()
  @Type(() => BatchResponseDto)
  batch: BatchResponseDto;

  @ApiProperty({ type: () => TeacherResponseDto })
  @Expose()
  @Type(() => TeacherResponseDto)
  teacher: TeacherResponseDto;

  @ApiProperty({ type: () => ClassroomResponseDto })
  @Expose()
  @Type(() => ClassroomResponseDto)
  classroom: ClassroomResponseDto;

  @ApiProperty({ type: TimeSlotResponseDto })
  @Expose()
  @Type(() => TimeSlotResponseDto)
  timeSlot: TimeSlotResponseDto;
}
