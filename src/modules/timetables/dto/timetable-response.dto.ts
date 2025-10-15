import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TeacherResponseDto } from '../../teachers/dto';
import { ClassroomResponseDto } from '../../classrooms/dto';
import { TimeSlotResponseDto } from '../../time-slots/dto';
import { BatchResponseDto } from '../../batches/dto';

export class TimetableResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ type: BatchResponseDto })
  @Expose()
  batch: BatchResponseDto;

  @ApiProperty({ type: TeacherResponseDto })
  @Expose()
  teacher: TeacherResponseDto;

  @ApiProperty({ type: ClassroomResponseDto })
  @Expose()
  classroom: ClassroomResponseDto;

  @ApiProperty({ type: TimeSlotResponseDto })
  @Expose()
  timeSlot: TimeSlotResponseDto;
}
