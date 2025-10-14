import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepo.create(createRoleDto);
    return this.roleRepo.save(role);
  }

  async findAll() {
    return this.roleRepo.find({ relations: ['permissions'] });
  }

  async findOne(id: number) {
    return this.roleRepo.findOne({ where: { id }, relations: ['permissions'] });
  }

  async findByName(name: string) {
    return this.roleRepo.findOne({
      where: { name },
      relations: ['permissions'],
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepo.update(id, updateRoleDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.roleRepo.delete(id);
  }
}
