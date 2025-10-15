import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Batch } from './entities/batch.entity';
import { Course } from '../courses/entities/course.entity';
import { Teacher } from '../teachers/entities/teacher.entity';

@Injectable()
export class BatchesRepository {
  constructor(
    @InjectRepository(Batch)
    private readonly repo: Repository<Batch>,

    @InjectRepository(Course)
    private readonly courseRepo: Repository<Course>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  async create(batch: Partial<Batch>): Promise<Batch> {
    const newBatch = this.repo.create(batch);
    return this.repo.save(newBatch);
  }

  async findAll(): Promise<Batch[]> {
    return this.repo.find({
      relations: ['course', 'teachers'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: number): Promise<Batch | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['course', 'teachers'],
    });
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }

  async findCourseById(id: number): Promise<Course | null> {
    return this.courseRepo.findOne({ where: { id } });
  }

  async findTeachersByIds(ids: number[]): Promise<Teacher[]> {
    return this.teacherRepo.findBy({ id: In(ids) });
  }
}
