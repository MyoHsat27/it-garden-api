import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
  @ApiProperty({ example: 'test12345', required: false })
  @IsOptional()
  password?: string;
}
