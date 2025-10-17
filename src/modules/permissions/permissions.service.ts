import { Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionsRepository } from './permissions.repository';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionRepository: PermissionsRepository) {}

  async findAll() {
    return this.permissionRepository.findAll();
  }

  async findByIds(ids: number[]) {
    return this.permissionRepository.findByIds(ids);
  }

  async findById(id: number) {
    return this.permissionRepository.findById(id);
  }
}
