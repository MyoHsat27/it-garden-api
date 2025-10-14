import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserDto } from '../../users/dto';
import { Gender } from '../../../common';

export class StudentDto {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'John Doe' })
  @Expose()
  fullName: string;

  @ApiProperty({ example: 21 })
  @Expose()
  age: number;

  @ApiProperty({ enum: Gender, example: Gender.MALE })
  @Expose()
  gender: Gender;

  @ApiProperty({ type: UserDto })
  @Expose()
  @Type(() => UserDto)
  user: UserDto[];
}
