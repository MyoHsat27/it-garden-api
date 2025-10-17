import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import {
  GetAllPermissionsDecorator,
  GetPermissionByIdDecorator,
} from './decorators';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get()
  @GetAllPermissionsDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    const permissions = await this.permissionsService.findAll();
    return plainToInstance(PermissionResponseDto, permissions);
  }

  @Get(':id')
  @GetPermissionByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    const permission = await this.permissionsService.findById(+id);
    return plainToInstance(PermissionResponseDto, permission);
  }
}
