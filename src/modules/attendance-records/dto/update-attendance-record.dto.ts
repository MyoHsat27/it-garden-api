import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class UpdateAttendanceRecordDto {
  @ApiProperty()
  @IsBoolean()
  present: boolean;
}
