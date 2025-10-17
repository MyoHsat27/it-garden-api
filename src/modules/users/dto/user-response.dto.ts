import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { Student } from '../../students/entities';
import { Teacher } from '../../teachers/entities';
import { UserRole } from '../enums';
import { Admin } from '../../admins/entities';
import { AdminResponseDto } from '../../admins/dto';
import { TeacherResponseDto } from '../../teachers/dto';
import { StudentResponseDto } from '../../students/dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'The id of the user',
    example: 2,
  })
  @Expose()
  id: number;

  @ApiProperty({
    description: 'The username of the user',
    example: 'test',
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'example@email.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The email verify status of the user',
    example: true,
  })
  @Expose()
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'The role of the user',
    example: UserRole.ADMIN,
  })
  @Expose()
  userRole: UserRole;

  @Expose()
  @Type(() => StudentResponseDto)
  studentProfile?: StudentResponseDto;

  @Expose()
  @Type(() => TeacherResponseDto)
  teacherProfile?: TeacherResponseDto;

  @Expose()
  @Type(() => AdminResponseDto)
  adminProfile?: AdminResponseDto;
}
