import { Injectable, NotFoundException } from '@nestjs/common';
import { AssignmentsRepository } from './assignments.repository';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { UpdateAssignmentDto } from './dto/update-assignment.dto';
import { plainToInstance } from 'class-transformer';
import { AssignmentResponseDto } from './dto';

@Injectable()
export class AssignmentsService {
  constructor(private readonly repository: AssignmentsRepository) {}

  async create(dto: CreateAssignmentDto) {
    const assignment = await this.repository.create(dto);
    return plainToInstance(AssignmentResponseDto, assignment);
  }

  async findAll() {
    const assignments = await this.repository.findAll();
    return plainToInstance(AssignmentResponseDto, assignments);
  }

  async findOne(id: number) {
    const assignment = await this.repository.findById(id);
    if (!assignment)
      throw new NotFoundException(`Assignment with id ${id} not found`);

    return plainToInstance(AssignmentResponseDto, assignment);
  }

  async update(id: number, dto: UpdateAssignmentDto) {
    const assignment = await this.repository.findById(id);
    if (!assignment)
      throw new NotFoundException(`Assignment with id ${id} not found`);

    Object.assign(assignment, dto);
    const updated = await this.repository.update(assignment);
    return plainToInstance(AssignmentResponseDto, updated);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Assignment with id ${id} not found`);
    }
  }
}
