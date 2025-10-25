import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto';
import { NotificationType } from '../../../common';

export class NotificationResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  read: boolean;

  @ApiProperty()
  @Expose()
  type: NotificationType;

  @ApiProperty()
  @Expose()
  payload: any;

  @ApiProperty()
  @Expose()
  sourceId?: number;

  @ApiProperty({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  recipient: UserResponseDto;

  @ApiProperty()
  @Expose()
  channels: string[];

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
