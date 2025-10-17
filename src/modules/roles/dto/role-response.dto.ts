import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PermissionResponseDto } from '../../permissions/dto';

export class RoleResponseDto {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @Expose()
  @Type(() => PermissionResponseDto)
  permissions?: PermissionResponseDto[];

  @ApiProperty({ description: 'User ID linked to this admin' })
  @Expose()
  @Type(() => Number)
  userId: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
