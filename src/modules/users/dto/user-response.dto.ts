import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
    description: 'The ban status of the user',
    example: true,
  })
  @Expose()
  isBanned: boolean;

  @ApiProperty({
    description: 'The onboarding status of the user',
    example: true,
  })
  @Expose()
  hasCompletedOnboarding: boolean;

  @ApiProperty({
    description: 'The email verify status of the user',
    example: true,
  })
  @Expose()
  isEmailVerified: boolean;
}
