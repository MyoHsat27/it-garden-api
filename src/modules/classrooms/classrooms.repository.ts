import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from './entities/classroom.entity';

@Injectable()
export class ClassroomsRepository {
  constructor(
    @InjectRepository(Classroom)
    private readonly repo: Repository<Classroom>,
  ) {}

  async create(Classroom: Partial<Classroom>): Promise<Classroom> {
    const entity = this.repo.create(Classroom);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Classroom[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Classroom | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(classroom: Classroom): Promise<Classroom> {
    return this.repo.save(classroom);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
