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

  findAll(): Promise<Submission[]> {
    return this.repo.find({ relations: ['assignment', 'enrollment'] });
  }

  findById(id: number): Promise<Submission | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['assignment', 'enrollment'],
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
