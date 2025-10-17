import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Gender } from '../../../common';
import { RoleResponseDto } from '../../roles/dto';
import { UserResponseDto } from '../../users/dto';

export class AdminResponseDto {
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
  status: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => RoleResponseDto)
  role: RoleResponseDto;
}
