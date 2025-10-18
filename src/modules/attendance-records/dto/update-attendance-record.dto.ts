import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateAttendanceRecordDto {
  @ApiProperty()
  @IsBoolean()
  present: boolean;

  @ApiProperty()
  @IsNumber()
  id: number;
}
