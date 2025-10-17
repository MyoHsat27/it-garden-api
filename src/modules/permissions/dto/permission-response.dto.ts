import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class PermissionResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  subject: string;

  @ApiProperty()
  @Expose()
  action: string;
}
