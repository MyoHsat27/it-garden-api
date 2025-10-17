import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BatchesRepository } from './batches.repository';
import { BatchResponseDto, CreateBatchDto, UpdateBatchDto } from './dto';
import { Batch } from './entities/batch.entity';
import { GetBatchesQueryDto } from './dto/get-batches-query.dto';
import { plainToInstance } from 'class-transformer';
import { PaginatedResponseDto } from '../../common';

@Injectable()
export class BatchesService {
  constructor(private readonly repository: BatchesRepository) {}

  async create(dto: CreateBatchDto): Promise<Batch> {
    const existingBatch = await this.repository.findByName(dto.name);
    if (existingBatch)
      throw new BadRequestException(`Batch ${dto.name} already exists`);

    const course = await this.repository.findCourseById(dto.courseId);
    if (!course)
      throw new NotFoundException(`Course with id ${dto.courseId} not found`);

    const teacher = await this.repository.findTeacherById(dto.teacherId);
    if (!teacher)
      throw new NotFoundException(`Teacher with id ${dto.teacherId} not found`);

    return this.repository.create({
      name: dto.name,
      description: dto.description,
      course,
      teacher,
    });
  }

  async findAll(): Promise<Batch[]> {
    return this.repository.findAll();
  }

  async findAllBatchesWithFilters(query: GetBatchesQueryDto) {
    const result = await this.repository.findWithFilters(query);

    const data = result.data.map((a) => plainToInstance(BatchResponseDto, a));

    return new PaginatedResponseDto(
      data,
      result.totalItems,
      result.page,
      result.limit,
    );
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

    if (dto.name) {
      const existingBatch = await this.repository.findExisting(
        dto.name,
        batch.id,
      );

      if (existingBatch)
        throw new BadRequestException(`Batch ${dto.name} already exists`);
    }

    if (dto.courseId) {
      const course = await this.repository.findCourseById(dto.courseId);
      if (!course)
        throw new NotFoundException(`Course with id ${dto.courseId} not found`);
      batch.course = course;
    }

    if (dto.teacherId) {
      const teacher = await this.repository.findTeacherById(dto.teacherId);
      if (!teacher) {
        throw new NotFoundException('Teacher not found');
      }
      batch.teacher = teacher;
    }

    if (dto.name !== undefined) batch.name = dto.name;
    if (dto.description !== undefined) batch.description = dto.description;

    return this.repository.create(batch);
  }

  async remove(id: number): Promise<void> {
    const affected = await this.repository.delete(id);
    if (affected === 0) {
      throw new NotFoundException(`Batch with id ${id} not found`);
    }
  }
}
