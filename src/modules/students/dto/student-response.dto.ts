import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { Gender } from '../../../common';
import { StudentStatus } from '../enums';

export class StudentResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  registrationNumber: string;

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
  guardianName: string;

  @ApiProperty()
  @Expose()
  guardianContact: string;

  @ApiProperty()
  @Expose()
  gender: Gender;

  @ApiProperty()
  @Expose()
  status: StudentStatus;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty({ description: 'User ID linked to this admin' })
  @Expose()
  @Type(() => Number)
  userId: number;
}
