import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  MinLength,
} from 'class-validator';
import { Gender } from '../../../common';

export class CreateAdminDto {
  @ApiProperty({
    example: 'Admin 1',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'admin1@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'test12345' })
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '09222222222' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: 'Yangon' })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ example: Gender.MALE, enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({ example: 1 })
  @IsNumber()
  roleId: number;
}
