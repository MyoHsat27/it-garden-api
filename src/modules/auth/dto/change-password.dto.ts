import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Old password of the user',
    example: '123456',
  })
  oldPassword: string;

  @IsNotEmpty()
  @ApiProperty({
    description: 'new password of the user',
    example: 'abcdefg',
  })
  newPassword: string;
}
