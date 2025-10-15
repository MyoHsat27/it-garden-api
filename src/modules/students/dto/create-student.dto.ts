import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { Gender } from '../../../common';

export class CreateStudentDto {
  @ApiProperty({
    example: 'Student 1',
  })
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({
    example: 'ITG-222345',
  })
  @IsNotEmpty()
  registrationNumber: string;

  @ApiProperty({
    example: 'Mg Mg',
  })
  @IsNotEmpty()
  guardianName: string;

  @ApiProperty({
    example: '09264662221',
  })
  @IsNotEmpty()
  guardianContact: string;

  @ApiProperty({ example: 'student1@example.com' })
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
}
