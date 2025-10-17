import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  NotFoundException,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import {
  CreateRoleDecorator,
  DeleteRoleDecorator,
  GetAllRolesDecorator,
  GetRoleByIdDecorator,
  UpdateRoleDecorator,
} from './decorators';
import { GetRolesQueryDto } from './dto/get-roles-query.dto';
import { PaginatedResponseDto } from '../../common';
import { RoleResponseDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '../auth/guards';

@Controller('roles')
@UseGuards(JwtAuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @CreateRoleDecorator()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleResponseDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  @GetAllRolesDecorator()
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<RoleResponseDto[]> {
    const roles = await this.rolesService.findAll();
    return plainToInstance(RoleResponseDto, roles);
  }

  @Get('filtered')
  @GetAllRolesDecorator()
  @HttpCode(HttpStatus.OK)
  async findAllRolesWithFilters(
    @Query() query: GetRolesQueryDto,
  ): Promise<PaginatedResponseDto<RoleResponseDto>> {
    return this.rolesService.findAllRolesWithFilters(query);
  }

  @Get(':id')
  @GetRoleByIdDecorator()
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: string): Promise<RoleResponseDto> {
    const role = this.rolesService.findById(+id);
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return plainToInstance(RoleResponseDto, role);
  }

  @Put(':id')
  @UpdateRoleDecorator()
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<RoleResponseDto> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @DeleteRoleDecorator()
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.remove(+id);
  }
}
