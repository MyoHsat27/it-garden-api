import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';

@Injectable()
export class SubmissionsRepository {
  constructor(
    @InjectRepository(Submission)
    private readonly repo: Repository<Submission>,
  ) {}

  async create(submission: Partial<Submission>): Promise<Submission> {
    const entity = this.repo.create(submission);
    return this.repo.save(entity);
  }

  async save(submission: Submission): Promise<Submission> {
    return this.repo.save(submission);
  }

  findAll(): Promise<Submission[]> {
    return this.repo.find({ relations: ['assignment', 'enrollment'] });
  }

  findByAssignmentAndEnrollment(assignmentId: number, enrollmentId: number) {
    return this.repo.findOne({
      where: {
        assignment: { id: assignmentId },
        enrollment: { id: enrollmentId },
      },
      relations: ['enrollment', 'assignment', 'enrollment.student'],
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['enrollment', 'enrollment.student', 'assignment', 'media'],
    });
  }

  findAllByAssignment(assignmentId: number) {
    return this.repo.find({
      where: { assignment: { id: assignmentId } },
      relations: ['enrollment', 'enrollment.student', 'media'],
      order: { createdAt: 'ASC' },
    });
  }

  async update(submission: Submission) {
    return this.repo.save(submission);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
