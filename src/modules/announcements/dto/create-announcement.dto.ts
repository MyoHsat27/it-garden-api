import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
} from 'class-validator';
import { NotificationChannel } from '../../../common';

export class CreateAnnouncementDto {
  @ApiProperty({ example: 'Exam next week' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Please prepare...' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiProperty({ example: 12, required: false })
  @IsOptional()
  @IsNumber()
  batchId?: number;

  @ApiProperty({
    example: [NotificationChannel.WEB, NotificationChannel.EMAIL],
    enum: NotificationChannel,
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(NotificationChannel, { each: true })
  channels?: NotificationChannel[];
}
