import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities';

@Injectable()
export class TeachersRepository {
  constructor(
    @InjectRepository(Teacher)
    private readonly repo: Repository<Teacher>,
  ) {}

  create(data: Partial<Teacher>) {
    return this.repo.create(data);
  }

  save(teacher: Teacher) {
    return this.repo.save(teacher);
  }

  findAll() {
    return this.repo.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async deleteTeacher(id: number) {
    const teacher = await this.findById(id);
    if (teacher) await this.repo.remove(teacher);
  }
}
