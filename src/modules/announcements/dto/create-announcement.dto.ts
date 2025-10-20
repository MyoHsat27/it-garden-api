import {
  IsArray,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { NotificationChannel } from '../../../common';

export class CreateAnnouncementDto {
  @IsString() title: string;
  @IsString() body: string;
  @IsOptional() @IsNumber() batchId?: number;
  @IsArray() channels: NotificationChannel[];
  @IsOptional() @IsISO8601() publishAt?: string;
}
