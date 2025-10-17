import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Finance',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray({})
  permissionIds: number[];
}
