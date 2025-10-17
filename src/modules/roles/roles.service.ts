import { AdminsService } from './../admins/admins.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { plainToInstance } from 'class-transformer';
import { RoleResponseDto } from './dto';
import { RolesRepository } from './roles.repository';
import { GetRolesQueryDto } from './dto/get-roles-query.dto';
import { PaginatedResponseDto } from '../../common';
import { AdminsRepository } from '../admins/admins.repository';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class RolesService {
  constructor(
    private readonly rolesRepository: RolesRepository,
    @Inject(forwardRef(() => PermissionsService))
    private readonly permissionsService: PermissionsService,
    @Inject(forwardRef(() => AdminsService))
    private readonly adminsService: AdminsService,
  ) {}

  async create(dto: CreateRoleDto) {
    const existingRole = await this.rolesRepository.findByName(dto.name);
    if (existingRole) throw new BadRequestException('Role Name already in use');

    const permissions = await this.permissionsService.findByIds(
      dto.permissionIds,
    );

    if (permissions.length !== dto.permissionIds.length) {
      throw new BadRequestException('Some permissions not found');
    }

    const role = this.rolesRepository.create({
      name: dto.name,
      permissions,
    });

    const savedRole = await this.rolesRepository.save(role);

    return plainToInstance(RoleResponseDto, savedRole);
  }

  async findAll() {
    return this.rolesRepository.findAll();
  }

  async findAllRolesWithFilters(
    query: GetRolesQueryDto,
  ): Promise<PaginatedResponseDto<RoleResponseDto>> {
    const result = await this.rolesRepository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(RoleResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
  }

  async findById(id: number) {
    return await this.rolesRepository.findById(id);
  }

  async update(id: number, dto: UpdateRoleDto) {
    const role = await this.rolesRepository.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    if (dto.name && dto.name !== role.name) {
      const existing = await this.rolesRepository.findByName(dto.name);
      if (existing) throw new BadRequestException('Role name already in use');
    }

    let permissions = role.permissions;
    if (dto.permissionIds && dto.permissionIds.length > 0) {
      permissions = await this.permissionsService.findByIds(dto.permissionIds);
      if (permissions.length !== dto.permissionIds.length) {
        throw new BadRequestException('Some permissions not found');
      }
    }

    Object.assign(role, { name: dto.name ?? role.name, permissions });
    const updated = await this.rolesRepository.save(role);
    return plainToInstance(RoleResponseDto, updated);
  }

  async remove(id: number) {
    const role = await this.rolesRepository.findById(id);
    if (!role) throw new NotFoundException('Role not found');

    const adminsUsingRole = await this.adminsService.findCountByRoleId(id);
    if (adminsUsingRole > 0) {
      throw new BadRequestException(
        'Cannot delete role: It is currently assigned to one or more admins',
      );
    }

    await this.rolesRepository.deleteRole(id);
  }
}
