import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Assignment } from './entities/assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';

@Injectable()
export class AssignmentsRepository {
  constructor(
    @InjectRepository(Assignment)
    private readonly repo: Repository<Assignment>,
  ) {}

  async create(assignment: Partial<Assignment>): Promise<Assignment> {
    const entity = this.repo.create(assignment);
    return this.repo.save(entity);
  }

  findAll(): Promise<Assignment[]> {
    return this.repo.find({ relations: ['teacher', 'batch'] });
  }

  findById(id: number): Promise<Assignment | null> {
    return this.repo.findOne({
      where: { id },
      relations: ['teacher', 'batch'],
    });
  }

  async update(assignment: Assignment): Promise<Assignment> {
    return this.repo.save(assignment);
  }

  async delete(id: number): Promise<number> {
    const result = await this.repo.delete(id);
    return result.affected ?? 0;
  }
}
