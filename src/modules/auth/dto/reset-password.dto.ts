import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword, IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsStrongPassword()
  @ApiProperty({
    description: 'new password of the user',
    example: 'abcdefg',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'new password of the user',
    example: 'abcdefg',
  })
  resetToken: string;
}
