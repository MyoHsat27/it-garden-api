import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Gender } from '../../../common';
import { UserResponseDto } from '../../users/dto';
import { BatchResponseDto } from '../../batches/dto';

export class TeacherResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  fullName: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  gender: Gender;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ type: () => UserResponseDto })
  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @ApiProperty({ type: () => [BatchResponseDto] })
  @Expose()
  @Type(() => BatchResponseDto)
  batches: BatchResponseDto[];
}
