import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAdminDto {
  @ApiProperty({
    description: 'The email of the usear',
    example: 'example@email.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The status of the user',
    example: 'active',
    enum: [
      'pending',
      'active',
      'inactive',
      'blocked',
      'soft_deleted',
      'deleted',
    ],
  })
  @Expose()
  status: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'user',
    enum: ['user', 'manager', 'admin'],
  })
  @Expose()
  role: string;
}
