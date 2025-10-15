import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { BatchesRepository } from './batches.repository';
import { CreateBatchDto, UpdateBatchDto } from './dto';
import { Batch } from './entities/batch.entity';
import { Teacher } from '../teachers/entities';

@Injectable()
export class BatchesService {
  constructor(private readonly repository: BatchesRepository) {}

  async create(dto: CreateBatchDto): Promise<Batch> {
    const course = await this.repository.findCourseById(dto.courseId);
    if (!course) {
      throw new NotFoundException(`Course with id ${dto.courseId} not found`);
    }

    let teachers: Teacher[] = [];
    if (dto.teacherIds && dto.teacherIds.length > 0) {
      teachers = await this.repository.findTeachersByIds(dto.teacherIds);
      if (teachers.length !== dto.teacherIds.length) {
        throw new BadRequestException('One or more teachers not found');
      }
    }

    return this.repository.create({
      name: dto.name,
      description: dto.description,
      course,
      teachers,
    });
  }

  async findAll(): Promise<Batch[]> {
    return this.repository.findAll();
  }

  async findOne(id: number): Promise<Batch> {
    const batch = await this.repository.findById(id);
    if (!batch) {
      throw new NotFoundException(`Batch with id ${id} not found`);
    }
    return batch;
  }

  async update(id: number, dto: UpdateBatchDto): Promise<Batch> {
    const batch = await this.repository.findById(id);
    if (!batch) throw new NotFoundException(`Batch with id ${id} not found`);

    if (dto.courseId) {
      const course = await this.repository.findCourseById(dto.courseId);
      if (!course)
        throw new NotFoundException(`Course with id ${dto.courseId} not found`);
      batch.course = course;
    }

    if (dto.teacherIds && dto.teacherIds.length > 0) {
      const teachers = await this.repository.findTeachersByIds(dto.teacherIds);
      if (teachers.length !== dto.teacherIds.length) {
        throw new BadRequestException('One or more teachers not found');
      }
      batch.teachers = teachers;
    }

    if (dto.name !== undefined) batch.name = dto.name;
    if (dto.description !== undefined) batch.description = dto.description;

    return this.repository.create(batch); // reuse `create` to save
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Batch with id ${id} not found`);
    }
  }
}
