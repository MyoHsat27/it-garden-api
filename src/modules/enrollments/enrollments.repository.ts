import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './entities/enrollment.entity';

@Injectable()
export class EnrollmentsRepository {
  constructor(
    @InjectRepository(Enrollment)
    private readonly repo: Repository<Enrollment>,
  ) {}

  async save(enrollment: Enrollment): Promise<Enrollment> {
    return this.repo.save(enrollment);
  }

  findAll(): Promise<Enrollment[]> {
    return this.repo.find({ relations: ['student', 'batch'] });
  }

  findById(id: number): Promise<Enrollment | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['student', 'batch'],
    });
  }

  async update(enrollment: Enrollment): Promise<Enrollment> {
    return this.repo.save(enrollment);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }

  async findByStudentAndBatch(
    studentId: number,
    batchId: number,
  ): Promise<Enrollment | null> {
    return this.repo.findOne({
      where: { student: { id: studentId }, batch: { id: batchId } },
    });
  }
}
