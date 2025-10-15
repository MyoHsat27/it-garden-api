import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';

@Injectable()
export class CoursesRepository {
  constructor(
    @InjectRepository(Course)
    private readonly repo: Repository<Course>,
  ) {}

  async create(course: Partial<Course>): Promise<Course> {
    const entity = this.repo.create(course);
    return this.repo.save(entity);
  }

  async findAll(): Promise<Course[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findById(id: number): Promise<Course | null> {
    return this.repo.findOne({ where: { id } });
  }

  async update(course: Course): Promise<Course> {
    return this.repo.save(course);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
