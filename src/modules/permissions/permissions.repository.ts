import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Permission } from './entities/permission.entity';

@Injectable()
export class PermissionsRepository {
  constructor(
    @InjectRepository(Permission)
    private readonly repo: Repository<Permission>,
  ) {}

  findAll() {
    return this.repo.find();
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }
  findByIds(ids: number[]) {
    return this.repo.find({
      where: { id: In(ids) },
    });
  }
}
