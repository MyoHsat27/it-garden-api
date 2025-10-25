import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserResponseDto } from '../../users/dto';
import { BatchResponseDto } from '../../batches/dto';

export class AnnouncementResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty({ required: false })
  @Expose()
  batchId?: number;

  @ApiProperty({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  author: UserResponseDto;

  @ApiProperty({ type: () => BatchResponseDto })
  @Expose()
  @Type(() => BatchResponseDto)
  batch: BatchResponseDto;

  @ApiProperty()
  @Expose()
  channels: string[];

  @ApiProperty()
  @Expose()
  publishAt?: Date;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}
