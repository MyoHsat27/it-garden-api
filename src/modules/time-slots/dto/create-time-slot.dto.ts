import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsString } from 'class-validator';

export class CreateTimeSlotDto {
  @ApiProperty({ example: '13:00:00' })
  @IsString()
  name: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '13:00:00' })
  @IsString()
  startTime: string;

  @ApiProperty({ example: '15:00:00' })
  @IsString()
  endTime: string;
}
