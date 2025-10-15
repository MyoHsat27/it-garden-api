import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max, IsString, Matches } from 'class-validator';

export class CreateTimeSlotDto {
  @ApiProperty()
  @IsInt()
  @Min(0)
  @Max(6)
  dayOfWeek: number;

  @ApiProperty({ example: '13:00:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'startTime must be in HH:mm:ss format',
  })
  startTime: string;

  @ApiProperty({ example: '15:00:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/, {
    message: 'endTime must be in HH:mm:ss format',
  })
  endTime: string;
}
