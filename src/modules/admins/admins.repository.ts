import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminsRepository {
  constructor(
    @InjectRepository(Admin)
    private readonly repo: Repository<Admin>,
  ) {}

  create(data: Partial<Admin>) {
    return this.repo.create(data);
  }

  save(admin: Admin) {
    return this.repo.save(admin);
  }

  findAll() {
    return this.repo.find({
      relations: ['user', 'role'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user', 'role'],
    });
  }

  async deleteAdmin(id: number) {
    const admin = await this.findById(id);
    if (admin) await this.repo.remove(admin);
  }
}
